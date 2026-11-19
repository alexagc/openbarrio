import {
  LayerResult,
  NoiseData,
  NoiseLevelCategory,
  PredominantNoiseSource,
  layerOk,
  layerOutOfCoverage,
  layerUnavailable,
} from '@openbarrio/core';
import { ISICAProvider } from './types.js';
import type { D1Database } from '../types/env.js';
import {
  CircuitBreakerRegistry,
  InvalidPayloadError,
  NonTransientUpstreamError,
  SourceSnapshotStore,
  TransientUpstreamError,
  WaitUntilFn,
  defaultBreakerRegistry,
  mapErrorToLayerReason,
  resolveWithStaleWhileRevalidate,
  withResilience,
} from '../resilience/index.js';

export const SICA_SOURCE_NAME = 'MITECO SICA';

export interface SICAProviderOptions {
  wmsBaseUrl?: string;
  timeoutMs?: number;
  db?: D1Database;
  breaker?: CircuitBreakerRegistry;
  maxRetries?: number;
  snapshotStore?: SourceSnapshotStore;
}

/**
 * MITECO SICA (Sistema de Información sobre Contaminación Acústica) Provider.
 * Queries strategic noise maps (Lden) across road, railway, airport, and agglomeration corridors.
 * Never fabricates acoustic baselines when upstream fails or a coordinate lies outside coverage.
 */
export class SICAProvider implements ISICAProvider {
  private readonly wmsBaseUrl: string;
  private readonly timeoutMs?: number;
  private readonly breaker: CircuitBreakerRegistry;
  private readonly maxRetries?: number;
  private snapshotStore?: SourceSnapshotStore;
  private db?: D1Database;

  constructor(options: SICAProviderOptions = {}) {
    this.wmsBaseUrl =
      options.wmsBaseUrl || 'https://gis.miteco.gob.es/geoserver/evaluacionambiental/wms';
    this.timeoutMs = options.timeoutMs;
    this.breaker = options.breaker || defaultBreakerRegistry;
    this.maxRetries = options.maxRetries;
    this.db = options.db;
    this.snapshotStore =
      options.snapshotStore ?? (options.db ? new SourceSnapshotStore({ db: options.db }) : undefined);
  }

  setDatabase(db: D1Database): void {
    this.db = db;
    if (this.snapshotStore) {
      this.snapshotStore.setDatabase(db);
    } else {
      this.snapshotStore = new SourceSnapshotStore({ db });
    }
  }

  async getNoiseData(
    latitude: number,
    longitude: number,
    censusSectionCode?: string,
    waitUntil?: WaitUntilFn
  ): Promise<LayerResult<NoiseData>> {
    // 1. Hierarchical Resolution via Cloudflare D1 (sub-5ms Edge execution)
    if (this.db && censusSectionCode) {
      try {
        const row = await this.db
          .prepare(
            'SELECT day_evening_night_decibels, category, predominant_source FROM census_tract_sica_noise WHERE cusec = ?'
          )
          .bind(censusSectionCode)
          .first<{
            day_evening_night_decibels: number;
            category: string;
            predominant_source: string;
          }>();

        if (row && Number.isFinite(Number(row.day_evening_night_decibels))) {
          return layerOk(SICA_SOURCE_NAME, {
            dayEveningNightDecibels: Number(row.day_evening_night_decibels),
            category: (row.category as NoiseLevelCategory) || this.categorizeDecibels(Number(row.day_evening_night_decibels)),
            predominantSource: (row.predominant_source as PredominantNoiseSource) || 'ROAD_TRAFFIC',
          });
        }

        if (censusSectionCode.length >= 5) {
          const muniCode = censusSectionCode.slice(0, 5);
          const muniRow = await this.db
            .prepare(
              'SELECT day_evening_night_decibels, category, predominant_source FROM census_tract_sica_noise WHERE municipality_code = ? AND cusec IS NULL'
            )
            .bind(muniCode)
            .first<{
              day_evening_night_decibels: number;
              category: string;
              predominant_source: string;
            }>();

          if (muniRow && Number.isFinite(Number(muniRow.day_evening_night_decibels))) {
            return layerOk(SICA_SOURCE_NAME, {
              dayEveningNightDecibels: Number(muniRow.day_evening_night_decibels),
              category: (muniRow.category as NoiseLevelCategory) || this.categorizeDecibels(Number(muniRow.day_evening_night_decibels)),
              predominantSource: (muniRow.predominant_source as PredominantNoiseSource) || 'ROAD_TRAFFIC',
            });
          }
        }
      } catch (err: unknown) {
        console.warn('[SICAProvider] D1 lookup failed, falling back to WMS:', err instanceof Error ? err.message : err);
      }
    }

    // 2. Live MITECO WMS GetFeatureInfo protected by timeout, backoff and circuit breaker
    const delta = 0.0005;
    const bbox = `${longitude - delta},${latitude - delta},${longitude + delta},${latitude + delta}`;
    const noiseLayers = 'mer_carretera_lden,mer_aglomeracion_lden,mer_ferrocarril_lden,mer_aeropuerto_lden';

    const params = new URLSearchParams({
      SERVICE: 'WMS',
      VERSION: '1.3.0',
      REQUEST: 'GetFeatureInfo',
      LAYERS: noiseLayers,
      QUERY_LAYERS: noiseLayers,
      CRS: 'CRS:84',
      BBOX: bbox,
      WIDTH: '101',
      HEIGHT: '101',
      I: '50',
      J: '50',
      INFO_FORMAT: 'application/json',
    });

    const url = `${this.wmsBaseUrl}?${params.toString()}`;
    const cacheKey = `${latitude.toFixed(4)}:${longitude.toFixed(4)}`;

    return resolveWithStaleWhileRevalidate({
      providerKey: 'sica',
      sourceName: SICA_SOURCE_NAME,
      cacheKey,
      snapshotStore: this.snapshotStore,
      breaker: this.breaker,
      waitUntil,
      fetcher: async () => {
        try {
          return await withResilience(
            'sica',
            async (signal) => {
              const res = await fetch(url, {
                signal,
                headers: { Accept: 'application/json', 'User-Agent': 'OpenBarrio-DueDiligence/1.4' },
                ...({ cf: { cacheTtl: 7776000, cacheEverything: true } } as Record<string, unknown>),
              });

              if (!res.ok) {
                if (res.status >= 500 || res.status === 429) {
                  throw new TransientUpstreamError(`MITECO SICA WMS HTTP ${res.status}`, res.status);
                }
                throw new NonTransientUpstreamError(`MITECO SICA WMS HTTP ${res.status}`, res.status);
              }

              const text = await res.text();
              const parsed = this.parseSicaResponse(text);
              if (parsed.status === 'unavailable' && parsed.reason === 'invalid_payload') {
                throw new InvalidPayloadError('Invalid MITECO SICA WMS payload');
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
          return layerUnavailable(SICA_SOURCE_NAME, mapErrorToLayerReason(err));
        }
      },
    });
  }

  /**
   * Parses SICA WMS/WFS JSON or GML/XML payload into a typed LayerResult.
   * Empty valid FeatureCollections indicate outside strategic noise map coverage (`out_of_coverage`).
   * Malformed, empty, HTML, or WMS ServiceException bodies return `unavailable` (`invalid_payload`).
   */
  public parseSicaResponse(rawBody: string): LayerResult<NoiseData> {
    const trimmed = (rawBody || '').trim();
    if (!trimmed) {
      return layerUnavailable(SICA_SOURCE_NAME, 'invalid_payload');
    }

    const lowerPrefix = trimmed.slice(0, 200).toLowerCase();
    if (
      lowerPrefix.includes('<serviceexceptionreport') ||
      lowerPrefix.includes('<serviceexception') ||
      lowerPrefix.includes('<!doctype') ||
      lowerPrefix.includes('<html')
    ) {
      return layerUnavailable(SICA_SOURCE_NAME, 'invalid_payload');
    }

    try {
      const json = JSON.parse(trimmed) as {
        type?: unknown;
        features?: Array<{
          layer?: unknown;
          id?: unknown;
          properties?: Record<string, unknown>;
        }>;
      };

      if (!json || typeof json !== 'object' || !Array.isArray(json.features)) {
        return layerUnavailable(SICA_SOURCE_NAME, 'invalid_payload');
      }

      if (json.features.length === 0) {
        return layerOutOfCoverage(SICA_SOURCE_NAME);
      }

      let maxDecibels = 0;
      let bestSource: PredominantNoiseSource = 'ROAD_TRAFFIC';

      for (const feature of json.features) {
        const props = feature.properties || {};
        const layerName = String(feature.layer || feature.id || '').toUpperCase();

        const rawLden =
          props['Nivel Lden dB(A) de la isófona'] ??
          props.lden ??
          props.LDEN ??
          props.noiselevel ??
          props.VALOR ??
          props.valor ??
          props.decibels ??
          props.LEVEL;

        const ldenVal =
          typeof rawLden === 'number'
            ? rawLden
            : parseFloat(String(rawLden ?? '').replace(',', '.'));

        if (!Number.isFinite(ldenVal) || ldenVal <= 0) {
          continue;
        }

        const rawSource =
          props['Tipo de Fuente de ruido que genera la isófona'] ??
          props.tipo_emiso ??
          props.fuente ??
          props.FUENTE ??
          props.source ??
          layerName;

        const currentSource = this.determinePredominantSource(String(rawSource));

        if (ldenVal > maxDecibels) {
          maxDecibels = ldenVal;
          bestSource = currentSource;
        }
      }

      if (maxDecibels > 0) {
        return layerOk(SICA_SOURCE_NAME, {
          dayEveningNightDecibels: maxDecibels,
          category: this.categorizeDecibels(maxDecibels),
          predominantSource: bestSource,
        });
      }

      return layerUnavailable(SICA_SOURCE_NAME, 'invalid_payload');
    } catch {
      // Fallback for valid GML / XML FeatureCollection responses
      const ldenMatch =
        trimmed.match(/<LDEN>([^<]+)<\/LDEN>/i) ||
        trimmed.match(/<valor>([^<]+)<\/valor>/i);
      const sourceMatch = trimmed.match(/<FUENTE>([^<]+)<\/FUENTE>/i);

      if (ldenMatch) {
        const decibels = parseFloat(ldenMatch[1].replace(',', '.'));
        if (!Number.isFinite(decibels) || decibels <= 0) {
          return layerUnavailable(SICA_SOURCE_NAME, 'invalid_payload');
        }
        const source = this.determinePredominantSource(sourceMatch ? sourceMatch[1] : '');
        return layerOk(SICA_SOURCE_NAME, {
          dayEveningNightDecibels: decibels,
          category: this.categorizeDecibels(decibels),
          predominantSource: source,
        });
      }

      if (
        (trimmed.includes('<wfs:FeatureCollection') ||
          trimmed.includes('<FeatureCollection') ||
          trimmed.includes('<msGMLOutput')) &&
        !trimmed.includes('<gml:featureMember') &&
        !trimmed.includes('<wfs:member')
      ) {
        return layerOutOfCoverage(SICA_SOURCE_NAME);
      }

      return layerUnavailable(SICA_SOURCE_NAME, 'invalid_payload');
    }
  }

  private categorizeDecibels(decibels: number): NoiseLevelCategory {
    if (decibels < 55) return 'QUIET';
    if (decibels < 65) return 'MODERATE';
    if (decibels < 75) return 'NOISY';
    return 'VERY_NOISY';
  }

  private determinePredominantSource(sourceStr: string): PredominantNoiseSource {
    const s = sourceStr.toUpperCase();
    if (s.includes('AERO') || s.includes('AIRPORT') || s.includes('AÉREO')) return 'AIRPORT';
    if (s.includes('FERRO') || s.includes('TREN') || s.includes('RAIL')) return 'RAILWAY';
    if (s.includes('INDUSTR') || s.includes('IND')) return 'INDUSTRIAL';
    if (s.includes('CARRETERA') || s.includes('VIARIO') || s.includes('TRAF') || s.includes('AGLOMER')) {
      return 'ROAD_TRAFFIC';
    }
    return 'ROAD_TRAFFIC';
  }
}
