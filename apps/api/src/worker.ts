import { buildApp } from './app.js';
import { CadastralCache } from './providers/cadastral-cache.js';
import { SourceSnapshotStore } from './resilience/source-snapshot-store.js';
import type { CloudflareEnv, ScheduledController, ExecutionContext } from './types/env.js';

const app = buildApp();

export default {
  fetch: app.fetch,
  async scheduled(_controller: ScheduledController, env: CloudflareEnv, ctx: ExecutionContext): Promise<void> {
    if (env.DB) {
      const cache = new CadastralCache({ db: env.DB });
      const snapshots = new SourceSnapshotStore({ db: env.DB });
      ctx.waitUntil(
        Promise.all([
          cache
            .pruneExpired(5000)
            .catch((err) => console.error('[OpenBarrio Cron] Failed to prune expired cadastral cache:', err)),
          snapshots
            .pruneExpired()
            .catch((err) => console.error('[OpenBarrio Cron] Failed to prune expired source snapshots:', err)),
        ])
      );
    }
  },
};
