import { CadastralProperty } from '@openbarrio/core';
import { ICatastroProvider } from './types.js';
import { parseCatastroCoordinatesXml, parseCatastroDnprcXml } from './catastro.parser.js';
import { CadastralNotFoundError, UpstreamProviderError } from '../errors/problem-details.js';

export interface CatastroProviderOptions {
  baseUrl?: string;
  timeoutMs?: number;
}

export class CatastroProvider implements ICatastroProvider {
  private readonly baseUrl: string;
  private readonly timeoutMs: number;

  constructor(options: CatastroProviderOptions = {}) {
    this.baseUrl =
      options.baseUrl ||
      'https://ovc.catastro.meh.es/ovcservweb/ovcswlocalizacionrc/ovccoordenadas.asmx';
    this.timeoutMs = options.timeoutMs || 8000;
  }

  async getByCoordinates(latitude: number, longitude: number): Promise<CadastralProperty> {
    const url = `${this.baseUrl}/Consulta_RCCOOR?SRS=EPSG:4326&Coordenada_X=${longitude}&Coordenada_Y=${latitude}`;

    let xmlText: string;
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeoutMs);
      const res = await fetch(url, {
        signal: controller.signal,
        headers: { 'User-Agent': 'OpenBarrio-DueDiligence/0.1' },
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

    const { cadastralReference, latitude: resLat, longitude: resLon } =
      parseCatastroCoordinatesXml(xmlText);

    // Fetch detailed property attributes using the cadastral reference obtained
    return this.getByCadastralReference(cadastralReference, {
      latitude: resLat || latitude,
      longitude: resLon || longitude,
    });
  }

  async getByCadastralReference(
    refcat: string,
    fallbackCoords?: { latitude: number; longitude: number }
  ): Promise<CadastralProperty> {
    const cleanRef = refcat.trim().toUpperCase();
    const url = `${this.baseUrl}/Consulta_DNPRC?Provincia=&Municipio=&RC=${encodeURIComponent(cleanRef)}`;

    let xmlText: string;
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeoutMs);
      const res = await fetch(url, {
        signal: controller.signal,
        headers: { 'User-Agent': 'OpenBarrio-DueDiligence/0.1' },
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

    return parseCatastroDnprcXml(xmlText, cleanRef, fallbackCoords);
  }
}
