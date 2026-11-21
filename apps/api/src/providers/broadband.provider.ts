import {
  BroadbandCoverage,
  BroadbandGranularity,
  evaluateBroadbandLayerStatus,
  layerOk,
  layerOutOfCoverage,
  layerStale,
  layerUnavailable,
  LayerResult,
} from '@openbarrio/core';
import { D1Database } from '../types/env.js';
import { IBroadbandProvider } from './types.js';

export const BROADBAND_SOURCE_NAME = 'SETELECO / CNMC Banda Ancha';

interface BroadbandSqlRow {
  territory_code: string;
  municipality_code: string;
  entity_name: string;
  granularity: BroadbandGranularity;
  ftth_pct: number;
  fixed_max_mbps: number | null;
  mobile_5g_pct: number | null;
  source_year: number;
  source_date: string;
  source_dataset: string;
}

function buildGranularityDisclaimer(
  granularity: BroadbandGranularity,
  entityName: string,
  sourceYear: number
): string {
  if (granularity === 'parcel') {
    return `Verified portal-level cadastral broadband record (${sourceYear}) for ${entityName}.`;
  }
  if (granularity === 'population_entity') {
    return `Historical SETELECO Singular Population Entity (ESP) aggregate (${sourceYear}) for ${entityName}; aggregate series ended open publication in 2020 and does not verify an optical CTO box inside this building.`;
  }
  return `SETELECO / CNMC municipal aggregate (${sourceYear}) for ${entityName}; does not guarantee active FTTH installation (CTO) at this specific street portal.`;
}

function mapRowToCoverage(row: BroadbandSqlRow): BroadbandCoverage {
  return {
    municipalityCode: row.municipality_code,
    territoryCode: row.territory_code,
    entityName: row.entity_name,
    granularity: row.granularity,
    ftthPct: Number(row.ftth_pct),
    fixedMaxMbps: row.fixed_max_mbps !== null ? Number(row.fixed_max_mbps) : null,
    mobile5gPct: row.mobile_5g_pct !== null ? Number(row.mobile_5g_pct) : null,
    sourceYear: Number(row.source_year),
    sourceDate: row.source_date,
    sourceDataset: row.source_dataset,
    disclaimer: buildGranularityDisclaimer(row.granularity, row.entity_name, Number(row.source_year)),
    informativeOnly: true,
  };
}

function toLayerResultFromRow(row: BroadbandSqlRow, now: Date): LayerResult<BroadbandCoverage> {
  const coverage = mapRowToCoverage(row);
  const evalRes = evaluateBroadbandLayerStatus(coverage.sourceDate, coverage.granularity, now);

  if (evalRes.status === 'unavailable') {
    return layerUnavailable(BROADBAND_SOURCE_NAME, 'upstream_error', {
      sourceDate: coverage.sourceDate,
      verifiedAt: coverage.sourceDate,
    });
  }

  if (evalRes.status === 'stale') {
    return layerStale(BROADBAND_SOURCE_NAME, coverage, {
      sourceDate: coverage.sourceDate,
      verifiedAt: coverage.sourceDate,
      staleDays: evalRes.staleDays,
      granularity: coverage.granularity,
    });
  }

  return layerOk(BROADBAND_SOURCE_NAME, coverage, {
    sourceDate: coverage.sourceDate,
    verifiedAt: coverage.sourceDate,
    granularity: coverage.granularity,
  });
}

export class D1BroadbandProvider implements IBroadbandProvider {
  private db?: D1Database;
  private readonly now: () => Date;

  constructor(options?: { db?: D1Database; now?: () => Date }) {
    this.db = options?.db;
    this.now = options?.now ?? (() => new Date());
  }

  setDatabase(db: D1Database): void {
    this.db = db;
  }

  async getBroadbandCoverage(
    municipalityCode?: string,
    cadastralReference?: string
  ): Promise<LayerResult<BroadbandCoverage>> {
    if (!municipalityCode) {
      return layerOutOfCoverage(BROADBAND_SOURCE_NAME, { reason: 'no_coverage' });
    }
    if (!this.db) {
      return layerUnavailable(BROADBAND_SOURCE_NAME, 'upstream_error');
    }

    try {
      const lookupRef = cadastralReference || municipalityCode;
      const row = await this.db
        .prepare(
          `SELECT territory_code, municipality_code, entity_name, granularity,
                  ftth_pct, fixed_max_mbps, mobile_5g_pct, source_year, source_date, source_dataset
           FROM broadband_coverage
           WHERE municipality_code = ? OR territory_code = ?
           ORDER BY CASE
             WHEN territory_code = ? THEN 0
             WHEN granularity = 'parcel' THEN 1
             WHEN granularity = 'municipality' THEN 2
             WHEN granularity = 'population_entity' THEN 3
             ELSE 4
           END,
           source_year DESC
           LIMIT 1`
        )
        .bind(municipalityCode, lookupRef, lookupRef)
        .first<BroadbandSqlRow>();

      if (!row) {
        return layerOutOfCoverage(BROADBAND_SOURCE_NAME, { reason: 'no_coverage' });
      }

      return toLayerResultFromRow(row, this.now());
    } catch (err) {
      console.warn('[D1BroadbandProvider] Query failed:', (err as Error)?.message);
      return layerUnavailable(BROADBAND_SOURCE_NAME, 'upstream_error');
    }
  }
}

const MOCK_BROADBAND_ROWS: BroadbandSqlRow[] = [
  {
    territory_code: '28079',
    municipality_code: '28079',
    entity_name: 'Madrid',
    granularity: 'municipality',
    ftth_pct: 99.1,
    fixed_max_mbps: 10000,
    mobile_5g_pct: 98.4,
    source_year: 2025,
    source_date: '2026-11-01',
    source_dataset: 'CNMCData / SETELECO Municipal 2025',
  },
  {
    territory_code: '08019',
    municipality_code: '08019',
    entity_name: 'Barcelona',
    granularity: 'municipality',
    ftth_pct: 99.3,
    fixed_max_mbps: 10000,
    mobile_5g_pct: 98.7,
    source_year: 2025,
    source_date: '2026-11-01',
    source_dataset: 'CNMCData / SETELECO Municipal 2025',
  },
  {
    territory_code: '46250',
    municipality_code: '46250',
    entity_name: 'València',
    granularity: 'municipality',
    ftth_pct: 98.6,
    fixed_max_mbps: 10000,
    mobile_5g_pct: 97.2,
    source_year: 2025,
    source_date: '2026-11-01',
    source_dataset: 'CNMCData / SETELECO Municipal 2025',
  },
  {
    territory_code: '41091',
    municipality_code: '41091',
    entity_name: 'Sevilla',
    granularity: 'municipality',
    ftth_pct: 97.8,
    fixed_max_mbps: 1000,
    mobile_5g_pct: 96.5,
    source_year: 2025,
    source_date: '2026-11-01',
    source_dataset: 'CNMCData / SETELECO Municipal 2025',
  },
  {
    territory_code: '50297',
    municipality_code: '50297',
    entity_name: 'Zaragoza',
    granularity: 'municipality',
    ftth_pct: 96.9,
    fixed_max_mbps: 1000,
    mobile_5g_pct: 95.2,
    source_year: 2024,
    source_date: '2024-06-30',
    source_dataset: 'SETELECO Cobertura Banda Ancha 2024',
  },
  {
    territory_code: '29067',
    municipality_code: '29067',
    entity_name: 'Málaga',
    granularity: 'municipality',
    ftth_pct: 96.4,
    fixed_max_mbps: 1000,
    mobile_5g_pct: 95.0,
    source_year: 2024,
    source_date: '2024-06-30',
    source_dataset: 'SETELECO Cobertura Banda Ancha 2024',
  },
  {
    territory_code: '28068000100',
    municipality_code: '28068',
    entity_name: 'Guadarrama (ESP 2020)',
    granularity: 'population_entity',
    ftth_pct: 82.4,
    fixed_max_mbps: 300,
    mobile_5g_pct: 12.0,
    source_year: 2020,
    source_date: '2020-12-31',
    source_dataset: 'SETELECO ESP Serie Histórica 2020',
  },
  {
    territory_code: '44216000100',
    municipality_code: '44216',
    entity_name: 'Teruel (ESP 2020)',
    granularity: 'population_entity',
    ftth_pct: 78.5,
    fixed_max_mbps: 300,
    mobile_5g_pct: 8.5,
    source_year: 2020,
    source_date: '2020-12-31',
    source_dataset: 'SETELECO ESP Serie Histórica 2020',
  },
];

export class MockBroadbandProvider implements IBroadbandProvider {
  private readonly now: () => Date;

  constructor(options?: { now?: () => Date }) {
    this.now = options?.now ?? (() => new Date());
  }

  async getBroadbandCoverage(
    municipalityCode?: string,
    cadastralReference?: string
  ): Promise<LayerResult<BroadbandCoverage>> {
    if (!municipalityCode) {
      return layerOutOfCoverage(BROADBAND_SOURCE_NAME, { reason: 'no_coverage' });
    }
    const row =
      MOCK_BROADBAND_ROWS.find((r) => cadastralReference && r.territory_code === cadastralReference) ??
      MOCK_BROADBAND_ROWS.find((r) => r.municipality_code === municipalityCode);

    if (!row) {
      return layerOutOfCoverage(BROADBAND_SOURCE_NAME, { reason: 'no_coverage' });
    }

    return toLayerResultFromRow(row, this.now());
  }
}
