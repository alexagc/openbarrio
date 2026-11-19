import { describe, it, expect, afterEach, vi } from 'vitest';
import { isStaleAmber, STALE_AMBER_DAYS } from '@openbarrio/core';
import { buildApp } from '../../src/app.js';
import { createProviders } from '../../src/providers/index.js';
import { SICAProvider } from '../../src/providers/sica.provider.js';
import { SNCZIProvider } from '../../src/providers/snczi.provider.js';
import { INEProvider } from '../../src/providers/ine.provider.js';
import { VutProvider } from '../../src/providers/vut.provider.js';
import { EnvironmentalProvider } from '../../src/providers/environmental.provider.js';
import { AirQualityProvider } from '../../src/providers/air-quality.provider.js';
import {
  CircuitBreakerRegistry,
  SourceSnapshotStore,
  computeSnapshotHash,
} from '../../src/resilience/index.js';
import type { D1Database } from '../../src/types/env.js';

function createSnapshotMockDb(seed: Array<{ providerKey: string; cacheKey: string; data: unknown; verifiedAt: string; expiresAt: string }>) {
  const store = new Map<string, any>();
  for (const item of seed) {
    store.set(`${item.providerKey}:${item.cacheKey}`, {
      provider_key: item.providerKey,
      cache_key: item.cacheKey,
      data_json: JSON.stringify(item.data),
      data_hash: 'seed-hash',
      source_date: '2026-01-15',
      verified_at: item.verifiedAt,
      expires_at: item.expiresAt,
    });
  }

  const db: D1Database = {
    prepare: () => {
      const bound = (params: unknown[]) => ({
        bind: (...next: unknown[]) => bound([...params, ...next]),
        first: async <T>() => {
          const pk = String(params[0] ?? '');
          const ck = String(params[1] ?? '');
          return (store.get(`${pk}:${ck}`) ?? null) as T | null;
        },
        all: async <T>() => ({ results: [] as T[], success: true }),
        run: async () => ({ success: true, meta: { changes: 0 } }),
      });
      return bound([]);
    },
    batch: async () => [],
    exec: async () => ({ count: 0 }),
  };

  return db;
}

describe('Ministerial Outage, Timeout, Garbage & Stale Drills (Zero Network)', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('handles HTTP 500/503 outage across SICA, SNCZI, INE, VUT without fabricating data or green traffic light', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(
      async () => new Response('Service Unavailable', { status: 503 })
    );

    const breaker = new CircuitBreakerRegistry();
    const sica = new SICAProvider({ breaker, maxRetries: 0 });
    const snczi = new SNCZIProvider({ breaker, maxRetries: 0 });
    const ine = new INEProvider({ breaker, maxRetries: 0 });
    const vut = new VutProvider(undefined, { enableLiveLookup: true, breaker, maxRetries: 0 });
    const airQuality = new AirQualityProvider({ breaker, maxRetries: 0 });

    const sicaRes = await sica.getNoiseData(40.4203, -3.7038);
    expect(sicaRes.status).toBe('unavailable');
    expect(sicaRes.data).toBeUndefined();

    const sncziRes = await snczi.getFloodRiskData(40.4203, -3.7038);
    expect(sncziRes.status).toBe('unavailable');
    expect(sncziRes.data).toBeUndefined();

    const ineRes = await ine.resolveCensusSection(40.4203, -3.7038, '28', '079');
    expect(ineRes.status).toBe('unavailable');
    expect(ineRes.data).toBeUndefined();

    const vutRes = await vut.getVutEvaluation('2807901001', { latitude: 40.4203, longitude: -3.7038 });
    expect(vutRes.status).toBe('unavailable');
    expect(vutRes.data).toBeUndefined();

    // Full Hono HTTP route drill with live ministerial providers failing
    const app = buildApp({
      providers: createProviders({
        useMocks: true,
        overrides: {
          sica,
          snczi,
          ine,
          vut,
          airQuality,
          environmental: new EnvironmentalProvider({ sica, snczi, airQuality }),
        },
      }),
    });

    const httpRes = await app.request('/api/v1/audit/refcat/9872023VH5797S0001WX');
    expect(httpRes.status).toBe(200);
    const report = await httpRes.json();

    expect(report.environment.noise).toBeUndefined();
    expect(report.environment.floodRisk).toBeUndefined();
    expect(report.neighborhood).toBeUndefined();
    expect(report.vut).toBeUndefined();

    expect(report.layers.sica.status).toBe('unavailable');
    expect(report.layers.snczi.status).toBe('unavailable');
    expect(report.layers.ine.status).toBe('unavailable');

    expect(report.score.pillarTrafficLights.environmental).toBe('UNCERTAIN');
    expect(report.score.trafficLight).not.toBe('GREEN');
    expect(report.score.keyRisks.some((r: string) => /not evaluated|unavailable/i.test(r))).toBe(true);
    expect(fetchSpy).toHaveBeenCalled();
  });

  it('classifies upstream timeouts cleanly as reason="timeout" with zero fabricated fallbacks', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(async () => {
      const err = new Error('The operation timed out');
      err.name = 'TimeoutError';
      throw err;
    });

    const breaker = new CircuitBreakerRegistry();
    const sica = new SICAProvider({ breaker, maxRetries: 0 });
    const snczi = new SNCZIProvider({ breaker, maxRetries: 0 });
    const ine = new INEProvider({ breaker, maxRetries: 0 });

    const [noiseRes, floodRes, secRes] = await Promise.all([
      sica.getNoiseData(40.4203, -3.7038),
      snczi.getFloodRiskData(40.4203, -3.7038),
      ine.resolveCensusSection(40.4203, -3.7038),
    ]);

    expect(noiseRes.status).toBe('unavailable');
    expect(noiseRes.reason).toBe('timeout');
    expect(noiseRes.data).toBeUndefined();

    expect(floodRes.status).toBe('unavailable');
    expect(floodRes.reason).toBe('timeout');
    expect(floodRes.data).toBeUndefined();

    expect(secRes.status).toBe('unavailable');
    expect(secRes.reason).toBe('timeout');
    expect(secRes.data).toBeUndefined();
  });

  it('rejects HTML error pages, WMS ServiceException XML, truncated JSON, and non-numeric values without fabricating 55 dB or NONE', async () => {
    const breaker = new CircuitBreakerRegistry();
    const sica = new SICAProvider({ breaker, maxRetries: 0 });
    const snczi = new SNCZIProvider({ breaker, maxRetries: 0 });
    const ine = new INEProvider({ breaker, maxRetries: 0 });
    const vut = new VutProvider(undefined, { enableLiveLookup: true, breaker, maxRetries: 0 });

    const garbageBodies = [
      '<!DOCTYPE html><html><body>502 Bad Gateway</body></html>',
      '<ServiceExceptionReport version="1.3.0"><ServiceException>Layer not found</ServiceException></ServiceExceptionReport>',
      '{"type":"FeatureCollection","features":[TRUNCATED',
      JSON.stringify({
        type: 'FeatureCollection',
        features: [{ properties: { LDEN: 'N/A', valor: 'UNKNOWN' } }],
      }),
    ];

    for (const body of garbageBodies) {
      vi.spyOn(globalThis, 'fetch').mockImplementation(
        async () => new Response(body, { status: 200 })
      );

      const sicaRes = await sica.getNoiseData(40.4203, -3.7038);
      expect(sicaRes.status).toBe('unavailable');
      expect(sicaRes.reason).toBe('invalid_payload');
      expect(sicaRes.data).toBeUndefined();

      const sncziRes = await snczi.getFloodRiskData(40.4203, -3.7038);
      expect(sncziRes.status).toBe('unavailable');
      expect(sncziRes.reason).toBe('invalid_payload');
      expect(sncziRes.data).toBeUndefined();

      vi.restoreAllMocks();
    }

    vi.spyOn(globalThis, 'fetch').mockImplementation(
      async () => new Response('<html>Bad Gateway</html>', { status: 200 })
    );
    const ineRes = await ine.resolveCensusSection(40.4203, -3.7038);
    expect(ineRes.status).toBe('unavailable');
    expect(ineRes.reason).toBe('invalid_payload');

    const vutRes = await vut.getVutEvaluation('2807901001', { latitude: 40.4203, longitude: -3.7038 });
    expect(vutRes.status).toBe('unavailable');
    expect(vutRes.reason).toBe('invalid_payload');
  });

  it('distinguishes out_of_coverage cleanly (empty SICA features and SNCZI Canary Islands) without favorable defaults', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(
      async () => new Response(JSON.stringify({ type: 'FeatureCollection', features: [] }), { status: 200 })
    );

    const breaker = new CircuitBreakerRegistry();
    const sica = new SICAProvider({ breaker, maxRetries: 0 });
    const snczi = new SNCZIProvider({ breaker, maxRetries: 0 });

    const sicaOut = await sica.getNoiseData(40.1, -4.1);
    expect(sicaOut.status).toBe('out_of_coverage');
    expect(sicaOut.reason).toBe('no_coverage');
    expect(sicaOut.data).toBeUndefined();

    // Canary Islands SNCZI must return out_of_coverage immediately, never NONE floodRisk
    const canariasOut = await snczi.getFloodRiskData(28.1235, -15.4363, '3501601001');
    expect(canariasOut.status).toBe('out_of_coverage');
    expect(canariasOut.reason).toBe('no_coverage');
    expect(canariasOut.data).toBeUndefined();
  });

  it('serves stale snapshots at 45d (non-amber), 120d (amber >=90d), and rejects 400d (>365d) on upstream outage', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(
      async () => new Response('Down', { status: 503 })
    );

    const now = new Date('2026-11-19T12:00:00.000Z');
    const verified45 = new Date(now.getTime() - 45 * 86_400_000).toISOString();
    const verified120 = new Date(now.getTime() - 120 * 86_400_000).toISOString();
    const verified400 = new Date(now.getTime() - 400 * 86_400_000).toISOString();

    const db = createSnapshotMockDb([
      {
        providerKey: 'sica',
        cacheKey: '40.4200:-3.7030',
        data: { dayEveningNightDecibels: 62, category: 'MODERATE', predominantSource: 'ROAD_TRAFFIC' },
        verifiedAt: verified45,
        expiresAt: new Date(now.getTime() + 10 * 86_400_000).toISOString(),
      },
      {
        providerKey: 'sica',
        cacheKey: '41.3900:2.1600',
        data: { dayEveningNightDecibels: 66, category: 'NOISY', predominantSource: 'ROAD_TRAFFIC' },
        verifiedAt: verified120,
        expiresAt: new Date(now.getTime() + 10 * 86_400_000).toISOString(),
      },
      {
        providerKey: 'sica',
        cacheKey: '37.3800:-5.9900',
        data: { dayEveningNightDecibels: 58, category: 'MODERATE', predominantSource: 'ROAD_TRAFFIC' },
        verifiedAt: verified400,
        expiresAt: new Date(now.getTime() - 35 * 86_400_000).toISOString(),
      },
    ]);

    expect(await computeSnapshotHash('{"ok":true}')).toHaveLength(64);
    const snapshotStore = new SourceSnapshotStore({ db, now: () => now });
    const breaker = new CircuitBreakerRegistry();
    const sica = new SICAProvider({ breaker, maxRetries: 0, snapshotStore });

    // Check 45d snapshot (stale, not amber)
    const snap45 = new SourceSnapshotStore({ db, now: () => now });
    expect((await snap45.get('sica', '40.4200:-3.7030'))?.ageDays).toBe(45);

    const res45 = await sica.getNoiseData(40.4200, -3.7030);
    expect(res45.status).toBe('stale');
    expect(res45.staleDays).toBe(45);
    expect(isStaleAmber(res45.staleDays)).toBe(false);

    // Check 120d snapshot (stale, amber >= 90d)
    const res120 = await sica.getNoiseData(41.3900, 2.1600);
    expect(res120.status).toBe('stale');
    expect(res120.staleDays).toBe(120);
    expect(res120.staleDays).toBeGreaterThanOrEqual(STALE_AMBER_DAYS);
    expect(isStaleAmber(res120.staleDays)).toBe(true);

    // Check 400d snapshot (> 365d -> refused; returns unavailable because upstream failed)
    const res400 = await sica.getNoiseData(37.3800, -5.9900);
    expect(res400.status).toBe('unavailable');
    expect(res400.data).toBeUndefined();
  });
});
