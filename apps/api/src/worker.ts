import { buildApp } from './app.js';
import { createProviders } from './providers/index.js';
import { CadastralCache } from './providers/cadastral-cache.js';
import { SourceSnapshotStore } from './resilience/source-snapshot-store.js';
import { TelemetryStore } from './telemetry/telemetry-store.js';
import type { CloudflareEnv, ScheduledController, ExecutionContext } from './types/env.js';

const sharedTelemetryStore = new TelemetryStore();
const app = buildApp({
  providers: createProviders({
    overrides: {
      telemetryStore: sharedTelemetryStore,
    },
  }),
});

export default {
  fetch: app.fetch,
  async scheduled(_controller: ScheduledController, env: CloudflareEnv, ctx: ExecutionContext): Promise<void> {
    if (env.DB) {
      const cache = new CadastralCache({ db: env.DB });
      const snapshots = new SourceSnapshotStore({ db: env.DB });
      sharedTelemetryStore.setDatabase(env.DB);
      ctx.waitUntil(
        Promise.all([
          cache
            .pruneExpired(5000)
            .catch((err) => console.error('[OpenBarrio Cron] Failed to prune expired cadastral cache:', err)),
          snapshots
            .pruneExpired()
            .catch((err) => console.error('[OpenBarrio Cron] Failed to prune expired source snapshots:', err)),
          sharedTelemetryStore
            .flush()
            .catch((err) => console.error('[OpenBarrio Cron] Failed to flush telemetry aggregates:', err)),
          sharedTelemetryStore
            .pruneExpired()
            .catch((err) => console.error('[OpenBarrio Cron] Failed to prune expired telemetry aggregates:', err)),
        ])
      );
    }
  },
};
