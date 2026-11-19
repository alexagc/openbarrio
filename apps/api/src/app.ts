import { Hono } from 'hono';
import { swaggerUI } from '@hono/swagger-ui';
import { problemDetailsErrorHandler } from './errors/problem-details.js';
import { createProviders, injectDatabase, ProviderContainer } from './providers/index.js';
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
      version: '1.4.0',
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
      {
        name: 'Telemetry',
        description: 'Privacy-first aggregate event ingestion without cookies or PII',
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
      '/api/v1/status/sources': {
        get: {
          tags: ['Status'],
          summary: 'Inspect real-time health, circuit breaker states, and latest verified D1 snapshots for all 13 public data layers',
          description:
            'Read-only operational status endpoint aggregating in-memory isolate circuit breakers and latest snapshot timestamps from D1 without performing write queries',
          responses: {
            '200': {
              description: 'Operational status summary and per-source health telemetry',
            },
            '500': {
              description: 'RFC 7807 Internal Status Aggregation Failure',
            },
          },
        },
      },
      '/api/v1/listing/resolve': {
        post: {
          tags: ['Listing'],
          summary: 'Resolve metadata from a user-supplied real-estate portal URL without server-side fetching',
          description:
            'Validates host against the 5-portal allowlist and extracts listing ID, location hints, or optional user-pasted cadastral references in memory with zero storage and strict per-IP rate limits (10/min, 100/day).',
          responses: {
            '200': {
              description: 'Sanitized listing URL and minimal extracted metadata',
            },
            '400': { description: 'RFC 7807 Invalid Listing URL or parameters' },
            '413': { description: 'RFC 7807 Pasted snippet exceeds 200 KB' },
            '415': { description: 'RFC 7807 Expected application/json' },
            '422': { description: 'RFC 7807 Unsupported host or insufficient metadata' },
            '429': { description: 'RFC 7807 Rate limit exceeded' },
          },
        },
      },
      '/api/v1/extension/selectors': {
        get: {
          tags: ['Extension'],
          summary: 'Fetch versioned JSON-only CSS selector configuration for portal adapters',
          description:
            'Returns schema-validated CSS selector configuration (<32 KB, JSON only, no executable code) for the 5 supported Spanish real-estate portals.',
          responses: {
            '200': {
              description: 'Valid RemoteSelectorsBundle JSON',
            },
            '500': { description: 'RFC 7807 Selector config validation failure' },
          },
        },
      },
      '/api/v1/telemetry': {
        post: {
          tags: ['Telemetry'],
          summary: 'Ingest privacy-first aggregate telemetry event',
          description:
            'Accepts closed-schema aggregate usage events (<= 1 KB, zero PII, zero cookies, zero IP persistence) buffered into batched daily D1 counts with 13-month retention.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['event'],
                  additionalProperties: false,
                  properties: {
                    event: {
                      type: 'string',
                      enum: [
                        'dossier_generated',
                        'lens_used',
                        'checklist_exported',
                        'visit_mode_enabled',
                      ],
                    },
                    lens: {
                      type: 'string',
                      enum: ['profile', 'layer', 'checklist'],
                    },
                    returning14d: { type: 'boolean' },
                  },
                },
              },
            },
          },
          responses: {
            '204': { description: 'Telemetry event accepted into isolate aggregate batch' },
            '400': { description: 'RFC 7807 Strict closed schema validation failure' },
            '413': { description: 'RFC 7807 Telemetry payload exceeds 1024 bytes' },
            '415': { description: 'RFC 7807 Expected application/json' },
            '429': { description: 'RFC 7807 Telemetry rate limit exceeded' },
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

  // 6. Dynamic Cloudflare D1 injection across all providers (sub-5ms INE, CEE, facilities, trends, radon, vut)
  const providers = options.providers || createProviders();
  app.use('*', async (c, next) => {
    if (c.env?.DB) {
      injectDatabase(providers, c.env.DB);
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
