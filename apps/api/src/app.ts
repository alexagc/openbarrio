import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { swaggerUI } from '@hono/swagger-ui';
import { problemDetailsErrorHandler } from './errors/problem-details.js';
import { createProviders, ProviderContainer } from './providers/index.js';
import { createV1Routes } from './routes/index.js';

export interface AppOptions {
  providers?: ProviderContainer;
}

export function buildOpenApiSpec(): Record<string, any> {
  return {
    openapi: '3.0.3',
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
      {
        url: 'https://api.openbarrio.org',
        description: 'Cloudflare Edge production gateway',
      },
    ],
    paths: {
      '/health': {
        get: {
          tags: ['System'],
          summary: 'System liveness and service status probe',
          responses: {
            '200': {
              description: 'Service is operational',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string', example: 'ok' },
                      service: { type: 'string', example: 'openbarrio-api' },
                      timestamp: { type: 'string', format: 'date-time' },
                    },
                    required: ['status', 'service', 'timestamp'],
                  },
                },
              },
            },
          },
        },
      },
      '/api/v1/audit/coords': {
        get: {
          tags: ['Audit'],
          summary: 'Audit property and neighborhood due diligence by geographic coordinates',
          description:
            'Aggregates official data from Catastro, INE income distribution, MITECO SICA noise, MITECO SNCZI flood risk, and MIVAU SERPAVI rental benchmarks',
          parameters: [
            {
              name: 'lat',
              in: 'query',
              required: true,
              schema: { type: 'number', minimum: -90, maximum: 90 },
              description: 'Latitude coordinate (WGS84 EPSG:4326)',
            },
            {
              name: 'lon',
              in: 'query',
              required: true,
              schema: { type: 'number', minimum: -180, maximum: 180 },
              description: 'Longitude coordinate (WGS84 EPSG:4326)',
            },
          ],
          responses: {
            '200': {
              description: 'Complete Due Diligence Audit Dossier with rental benchmark and environmental indicators',
            },
            '400': {
              description: 'RFC 7807 Invalid Request Parameters',
            },
            '404': {
              description: 'RFC 7807 Cadastral Property Not Found',
            },
            '502': {
              description: 'RFC 7807 Upstream Public Provider Failure',
            },
          },
        },
      },
      '/api/v1/audit/refcat/{refcat}': {
        get: {
          tags: ['Audit'],
          summary: 'Audit property and neighborhood due diligence by official Cadastral Reference (RC)',
          description:
            'Aggregates official data from Catastro, INE income distribution, MITECO SICA noise, MITECO SNCZI flood risk, and MIVAU SERPAVI rental benchmarks',
          parameters: [
            {
              name: 'refcat',
              in: 'path',
              required: true,
              schema: { type: 'string', pattern: '^[0-9A-Za-z]{14,20}$' },
              description: 'Spanish Cadastral Reference (14 or 20 characters)',
            },
          ],
          responses: {
            '200': {
              description: 'Complete Due Diligence Audit Dossier with rental benchmark and environmental indicators',
            },
            '400': {
              description: 'RFC 7807 Invalid Request Parameters',
            },
            '404': {
              description: 'RFC 7807 Cadastral Property Not Found',
            },
            '502': {
              description: 'RFC 7807 Upstream Public Provider Failure',
            },
          },
        },
      },
    },
  };
}

export function buildApp(options: AppOptions = {}): Hono {
  const app = new Hono();

  // RFC 7807 Problem Details error handler
  app.onError(problemDetailsErrorHandler);

  // CORS middleware supporting portal injection and web dashboard
  app.use('*', cors({
    origin: (origin) => {
      // Allow browser extension schemas, openbarrio domains, and localhost
      return origin || '*';
    },
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  }));

  // Swagger Documentation & OpenAPI spec
  const openApiSpec = buildOpenApiSpec();
  app.get('/docs/json', (c) => c.json(openApiSpec));
  app.get('/docs', swaggerUI({ url: '/docs/json' }));

  // Health check endpoint
  app.get('/health', (c) => {
    return c.json({
      status: 'ok',
      service: 'openbarrio-api',
      timestamp: new Date().toISOString(),
    });
  });

  // Providers & v1 API routes
  const providers = options.providers || createProviders();
  app.route('/api/v1', createV1Routes(providers));

  return app;
}
