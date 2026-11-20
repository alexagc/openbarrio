import { describe, it, expect, vi } from 'vitest';
import { Value } from '@sinclair/typebox/value';
import { ALL_LAYER_KEYS, SourcesStatusResponseSchema } from '@openbarrio/core';
import { buildApp } from '../../src/app.js';
import { createProviders } from '../../src/providers/index.js';
import { CircuitBreakerRegistry, SourceSnapshotStore } from '../../src/resilience/index.js';
import type { D1Database } from '../../src/types/env.js';

describe('GET /api/v1/status/sources', () => {
  it('returns schema-valid operational/unknown status across all 15 configured data layers', async () => {
    const breaker = new CircuitBreakerRegistry();
    breaker.recordSuccess('catastro');

    const executedSqls: string[] = [];
    const mockDb: D1Database = {
      prepare: vi.fn((sql: string) => {
        executedSqls.push(sql);
        return {
          bind: vi.fn(() => ({
            first: vi.fn(async () => null),
            all: vi.fn(async () => ({ results: [], success: true })),
            run: vi.fn(async () => ({ success: true, meta: { changes: 0 } })),
          })),
          all: vi.fn(async () => ({
            results: [
              {
                provider_key: 'sica',
                verified_at: '2026-11-18T10:00:00.000Z',
                source_date: '2026-11-01',
              },
            ],
            success: true,
          })),
        } as any;
      }),
      batch: async () => [],
      exec: async () => ({ count: 0 }),
    };

    const snapshotStore = new SourceSnapshotStore({ db: mockDb });
    const app = buildApp({
      providers: createProviders({
        useMocks: true,
        overrides: { breaker, snapshotStore },
      }),
    });

    const res = await app.request('/api/v1/status/sources');
    expect(res.status).toBe(200);
    expect(res.headers.get('cache-control')).toBe('no-store');

    const body = await res.json();
    expect(Value.Check(SourcesStatusResponseSchema, body)).toBe(true);
    expect(body.overallStatus).toBe('operational');
    expect(body.sources).toHaveLength(ALL_LAYER_KEYS.length);

    const catastro = body.sources.find((s: any) => s.key === 'catastro');
    expect(catastro.status).toBe('operational');
    expect(catastro.lastSuccessAt).toBeDefined();

    const sica = body.sources.find((s: any) => s.key === 'sica');
    expect(sica.status).toBe('operational');
    expect(sica.lastVerifiedAt).toBe('2026-11-18T10:00:00.000Z');
    expect(sica.sourceDate).toBe('2026-11-01');

    const transit = body.sources.find((s: any) => s.key === 'transit');
    expect(transit?.sourceName).toBe('MITMS NAP GTFS Transporte');

    const broadband = body.sources.find((s: any) => s.key === 'broadband');
    expect(broadband?.sourceName).toBe('SETELECO / CNMC Banda Ancha');

    // Enforce strict zero-write D1 policy
    expect(executedSqls.some((s) => /^\s*(INSERT|UPDATE|DELETE)\b/i.test(s))).toBe(false);
  });

  it('reports degraded / outage overallStatus when circuit breakers fail or open', async () => {
    const breaker = new CircuitBreakerRegistry();
    // Single transient failure -> degraded overall
    breaker.recordFailure('ine', 'timeout');

    const appDegraded = buildApp({
      providers: createProviders({
        useMocks: true,
        overrides: { breaker },
      }),
    });
    const degradedRes = await appDegraded.request('/api/v1/status/sources');
    expect(degradedRes.status).toBe(200);
    const degradedBody = await degradedRes.json();
    expect(degradedBody.overallStatus).toBe('degraded');
    expect(degradedBody.sources.find((s: any) => s.key === 'ine').status).toBe('degraded');

    // Trip critical SICA circuit breaker (5 failures) -> outage overall
    for (let i = 0; i < 5; i++) {
      breaker.recordFailure('sica', 'upstream_error');
    }
    const outageRes = await appDegraded.request('/api/v1/status/sources');
    expect(outageRes.status).toBe(200);
    const outageBody = await outageRes.json();
    expect(outageBody.overallStatus).toBe('outage');
    const sicaEntry = outageBody.sources.find((s: any) => s.key === 'sica');
    expect(sicaEntry.status).toBe('outage');
    expect(sicaEntry.circuitState).toBe('open');
    expect(sicaEntry.recentFailures).toBe(5);
  });

  it('returns RFC 7807 Problem Details on unexpected status store failure', async () => {
    const faultyStore = {
      listLatestByProvider: async () => {
        throw new Error('Unexpected status aggregation error');
      },
    } as unknown as SourceSnapshotStore;

    const app = buildApp({
      providers: createProviders({
        useMocks: true,
        overrides: { snapshotStore: faultyStore },
      }),
    });

    const res = await app.request('/api/v1/status/sources');
    expect(res.status).toBe(500);
    expect(res.headers.get('content-type')).toContain('application/problem+json');
    const problem = await res.json();
    expect(problem.status).toBe(500);
    expect(problem.type).toContain('openbarrio.org/errors/');
  });
});
