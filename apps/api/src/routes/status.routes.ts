import { Hono } from 'hono';
import { Value } from '@sinclair/typebox/value';
import {
  ALL_LAYER_KEYS,
  LayerKey,
  SourceHealthEntry,
  SourceOperationalStatus,
  SourcesStatusResponse,
  SourcesStatusResponseSchema,
} from '@openbarrio/core';
import { ProviderContainer } from '../providers/index.js';
import {
  SourceSnapshotStore,
  defaultBreakerRegistry,
  getProviderResilienceConfig,
} from '../resilience/index.js';

const OUTAGE_CRITICAL_KEYS = new Set<LayerKey>(['catastro', 'sica', 'snczi']);

export function createStatusRoutes(providers: ProviderContainer): Hono {
  const router = new Hono();

  // GET /api/v1/status/sources — Read-only telemetry of circuit breakers + latest verified D1 snapshots
  router.get('/sources', async (c) => {
    const breaker = providers.breaker ?? defaultBreakerRegistry;
    const snapshotStore =
      providers.snapshotStore ??
      (providers.db ? new SourceSnapshotStore({ db: providers.db }) : undefined);

    const latestSnapshots = snapshotStore ? await snapshotStore.listLatestByProvider() : {};

    const sources: SourceHealthEntry[] = ALL_LAYER_KEYS.map((key) => {
      const cfg = getProviderResilienceConfig(key);
      const snap = breaker.getSnapshot(key);
      const snapshotSummary = latestSnapshots[key];

      const lastSuccessIso =
        snap.lastSuccessAt !== undefined ? new Date(snap.lastSuccessAt).toISOString() : undefined;
      const lastErrorIso =
        snap.lastErrorAt !== undefined ? new Date(snap.lastErrorAt).toISOString() : undefined;
      const lastVerifiedAt = snapshotSummary?.lastVerifiedAt ?? lastSuccessIso;

      let status: SourceOperationalStatus;
      if (snap.circuitState === 'open') {
        status = 'outage';
      } else if (snap.circuitState === 'half_open' || snap.recentFailures > 0) {
        status = 'degraded';
      } else if (lastSuccessIso !== undefined || snapshotSummary !== undefined) {
        status = 'operational';
      } else {
        status = 'unknown';
      }

      return {
        key,
        sourceName: cfg.sourceName,
        status,
        circuitState: snap.circuitState,
        recentFailures: snap.recentFailures,
        ...(lastSuccessIso ? { lastSuccessAt: lastSuccessIso } : {}),
        ...(lastErrorIso ? { lastErrorAt: lastErrorIso } : {}),
        ...(lastVerifiedAt ? { lastVerifiedAt } : {}),
        ...(snapshotSummary?.sourceDate ? { sourceDate: snapshotSummary.sourceDate } : {}),
      };
    });

    const outageCount = sources.filter((s) => s.status === 'outage').length;
    const degradedCount = sources.filter((s) => s.status === 'degraded').length;
    const criticalOutage = sources.some(
      (s) => s.status === 'outage' && OUTAGE_CRITICAL_KEYS.has(s.key)
    );

    const overallStatus: SourcesStatusResponse['overallStatus'] =
      criticalOutage || outageCount >= 3
        ? 'outage'
        : outageCount > 0 || degradedCount > 0
        ? 'degraded'
        : 'operational';

    const payload: SourcesStatusResponse = {
      generatedAt: new Date().toISOString(),
      overallStatus,
      sources,
    };

    if (!Value.Check(SourcesStatusResponseSchema, payload)) {
      throw new Error('Generated sources status response failed TypeBox schema validation');
    }

    c.header('Cache-Control', 'no-store');
    return c.json(payload, 200);
  });

  return router;
}
