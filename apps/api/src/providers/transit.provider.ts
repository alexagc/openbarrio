import {
  LayerResult,
  TransitAccessibility,
  TransitHubDefinition,
  TransitMode,
  TransitStopInput,
  calculateTransitAccessibility,
  layerOk,
  layerOutOfCoverage,
  layerUnavailable,
} from '@openbarrio/core';
import type { D1Database } from '../types/env.js';
import type { ITransitProvider } from './types.js';

export const TRANSIT_SOURCE_NAME = 'MITMS NAP GTFS Transporte';

interface RawTransitStopRow {
  stop_id: string;
  feed_id: string;
  operator_name: string;
  municipality_code: string;
  stop_name: string;
  mode: string;
  latitude: number;
  longitude: number;
  routes_count: number;
  peak_headway_min: number | null;
  offpeak_headway_min: number | null;
  hub_travel_times_json: string | null;
  source_date: string;
  license_id: string;
}

interface RawTransitCoverageRow {
  municipality_code: string;
  area_name: string;
  coverage_pct: number;
  covered_operators_json: string;
  missing_operators_json: string;
  source_date: string;
}

function safeJsonArray<T>(raw: string | null | undefined): T[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function normalizeTransitMode(mode: string): TransitMode {
  if (mode === 'metro' || mode === 'rail' || mode === 'tram' || mode === 'bus' || mode === 'ferry') {
    return mode;
  }
  return 'bus';
}

function mapStopRowsToInputs(rows: RawTransitStopRow[]): TransitStopInput[] {
  return rows.map((row) => ({
    stopId: row.stop_id,
    feedId: row.feed_id,
    operatorName: row.operator_name,
    name: row.stop_name,
    mode: normalizeTransitMode(row.mode),
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
    routesCount: Math.max(1, Number(row.routes_count || 1)),
    ...(typeof row.peak_headway_min === 'number' ? { peakHeadwayMin: row.peak_headway_min } : {}),
    ...(typeof row.offpeak_headway_min === 'number'
      ? { offPeakHeadwayMin: row.offpeak_headway_min }
      : {}),
    hubTravelTimes: safeJsonArray<TransitHubDefinition>(row.hub_travel_times_json),
    licenseId: row.license_id,
  }));
}

function computeBoundingBox(latitude: number, longitude: number, radiusMeters: number) {
  const latDelta = radiusMeters / 111_132;
  const cosLat = Math.cos((latitude * Math.PI) / 180);
  const lonDelta = radiusMeters / (111_132 * (Math.abs(cosLat) > 0.001 ? Math.abs(cosLat) : 1));
  return {
    minLat: latitude - latDelta,
    maxLat: latitude + latDelta,
    minLon: longitude - lonDelta,
    maxLon: longitude + lonDelta,
  };
}

/**
 * Cloudflare D1 / SQLite GTFS Transit Provider.
 * Computes parametric walking access legs + scheduled GTFS headways/hub times and
 * surfaces real feed coverage percentages (`out_of_coverage` when partial or absent).
 */
export class D1TransitProvider implements ITransitProvider {
  private db?: D1Database;
  private readonly searchRadiusMeters: number;

  constructor(options: { db?: D1Database; searchRadiusMeters?: number } = {}) {
    this.db = options.db;
    this.searchRadiusMeters = options.searchRadiusMeters ?? 1500;
  }

  setDatabase(db: D1Database): void {
    this.db = db;
  }

  async getTransitAccessibility(
    latitude: number,
    longitude: number,
    municipalityCode?: string
  ): Promise<LayerResult<TransitAccessibility>> {
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || (latitude === 0 && longitude === 0)) {
      return layerOutOfCoverage(TRANSIT_SOURCE_NAME, { reason: 'no_coverage', coveragePct: 0 });
    }

    if (!this.db) {
      return layerUnavailable(TRANSIT_SOURCE_NAME, 'upstream_error');
    }

    try {
      const box = computeBoundingBox(latitude, longitude, this.searchRadiusMeters);
      const stopsRes = await this.db
        .prepare(
          `SELECT stop_id, feed_id, operator_name, municipality_code, stop_name, mode,
                  latitude, longitude, routes_count, peak_headway_min, offpeak_headway_min,
                  hub_travel_times_json, source_date, license_id
           FROM transit_stops
           WHERE latitude BETWEEN ? AND ? AND longitude BETWEEN ? AND ?`
        )
        .bind(box.minLat, box.maxLat, box.minLon, box.maxLon)
        .all<RawTransitStopRow>();

      const stopRows = stopsRes?.results ?? [];
      const effectiveMuni = municipalityCode?.trim() || stopRows[0]?.municipality_code;

      let coverageRow: RawTransitCoverageRow | null = null;
      if (effectiveMuni) {
        coverageRow = await this.db
          .prepare(
            `SELECT municipality_code, area_name, coverage_pct,
                    covered_operators_json, missing_operators_json, source_date
             FROM transit_feed_coverage
             WHERE municipality_code = ?`
          )
          .bind(effectiveMuni)
          .first<RawTransitCoverageRow>();
      }

      if (!coverageRow && stopRows.length === 0) {
        return layerOutOfCoverage(TRANSIT_SOURCE_NAME, { reason: 'no_coverage', coveragePct: 0 });
      }

      const coveragePct = coverageRow ? Math.min(100, Math.max(0, Number(coverageRow.coverage_pct))) : 0;
      const coveredOperators = coverageRow
        ? safeJsonArray<string>(coverageRow.covered_operators_json)
        : Array.from(new Set(stopRows.map((s) => s.operator_name)));
      const missingOperators = coverageRow
        ? safeJsonArray<string>(coverageRow.missing_operators_json)
        : [];
      const sourceDate = coverageRow?.source_date ?? stopRows[0]?.source_date;

      const accessibility = calculateTransitAccessibility(
        [longitude, latitude],
        mapStopRowsToInputs(stopRows),
        {
          coveragePct,
          coveredOperators,
          missingOperators,
          sourceDate,
        }
      );

      if (coveragePct < 100 || stopRows.length === 0) {
        return layerOutOfCoverage(TRANSIT_SOURCE_NAME, {
          reason: 'no_coverage',
          coveragePct,
          sourceDate,
          data: accessibility,
        });
      }

      return layerOk(TRANSIT_SOURCE_NAME, accessibility, {
        sourceDate,
        coveragePct: 100,
      });
    } catch (err) {
      console.warn('[D1TransitProvider] Query failed:', (err as Error)?.message);
      return layerUnavailable(TRANSIT_SOURCE_NAME, 'upstream_error');
    }
  }
}

const SEEDED_COVERAGE: RawTransitCoverageRow[] = [
  {
    municipality_code: '28079',
    area_name: 'Madrid',
    coverage_pct: 100,
    covered_operators_json: JSON.stringify(['Metro de Madrid', 'EMT Madrid', 'Renfe Cercanías', 'Metro Ligero']),
    missing_operators_json: '[]',
    source_date: '2026-11-01',
  },
  {
    municipality_code: '08019',
    area_name: 'Barcelona',
    coverage_pct: 100,
    covered_operators_json: JSON.stringify(['TMB Metro', 'TMB Bus', 'Rodalies de Catalunya', 'FGC / TRAM']),
    missing_operators_json: '[]',
    source_date: '2026-11-01',
  },
  {
    municipality_code: '46250',
    area_name: 'València',
    coverage_pct: 100,
    covered_operators_json: JSON.stringify(['EMT València', 'Metrovalencia (FGV)']),
    missing_operators_json: '[]',
    source_date: '2026-11-01',
  },
  {
    municipality_code: '41091',
    area_name: 'Sevilla',
    coverage_pct: 100,
    covered_operators_json: JSON.stringify(['TUSSAM', 'Metro de Sevilla / CTAN']),
    missing_operators_json: '[]',
    source_date: '2026-11-01',
  },
  {
    municipality_code: '50297',
    area_name: 'Zaragoza',
    coverage_pct: 50,
    covered_operators_json: JSON.stringify(['Tranvía de Zaragoza']),
    missing_operators_json: JSON.stringify(['Avanza Bus Urbano', 'Renfe Cercanías Zaragoza']),
    source_date: '2026-11-01',
  },
];

const SEEDED_STOPS: RawTransitStopRow[] = [
  {
    stop_id: 'crtm-madrid:SOL',
    feed_id: 'crtm-madrid',
    operator_name: 'CRTM Madrid (Metro / Cercanías)',
    municipality_code: '28079',
    stop_name: 'Sol (Metro L1, L2, L3 · Cercanías C3, C4)',
    mode: 'metro',
    latitude: 40.4169,
    longitude: -3.7035,
    routes_count: 5,
    peak_headway_min: 3.0,
    offpeak_headway_min: 5.0,
    hub_travel_times_json: JSON.stringify([
      { hubName: 'Atocha Renfe', inVehicleMinutes: 4, mode: 'rail', lineName: 'C3 / C4' },
      { hubName: 'Nuevos Ministerios', inVehicleMinutes: 7, mode: 'rail', lineName: 'C3 / C4' },
    ]),
    source_date: '2026-11-01',
    license_id: 'MITMS-NAP-RISP / CRTM Open Data',
  },
  {
    stop_id: 'crtm-madrid:GRAN_VIA',
    feed_id: 'crtm-madrid',
    operator_name: 'CRTM Madrid (Metro)',
    municipality_code: '28079',
    stop_name: 'Gran Vía (Metro L1, L5)',
    mode: 'metro',
    latitude: 40.4201,
    longitude: -3.7022,
    routes_count: 2,
    peak_headway_min: 3.5,
    offpeak_headway_min: 5.5,
    hub_travel_times_json: JSON.stringify([
      { hubName: 'Sol', inVehicleMinutes: 2, mode: 'metro', lineName: 'L1' },
      { hubName: 'Atocha', inVehicleMinutes: 7, mode: 'metro', lineName: 'L1' },
    ]),
    source_date: '2026-11-01',
    license_id: 'MITMS-NAP-RISP / CRTM Open Data',
  },
  {
    stop_id: 'crtm-madrid:CALLAO',
    feed_id: 'crtm-madrid',
    operator_name: 'CRTM Madrid (Metro)',
    municipality_code: '28079',
    stop_name: 'Callao (Metro L3, L5)',
    mode: 'metro',
    latitude: 40.4202,
    longitude: -3.7056,
    routes_count: 2,
    peak_headway_min: 3.5,
    offpeak_headway_min: 6.0,
    hub_travel_times_json: JSON.stringify([
      { hubName: 'Moncloa', inVehicleMinutes: 7, mode: 'metro', lineName: 'L3' },
    ]),
    source_date: '2026-11-01',
    license_id: 'MITMS-NAP-RISP / CRTM Open Data',
  },
  {
    stop_id: 'crtm-madrid:CASTELLANA_BM',
    feed_id: 'crtm-madrid',
    operator_name: 'CRTM Madrid (Metro / EMT)',
    municipality_code: '28079',
    stop_name: 'Santiago Bernabéu (Metro L10 · EMT 14, 27, 40)',
    mode: 'metro',
    latitude: 40.4521,
    longitude: -3.6908,
    routes_count: 5,
    peak_headway_min: 4.0,
    offpeak_headway_min: 6.5,
    hub_travel_times_json: JSON.stringify([
      { hubName: 'Nuevos Ministerios', inVehicleMinutes: 2, mode: 'metro', lineName: 'L10' },
    ]),
    source_date: '2026-11-01',
    license_id: 'MITMS-NAP-RISP / CRTM Open Data',
  },
  {
    stop_id: 'crtm-madrid:VILLAVERDE_ALTO',
    feed_id: 'crtm-madrid',
    operator_name: 'CRTM Madrid (Metro / Cercanías)',
    municipality_code: '28079',
    stop_name: 'Villaverde Alto (L3 · Cercanías C4, C5)',
    mode: 'rail',
    latitude: 40.3479,
    longitude: -3.7098,
    routes_count: 3,
    peak_headway_min: 6.0,
    offpeak_headway_min: 10.0,
    hub_travel_times_json: JSON.stringify([
      { hubName: 'Atocha Renfe', inVehicleMinutes: 13, mode: 'rail', lineName: 'C4 / C5' },
    ]),
    source_date: '2026-11-01',
    license_id: 'MITMS-NAP-RISP / CRTM Open Data',
  },
  {
    stop_id: 'tmb-atm-barcelona:PASSEIG_GRACIA',
    feed_id: 'tmb-atm-barcelona',
    operator_name: 'TMB & ATM Barcelona',
    municipality_code: '08019',
    stop_name: 'Passeig de Gràcia (L2, L3, L4 · Rodalies R2)',
    mode: 'metro',
    latitude: 41.3922,
    longitude: 2.1652,
    routes_count: 5,
    peak_headway_min: 3.0,
    offpeak_headway_min: 5.0,
    hub_travel_times_json: JSON.stringify([
      { hubName: 'Plaça de Catalunya', inVehicleMinutes: 2, mode: 'metro', lineName: 'L3' },
      { hubName: 'Barcelona Sants', inVehicleMinutes: 6, mode: 'rail', lineName: 'R2' },
    ]),
    source_date: '2026-11-01',
    license_id: 'CC-BY-4.0 / TMB Open Data',
  },
  {
    stop_id: 'emt-atmv-valencia:COLON',
    feed_id: 'emt-atmv-valencia',
    operator_name: 'Metrovalencia & EMT València',
    municipality_code: '46250',
    stop_name: 'Colón (Metrovalencia L3, L5, L7, L9)',
    mode: 'metro',
    latitude: 39.4695,
    longitude: -0.3715,
    routes_count: 4,
    peak_headway_min: 5.0,
    offpeak_headway_min: 8.0,
    hub_travel_times_json: JSON.stringify([
      { hubName: 'Xàtiva / Estació del Nord', inVehicleMinutes: 2, mode: 'metro', lineName: 'L3 / L5' },
    ]),
    source_date: '2026-11-01',
    license_id: 'CC-BY-4.0 (GVA / Ayto. València)',
  },
  {
    stop_id: 'tussam-ctan-sevilla:PLAZA_NUEVA',
    feed_id: 'tussam-ctan-sevilla',
    operator_name: 'TUSSAM & MetroCentro Sevilla',
    municipality_code: '41091',
    stop_name: 'Plaza Nueva (Tranvía T1 · TUSSAM)',
    mode: 'tram',
    latitude: 37.3888,
    longitude: -5.9962,
    routes_count: 4,
    peak_headway_min: 6.0,
    offpeak_headway_min: 10.0,
    hub_travel_times_json: JSON.stringify([
      { hubName: 'Puerta de Jerez (Metro L1)', inVehicleMinutes: 4, mode: 'tram', lineName: 'T1' },
    ]),
    source_date: '2026-11-01',
    license_id: 'CC-BY-4.0 (IDE Sevilla / Junta de Andalucía)',
  },
  {
    stop_id: 'zaragoza-tranvia:PLAZA_ESPANA',
    feed_id: 'zaragoza-tranvia',
    operator_name: 'Tranvía de Zaragoza',
    municipality_code: '50297',
    stop_name: 'Plaza España (Tranvía L1)',
    mode: 'tram',
    latitude: 41.6528,
    longitude: -0.8809,
    routes_count: 1,
    peak_headway_min: 5.5,
    offpeak_headway_min: 9.0,
    hub_travel_times_json: JSON.stringify([
      { hubName: 'Gran Vía / Universidad', inVehicleMinutes: 7, mode: 'tram', lineName: 'L1' },
    ]),
    source_date: '2026-11-01',
    license_id: 'CC-BY-4.0 (Ayto. Zaragoza)',
  },
];

/**
 * In-memory deterministic mock provider for isolated testing without D1 or external GTFS feeds.
 */
export class MockTransitProvider implements ITransitProvider {
  async getTransitAccessibility(
    latitude: number,
    longitude: number,
    municipalityCode?: string
  ): Promise<LayerResult<TransitAccessibility>> {
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || (latitude === 0 && longitude === 0)) {
      return layerOutOfCoverage(TRANSIT_SOURCE_NAME, { reason: 'no_coverage', coveragePct: 0 });
    }

    const box = computeBoundingBox(latitude, longitude, 1500);
    const nearbyRows = SEEDED_STOPS.filter(
      (s) =>
        s.latitude >= box.minLat &&
        s.latitude <= box.maxLat &&
        s.longitude >= box.minLon &&
        s.longitude <= box.maxLon
    );

    const effectiveMuni = municipalityCode?.trim() || nearbyRows[0]?.municipality_code;
    const coverageRow = effectiveMuni
      ? SEEDED_COVERAGE.find((c) => c.municipality_code === effectiveMuni)
      : undefined;

    if (!coverageRow && nearbyRows.length === 0) {
      return layerOutOfCoverage(TRANSIT_SOURCE_NAME, { reason: 'no_coverage', coveragePct: 0 });
    }

    const coveragePct = coverageRow ? coverageRow.coverage_pct : 0;
    const coveredOperators = coverageRow
      ? safeJsonArray<string>(coverageRow.covered_operators_json)
      : Array.from(new Set(nearbyRows.map((s) => s.operator_name)));
    const missingOperators = coverageRow
      ? safeJsonArray<string>(coverageRow.missing_operators_json)
      : [];
    const sourceDate = coverageRow?.source_date ?? nearbyRows[0]?.source_date;

    const accessibility = calculateTransitAccessibility(
      [longitude, latitude],
      mapStopRowsToInputs(nearbyRows),
      {
        coveragePct,
        coveredOperators,
        missingOperators,
        sourceDate,
      }
    );

    if (coveragePct < 100 || nearbyRows.length === 0) {
      return layerOutOfCoverage(TRANSIT_SOURCE_NAME, {
        reason: 'no_coverage',
        coveragePct,
        sourceDate,
        data: accessibility,
      });
    }

    return layerOk(TRANSIT_SOURCE_NAME, accessibility, {
      sourceDate,
      coveragePct: 100,
    });
  }
}
