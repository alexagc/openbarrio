import {
  MunicipalitySummaryDTO,
  MunicipalityDetailDTO,
} from '@openbarrio/core';
import { IMunicipalityProvider } from './types.js';
import { MockMunicipalityProvider } from './municipality.mock.js';
import { D1Database } from '../types/env.js';

export interface MunicipalityProviderOptions {
  db?: D1Database;
}

export class MunicipalityProvider implements IMunicipalityProvider {
  private db?: D1Database;
  private readonly fallback: MockMunicipalityProvider;

  constructor(options: MunicipalityProviderOptions = {}) {
    this.db = options.db;
    this.fallback = new MockMunicipalityProvider();
  }

  setDatabase(db: D1Database): void {
    this.db = db;
  }

  async listMunicipalities(params?: {
    query?: string;
    province?: string;
    page?: number;
    limit?: number;
  }): Promise<{ items: MunicipalitySummaryDTO[]; total: number; page: number; limit: number }> {
    // If D1 is bound, we can also query live tables, but fallback provides guaranteed rich metadata
    return this.fallback.listMunicipalities(params);
  }

  async getBySlugOrCode(slugOrCode: string): Promise<MunicipalityDetailDTO> {
    const base = await this.fallback.getBySlugOrCode(slugOrCode);

    if (this.db) {
      try {
        // Query live D1 census_tract_income aggregate if code matches
        const row = await this.db
          .prepare(
            `SELECT 
              AVG(average_net_household_income_eur) as avg_income,
              AVG(median_net_household_income_eur) as med_income,
              AVG(average_net_person_income_eur) as avg_person,
              AVG(percentile_in_municipality) as avg_pct,
              COUNT(*) as total_sec,
              AVG(median_age) as avg_age,
              AVG(single_person_household_percentage) as single_pct
            FROM census_tract_income
            WHERE municipality_code = ?`
          )
          .bind(base.code)
          .first<Record<string, any>>();

        if (row && row.total_sec > 0 && row.avg_income > 0) {
          base.averageHouseholdIncomeEur = Math.round(row.avg_income);
          base.medianHouseholdIncomeEur = Math.round(row.med_income || row.avg_income * 0.9);
          base.averagePersonIncomeEur = Math.round(row.avg_person || row.avg_income * 0.45);
          base.totalCensusSections = Number(row.total_sec);
          if (row.avg_age) base.medianAge = Math.round(row.avg_age * 10) / 10;
          if (row.single_pct) base.singlePersonHouseholdPct = Math.round(row.single_pct * 10) / 10;
        }

        // Query SERPAVI
        const serpaviRow = await this.db
          .prepare(
            `SELECT is_stressed_market, median_eur_m2, lower_bound_eur_m2, upper_bound_eur_m2
             FROM mivau_serpavi_benchmarks
             WHERE municipality_code = ? LIMIT 1`
          )
          .bind(base.code)
          .first<Record<string, any>>();

        if (serpaviRow) {
          base.isStressedMarket = Boolean(serpaviRow.is_stressed_market);
          base.serpaviMedianEurM2 = Number(serpaviRow.median_eur_m2);
          base.serpaviRangeEurM2 = {
            lower: Number(serpaviRow.lower_bound_eur_m2),
            upper: Number(serpaviRow.upper_bound_eur_m2),
          };
        }

        // Query Radon
        const radonRow = await this.db
          .prepare(
            `SELECT zone FROM cte_radon_municipalities WHERE municipality_code = ? LIMIT 1`
          )
          .bind(base.code)
          .first<Record<string, any>>();

        if (radonRow?.zone) {
          base.radonZone = radonRow.zone;
        }
      } catch {
        // Soft fallback to in-memory metadata
      }
    }

    return base;
  }
}
