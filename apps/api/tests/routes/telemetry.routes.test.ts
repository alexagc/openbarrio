import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_LENS_VALUES,
  ANALYTICS_MAX_PAYLOAD_BYTES,
  TELEMETRY_RATE_LIMIT_PER_MIN,
} from '@openbarrio/core';
import { buildApp } from '../../src/app.js';
import { createMockProviders } from '../../src/providers/index.js';
import { TelemetryStore } from '../../src/telemetry/telemetry-store.js';
import { resetTelemetryRateLimiter } from '../../src/routes/telemetry.routes.js';
import { resetRateLimiter } from '../../src/middleware/rate-limit.middleware.js';
import type { D1Database } from '../../src/types/env.js';

describe('POST /api/v1/telemetry (Privacy-First Batched Aggregates)', () => {
  let batchSpy: ReturnType<typeof vi.fn>;
  let prepareSpy: ReturnType<typeof vi.fn>;
  let boundCalls: Array<{ sql: string; args: unknown[] }>;
  let mockDb: D1Database;
  let store: TelemetryStore;
  let fixedNow: Date;

  beforeEach(() => {
    resetTelemetryRateLimiter();
    resetRateLimiter();
    fixedNow = new Date('2026-11-19T14:00:00.000Z');
    boundCalls = [];

    prepareSpy = vi.fn((sql: string) => ({
      bind: vi.fn((...args: unknown[]) => {
        const entry = { sql, args };
        boundCalls.push(entry);
        return {
          bind: vi.fn(),
          first: vi.fn(async () => null),
          all: vi.fn(async () => ({ results: [], success: true })),
          run: vi.fn(async () => ({ success: true, meta: { changes: 3 } })),
          _sql: sql,
          _args: args,
        };
      }),
      first: vi.fn(async () => null),
      all: vi.fn(async () => ({ results: [], success: true })),
      run: vi.fn(async () => ({ success: true, meta: { changes: 3 } })),
    }));

    batchSpy = vi.fn(async (statements: unknown[]) => statements.map(() => ({ success: true })));

    mockDb = {
      prepare: prepareSpy as any,
      batch: batchSpy as any,
      exec: vi.fn(async () => ({})),
    };

    store = new TelemetryStore({
      db: mockDb,
      flushThresholdEvents: 50,
      flushIntervalMs: 60_000,
      now: () => fixedNow,
    });
  });

  function createTestApp() {
    return buildApp({
      providers: createMockProviders({ telemetryStore: store, db: mockDb }),
    });
  }

  async function postTelemetry(
    app: ReturnType<typeof createTestApp>,
    body: unknown,
    options: { ip?: string; contentType?: string } = {}
  ) {
    return app.request('/api/v1/telemetry', {
      method: 'POST',
      headers: {
        'content-type': options.contentType ?? 'application/json',
        'x-real-ip': options.ip ?? '203.0.113.42',
      },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    });
  }

  it('returns 204 No Content with Cache-Control: no-store for all closed events', async () => {
    const app = createTestApp();

    for (const eventName of ANALYTICS_EVENTS) {
      if (eventName === 'lens_used') {
        for (const lens of ANALYTICS_LENS_VALUES) {
          const res = await postTelemetry(app, { event: 'lens_used', lens, returning14d: true });
          expect(res.status).toBe(204);
          expect(res.headers.get('cache-control')).toBe('no-store');
        }
      } else {
        const res = await postTelemetry(app, { event: eventName });
        expect(res.status).toBe(204);
        expect(res.headers.get('cache-control')).toBe('no-store');
      }
    }

    expect(store.getPendingStats().events).toBe(6);
    expect(batchSpy).not.toHaveBeenCalled();
  });

  it('rejects PII, unknown fields, and invalid lens values with 400 RFC 7807', async () => {
    const app = createTestApp();

    const invalidBodies = [
      { event: 'dossier_generated', refcat: '9872023VH5797S0001WX' },
      { event: 'dossier_generated', address: 'Gran Via 28' },
      { event: 'dossier_generated', lat: 40.42, lon: -3.7 },
      { event: 'dossier_generated', ip: '1.2.3.4' },
      { event: 'dossier_generated', userId: 'user-123' },
      { event: 'dossier_generated', municipality: 'Madrid' },
      { event: 'lens_used' },
      { event: 'lens_used', lens: 'unknown_lens' },
      { event: 'unknown_event' },
      '{invalid json',
    ];

    for (const body of invalidBodies) {
      const res = await postTelemetry(app, body);
      expect(res.status).toBe(400);
      expect(res.headers.get('content-type')).toContain('application/problem+json');
      const problem = (await res.json()) as any;
      expect(problem.status).toBe(400);
      expect(problem.type).toContain('invalid-parameters');
    }

    expect(store.getPendingStats().events).toBe(0);
  });

  it('rejects payloads exceeding 1024 bytes with 413 RFC 7807', async () => {
    const app = createTestApp();
    const oversized = JSON.stringify({
      event: 'dossier_generated',
      padding: 'x'.repeat(ANALYTICS_MAX_PAYLOAD_BYTES + 20),
    });

    const res = await postTelemetry(app, oversized);
    expect(res.status).toBe(413);
    expect(res.headers.get('content-type')).toContain('application/problem+json');
    const problem = (await res.json()) as any;
    expect(problem.type).toContain('telemetry-payload-too-large');
  });

  it('rejects non-JSON Content-Type with 415 RFC 7807', async () => {
    const app = createTestApp();
    const res = await postTelemetry(
      app,
      JSON.stringify({ event: 'dossier_generated' }),
      { contentType: 'text/plain' }
    );
    expect(res.status).toBe(415);
    expect(res.headers.get('content-type')).toContain('application/problem+json');
  });

  it('enforces per-IP telemetry rate limit (30/min) with 429 RFC 7807 and Retry-After', async () => {
    const app = createTestApp();

    for (let i = 0; i < TELEMETRY_RATE_LIMIT_PER_MIN; i++) {
      const ok = await postTelemetry(
        app,
        { event: 'dossier_generated' },
        { ip: '198.51.100.88' }
      );
      expect(ok.status).toBe(204);
    }

    const blocked = await postTelemetry(
      app,
      { event: 'dossier_generated' },
      { ip: '198.51.100.88' }
    );
    expect(blocked.status).toBe(429);
    expect(blocked.headers.get('content-type')).toContain('application/problem+json');
    expect(Number(blocked.headers.get('retry-after'))).toBeGreaterThanOrEqual(1);
  });

  it('batches identical daily events in isolate memory, flushes in one db.batch(), and restores on D1 failure', async () => {
    const app = createTestApp();

    for (let i = 0; i < 5; i++) {
      const res = await postTelemetry(app, { event: 'dossier_generated' });
      expect(res.status).toBe(204);
    }

    // Zero hot-path D1 writes
    expect(prepareSpy).not.toHaveBeenCalled();
    expect(batchSpy).not.toHaveBeenCalled();
    expect(store.getPendingStats()).toEqual({ buckets: 1, events: 5 });

    // Single atomic batch flush
    const flushRes = await store.flush();
    expect(flushRes).toEqual({ flushedBuckets: 1, flushedEvents: 5 });
    expect(batchSpy).toHaveBeenCalledTimes(1);
    expect(boundCalls[0]?.args).toEqual([
      '2026-11-19',
      'dossier_generated',
      'standard',
      5,
      '2026-11-19T14:00:00.000Z',
    ]);

    // Subsequent empty flush performs zero DB calls (idempotent)
    const emptyFlush = await store.flush();
    expect(emptyFlush).toEqual({ flushedBuckets: 0, flushedEvents: 0 });
    expect(batchSpy).toHaveBeenCalledTimes(1);

    // D1 error restores pending counts so telemetry is not lost
    await postTelemetry(app, { event: 'visit_mode_enabled' });
    batchSpy.mockRejectedValueOnce(new Error('D1 transient write outage'));
    const failedFlush = await store.flush();
    expect(failedFlush).toEqual({ flushedBuckets: 0, flushedEvents: 0 });
    expect(store.getPendingStats()).toEqual({ buckets: 1, events: 1 });
  });

  it('prunes daily aggregates strictly older than 13 months', async () => {
    const deleted = await store.pruneExpired(new Date('2026-11-19T03:00:00.000Z'));
    expect(deleted).toBe(3);
    expect(boundCalls).toHaveLength(1);
    expect(boundCalls[0]?.sql).toContain('DELETE FROM telemetry_daily_aggregates WHERE day < ?1');
    expect(boundCalls[0]?.args).toEqual(['2025-10-19']);
  });
});
