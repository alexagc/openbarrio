import { Hono } from 'hono';
import { createAuditRoutes } from './audit.routes.js';
import { createTilesRoutes } from './tiles.routes.js';
import { createMunicipalitiesRoutes } from './municipalities.routes.js';
import { createOgRoutes } from './og.routes.js';
import { createSitemapRoutes } from './sitemap.routes.js';
import { ProviderContainer } from '../providers/index.js';
import type { CloudflareEnv } from '../types/env.js';

export function createV1Routes(providers: ProviderContainer): Hono<{ Bindings: CloudflareEnv }> {
  const v1 = new Hono<{ Bindings: CloudflareEnv }>();
  v1.route('/audit', createAuditRoutes(providers) as any);
  v1.route('/tiles', createTilesRoutes());
  v1.route('/municipalities', createMunicipalitiesRoutes(providers.municipality));
  v1.route('/og', createOgRoutes(providers.municipality));
  v1.route('/sitemap', createSitemapRoutes(providers.municipality));
  return v1;
}
