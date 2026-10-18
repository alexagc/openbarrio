import { FastifyPluginAsync } from 'fastify';
import { auditRoutes } from './audit.routes.js';
import { ProviderContainer } from '../providers/index.js';

export interface V1RoutesOptions {
  providers: ProviderContainer;
}

export const v1Routes: FastifyPluginAsync<V1RoutesOptions> = async (fastify, options) => {
  await fastify.register(auditRoutes, {
    prefix: '/audit',
    providers: options.providers,
  });
};
