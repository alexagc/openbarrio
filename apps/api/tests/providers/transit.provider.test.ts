import { describe, it, expect } from 'vitest';
import {
  D1TransitProvider,
  MockTransitProvider,
  TRANSIT_SOURCE_NAME,
} from '../../src/providers/transit.provider.js';
import type { D1Database } from '../../src/types/env.js';

function createMockTransitDb(options: {
  stops?: Array<Record<string, unknown>>;
  coverage?: Record<string, unknown> | null;
  shouldThrow?: boolean;
}): D1Database {
  return {
    prepare: (sql: string) => ({
      bind: (..._args: unknown[]) => ({
        all: async <T>() => {
          if (options.shouldThrow) throw new Error('SQLite read failure');
          if (sql.includes('FROM transit_stops')) {
            return { results: (options.stops ?? []) as T[], success: true };
          }
          return { results: [] as T[], success: true };
        },
        first: async <T>() => {
          if (options.shouldThrow) throw new Error('SQLite read failure');
          if (sql.includes('FROM transit_feed_coverage')) {
            return (options.coverage ?? null) as T | null;
          }
          return null;
        },
        run: async () => ({ success: true, meta: { changes: 0 } }),
      }),
    }),
    batch: async () => [],
    exec: async () => ({ count: 0 }),
  } as unknown as D1Database;
}

describe('Transit Providers (D1TransitProvider & MockTransitProvider)', () => {
  it('returns ok with full 100% coverage and parametric walk times in Madrid/Barcelona', async () => {
    const provider = new MockTransitProvider();
    const res = await provider.getTransitAccessibility(40.418, -3.7038, '28079');

    expect(res.status).toBe('ok');
    expect(res.sourceName).toBe(TRANSIT_SOURCE_NAME);
    expect(res.coveragePct).toBe(100);
    expect(res.data?.walkSegmentMethod).toBe('parametric');
    expect(res.data?.nearestStops.length).toBeGreaterThan(0);
    expect(res.data?.stopsWithin15Min).toBeGreaterThan(0);
    expect(res.data?.travelTimesToHubs.length).toBeGreaterThan(0);
  });

  it('returns out_of_coverage with exact partial coveragePct=50 and available stops in Zaragoza', async () => {
    const provider = new MockTransitProvider();
    const res = await provider.getTransitAccessibility(41.653, -0.881, '50297');

    expect(res.status).toBe('out_of_coverage');
    expect(res.reason).toBe('no_coverage');
    expect(res.coveragePct).toBe(50);
    expect(res.data?.coveragePct).toBe(50);
    expect(res.data?.coveredOperators).toContain('Tranvía de Zaragoza');
    expect(res.data?.missingOperators.length).toBeGreaterThan(0);
    expect(res.data?.nearestStops.length).toBeGreaterThan(0);
  });

  it('returns out_of_coverage with coveragePct=0 for uncovered rural coordinates', async () => {
    const provider = new MockTransitProvider();
    const res = await provider.getTransitAccessibility(40.8, -1.5, '44999');

    expect(res.status).toBe('out_of_coverage');
    expect(res.reason).toBe('no_coverage');
    expect(res.coveragePct).toBe(0);
    expect(res.data).toBeUndefined();
  });

  it('D1TransitProvider handles ok, partial out_of_coverage, missing DB, and SQL errors cleanly', async () => {
    const noDbProvider = new D1TransitProvider();
    const noDbRes = await noDbProvider.getTransitAccessibility(40.418, -3.7038, '28079');
    expect(noDbRes.status).toBe('unavailable');
    expect(noDbRes.reason).toBe('upstream_error');

    const errorDb = createMockTransitDb({ shouldThrow: true });
    const errProvider = new D1TransitProvider({ db: errorDb });
    const errRes = await errProvider.getTransitAccessibility(40.418, -3.7038, '28079');
    expect(errRes.status).toBe('unavailable');

    const partialDb = createMockTransitDb({
      coverage: {
        municipality_code: '50297',
        area_name: 'Zaragoza',
        coverage_pct: 50,
        covered_operators_json: JSON.stringify(['Tranvía de Zaragoza']),
        missing_operators_json: JSON.stringify(['Renfe Cercanías']),
        source_date: '2026-11-01',
      },
      stops: [
        {
          stop_id: 'zaz:1',
          feed_id: 'zaragoza-tranvia',
          operator_name: 'Tranvía de Zaragoza',
          municipality_code: '50297',
          stop_name: 'Plaza España',
          mode: 'tram',
          latitude: 41.6528,
          longitude: -0.8809,
          routes_count: 1,
          peak_headway_min: 5.5,
          offpeak_headway_min: 9.0,
          hub_travel_times_json: '[]',
          source_date: '2026-11-01',
          license_id: 'CC-BY-4.0',
        },
      ],
    });
    const partialProvider = new D1TransitProvider({ db: partialDb });
    const partialRes = await partialProvider.getTransitAccessibility(41.653, -0.881, '50297');
    expect(partialRes.status).toBe('out_of_coverage');
    expect(partialRes.coveragePct).toBe(50);
    expect(partialRes.data?.nearestStops).toHaveLength(1);
  });

  it('falls back to stop municipality_code when Catastro municipalityCode (e.g. 28900) differs from INE (28079)', async () => {
    const db = createMockTransitDb({
      coverage: {
        municipality_code: '28079',
        area_name: 'Madrid',
        coverage_pct: 100,
        covered_operators_json: JSON.stringify(['Metro de Madrid', 'EMT Madrid']),
        missing_operators_json: '[]',
        source_date: '2026-11-22',
      },
      stops: [
        {
          stop_id: 'crtm-madrid:GRAN_VIA',
          feed_id: 'crtm-madrid',
          operator_name: 'CRTM Madrid (Metro)',
          municipality_code: '28079',
          stop_name: 'Gran Vía',
          mode: 'metro',
          latitude: 40.4201,
          longitude: -3.7022,
          routes_count: 2,
          peak_headway_min: 3.5,
          offpeak_headway_min: 5.5,
          hub_travel_times_json: '[]',
          source_date: '2026-11-22',
          license_id: 'MITMS-NAP-RISP',
        },
      ],
    });
    const provider = new D1TransitProvider({ db });
    const res = await provider.getTransitAccessibility(40.4202, -3.7023, '28900');
    expect(res.status).toBe('ok');
    expect(res.data?.coveragePct).toBe(100);
    expect(res.data?.nearestStops).toHaveLength(1);
  });
});
