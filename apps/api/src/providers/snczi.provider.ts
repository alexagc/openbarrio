import { FloodRiskData, FloodRiskLevel } from '@openbarrio/core';
import { ISNCZIProvider } from './types.js';
import { UpstreamProviderError } from '../errors/problem-details.js';

export interface SNCZIProviderOptions {
  wmsBaseUrl?: string;
  timeoutMs?: number;
}

/**
 * MITECO SNCZI (Sistema Nacional de Cartografía de Zonas Inundables) Provider.
 * Queries official flood risk layers across return periods (T=10, 50, 100, 500 years)
 * and the Preferential Flow Zone (Zona de Flujo Preferente - ZFP).
 */
export class SNCZIProvider implements ISNCZIProvider {
  private readonly wmsBaseUrl: string;
  private readonly timeoutMs: number;

  constructor(options: SNCZIProviderOptions = {}) {
    this.wmsBaseUrl =
      options.wmsBaseUrl || 'https://wms.mapama.gob.es/sig/Agua/ZonasInundables/wms.aspx';
    this.timeoutMs = options.timeoutMs || 8000;
  }

  async getFloodRiskData(latitude: number, longitude: number): Promise<FloodRiskData> {
    const delta = 0.0005;
    const minLon = longitude - delta;
    const minLat = latitude - delta;
    const maxLon = longitude + delta;
    const maxLat = latitude + delta;
    const bbox = `${minLon},${minLat},${maxLon},${maxLat}`;

    // Query layers including T10, T100, T500 and Preferential Flow Zone (ZFP)
    const layers = 'ZI_T10,ZI_T50,ZI_T100,ZI_T500,ZI_ZFP';

    const params = new URLSearchParams({
      SERVICE: 'WMS',
      VERSION: '1.3.0',
      REQUEST: 'GetFeatureInfo',
      LAYERS: layers,
      QUERY_LAYERS: layers,
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
      });
      clearTimeout(timer);

      if (!res.ok) {
        throw new UpstreamProviderError('MITECO SNCZI WMS', `HTTP ${res.status}`);
      }

      const text = await res.text();
      return this.parseSncziResponse(text);
    } catch (err: any) {
      if (err instanceof UpstreamProviderError) {
        throw err;
      }
      throw new UpstreamProviderError('MITECO SNCZI WMS', err.message || 'Network error');
    }
  }

  /**
   * Parses SNCZI WMS/WFS response to identify flood return period and preferential flow zone.
   */
  public parseSncziResponse(rawBody: string): FloodRiskData {
    let isInPreferentialFlowZone = false;
    let minReturnPeriod: number | null = null;

    try {
      const json = JSON.parse(rawBody);
      if (json && json.features && json.features.length > 0) {
        for (const feature of json.features) {
          const layerName = String(feature.layer || feature.id || '').toUpperCase();
          const props = feature.properties || {};
          const periodVal = Number(props.PERIODO || props.T || props.return_period);

          if (layerName.includes('ZFP') || props.ZFP === true || props.ZFP === '1') {
            isInPreferentialFlowZone = true;
          }

          if (periodVal === 10 || layerName.includes('T10')) {
            minReturnPeriod = minReturnPeriod ? Math.min(minReturnPeriod, 10) : 10;
          } else if (periodVal === 50 || layerName.includes('T50')) {
            minReturnPeriod = minReturnPeriod ? Math.min(minReturnPeriod, 50) : 50;
          } else if (periodVal === 100 || layerName.includes('T100')) {
            minReturnPeriod = minReturnPeriod ? Math.min(minReturnPeriod, 100) : 100;
          } else if (periodVal === 500 || layerName.includes('T500')) {
            minReturnPeriod = minReturnPeriod ? Math.min(minReturnPeriod, 500) : 500;
          }
        }
      }
    } catch {
      // XML / GML text parsing fallback
      if (rawBody.includes('ZI_ZFP') || rawBody.includes('<ZFP>1</ZFP>')) {
        isInPreferentialFlowZone = true;
      }
      if (rawBody.includes('ZI_T10') || rawBody.includes('<T>10</T>')) {
        minReturnPeriod = 10;
      } else if (rawBody.includes('ZI_T50') || rawBody.includes('<T>50</T>')) {
        minReturnPeriod = 50;
      } else if (rawBody.includes('ZI_T100') || rawBody.includes('<T>100</T>')) {
        minReturnPeriod = 100;
      } else if (rawBody.includes('ZI_T500') || rawBody.includes('<T>500</T>')) {
        minReturnPeriod = 500;
      }
    }

    let level: FloodRiskLevel = 'NONE';
    if (minReturnPeriod !== null) {
      if (minReturnPeriod <= 50) {
        level = 'HIGH';
      } else if (minReturnPeriod <= 100) {
        level = 'MEDIUM';
      } else {
        level = 'LOW';
      }
    }

    return {
      level,
      returnPeriodYears: minReturnPeriod,
      isInPreferentialFlowZone,
    };
  }
}
