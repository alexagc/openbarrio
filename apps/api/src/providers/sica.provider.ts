import { NoiseData, NoiseLevelCategory, PredominantNoiseSource } from '@openbarrio/core';
import { ISICAProvider } from './types.js';
import { UpstreamProviderError } from '../errors/problem-details.js';

export interface SICAProviderOptions {
  wmsBaseUrl?: string;
  timeoutMs?: number;
}

/**
 * MITECO SICA (Sistema de Información sobre Contaminación Acústica) Provider.
 * Queries strategic noise maps (Lden) across road, railway, airport, and agglomeration corridors.
 */
export class SICAProvider implements ISICAProvider {
  private readonly wmsBaseUrl: string;
  private readonly timeoutMs: number;

  constructor(options: SICAProviderOptions = {}) {
    this.wmsBaseUrl =
      options.wmsBaseUrl || 'https://wms.mapama.gob.es/sig/SICA/wms.aspx';
    this.timeoutMs = options.timeoutMs || 8000;
  }

  async getNoiseData(latitude: number, longitude: number): Promise<NoiseData> {
    // Generate small bounding box around the point (~50m delta) for WMS GetFeatureInfo
    const delta = 0.0005;
    const minLon = longitude - delta;
    const minLat = latitude - delta;
    const maxLon = longitude + delta;
    const maxLat = latitude + delta;
    const bbox = `${minLon},${minLat},${maxLon},${maxLat}`;

    const params = new URLSearchParams({
      SERVICE: 'WMS',
      VERSION: '1.3.0',
      REQUEST: 'GetFeatureInfo',
      LAYERS: 'SICA_Lden_Global',
      QUERY_LAYERS: 'SICA_Lden_Global',
      CRS: 'EPSG:4326',
      BBOX: bbox,
      WIDTH: '101',
      HEIGHT: '101',
      I: '50',
      J: '50',
      INFO_FORMAT: 'application/json',
    });

    const url = `${this.wmsBaseUrl}?${params.toString()}`;

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeoutMs);
      const res = await fetch(url, {
        signal: controller.signal,
        headers: { Accept: 'application/json', 'User-Agent': 'OpenBarrio-DueDiligence/0.1' },
        ...({ cf: { cacheTtl: 7776000, cacheEverything: true } } as any),
      });
      clearTimeout(timer);

      if (!res.ok) {
        throw new UpstreamProviderError('MITECO SICA WMS', `HTTP ${res.status}`);
      }

      const text = await res.text();
      return this.parseSicaResponse(text);
    } catch (err: any) {
      if (err instanceof UpstreamProviderError) {
        throw err;
      }
      // If network fails or times out, report upstream error
      throw new UpstreamProviderError('MITECO SICA WMS', err.message || 'Network error');
    }
  }

  /**
   * Parses SICA WMS/WFS JSON or XML payload to extract Lden decibels and noise source.
   */
  public parseSicaResponse(rawBody: string): NoiseData {
    try {
      const json = JSON.parse(rawBody);
      if (json && json.features && json.features.length > 0) {
        const props = json.features[0].properties || {};
        const ldenVal = Number(props.LDEN || props.lden || props.decibels || props.valor);
        const sourceStr = String(props.FUENTE || props.fuente || props.source || '').toUpperCase();

        const decibels = !isNaN(ldenVal) && ldenVal > 0 ? ldenVal : 55;
        const source = this.determinePredominantSource(sourceStr);
        const category = this.categorizeDecibels(decibels);

        return {
          dayEveningNightDecibels: decibels,
          category,
          predominantSource: source,
        };
      }
    } catch {
      // In case the response is XML / GML, parse simple tags
      const ldenMatch = rawBody.match(/<LDEN>([^<]+)<\/LDEN>/i) || rawBody.match(/<valor>([^<]+)<\/valor>/i);
      const sourceMatch = rawBody.match(/<FUENTE>([^<]+)<\/FUENTE>/i);

      if (ldenMatch) {
        const decibels = parseFloat(ldenMatch[1]) || 55;
        const source = this.determinePredominantSource(sourceMatch ? sourceMatch[1] : '');
        return {
          dayEveningNightDecibels: decibels,
          category: this.categorizeDecibels(decibels),
          predominantSource: source,
        };
      }
    }

    // Default favorable acoustic baseline when no strategic noise corridor is intersecting
    return {
      dayEveningNightDecibels: 52,
      category: 'QUIET',
      predominantSource: 'NONE',
    };
  }

  private categorizeDecibels(decibels: number): NoiseLevelCategory {
    if (decibels < 55) return 'QUIET';
    if (decibels < 65) return 'MODERATE';
    if (decibels < 75) return 'NOISY';
    return 'VERY_NOISY';
  }

  private determinePredominantSource(sourceStr: string): PredominantNoiseSource {
    const s = sourceStr.toUpperCase();
    if (s.includes('AEROPUERTO') || s.includes('AIRPORT') || s.includes('AER')) return 'AIRPORT';
    if (s.includes('FERRO') || s.includes('TREN') || s.includes('RAIL')) return 'RAILWAY';
    if (s.includes('INDUSTR') || s.includes('IND')) return 'INDUSTRIAL';
    if (s.includes('CARRETERA') || s.includes('VIARIO') || s.includes('TRAF')) return 'ROAD_TRAFFIC';
    return 'ROAD_TRAFFIC';
  }
}
