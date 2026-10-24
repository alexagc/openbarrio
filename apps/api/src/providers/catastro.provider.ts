import {
  CadastralProperty,
  CadastralUnitsResponse,
  CadastralCoordinates,
  CadastralGeometry,
} from '@openbarrio/core';
import { ICatastroProvider } from './types.js';
import {
  parseCatastroCoordinatesXml,
  parseCatastroDnprcXml,
  parseCatastroCpmrcXml,
  parseCadastralUnitsXml,
  isMultiUnitParcelXml,
  parseMultiUnitParcelSummary,
  parseCatastroWfsGeometryXml,
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

        // Snap to the exact portal number & letter via CartoCiudad IGN geocoder (e.g. 2 F vs 2 I)
    let targetPortal: string | undefined;
    try {
      const cartoUrl = `https://www.cartociudad.es/geocoder/api/geocoder/reverseGeocode?lat=${latitude}&lon=${longitude}`;
      const cartoRes = await fetch(cartoUrl);
      if (cartoRes.ok) {
        const cartoData = (await cartoRes.json()) as any;
        if (cartoData?.extension) {
          targetPortal = String(cartoData.extension).trim().toUpperCase();
        }
        if (typeof cartoData?.lat === 'number' && typeof cartoData?.lng === 'number') {
          resLat = cartoData.lat;
          resLon = cartoData.lng;
        }
      }
    } catch {
      // Non-critical: continue
    }

    // Fetch detailed property attributes using the cadastral reference obtained
    return this.getByCadastralReference(
      cadastralReference,
      {
        latitude: resLat || latitude,
        longitude: resLon || longitude,
        srs: 'EPSG:4326',
      },
      targetPortal
    );
  }

    async getByCadastralReference(
    refcat: string,
    fallbackCoords?: CadastralCoordinates,
    preferredPortal?: string
  ): Promise<CadastralProperty> {
    let activePortal = preferredPortal;
    if (!activePortal && fallbackCoords) {
      try {
        const cartoUrl = `https://www.cartociudad.es/geocoder/api/geocoder/reverseGeocode?lat=${fallbackCoords.latitude}&lon=${fallbackCoords.longitude}`;
        const cartoRes = await fetch(cartoUrl);
        if (cartoRes.ok) {
          const cartoData = (await cartoRes.json()) as any;
          if (cartoData?.extension) {
            activePortal = String(cartoData.extension).trim().toUpperCase();
          }
        }
      } catch {
        // Non-critical: continue
      }
    }
    const cleanRef = refcat.replace(/[\s\-_.]/g, '').toUpperCase();
    const dnprcUrl = `${this.callejeroBaseUrl}/Consulta_DNPRC?Provincia=&Municipio=&RC=${encodeURIComponent(cleanRef)}`;

    // If coordinates are not passed, query Consulta_CPMRC to get the exact parcel centroid coordinates
    let resolvedCoords: CadastralCoordinates | undefined = fallbackCoords;
    if (!resolvedCoords) {
      try {
        const parcelRef = cleanRef.slice(0, 14);
        const cpmrcUrl = `${this.coordenadasBaseUrl}/Consulta_CPMRC?Provincia=&Municipio=&SRS=EPSG:4326&RC=${encodeURIComponent(parcelRef)}`;
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
      const summary = parseMultiUnitParcelSummary(xmlText, activePortal);
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

  async getGeometryByCadastralReference(refcat: string): Promise<CadastralGeometry> {
    const cleanRef = refcat.replace(/[\s\-_.]/g, '').toUpperCase();
    const parcelRef = cleanRef.slice(0, 14);

    // 1. Try Building footprint (wfsBU)
    const buUrl = `https://ovc.catastro.meh.es/INSPIRE/wfsBU.aspx?service=WFS&version=2.0.0&request=GetFeature&STOREDQUERIE_ID=GetBuildingByParcel&refcat=${encodeURIComponent(parcelRef)}&srsname=EPSG::4326`;
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeoutMs);
      const res = await fetch(buUrl, {
        signal: controller.signal,
        headers: { 'User-Agent': 'OpenBarrio-DueDiligence/0.1' },
        ...({ cf: { cacheTtl: 7776000, cacheEverything: true } } as any),
      });
      clearTimeout(timer);

      if (res.ok) {
        const xml = await res.text();
        const parsed = parseCatastroWfsGeometryXml(xml, parcelRef, 'building');
        if (parsed) {
          const floors = parsed.numberOfFloors || 4;
          const height = floors * 3.2;
          return {
            cadastralReference: cleanRef,
            type: 'building',
            geometry: {
              type: 'Polygon',
              coordinates: parsed.coordinates,
            },
            properties: {
              numberOfFloors: floors,
              height: Number(height.toFixed(1)),
              areaM2: parsed.areaM2,
            },
          };
        }
      }
    } catch {
      // Continue to parcel boundary fallback
    }

    // 2. Try Cadastral Parcel boundary (wfsCP)
    const cpUrl = `https://ovc.catastro.meh.es/INSPIRE/wfsCP.aspx?service=WFS&version=2.0.0&request=GetFeature&STOREDQUERIE_ID=GetParcel&refcat=${encodeURIComponent(parcelRef)}&srsname=EPSG::4326`;
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeoutMs);
      const res = await fetch(cpUrl, {
        signal: controller.signal,
        headers: { 'User-Agent': 'OpenBarrio-DueDiligence/0.1' },
        ...({ cf: { cacheTtl: 7776000, cacheEverything: true } } as any),
      });
      clearTimeout(timer);

      if (res.ok) {
        const xml = await res.text();
        const parsed = parseCatastroWfsGeometryXml(xml, parcelRef, 'parcel');
        if (parsed) {
          return {
            cadastralReference: cleanRef,
            type: 'parcel',
            geometry: {
              type: 'Polygon',
              coordinates: parsed.coordinates,
            },
            properties: {
              numberOfFloors: 3,
              height: 9.6,
              areaM2: parsed.areaM2,
            },
          };
        }
      }
    } catch {
      // Continue to deterministic fallback
    }

    // 3. Fallback: Query coordinates from Catastro to generate realistic parcel box
    let centerLat = 40.42028;
    let centerLon = -3.70379;
    try {
      const prop = await this.getByCadastralReference(cleanRef);
      centerLat = prop.coordinates.latitude;
      centerLon = prop.coordinates.longitude;
    } catch {
      // keep default center
    }

    const dLat = 0.00020;
    const dLon = 0.00025;
    const coords = [
      [
        [Number((centerLon - dLon).toFixed(6)), Number((centerLat - dLat).toFixed(6))],
        [Number((centerLon + dLon).toFixed(6)), Number((centerLat - dLat).toFixed(6))],
        [Number((centerLon + dLon).toFixed(6)), Number((centerLat + dLat).toFixed(6))],
        [Number((centerLon - dLon).toFixed(6)), Number((centerLat + dLat).toFixed(6))],
        [Number((centerLon - dLon).toFixed(6)), Number((centerLat - dLat).toFixed(6))],
      ],
    ];

    return {
      cadastralReference: cleanRef,
      type: 'fallback',
      geometry: {
        type: 'Polygon',
        coordinates: coords,
      },
      properties: {
        numberOfFloors: 4,
        height: 12.8,
      },
    };
  }
}
