import { buildApp } from './app.js';
import { CadastralCache } from './providers/cadastral-cache.js';
import type { CloudflareEnv, ScheduledController, ExecutionContext } from './types/env.js';

const app = buildApp();

export default {
  fetch: app.fetch,
  async scheduled(controller: ScheduledController, env: CloudflareEnv, ctx: ExecutionContext): Promise<void> {
    if (env.DB) {
      const cache = new CadastralCache({ db: env.DB });
      ctx.waitUntil(
        cache
          .pruneExpired(5000)
          .catch((err) => console.error('[OpenBarrio Cron] Failed to prune expired cadastral cache:', err))
      );
    }
  },
};
