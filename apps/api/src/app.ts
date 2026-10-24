import { Hono } from 'hono';
import { swaggerUI } from '@hono/swagger-ui';
import { problemDetailsErrorHandler } from './errors/problem-details.js';
import { createProviders, ProviderContainer } from './providers/index.js';
import { createV1Routes } from './routes/index.js';
import {
  securityHeadersMiddleware,
  strictCorsMiddleware,
  rateLimitMiddleware,
  edgeCacheMiddleware,
  CorsOptions,
  RateLimitOptions,
  EdgeCacheOptions,
} from './middleware/index.js';
import type { CloudflareEnv } from './types/env.js';

export interface AppOptions {
  providers?: ProviderContainer;
  rateLimit?: RateLimitOptions;
  cache?: EdgeCacheOptions;
  cors?: CorsOptions;
}

export function buildOpenApiSpec(): Record<string, any> {
  return {
    openapi: '3.0.3',
    info: {
      title: 'OpenBarrio Public Due Diligence API',
      description:
        'Open-source civic-tech and real estate due diligence platform aggregating official Spanish public open data (Catastro, INE, MITECO, MIVAU) with sub-5ms Cloudflare Edge execution',
      version: '0.5.0',
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
        name: 'Tiles',
        description: 'Spatial vector boundaries and census tract PMTiles from Cloudflare R2',
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
        url: 'https://openbarrio-api.workers.dev',
        description: 'Cloudflare Workers production edge',
      },
      {
        url: 'https://api.openbarrio.org',
        description: 'Custom domain edge gateway',
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
            'Aggregates official data from Catastro, INE income distribution, MITECO SICA noise, MITECO SNCZI flood risk, MITECO air quality, 15-minute civic connectivity, urban planning zoning, and MIVAU SERPAVI rental benchmarks with 90-day Edge caching',
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
              description: 'Complete Due Diligence Audit Dossier with 5-pillar scores, rental benchmark, connectivity, and environmental indicators',
              headers: {
                'X-OpenBarrio-Cache': {
                  schema: { type: 'string', enum: ['HIT', 'MISS', 'BYPASS'] },
                  description: 'Cloudflare Edge cache status',
                },
                'RateLimit-Remaining': {
                  schema: { type: 'integer' },
                  description: 'Remaining allowed requests in current window',
                },
              },
            },
            '400': {
              description: 'RFC 7807 Invalid Request Parameters',
            },
            '404': {
              description: 'RFC 7807 Cadastral Property Not Found',
            },
            '429': {
              description: 'RFC 7807 Rate Limit Exceeded',
            },
            '502': {
              description: 'RFC 7807 Upstream Public Provider Failure',
            },
          },
        },
      },
      '/api/v1/audit/refcat/{refcat}/units': {
        get: {
          tags: ['Audit'],
          summary: 'Retrieve horizontal division cadastral units for a building parcel',
          description:
            'Extracts all private dwellings, commercial premises, and storage units from Sede del Catastro (<lrcdnp>) with floor, door, usage, surface, and participation coefficients',
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
              description: 'List of horizontal division cadastral units with parcel summary',
            },
            '400': {
              description: 'RFC 7807 Invalid Cadastral Reference Parameter',
            },
            '404': {
              description: 'RFC 7807 Cadastral Parcel Not Found',
            },
          },
        },
      },
      '/api/v1/audit/refcat/{refcat}': {
        get: {
          tags: ['Audit'],
          summary: 'Audit property and neighborhood due diligence by official Cadastral Reference (RC)',
          description:
            'Aggregates official data from Catastro, INE income distribution, MITECO SICA noise, MITECO SNCZI flood risk, MITECO air quality, 15-minute civic connectivity, urban planning zoning, and MIVAU SERPAVI rental benchmarks with 90-day Edge caching',
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
              description: 'Complete Due Diligence Audit Dossier with 5-pillar scores, rental benchmark, connectivity, and environmental indicators',
              headers: {
                'X-OpenBarrio-Cache': {
                  schema: { type: 'string', enum: ['HIT', 'MISS', 'BYPASS'] },
                  description: 'Cloudflare Edge cache status',
                },
                'RateLimit-Remaining': {
                  schema: { type: 'integer' },
                  description: 'Remaining allowed requests in current window',
                },
              },
            },
            '400': {
              description: 'RFC 7807 Invalid Request Parameters',
            },
            '404': {
              description: 'RFC 7807 Cadastral Property Not Found',
            },
            '429': {
              description: 'RFC 7807 Rate Limit Exceeded',
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

export function buildApp(options: AppOptions = {}): Hono<{ Bindings: CloudflareEnv }> {
  const app = new Hono<{ Bindings: CloudflareEnv }>();

  // 1. RFC 7807 Problem Details error handler
  app.onError(problemDetailsErrorHandler);

  // 2. Security headers (HSTS, CSP, X-Frame-Options, X-Content-Type-Options)
  app.use('*', securityHeadersMiddleware());

  // 3. Strict CORS policy (extensions, Pages, localhost)
  app.use('*', strictCorsMiddleware(options.cors));

  // 4. Rate limiting protecting public resources
  app.use('*', rateLimitMiddleware(options.rateLimit));

  // 5. Cloudflare Cache API & Edge caching (90 days TTL, X-OpenBarrio-Cache headers)
  app.use('*', edgeCacheMiddleware(options.cache));

  // 6. Dynamic Cloudflare D1 injection for sub-5ms INE and civic facilities lookups
  const providers = options.providers || createProviders();
  app.use('*', async (c, next) => {
    if (c.env?.DB && providers.ine && typeof (providers.ine as any).setDatabase === 'function') {
      (providers.ine as any).setDatabase(c.env.DB);
    }
    if (
      c.env?.DB &&
      providers.connectivity &&
      typeof (providers.connectivity as any).setDatabase === 'function'
    ) {
      (providers.connectivity as any).setDatabase(c.env.DB);
    }
    await next();
  });

  // 7. Swagger Documentation & OpenAPI spec
  const openApiSpec = buildOpenApiSpec();
  app.get('/docs/json', (c) => c.json(openApiSpec));
  app.get('/docs', swaggerUI({ url: '/docs/json' }));

  // 8. Health check endpoint
  app.get('/health', (c) => {
    return c.json({
      status: 'ok',
      service: 'openbarrio-api',
      timestamp: new Date().toISOString(),
    });
  });

  // 9. Providers & v1 API routes
  app.route('/api/v1', createV1Routes(providers));

  return app;
}
