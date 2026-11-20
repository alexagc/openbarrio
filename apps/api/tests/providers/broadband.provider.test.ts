import { describe, it, expect, vi } from 'vitest';
import {
  D1BroadbandProvider,
  MockBroadbandProvider,
  BROADBAND_SOURCE_NAME,
  createProviders,
} from '../../src/providers/index.js';
import { AuditService } from '../../src/services/audit.service.js';
import type { D1Database } from '../../src/types/env.js';

function createMockBroadbandDb(row: Record<string, unknown> | null, shouldFail = false): D1Database {
  return {
    prepare: vi.fn(() => ({
      bind: vi.fn(() => ({
        first: vi.fn(async () => {
          if (shouldFail) {
            throw new Error('D1 broadband query failure');
          }
          return row;
        }),
        all: vi.fn(async () => ({ results: row ? [row] : [], success: true })),
        run: vi.fn(async () => ({ success: true, meta: { changes: 0 } })),
      })),
    })),
    batch: async () => [],
    exec: async () => ({ count: 0 }),
  } as unknown as D1Database;
}

describe('Broadband Coverage Providers (SETELECO / CNMC)', () => {
  const fixedNow = () => new Date('2026-11-19T12:00:00.000Z');

  it('D1BroadbandProvider returns ok for fresh 2025 municipal coverage', async () => {
    const db = createMockBroadbandDb({
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
    });
    const provider = new D1BroadbandProvider({ db, now: fixedNow });
    const res = await provider.getBroadbandCoverage('28079', '1234567VK4713N0001AA');

    expect(res.status).toBe('ok');
    expect(res.sourceName).toBe(BROADBAND_SOURCE_NAME);
    expect(res.granularity).toBe('municipality');
    expect(res.data?.ftthPct).toBe(99.1);
    expect(res.data?.informativeOnly).toBe(true);
    expect(res.data?.disclaimer).toContain('municipal aggregate');
  });

  it('D1BroadbandProvider marks aged 2024 municipal and historical 2020 ESP records as stale', async () => {
    const db2024 = createMockBroadbandDb({
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
    });
    const res2024 = await new D1BroadbandProvider({ db: db2024, now: fixedNow }).getBroadbandCoverage('50297');
    expect(res2024.status).toBe('stale');
    expect(res2024.staleDays).toBeGreaterThan(365);
    expect(res2024.data?.sourceYear).toBe(2024);

    const dbEsp2020 = createMockBroadbandDb({
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
    });
    const resEsp = await new D1BroadbandProvider({ db: dbEsp2020, now: fixedNow }).getBroadbandCoverage('28068');
    expect(resEsp.status).toBe('stale');
    expect(resEsp.granularity).toBe('population_entity');
    expect(resEsp.data?.granularity).toBe('population_entity');
    expect(resEsp.data?.disclaimer).toContain('CTO');
  });

  it('D1BroadbandProvider returns unavailable beyond 2190d or on SQL failure, and out_of_coverage when missing', async () => {
    const expiredDb = createMockBroadbandDb({
      territory_code: '44216000100',
      municipality_code: '44216',
      entity_name: 'Teruel (ESP 2019)',
      granularity: 'population_entity',
      ftth_pct: 60.0,
      fixed_max_mbps: 300,
      mobile_5g_pct: null,
      source_year: 2019,
      source_date: '2019-12-31',
      source_dataset: 'SETELECO ESP 2019',
    });
    const expired = await new D1BroadbandProvider({ db: expiredDb, now: fixedNow }).getBroadbandCoverage('44216');
    expect(expired.status).toBe('unavailable');
    expect(expired.data).toBeUndefined();

    const emptyDb = createMockBroadbandDb(null);
    const missing = await new D1BroadbandProvider({ db: emptyDb, now: fixedNow }).getBroadbandCoverage('99999');
    expect(missing.status).toBe('out_of_coverage');
    expect(missing.reason).toBe('no_coverage');

    const noMuni = await new D1BroadbandProvider({ db: emptyDb, now: fixedNow }).getBroadbandCoverage(undefined);
    expect(noMuni.status).toBe('out_of_coverage');

    const brokenDb = createMockBroadbandDb(null, true);
    const errSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const broken = await new D1BroadbandProvider({ db: brokenDb, now: fixedNow }).getBroadbandCoverage('28079');
    expect(broken.status).toBe('unavailable');
    expect(broken.reason).toBe('upstream_error');
    errSpy.mockRestore();
  });

  it('MockBroadbandProvider resolves ok, stale 2024/2020, and out_of_coverage deterministically', async () => {
    const mock = new MockBroadbandProvider({ now: fixedNow });

    const madrid = await mock.getBroadbandCoverage('28079');
    expect(madrid.status).toBe('ok');
    expect(madrid.data?.ftthPct).toBe(99.1);

    const guadarrama = await mock.getBroadbandCoverage('28068');
    expect(guadarrama.status).toBe('stale');
    expect(guadarrama.granularity).toBe('population_entity');

    const unknown = await mock.getBroadbandCoverage('00000');
    expect(unknown.status).toBe('out_of_coverage');
  });

  it('attaches report.broadband and layers.broadband in AuditService with zero impact on BarrioScore', async () => {
    const refcat = '9872023VK4797S0001WX';
    const baseProviders = createProviders({ useMocks: true });
    const withoutBroadbandProviders = createProviders({
      useMocks: true,
      overrides: {
        broadband: {
          getBroadbandCoverage: async () => ({
            status: 'unavailable',
            sourceName: BROADBAND_SOURCE_NAME,
            reason: 'upstream_error',
          }),
        },
      },
    });

    const auditWith = await new AuditService(baseProviders).auditByCadastralReference(refcat);
    const auditWithout = await new AuditService(withoutBroadbandProviders).auditByCadastralReference(refcat);

    expect(auditWith.broadband).toBeDefined();
    expect(auditWith.broadband?.informativeOnly).toBe(true);
    expect(auditWith.layers?.broadband.status).toBe('ok');
    expect(auditWith.layers?.broadband.granularity).toBe('municipality');

    expect(auditWithout.broadband).toBeUndefined();
    expect(auditWithout.layers?.broadband.status).toBe('unavailable');

    // Zero BarrioScore weight invariant
    expect(auditWith.score.overallScore).toBe(auditWithout.score.overallScore);
    expect(auditWith.score.subscores).toEqual(auditWithout.score.subscores);
    expect(auditWith.score.trafficLight).toBe(auditWithout.score.trafficLight);
  });
});
