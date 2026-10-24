import { CadastralProperty, CadastralUnitsResponse, CadastralCoordinates } from '@openbarrio/core';
import { ICatastroProvider } from './types.js';
import {
  parseCatastroCoordinatesXml,
  parseCatastroDnprcXml,
  parseCatastroCpmrcXml,
  parseCadastralUnitsXml,
  isMultiUnitParcelXml,
  parseMultiUnitParcelSummary,
} from './catastro.parser.js';
import { UpstreamProviderError } from '../errors/problem-details.js';

export interface CatastroProviderOptions {
  baseUrl?: string;
  coordenadasBaseUrl?: string;
  callejeroBaseUrl?: string;
  timeoutMs?: number;
}

export class CatastroProvider implements ICatastroProvider {
  private readonly coordenadasBaseUrl: string;
  private readonly callejeroBaseUrl: string;
  private readonly timeoutMs: number;

  constructor(options: CatastroProviderOptions = {}) {
    this.coordenadasBaseUrl =
      options.coordenadasBaseUrl ||
      options.baseUrl ||
      'https://ovc.catastro.meh.es/ovcservweb/ovcswlocalizacionrc/ovccoordenadas.asmx';
    this.callejeroBaseUrl =
      options.callejeroBaseUrl ||
      'https://ovc.catastro.meh.es/ovcservweb/ovcswlocalizacionrc/ovccallejero.asmx';
    this.timeoutMs = options.timeoutMs || 8000;
  }

  async getByCoordinates(latitude: number, longitude: number): Promise<CadastralProperty> {
    const url = `${this.coordenadasBaseUrl}/Consulta_RCCOOR?SRS=EPSG:4326&Coordenada_X=${longitude}&Coordenada_Y=${latitude}`;

    let xmlText = '';
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeoutMs);
      const res = await fetch(url, {
        signal: controller.signal,
        headers: { 'User-Agent': 'OpenBarrio-DueDiligence/0.1' },
        ...({ cf: { cacheTtl: 7776000, cacheEverything: true } } as any),
      });
      clearTimeout(timer);

      if (!res.ok) {
        throw new UpstreamProviderError('Catastro OVC', `HTTP status ${res.status}`);
      }
      xmlText = await res.text();
    } catch (err: any) {
      if (err instanceof UpstreamProviderError) throw err;
      throw new UpstreamProviderError('Catastro OVC', err.message || 'Network request failed');
    }

    let cadastralReference: string | undefined;
    let resLat = latitude;
    let resLon = longitude;

    try {
      const parsed = parseCatastroCoordinatesXml(xmlText);
      cadastralReference = parsed.cadastralReference;
      resLat = parsed.latitude || latitude;
      resLon = parsed.longitude || longitude;
    } catch (parseErr) {
      // If Catastro has no exact parcel on coordinate (e.g. street), snap to nearest portal via CartoCiudad
      try {
        const cartoUrl = `https://www.cartociudad.es/geocoder/api/geocoder/reverseGeocode?lat=${latitude}&lon=${longitude}`;
        const cartoRes = await fetch(cartoUrl);
        if (cartoRes.ok) {
          const cartoData = (await cartoRes.json()) as any;
          if (cartoData && cartoData.refCatastral) {
            cadastralReference = cartoData.refCatastral;
            resLat = typeof cartoData.lat === 'number' ? cartoData.lat : latitude;
            resLon = typeof cartoData.lng === 'number' ? cartoData.lng : longitude;
          }
        }
      } catch {
        // Fall through
      }

      if (!cadastralReference) {
        throw parseErr;
      }
    }

    // Fetch detailed property attributes using the cadastral reference obtained
    return this.getByCadastralReference(cadastralReference, {
      latitude: resLat || latitude,
      longitude: resLon || longitude,
      srs: 'EPSG:4326',
    });
  }

  async getByCadastralReference(
    refcat: string,
    fallbackCoords?: CadastralCoordinates
  ): Promise<CadastralProperty> {
    const cleanRef = refcat.replace(/[\s\-_.]/g, '').toUpperCase();
    const dnprcUrl = `${this.callejeroBaseUrl}/Consulta_DNPRC?Provincia=&Municipio=&RC=${encodeURIComponent(cleanRef)}`;

    // If coordinates are not passed, query Consulta_CPMRC to get the exact parcel centroid coordinates
    let resolvedCoords: CadastralCoordinates | undefined = fallbackCoords;
    if (!resolvedCoords) {
      try {
        const cpmrcUrl = `${this.coordenadasBaseUrl}/Consulta_CPMRC?Provincia=&Municipio=&SRS=EPSG:4326&RC=${encodeURIComponent(cleanRef)}`;
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), this.timeoutMs);
        const cpmrcRes = await fetch(cpmrcUrl, {
          signal: controller.signal,
          headers: { 'User-Agent': 'OpenBarrio-DueDiligence/0.1' },
          ...({ cf: { cacheTtl: 7776000, cacheEverything: true } } as any),
        });
        clearTimeout(timer);

        if (cpmrcRes.ok) {
          const cpmrcXml = await cpmrcRes.text();
          const parsed = parseCatastroCpmrcXml(cpmrcXml);
          if (parsed) {
            resolvedCoords = { latitude: parsed.latitude, longitude: parsed.longitude, srs: 'EPSG:4326' };
          }
        }
      } catch {
        // Non-critical: continue with fallback coordinates if CPMRC fails
      }
    }

    let xmlText: string;
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeoutMs);
      const res = await fetch(dnprcUrl, {
        signal: controller.signal,
        headers: { 'User-Agent': 'OpenBarrio-DueDiligence/0.1' },
        ...({ cf: { cacheTtl: 7776000, cacheEverything: true } } as any),
      });
      clearTimeout(timer);

      if (!res.ok) {
        throw new UpstreamProviderError('Catastro OVC', `HTTP status ${res.status}`);
      }
      xmlText = await res.text();
    } catch (err: any) {
      if (err instanceof UpstreamProviderError) throw err;
      throw new UpstreamProviderError('Catastro OVC', err.message || 'Network request failed');
    }

    // If parcel has horizontal division (<lrcdnp>), fetch primary unit to extract official building year and specs
    if (isMultiUnitParcelXml(xmlText)) {
      const summary = parseMultiUnitParcelSummary(xmlText);
      if (summary.primaryUnitRef) {
        try {
          const unitUrl = `${this.callejeroBaseUrl}/Consulta_DNPRC?Provincia=&Municipio=&RC=${encodeURIComponent(summary.primaryUnitRef)}`;
          const unitController = new AbortController();
          const unitTimer = setTimeout(() => unitController.abort(), this.timeoutMs);
          const unitRes = await fetch(unitUrl, {
            signal: unitController.signal,
            headers: { 'User-Agent': 'OpenBarrio-DueDiligence/0.1' },
            ...({ cf: { cacheTtl: 7776000, cacheEverything: true } } as any),
          });
          clearTimeout(unitTimer);

          if (unitRes.ok) {
            const unitXml = await unitRes.text();
            return parseCatastroDnprcXml(unitXml, cleanRef, resolvedCoords, {
              unitsCount: summary.totalUnits,
              hasCommercialGroundFloor: summary.hasCommercialUnit,
            });
          }
        } catch {
          // Fall through to parsing parent XML on unit lookup timeout/error
        }
      }
    }

    return parseCatastroDnprcXml(xmlText, cleanRef, resolvedCoords);
  }

  async getUnitsByCadastralReference(refcat: string): Promise<CadastralUnitsResponse> {
    const cleanRef = refcat.replace(/[\s\-_.]/g, '').toUpperCase();
    const parcelRef = cleanRef.slice(0, 14);
    const dnprcUrl = `${this.callejeroBaseUrl}/Consulta_DNPRC?Provincia=&Municipio=&RC=${encodeURIComponent(parcelRef)}`;

    let xmlText: string;
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeoutMs);
      const res = await fetch(dnprcUrl, {
        signal: controller.signal,
        headers: { 'User-Agent': 'OpenBarrio-DueDiligence/0.1' },
        ...({ cf: { cacheTtl: 7776000, cacheEverything: true } } as any),
      });
      clearTimeout(timer);

      if (!res.ok) {
        throw new UpstreamProviderError('Catastro OVC', `HTTP status ${res.status}`);
      }
      xmlText = await res.text();
    } catch (err: any) {
      if (err instanceof UpstreamProviderError) throw err;
      throw new UpstreamProviderError('Catastro OVC', err.message || 'Network request failed');
    }

    return parseCadastralUnitsXml(xmlText, parcelRef);
  }
}
