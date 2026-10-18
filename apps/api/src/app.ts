import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { problemDetailsErrorHandler } from './errors/problem-details.js';
import { createProviders, ProviderContainer } from './providers/index.js';
import { v1Routes } from './routes/index.js';

export interface AppOptions {
  providers?: ProviderContainer;
  logger?: boolean;
}

export async function buildApp(options: AppOptions = {}): Promise<FastifyInstance> {
  const app = Fastify({
    logger: options.logger ?? false,
  });

  // RFC 7807 problem details error handler
  app.setErrorHandler(problemDetailsErrorHandler);

  await app.register(cors, {
    origin: true,
  });

  await app.register(swagger, {
    openapi: {
      info: {
        title: 'OpenBarrio Public Due Diligence API',
        description:
          'Open-source civic-tech and real estate due diligence platform aggregating official Spanish public open data (Catastro, INE, MITECO, MIVAU)',
        version: '0.2.0',
        contact: {
          name: 'OpenBarrio Project',
          url: 'https://github.com/alexagc/openbarrio',
        },
      },
      tags: [
        {
          name: 'Audit',
          description: 'Comprehensive cadastral, socioeconomic, and environmental property audits',
        },
        {
          name: 'System',
          description: 'System health and diagnostic probes',
        },
      ],
      servers: [
        {
          url: 'http://localhost:3001',
          description: 'Local development server',
        },
      ],
    },
  });

  await app.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
  });

  // Health check endpoint
  app.get(
    '/health',
    {
      schema: {
        tags: ['System'],
        description: 'System liveness and service status probe',
      },
    },
    async () => {
      return {
        status: 'ok',
        service: 'openbarrio-api',
        timestamp: new Date().toISOString(),
      };
    }
  );

  // Initialize providers
  const providers = options.providers || createProviders();

  // Register API v1 routes
  await app.register(v1Routes, {
    prefix: '/api/v1',
    providers,
  });

  return app;
}
