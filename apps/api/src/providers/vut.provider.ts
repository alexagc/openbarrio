import { VutEvaluationDTO, evaluateVutSaturation } from '@openbarrio/core';
import type { D1Database } from '../types/env.js';
import type { IVutProvider } from './types.js';

export interface VutProviderOptions {
  timeoutMs?: number;
  featureServerUrl?: string;
  enableLiveLookup?: boolean;
}

export class VutProvider implements IVutProvider {
  private db?: D1Database;
  private timeoutMs: number;
  private featureServerUrl: string;
  private enableLiveLookup: boolean;

  constructor(db?: D1Database, options?: VutProviderOptions) {
    this.db = db;
    this.timeoutMs = options?.timeoutMs || 3500;
    this.featureServerUrl =
      options?.featureServerUrl ||
      'https://www.ine.es/servergis/rest/services/Hosted/Viviendas_tur%C3%ADsticas_2024M08/FeatureServer/3/query';
    this.enableLiveLookup =
      options?.enableLiveLookup ??
      (typeof process !== 'undefined' &&
      (process.env?.NODE_ENV === 'test' || process.env?.VITEST === 'true')
        ? false
        : true);
  }

  setDatabase(db: D1Database): void {
    this.db = db;
  }

  async getVutEvaluation(
    censusSectionId: string,
    coords?: { latitude: number; longitude: number }
  ): Promise<VutEvaluationDTO> {
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
          return evaluateVutSaturation(
            censusSectionId,
            row.total_dwellings,
            row.vut_count,
            row.vut_beds,
            false
          );
        }
      } catch {
        // Fall through to live lookup or heuristic
      }
    }

    // 2. Query official INE ServerGIS Experimental VUT FeatureServer live
    if (this.enableLiveLookup) {
      try {
        let queryUrl = '';
        if (coords && typeof coords.latitude === 'number' && typeof coords.longitude === 'number') {
          queryUrl = `${this.featureServerUrl}?geometry=${coords.longitude},${coords.latitude}&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=*&returnGeometry=false&f=json`;
        } else if (censusSectionId && censusSectionId.length === 10) {
          queryUrl = `${this.featureServerUrl}?where=cusec='${encodeURIComponent(censusSectionId)}'&outFields=*&returnGeometry=false&f=json`;
        }

        if (queryUrl) {
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), this.timeoutMs);
          const res = await fetch(queryUrl, {
            signal: controller.signal,
            headers: { Accept: 'application/json', 'User-Agent': 'OpenBarrio-DueDiligence/0.1' },
          });
          clearTimeout(timer);

          if (res.ok) {
            const data = (await res.json()) as any;
            if (data && Array.isArray(data.features) && data.features.length > 0) {
              const attrs = data.features[0].attributes || {};
              const vutCount = typeof attrs.vivienda_turistica === 'number' ? attrs.vivienda_turistica : 0;
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
                } catch {
                  // Non-critical: continue
                }
              }

              return evaluateVutSaturation(
                censusSectionId,
                totalDwellings,
                vutCount,
                vutBeds,
                false
              );
            }
          }
        }
      } catch {
        // Fall through to deterministic fallback on upstream timeout or network error
      }
    }

    return this.resolveDeterministicFallback(censusSectionId);
  }

  private resolveDeterministicFallback(censusSectionId: string): VutEvaluationDTO {
    let hash = 0;
    for (let i = 0; i < censusSectionId.length; i++) {
      hash = (hash * 31 + censusSectionId.charCodeAt(i)) >>> 0;
    }
    const totalDwellings = 1000 + (hash % 600);
    const bucket = hash % 100;
    let vutCount: number;
    if (bucket < 15) {
      vutCount = Math.round(totalDwellings * (0.085 + (hash % 60) / 1000));
    } else if (bucket < 40) {
      vutCount = Math.round(totalDwellings * (0.035 + (hash % 35) / 1000));
    } else {
      vutCount = Math.round(totalDwellings * (0.005 + (hash % 15) / 1000));
    }
    const vutBeds = vutCount * 4;
    return evaluateVutSaturation(censusSectionId, totalDwellings, vutCount, vutBeds, true);
  }
}

export class MockVutProvider implements IVutProvider {
  async getVutEvaluation(
    censusSectionId: string,
    _coords?: { latitude: number; longitude: number }
  ): Promise<VutEvaluationDTO> {
    if (censusSectionId === '2807901001' || censusSectionId.endsWith('01001')) {
      return evaluateVutSaturation(censusSectionId, 1200, 168, 672, false);
    }
    if (censusSectionId === '2807907001' || censusSectionId.endsWith('07001')) {
      return evaluateVutSaturation(censusSectionId, 1400, 70, 280, false);
    }
    return evaluateVutSaturation(censusSectionId, 1500, 15, 60, false);
  }
}
