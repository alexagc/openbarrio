import {
  LayerKey,
  LayerResult,
  STALE_FRESH_DAYS,
  STALE_MAX_DAYS,
  computeStaleAgeDays,
  layerOk,
  layerStale,
} from '@openbarrio/core';
import { CircuitBreakerRegistry, defaultBreakerRegistry } from './circuit-breaker.js';
import { SourceSnapshotStore } from './source-snapshot-store.js';

export type WaitUntilFn = (promise: Promise<unknown>) => void;

export interface StaleWhileRevalidateOptions<T> {
  providerKey: LayerKey;
  sourceName: string;
  cacheKey: string;
  snapshotStore?: SourceSnapshotStore;
  breaker?: CircuitBreakerRegistry;
  waitUntil?: WaitUntilFn;
  now?: () => Date;
  fetcher: () => Promise<LayerResult<T>>;
}

/**
 * Implements tiered freshness and stale-while-revalidate over D1 snapshots:
 * - <= 30d: `ok` from snapshot (0 upstream calls, 0 D1 writes)
 * - 31d–365d: `stale` from snapshot; triggers background refresh via `waitUntil` if breaker is closed
 * - > 365d or absent: calls live upstream and never serves expired data on failure (D6/D7/D8)
 */
export async function resolveWithStaleWhileRevalidate<T>(
  options: StaleWhileRevalidateOptions<T>
): Promise<LayerResult<T>> {
  const {
    providerKey,
    sourceName,
    cacheKey,
    snapshotStore,
    breaker = defaultBreakerRegistry,
    waitUntil,
    now,
    fetcher,
  } = options;

  const snapshot = snapshotStore
    ? await snapshotStore.get<T>(providerKey, cacheKey)
    : null;

  if (snapshot) {
    const ageDays = now
      ? computeStaleAgeDays(snapshot.verifiedAt, now())
      : snapshot.ageDays;

    if (ageDays <= STALE_FRESH_DAYS) {
      return layerOk(sourceName, snapshot.data, {
        sourceDate: snapshot.sourceDate,
        verifiedAt: snapshot.verifiedAt,
      });
    }

    if (ageDays <= STALE_MAX_DAYS) {
      if (waitUntil && breaker.canRequest(providerKey)) {
        waitUntil(
          (async () => {
            try {
              const freshRes = await fetcher();
              if (freshRes.status === 'ok' && freshRes.data !== undefined && snapshotStore) {
                await snapshotStore.saveIfChanged(
                  providerKey,
                  cacheKey,
                  freshRes.data,
                  freshRes.sourceDate
                );
              }
            } catch (err) {
              console.warn(
                `[SWR:${providerKey}] Background revalidation skipped:`,
                (err as Error)?.message
              );
            }
          })()
        );
      }

      return layerStale(sourceName, snapshot.data, {
        sourceDate: snapshot.sourceDate,
        verifiedAt: snapshot.verifiedAt,
        staleDays: ageDays,
      });
    }
  }

  const liveResult = await fetcher();
  if (liveResult.status === 'ok' && liveResult.data !== undefined && snapshotStore) {
    await snapshotStore.saveIfChanged(
      providerKey,
      cacheKey,
      liveResult.data,
      liveResult.sourceDate
    );
  }
  return liveResult;
}
