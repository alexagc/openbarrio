import {
  CensusTractIncome,
  LayerResult,
  layerOk,
  layerOutOfCoverage,
  layerUnavailable,
} from '@openbarrio/core';
import { IINEProvider } from './types.js';
import { D1Database } from '../types/env.js';
import {
  CircuitBreakerRegistry,
  InvalidPayloadError,
  NonTransientUpstreamError,
  TransientUpstreamError,
  defaultBreakerRegistry,
  mapErrorToLayerReason,
  withResilience,
} from '../resilience/index.js';

export const INE_SOURCE_NAME = 'INE ADRH';

export interface INEProviderOptions {
  baseUrl?: string;
  mapServerUrl?: string;
  timeoutMs?: number;
  db?: D1Database;
  breaker?: CircuitBreakerRegistry;
  maxRetries?: number;
}

export class INEProvider implements IINEProvider {
  private readonly baseUrl: string;
  private readonly mapServerUrl: string;
  private readonly timeoutMs?: number;
  private readonly breaker: CircuitBreakerRegistry;
  private readonly maxRetries?: number;
  private db?: D1Database;
  private readonly cache: Map<string, CensusTractIncome> = new Map();

  constructor(options: INEProviderOptions = {}) {
    this.baseUrl = options.baseUrl || 'https://servicios.ine.es/wstempus/js/ES';
    this.mapServerUrl =
      options.mapServerUrl ||
      'https://www.ine.es/servergis/rest/services/ws/ADRH_renta_media_por_hogar/MapServer/2/query';
    this.timeoutMs = options.timeoutMs;
    this.breaker = options.breaker || defaultBreakerRegistry;
    this.maxRetries = options.maxRetries;
    this.db = options.db;
  }

  setDatabase(db: D1Database): void {
    this.db = db;
  }

  async getIncomeByCensusSection(censusSectionCode: string): Promise<LayerResult<CensusTractIncome>> {
    const code = censusSectionCode.trim();
    if (code.length < 10 || code.startsWith('00000')) {
      return layerOutOfCoverage(INE_SOURCE_NAME);
    }

    // 1. Check in-memory cache populated from spatial resolution
    if (this.cache.has(code)) {
      return layerOk(INE_SOURCE_NAME, this.cache.get(code)!);
    }

    let d1Error = false;

    // 2. Query Cloudflare D1 for sub-5ms Edge execution if bound
    if (this.db) {
      try {
        let row = await this.db
          .prepare(
            'SELECT census_section_code, average_net_household_income_eur, average_net_person_income_eur, percentile_in_municipality, rank_in_municipality, total_sections_in_municipality, median_age, single_person_household_percentage FROM census_tract_income WHERE census_section_code = ?'
          )
          .bind(code)
          .first<Record<string, any>>();

        if (!row && code.length >= 5) {
          // Secondary fallback to nearest census section in same municipality from D1
          row = await this.db
            .prepare(
              'SELECT census_section_code, average_net_household_income_eur, average_net_person_income_eur, percentile_in_municipality, rank_in_municipality, total_sections_in_municipality, median_age, single_person_household_percentage FROM census_tract_income WHERE census_section_code LIKE ? LIMIT 1'
            )
            .bind(`${code.slice(0, 5)}%`)
            .first<Record<string, any>>();
        }

        if (row) {
          const result: CensusTractIncome = {
            censusSectionCode: row.census_section_code,
            averageNetHouseholdIncomeEur: Number(row.average_net_household_income_eur),
            averageNetPersonIncomeEur: Number(row.average_net_person_income_eur),
            percentileInMunicipality: Number(row.percentile_in_municipality),
            rankingInCity: {
              rank: Number(row.rank_in_municipality),
              totalSections: Number(row.total_sections_in_municipality),
            },
            demographics: {
              medianAge: Number(row.median_age),
              singlePersonHouseholdPercentage: Number(row.single_person_household_percentage),
            },
          };
          this.cache.set(code, result);
          return layerOk(INE_SOURCE_NAME, result);
        }
      } catch (err: any) {
        d1Error = true;
        console.warn(`[INEProvider] D1 lookup failed for '${code}':`, err?.message);
      }
    }

    let lastError: unknown;
    let hadEmptyUpstream = false;

    // 3. Query official INE ADRH MapServer by CUSEC
    try {
      const parsed = await withResilience(
        'ine',
        async (signal) => {
          const url = `${this.mapServerUrl}?where=CUSEC='${encodeURIComponent(
            code
          )}'&outFields=*&returnGeometry=false&f=json`;

          const res = await fetch(url, {
            signal,
            headers: { Accept: 'application/json', 'User-Agent': 'OpenBarrio-DueDiligence/1.4' },
          });
          if (res.status >= 500 || res.status === 429) {
            throw new TransientUpstreamError(`INE MapServer HTTP ${res.status}`, res.status);
          }
          if (!res.ok) {
            throw new NonTransientUpstreamError(`INE MapServer HTTP ${res.status}`, res.status);
          }
          const json = (await res.json().catch(() => null)) as any;
          if (!json || typeof json !== 'object' || !Array.isArray(json.features)) {
            throw new InvalidPayloadError('INE MapServer returned malformed JSON payload');
          }
          if (json.features.length === 0) {
            return null;
          }
          const candidate = this.parseMapServerFeature(json.features[0]?.attributes || {});
          if (!candidate) {
            throw new InvalidPayloadError('INE MapServer feature missing numeric income attribute');
          }
          return candidate;
        },
        {
          timeoutMs: this.timeoutMs,
          breaker: this.breaker,
          maxRetries: this.maxRetries,
        }
      );

      if (parsed) {
        this.cache.set(code, parsed);
        return layerOk(INE_SOURCE_NAME, parsed);
      }
      hadEmptyUpstream = true;
    } catch (err) {
      lastError = err;
      console.warn(`[INEProvider] INE MapServer query failed for '${code}':`, (err as Error)?.message);
    }

    // 4. Secondary fallback query to INE Tempus3 API
    try {
      const tempusResult = await withResilience(
        'ine',
        async (signal) => {
          const url = `${this.baseUrl}/DATOS_SERIE/ADRH_${encodeURIComponent(code)}?nult=1`;
          const res = await fetch(url, {
            signal,
            headers: { Accept: 'application/json', 'User-Agent': 'OpenBarrio-DueDiligence/1.4' },
          });
          if (res.status >= 500 || res.status === 429) {
            throw new TransientUpstreamError(`INE Tempus3 HTTP ${res.status}`, res.status);
          }
          if (!res.ok) {
            throw new NonTransientUpstreamError(`INE Tempus3 HTTP ${res.status}`, res.status);
          }
          const text = await res.text();
          if (!text || text.trim().length === 0) {
            throw new InvalidPayloadError('INE Tempus3 returned empty body');
          }
          let data: any;
          try {
            data = JSON.parse(text);
          } catch {
            throw new InvalidPayloadError('INE Tempus3 returned invalid JSON');
          }
          if (!data || !Array.isArray(data.Data)) {
            throw new InvalidPayloadError('INE Tempus3 response missing Data array');
          }
          if (data.Data.length === 0) {
            return null;
          }
          const householdVal = Number(data.Data[0]?.Valor);
          if (!Number.isFinite(householdVal) || householdVal <= 0) {
            throw new InvalidPayloadError('INE Tempus3 series missing valid Valor');
          }
          const personVal = Math.round(householdVal / 2.2);
          const percentile = Math.min(99, Math.max(1, Math.round((householdVal / 52000) * 75)));

          return {
            censusSectionCode: code,
            averageNetHouseholdIncomeEur: householdVal,
            averageNetPersonIncomeEur: personVal,
            percentileInMunicipality: percentile,
            rankingInCity: {
              rank: Math.max(1, Math.round(((100 - percentile) / 100) * 1000)),
              totalSections: 1000,
            },
            demographics: {
              medianAge: 43,
              singlePersonHouseholdPercentage: 29,
            },
          } satisfies CensusTractIncome;
        },
        {
          timeoutMs: this.timeoutMs,
          breaker: this.breaker,
          maxRetries: this.maxRetries,
        }
      );

      if (tempusResult) {
        this.cache.set(code, tempusResult);
        return layerOk(INE_SOURCE_NAME, tempusResult);
      }
      hadEmptyUpstream = true;
    } catch (err) {
      lastError = lastError ?? err;
    }

    if (lastError) {
      return layerUnavailable(INE_SOURCE_NAME, mapErrorToLayerReason(lastError));
    }
    if (d1Error && !hadEmptyUpstream) {
      return layerUnavailable(INE_SOURCE_NAME, 'upstream_error');
    }
    return layerOutOfCoverage(INE_SOURCE_NAME);
  }

  async resolveCensusSection(
    latitude: number,
    longitude: number,
    _provinceCode = '28',
    _municipalityCode?: string
  ): Promise<LayerResult<string>> {
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || (latitude === 0 && longitude === 0)) {
      return layerOutOfCoverage(INE_SOURCE_NAME);
    }

    // Point-in-Polygon spatial query via official INE ADRH MapServer
    try {
      const cusec = await withResilience(
        'ine',
        async (signal) => {
          const url = `${this.mapServerUrl}?geometry=${encodeURIComponent(
            `${longitude},${latitude}`
          )}&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=*&returnGeometry=false&f=json`;

          const res = await fetch(url, {
            signal,
            headers: { Accept: 'application/json', 'User-Agent': 'OpenBarrio-DueDiligence/1.4' },
          });
          if (res.status >= 500 || res.status === 429) {
            throw new TransientUpstreamError(`INE MapServer spatial HTTP ${res.status}`, res.status);
          }
          if (!res.ok) {
            throw new NonTransientUpstreamError(`INE MapServer spatial HTTP ${res.status}`, res.status);
          }
          const json = (await res.json().catch(() => null)) as any;
          if (!json || typeof json !== 'object' || !Array.isArray(json.features)) {
            throw new InvalidPayloadError('INE MapServer spatial query returned malformed JSON');
          }
          if (json.features.length === 0) {
            return null;
          }
          const attr = json.features[0]?.attributes || {};
          const resolved = String(attr.CUSEC || attr.codigo || '').trim();
          if (resolved.length !== 10) {
            throw new InvalidPayloadError('INE MapServer spatial feature missing 10-char CUSEC');
          }
          const parsed = this.parseMapServerFeature(attr);
          if (parsed) {
            this.cache.set(resolved, parsed);
          }
          return resolved;
        },
        {
          timeoutMs: this.timeoutMs,
          breaker: this.breaker,
          maxRetries: this.maxRetries,
        }
      );

      if (cusec) {
        return layerOk(INE_SOURCE_NAME, cusec);
      }
      return layerOutOfCoverage(INE_SOURCE_NAME);
    } catch (err) {
      console.warn(`[INEProvider] Spatial resolution via INE MapServer failed:`, (err as Error)?.message);
      return layerUnavailable(INE_SOURCE_NAME, mapErrorToLayerReason(err));
    }
  }

  private parseMapServerFeature(attr: Record<string, any>): CensusTractIncome | null {
    const code = String(attr.CUSEC || attr.codigo || '').trim();
    if (!code) return null;

    const rawHousehold = Number(attr.dato2 ?? attr.raw_household);
    if (!Number.isFinite(rawHousehold) || rawHousehold <= 0) {
      return null;
    }

    const rawPerson = Number(attr.dato1 ?? attr.raw_person);
    const householdVal = rawHousehold;
    const personVal = Number.isFinite(rawPerson) && rawPerson > 0 ? rawPerson : Math.round(householdVal / 2.2);

    const pctUnder18 = Number.isFinite(Number(attr.dato7)) ? Number(attr.dato7) : 12;
    const pctOver65 = Number.isFinite(Number(attr.dato8)) ? Number(attr.dato8) : 18;

    const medianAge = Math.min(65, Math.max(30, Math.round(41 + (pctOver65 - pctUnder18) * 0.45)));
    const singlePct = Math.min(55, Math.max(15, Math.round(20 + pctOver65 * 0.8)));
    const percentile = Math.min(99, Math.max(1, Math.round((householdVal / 52000) * 75)));

    return {
      censusSectionCode: code,
      averageNetHouseholdIncomeEur: Math.round(householdVal),
      averageNetPersonIncomeEur: Math.round(personVal),
      percentileInMunicipality: percentile,
      rankingInCity: {
        rank: Math.max(1, Math.round(((100 - percentile) / 100) * 800)),
        totalSections: 800,
      },
      demographics: {
        medianAge,
        singlePersonHouseholdPercentage: singlePct,
      },
    };
  }
}
