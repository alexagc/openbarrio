import {
  LayerResult,
  VutEvaluationDTO,
  evaluateVutSaturation,
  layerOk,
  layerOutOfCoverage,
  layerUnavailable,
} from '@openbarrio/core';
import type { D1Database } from '../types/env.js';
import type { IVutProvider } from './types.js';
import {
  CircuitBreakerRegistry,
  InvalidPayloadError,
  NonTransientUpstreamError,
  TransientUpstreamError,
  defaultBreakerRegistry,
  mapErrorToLayerReason,
  withResilience,
} from '../resilience/index.js';

export const VUT_SOURCE_NAME = 'INE VUT Experimental';

export interface VutProviderOptions {
  timeoutMs?: number;
  featureServerUrl?: string;
  enableLiveLookup?: boolean;
  breaker?: CircuitBreakerRegistry;
  maxRetries?: number;
}

export class VutProvider implements IVutProvider {
  private db?: D1Database;
  private timeoutMs?: number;
  private featureServerUrl: string;
  private enableLiveLookup: boolean;
  private breaker: CircuitBreakerRegistry;
  private maxRetries?: number;

  constructor(db?: D1Database, options?: VutProviderOptions) {
    this.db = db;
    this.timeoutMs = options?.timeoutMs;
    this.featureServerUrl =
      options?.featureServerUrl ||
      'https://www.ine.es/servergis/rest/services/Hosted/Viviendas_tur%C3%ADsticas_2024M08/FeatureServer/3/query';
    this.enableLiveLookup =
      options?.enableLiveLookup ??
      (typeof process !== 'undefined' &&
      (process.env?.NODE_ENV === 'test' || process.env?.VITEST === 'true')
        ? false
        : true);
    this.breaker = options?.breaker || defaultBreakerRegistry;
    this.maxRetries = options?.maxRetries;
  }

  setDatabase(db: D1Database): void {
    this.db = db;
  }

  async getVutEvaluation(
    censusSectionId: string,
    coords?: { latitude: number; longitude: number }
  ): Promise<LayerResult<VutEvaluationDTO>> {
    let d1Error = false;

    // 1. Check Cloudflare D1 / SQLite cache (sub-5ms)
    if (this.db) {
      try {
        const row = await this.db
          .prepare(
            'SELECT total_dwellings, vut_count, vut_beds, vut_ratio_pct FROM census_tract_vut WHERE census_section_id = ?'
          )
          .bind(censusSectionId)
          .first<{
            total_dwellings: number;
            vut_count: number;
            vut_beds: number;
            vut_ratio_pct: number;
          }>();

        if (row) {
          return layerOk(
            VUT_SOURCE_NAME,
            evaluateVutSaturation(
              censusSectionId,
              row.total_dwellings,
              row.vut_count,
              row.vut_beds,
              false
            )
          );
        }
      } catch (err) {
        d1Error = true;
        console.warn('[VutProvider] D1 lookup failed:', (err as Error)?.message);
      }
    }

    // 2. Query official INE ServerGIS Experimental VUT FeatureServer live
    if (this.enableLiveLookup) {
      let queryUrl = '';
      if (coords && typeof coords.latitude === 'number' && typeof coords.longitude === 'number') {
        queryUrl = `${this.featureServerUrl}?geometry=${coords.longitude},${coords.latitude}&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=*&returnGeometry=false&f=json`;
      } else if (censusSectionId && censusSectionId.length === 10) {
        queryUrl = `${this.featureServerUrl}?where=cusec='${encodeURIComponent(censusSectionId)}'&outFields=*&returnGeometry=false&f=json`;
      }

      if (!queryUrl) {
        return layerOutOfCoverage(VUT_SOURCE_NAME);
      }

      try {
        const evaluated = await withResilience(
          'vut',
          async (signal) => {
            const res = await fetch(queryUrl, {
              signal,
              headers: { Accept: 'application/json', 'User-Agent': 'OpenBarrio-DueDiligence/1.4' },
            });
            if (res.status >= 500 || res.status === 429) {
              throw new TransientUpstreamError(`INE VUT HTTP ${res.status}`, res.status);
            }
            if (!res.ok) {
              throw new NonTransientUpstreamError(`INE VUT HTTP ${res.status}`, res.status);
            }
            const data = (await res.json().catch(() => null)) as any;
            if (!data || typeof data !== 'object' || !Array.isArray(data.features)) {
              throw new InvalidPayloadError('INE VUT returned malformed JSON payload');
            }
            if (data.features.length === 0) {
              return null;
            }
            const attrs = data.features[0]?.attributes || {};
            if (typeof attrs.vivienda_turistica !== 'number') {
              throw new InvalidPayloadError('INE VUT feature missing numeric vivienda_turistica');
            }
            const vutCount = attrs.vivienda_turistica;
            const vutBeds = typeof attrs.plazas === 'number' ? attrs.plazas : 0;
            const ratioPct =
              typeof attrs.porcentaje_vivienda_turistica === 'number'
                ? Number(attrs.porcentaje_vivienda_turistica.toFixed(2))
                : 0;

            const totalDwellings =
              ratioPct > 0
                ? Math.max(1, Math.round(vutCount / (ratioPct / 100)))
                : typeof attrs.total_viviendas === 'number' && attrs.total_viviendas > 0
                ? attrs.total_viviendas
                : 1000;

            const resolvedSection = String(attrs.cusec || attrs.codigo || censusSectionId);

            // Best-effort D1 cache write
            if (this.db) {
              try {
                await this.db
                  .prepare(
                    'INSERT OR REPLACE INTO census_tract_vut (census_section_id, total_dwellings, vut_count, vut_beds, vut_ratio_pct) VALUES (?, ?, ?, ?, ?)'
                  )
                  .bind(censusSectionId, totalDwellings, vutCount, vutBeds, ratioPct)
                  .run();

                if (resolvedSection !== censusSectionId) {
                  await this.db
                    .prepare(
                      'INSERT OR REPLACE INTO census_tract_vut (census_section_id, total_dwellings, vut_count, vut_beds, vut_ratio_pct) VALUES (?, ?, ?, ?, ?)'
                    )
                    .bind(resolvedSection, totalDwellings, vutCount, vutBeds, ratioPct)
                    .run();
                }
              } catch (writeErr) {
                console.warn('[VutProvider] D1 cache write skipped:', (writeErr as Error)?.message);
              }
            }

            return evaluateVutSaturation(
              censusSectionId,
              totalDwellings,
              vutCount,
              vutBeds,
              false
            );
          },
          {
            timeoutMs: this.timeoutMs,
            breaker: this.breaker,
            maxRetries: this.maxRetries,
          }
        );

        if (!evaluated) {
          return layerOutOfCoverage(VUT_SOURCE_NAME);
        }
        return layerOk(VUT_SOURCE_NAME, evaluated);
      } catch (err) {
        return layerUnavailable(VUT_SOURCE_NAME, mapErrorToLayerReason(err));
      }
    }

    if (this.db && !d1Error) {
      return layerOutOfCoverage(VUT_SOURCE_NAME);
    }

    return layerUnavailable(VUT_SOURCE_NAME, 'upstream_error');
  }
}

export class MockVutProvider implements IVutProvider {
  async getVutEvaluation(
    censusSectionId: string,
    _coords?: { latitude: number; longitude: number }
  ): Promise<LayerResult<VutEvaluationDTO>> {
    if (censusSectionId === '2807901001' || censusSectionId.endsWith('01001')) {
      return layerOk(VUT_SOURCE_NAME, evaluateVutSaturation(censusSectionId, 1200, 168, 672, false));
    }
    if (censusSectionId === '2807907001' || censusSectionId.endsWith('07001')) {
      return layerOk(VUT_SOURCE_NAME, evaluateVutSaturation(censusSectionId, 1400, 70, 280, false));
    }
    return layerOk(VUT_SOURCE_NAME, evaluateVutSaturation(censusSectionId, 1500, 15, 60, false));
  }
}
