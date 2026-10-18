import { Hono } from 'hono';
import { createAuditRoutes } from './audit.routes.js';
import { ProviderContainer } from '../providers/index.js';

export function createV1Routes(providers: ProviderContainer): Hono {
  const v1 = new Hono();
  v1.route('/audit', createAuditRoutes(providers));
  return v1;
}
