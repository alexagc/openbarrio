import {
  FloodRiskData,
  FloodRiskLevel,
  LayerResult,
  layerOk,
  layerOutOfCoverage,
  layerUnavailable,
} from '@openbarrio/core';
import { ISNCZIProvider } from './types.js';
import type { D1Database } from '../types/env.js';
import {
  CircuitBreakerRegistry,
  InvalidPayloadError,
  NonTransientUpstreamError,
  TransientUpstreamError,
  defaultBreakerRegistry,
  mapErrorToLayerReason,
  withResilience,
} from '../resilience/index.js';

export const SNCZI_SOURCE_NAME = 'MITECO SNCZI';

export interface SNCZIProviderOptions {
  wmsBaseUrl?: string;
  timeoutMs?: number;
  db?: D1Database;
  breaker?: CircuitBreakerRegistry;
  maxRetries?: number;
}

/**
 * MITECO SNCZI (Sistema Nacional de Cartografía de Zonas Inundables) Provider.
 * Queries official flood risk layers across return periods (T=10, 50, 100, 500 years)
 * and the Preferential Flow Zone (Zona de Flujo Preferente - ZFP).
 * Never synthesizes flood-free status when Canary Islands are outside coverage or WMS fails.
 */
export class SNCZIProvider implements ISNCZIProvider {
  private readonly wmsBaseUrl: string;
  private readonly timeoutMs?: number;
  private readonly breaker: CircuitBreakerRegistry;
  private readonly maxRetries?: number;
  private db?: D1Database;

  constructor(options: SNCZIProviderOptions = {}) {
    this.wmsBaseUrl =
      options.wmsBaseUrl || 'https://gis.miteco.gob.es/geoserver/agua/wms';
    this.timeoutMs = options.timeoutMs;
    this.breaker = options.breaker || defaultBreakerRegistry;
    this.maxRetries = options.maxRetries;
    this.db = options.db;
  }

  setDatabase(db: D1Database): void {
    this.db = db;
  }

  async getFloodRiskData(
    latitude: number,
    longitude: number,
    censusSectionCode?: string
  ): Promise<LayerResult<FloodRiskData>> {
    // 0. Canary Islands are outside MITECO SNCZI mainland jurisdiction (governed by Consejos Insulares de Aguas)
    const isCanarias =
      (latitude < 30 && longitude < -13) ||
      Boolean(censusSectionCode && (censusSectionCode.startsWith('35') || censusSectionCode.startsWith('38')));

    if (isCanarias) {
      return layerOutOfCoverage(SNCZI_SOURCE_NAME);
    }

    // 1. Hierarchical Resolution via Cloudflare D1 (sub-5ms Edge execution)
    if (this.db && censusSectionCode) {
      try {
        const row = await this.db
          .prepare(
            'SELECT flood_risk_level, return_period_years, is_in_preferential_flow_zone FROM census_tract_snczi_risk WHERE cusec = ?'
          )
          .bind(censusSectionCode)
          .first<{
            flood_risk_level: string;
            return_period_years: number | null;
            is_in_preferential_flow_zone: number;
          }>();

        if (row) {
          return layerOk(SNCZI_SOURCE_NAME, {
            level: (row.flood_risk_level as FloodRiskLevel) || 'NONE',
            returnPeriodYears:
              row.return_period_years !== null ? Number(row.return_period_years) : null,
            isInPreferentialFlowZone: row.is_in_preferential_flow_zone === 1,
          });
        }

        if (censusSectionCode.length >= 5) {
          const muniCode = censusSectionCode.slice(0, 5);
          const muniRow = await this.db
            .prepare(
              'SELECT flood_risk_level, return_period_years, is_in_preferential_flow_zone FROM census_tract_snczi_risk WHERE municipality_code = ? AND cusec IS NULL'
            )
            .bind(muniCode)
            .first<{
              flood_risk_level: string;
              return_period_years: number | null;
              is_in_preferential_flow_zone: number;
            }>();

          if (muniRow) {
            return layerOk(SNCZI_SOURCE_NAME, {
              level: (muniRow.flood_risk_level as FloodRiskLevel) || 'NONE',
              returnPeriodYears:
                muniRow.return_period_years !== null
                  ? Number(muniRow.return_period_years)
                  : null,
              isInPreferentialFlowZone: muniRow.is_in_preferential_flow_zone === 1,
            });
          }
        }
      } catch (err: unknown) {
        console.warn('[SNCZIProvider] D1 lookup failed, falling back to WMS:', err instanceof Error ? err.message : err);
      }
    }

    // 2. Live MITECO WMS GetFeatureInfo protected by timeout, backoff and circuit breaker
    const delta = 0.0005;
    const bbox = `${longitude - delta},${latitude - delta},${longitude + delta},${latitude + delta}`;
    const layers = 'Zi_laminas_q10,Zi_laminas_q50,Zi_laminas_q100,Zi_laminas_q500,ZI_Laminas_ZFP';

    const params = new URLSearchParams({
      SERVICE: 'WMS',
      VERSION: '1.3.0',
      REQUEST: 'GetFeatureInfo',
      LAYERS: layers,
      QUERY_LAYERS: layers,
      CRS: 'CRS:84',
      BBOX: bbox,
      WIDTH: '101',
      HEIGHT: '101',
      I: '50',
      J: '50',
      INFO_FORMAT: 'application/json',
    });

    const url = `${this.wmsBaseUrl}?${params.toString()}`;

    try {
      return await withResilience(
        'snczi',
        async (signal) => {
          const res = await fetch(url, {
            signal,
            headers: { Accept: 'application/json', 'User-Agent': 'OpenBarrio-DueDiligence/1.4' },
            ...({ cf: { cacheTtl: 7776000, cacheEverything: true } } as Record<string, unknown>),
          });

          if (!res.ok) {
            if (res.status >= 500 || res.status === 429) {
              throw new TransientUpstreamError(`MITECO SNCZI WMS HTTP ${res.status}`, res.status);
            }
            throw new NonTransientUpstreamError(`MITECO SNCZI WMS HTTP ${res.status}`, res.status);
          }

          const text = await res.text();
          const parsed = this.parseSncziResponse(text);
          if (parsed.status === 'unavailable' && parsed.reason === 'invalid_payload') {
            throw new InvalidPayloadError('Invalid MITECO SNCZI WMS payload');
          }
          return parsed;
        },
        {
          breaker: this.breaker,
          timeoutMs: this.timeoutMs,
          maxRetries: this.maxRetries,
        }
      );
    } catch (err: unknown) {
      return layerUnavailable(SNCZI_SOURCE_NAME, mapErrorToLayerReason(err));
    }
  }

  /**
   * Parses SNCZI WMS/WFS response into a typed LayerResult.
   * Mainland empty GeoJSON FeatureCollections indicate no mapped flood zone (`level: 'NONE'`).
   * Empty bodies, HTML error pages, WMS ServiceExceptions, or malformed responses yield `unavailable` (`invalid_payload`).
   */
  public parseSncziResponse(rawBody: string): LayerResult<FloodRiskData> {
    const trimmed = (rawBody || '').trim();
    if (!trimmed) {
      return layerUnavailable(SNCZI_SOURCE_NAME, 'invalid_payload');
    }

    const lowerPrefix = trimmed.slice(0, 200).toLowerCase();
    if (
      lowerPrefix.includes('<serviceexceptionreport') ||
      lowerPrefix.includes('<serviceexception') ||
      lowerPrefix.includes('<!doctype') ||
      lowerPrefix.includes('<html')
    ) {
      return layerUnavailable(SNCZI_SOURCE_NAME, 'invalid_payload');
    }

    let isInPreferentialFlowZone = false;
    let minReturnPeriod: number | null = null;

    try {
      const json = JSON.parse(trimmed) as {
        features?: Array<{
          layer?: unknown;
          id?: unknown;
          properties?: Record<string, unknown>;
        }>;
      };

      if (!json || typeof json !== 'object' || !Array.isArray(json.features)) {
        return layerUnavailable(SNCZI_SOURCE_NAME, 'invalid_payload');
      }

      for (const feature of json.features) {
        const layerName = String(feature.layer || feature.id || '').toUpperCase();
        const props = feature.properties || {};
        const tipoZona = String(props.tipo_zona || props.TIPO_ZONA || '').toUpperCase();
        const idZona = String(props.id_zona || props.ID_ZONA || '').toUpperCase();
        const periodVal = Number(props.PERIODO || props.T || props.return_period);

        if (
          layerName.includes('ZFP') ||
          idZona.includes('ZFP') ||
          props.ZFP === true ||
          props.ZFP === '1' ||
          tipoZona.includes('FLUJO PREFERENTE')
        ) {
          isInPreferentialFlowZone = true;
        }

        if (
          periodVal === 10 ||
          ((layerName.includes('Q10') || layerName.includes('T10') || tipoZona.includes('T10') || tipoZona.includes('Q10')) &&
            !layerName.includes('100') && !tipoZona.includes('100') && !idZona.includes('100'))
        ) {
          minReturnPeriod = minReturnPeriod ? Math.min(minReturnPeriod, 10) : 10;
        } else if (
          periodVal === 50 ||
          layerName.includes('Q50') ||
          layerName.includes('T50') ||
          tipoZona.includes('T50') ||
          tipoZona.includes('Q50')
        ) {
          minReturnPeriod = minReturnPeriod ? Math.min(minReturnPeriod, 50) : 50;
        } else if (
          periodVal === 100 ||
          layerName.includes('Q100') ||
          layerName.includes('T100') ||
          tipoZona.includes('T100') ||
          tipoZona.includes('Q100')
        ) {
          minReturnPeriod = minReturnPeriod ? Math.min(minReturnPeriod, 100) : 100;
        } else if (
          periodVal === 500 ||
          layerName.includes('Q500') ||
          layerName.includes('T500') ||
          tipoZona.includes('T500') ||
          tipoZona.includes('Q500')
        ) {
          minReturnPeriod = minReturnPeriod ? Math.min(minReturnPeriod, 500) : 500;
        }
      }
    } catch {
      const hasValidGml =
        trimmed.includes('<wfs:FeatureCollection') ||
        trimmed.includes('<FeatureCollection') ||
        trimmed.includes('<msGMLOutput') ||
        trimmed.includes('ZI_') ||
        trimmed.includes('<T>');

      if (!hasValidGml) {
        return layerUnavailable(SNCZI_SOURCE_NAME, 'invalid_payload');
      }

      if (trimmed.includes('ZI_ZFP') || trimmed.includes('<ZFP>1</ZFP>')) {
        isInPreferentialFlowZone = true;
      }
      if (trimmed.includes('<T>10</T>') || (trimmed.includes('ZI_T10') && !trimmed.includes('ZI_T100'))) {
        minReturnPeriod = 10;
      } else if (trimmed.includes('ZI_T50') || trimmed.includes('<T>50</T>')) {
        minReturnPeriod = 50;
      } else if (trimmed.includes('ZI_T100') || trimmed.includes('<T>100</T>')) {
        minReturnPeriod = 100;
      } else if (trimmed.includes('ZI_T500') || trimmed.includes('<T>500</T>')) {
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

    return layerOk(SNCZI_SOURCE_NAME, {
      level,
      returnPeriodYears: minReturnPeriod,
      isInPreferentialFlowZone,
    });
  }
}
