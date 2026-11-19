import { describe, it, expect, vi } from 'vitest';
import { LayerKey, layerOk, layerUnavailable } from '@openbarrio/core';
import {
  CircuitBreakerRegistry,
  SourceSnapshotStore,
  resolveWithStaleWhileRevalidate,
} from '../../src/resilience/index.js';
import type { D1Database } from '../../src/types/env.js';

interface StoredRow {
  provider_key: LayerKey;
  cache_key: string;
  data_json: string;
  data_hash: string;
  source_date: string | null;
  verified_at: string;
  expires_at: string;
}

function createInMemorySnapshotDb(initialRows: StoredRow[] = []) {
  const rows = new Map<string, StoredRow>();
  for (const row of initialRows) {
    rows.set(`${row.provider_key}:${row.cache_key}`, row);
  }
  let writeCount = 0;
  let readCount = 0;
  let deleteCount = 0;

  const db: D1Database = {
    prepare: (sql: string) => {
      const normalized = sql.replace(/\s+/g, ' ').trim();
      const createBound = (params: unknown[]) => ({
        bind: (...nextParams: unknown[]) => createBound([...params, ...nextParams]),
        first: async <T>() => {
          readCount += 1;
          const providerKey = String(params[0] ?? '');
          const cacheKey = String(params[1] ?? '');
          const row = rows.get(`${providerKey}:${cacheKey}`);
          if (!row) return null;
          return row as unknown as T;
        },
        all: async <T>() => {
          readCount += 1;
          if (normalized.includes('GROUP BY provider_key')) {
            const latestByProvider = new Map<string, StoredRow>();
            for (const row of rows.values()) {
              const prev = latestByProvider.get(row.provider_key);
              if (!prev || row.verified_at > prev.verified_at) {
                latestByProvider.set(row.provider_key, row);
              }
            }
            return { results: Array.from(latestByProvider.values()) as unknown as T[], success: true };
          }
          return { results: Array.from(rows.values()) as unknown as T[], success: true };
        },
        run: async () => {
          if (normalized.startsWith('DELETE FROM source_snapshots')) {
            deleteCount += 1;
            const cutoff = String(params[0] ?? '');
            let removed = 0;
            for (const [k, row] of rows.entries()) {
              if (row.expires_at <= cutoff) {
                rows.delete(k);
                removed += 1;
              }
            }
            return { success: true, meta: { changes: removed } };
          }
          writeCount += 1;
          const [providerKey, cacheKey, dataJson, dataHash, sourceDate, verifiedAt, expiresAt] =
            params as [LayerKey, string, string, string, string | null, string, string];
          rows.set(`${providerKey}:${cacheKey}`, {
            provider_key: providerKey,
            cache_key: cacheKey,
            data_json: dataJson,
            data_hash: dataHash,
            source_date: sourceDate,
            verified_at: verifiedAt,
            expires_at: expiresAt,
          });
          return { success: true, meta: { changes: 1 } };
        },
      });
      return createBound([]);
    },
    batch: async () => [],
    exec: async () => ({ count: 0 }),
  };

  return {
    db,
    rows,
    getMetrics: () => ({ writeCount, readCount, deleteCount }),
  };
}

describe('SourceSnapshotStore & Stale-While-Revalidate (Zero-Write D1 Policy)', () => {
  const baseNow = new Date('2026-11-19T12:00:00.000Z');

  it('performs zero D1 writes on read operations and skips duplicate writes within 24h when content hash matches', async () => {
    let currentTime = baseNow;
    const { db, getMetrics } = createInMemorySnapshotDb();
    const store = new SourceSnapshotStore({ db, now: () => currentTime });

    const payload = { dayEveningNightDecibels: 61, category: 'MODERATE', predominantSource: 'ROAD_TRAFFIC' };

    const firstWrite = await store.saveIfChanged('sica', '40.4200:-3.7030', payload, '2026-10-01');
    expect(firstWrite).toBe(true);
    expect(getMetrics().writeCount).toBe(1);

    // Zero writes on read
    const read1 = await store.get<typeof payload>('sica', '40.4200:-3.7030');
    expect(read1?.data).toEqual(payload);
    expect(getMetrics().writeCount).toBe(1);
    expect(getMetrics().deleteCount).toBe(0);

    // Same hash within 6 hours -> zero write!
    currentTime = new Date(baseNow.getTime() + 6 * 3600_000);
    const secondWriteSameHash = await store.saveIfChanged('sica', '40.4200:-3.7030', payload, '2026-10-01');
    expect(secondWriteSameHash).toBe(false);
    expect(getMetrics().writeCount).toBe(1);

    // Changed content hash -> writes immediately
    const changedWrite = await store.saveIfChanged(
      'sica',
      '40.4200:-3.7030',
      { ...payload, dayEveningNightDecibels: 64 },
      '2026-11-19'
    );
    expect(changedWrite).toBe(true);
    expect(getMetrics().writeCount).toBe(2);

    // Identical hash after >= 24 hours since last write (+31h from baseNow = +25h from changedWrite)
    currentTime = new Date(baseNow.getTime() + 31 * 3600_000);
    const dailyTouchWrite = await store.saveIfChanged(
      'sica',
      '40.4200:-3.7030',
      { ...payload, dayEveningNightDecibels: 64 },
      '2026-11-19'
    );
    expect(dailyTouchWrite).toBe(true);
    expect(getMetrics().writeCount).toBe(3);
  });

  it('serves <=30d snapshot as ok without upstream call or D1 writes', async () => {
    const { db, getMetrics } = createInMemorySnapshotDb();
    const tenDaysAgo = new Date(baseNow.getTime() - 10 * 86_400_000);
    const seedStore = new SourceSnapshotStore({ db, now: () => tenDaysAgo });
    await seedStore.saveIfChanged('sica', 'k1', { dayEveningNightDecibels: 58 });

    const writesAfterSeed = getMetrics().writeCount;
    const readerStore = new SourceSnapshotStore({ db, now: () => baseNow });
    const fetcher = vi.fn();

    const result = await resolveWithStaleWhileRevalidate({
      providerKey: 'sica',
      sourceName: 'MITECO SICA',
      cacheKey: 'k1',
      snapshotStore: readerStore,
      now: () => baseNow,
      fetcher,
    });

    expect(result.status).toBe('ok');
    expect(result.data).toEqual({ dayEveningNightDecibels: 58 });
    expect(fetcher).not.toHaveBeenCalled();
    expect(getMetrics().writeCount).toBe(writesAfterSeed);
  });

  it('serves 45d snapshot as stale and schedules background revalidation via waitUntil when breaker is closed', async () => {
    const { db } = createInMemorySnapshotDb();
    const fortyFiveDaysAgo = new Date(baseNow.getTime() - 45 * 86_400_000);
    const seedStore = new SourceSnapshotStore({ db, now: () => fortyFiveDaysAgo });
    await seedStore.saveIfChanged('sica', 'k2', { dayEveningNightDecibels: 60 }, '2026-09-01');

    const store = new SourceSnapshotStore({ db, now: () => baseNow });
    const breaker = new CircuitBreakerRegistry();
    const waitPromises: Promise<unknown>[] = [];
    const waitUntil = vi.fn((p: Promise<unknown>) => {
      waitPromises.push(p);
    });
    const fetcher = vi.fn(async () =>
      layerOk('MITECO SICA', { dayEveningNightDecibels: 63 }, { sourceDate: '2026-11-18' })
    );

    const result = await resolveWithStaleWhileRevalidate({
      providerKey: 'sica',
      sourceName: 'MITECO SICA',
      cacheKey: 'k2',
      snapshotStore: store,
      breaker,
      waitUntil,
      now: () => baseNow,
      fetcher,
    });

    expect(result.status).toBe('stale');
    expect(result.staleDays).toBe(45);
    expect(result.verifiedAt).toBe(fortyFiveDaysAgo.toISOString());
    expect(result.data).toEqual({ dayEveningNightDecibels: 60 });
    expect(waitUntil).toHaveBeenCalledTimes(1);

    await Promise.all(waitPromises);
    expect(fetcher).toHaveBeenCalledTimes(1);

    const refreshed = await store.get<{ dayEveningNightDecibels: number }>('sica', 'k2');
    expect(refreshed?.data.dayEveningNightDecibels).toBe(63);
  });

  it('serves 120d snapshot as stale WITHOUT calling upstream when circuit breaker is open', async () => {
    const { db } = createInMemorySnapshotDb();
    const age120 = new Date(baseNow.getTime() - 120 * 86_400_000);
    const seedStore = new SourceSnapshotStore({ db, now: () => age120 });
    await seedStore.saveIfChanged('snczi', 'k3', { level: 'LOW' });

    const breaker = new CircuitBreakerRegistry();
    for (let i = 0; i < 5; i++) {
      breaker.recordFailure('snczi', 'upstream_error');
    }
    expect(breaker.canRequest('snczi')).toBe(false);

    const waitUntil = vi.fn();
    const fetcher = vi.fn();
    const store = new SourceSnapshotStore({ db, now: () => baseNow });

    const result = await resolveWithStaleWhileRevalidate({
      providerKey: 'snczi',
      sourceName: 'MITECO SNCZI',
      cacheKey: 'k3',
      snapshotStore: store,
      breaker,
      waitUntil,
      now: () => baseNow,
      fetcher,
    });

    expect(result.status).toBe('stale');
    expect(result.staleDays).toBe(120);
    expect(waitUntil).not.toHaveBeenCalled();
    expect(fetcher).not.toHaveBeenCalled();
  });

  it('refuses >365d expired snapshot and returns unavailable on upstream failure (only prunes via pruneExpired)', async () => {
    const { db, getMetrics } = createInMemorySnapshotDb();
    const age400 = new Date(baseNow.getTime() - 400 * 86_400_000);
    const seedStore = new SourceSnapshotStore({ db, now: () => age400 });
    await seedStore.saveIfChanged('sica', 'k4', { dayEveningNightDecibels: 59 });

    const store = new SourceSnapshotStore({ db, now: () => baseNow });
    const fetcher = vi.fn(async () => layerUnavailable<{ dayEveningNightDecibels: number }>('MITECO SICA', 'timeout'));

    const result = await resolveWithStaleWhileRevalidate({
      providerKey: 'sica',
      sourceName: 'MITECO SICA',
      cacheKey: 'k4',
      snapshotStore: store,
      now: () => baseNow,
      fetcher,
    });

    expect(result.status).toBe('unavailable');
    expect(result.reason).toBe('timeout');
    expect(result.data).toBeUndefined();
    expect(getMetrics().deleteCount).toBe(0);

    const pruned = await store.pruneExpired();
    expect(pruned).toBe(1);
    expect(getMetrics().deleteCount).toBe(1);
  });
});
