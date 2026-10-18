import { describe, it, expect, beforeEach } from 'vitest';
import { Hono } from 'hono';
import { buildApp } from '../../src/app.js';
import { createProviders } from '../../src/providers/index.js';
import { resetRateLimiter } from '../../src/middleware/rate-limit.middleware.js';
import { clearEdgeMemoryCache } from '../../src/middleware/cache.middleware.js';
import { INEProvider } from '../../src/providers/ine.provider.js';
import type { D1Database, R2Bucket } from '../../src/types/env.js';

describe('Phase 6: Cloudflare Edge Hardening & Deployment Tests', () => {
  beforeEach(() => {
    resetRateLimiter();
    clearEdgeMemoryCache();
  });

  describe('Security Headers Middleware', () => {
    it('injects standard OWASP & Cloudflare security headers on all responses', async () => {
      const app = buildApp({ providers: createProviders({ useMocks: true }) });
      const res = await app.request('/health');

      expect(res.status).toBe(200);
      expect(res.headers.get('x-content-type-options')).toBe('nosniff');
      expect(res.headers.get('x-frame-options')).toBe('DENY');
      expect(res.headers.get('referrer-policy')).toBe('strict-origin-when-cross-origin');
      expect(res.headers.get('strict-transport-security')).toContain('max-age=31536000');
      expect(res.headers.get('permissions-policy')).toBeDefined();
      expect(res.headers.get('content-security-policy')).toBeDefined();
    });
  });

  describe('Strict CORS Policy Middleware', () => {
    const app = buildApp({ providers: createProviders({ useMocks: true }) });

    it('allows official Cloudflare Pages dashboard origin', async () => {
      const res = await app.request('/health', {
        headers: { Origin: 'https://openbarrio-web.pages.dev' },
      });
      expect(res.headers.get('access-control-allow-origin')).toBe('https://openbarrio-web.pages.dev');
    });

    it('allows Cloudflare Pages preview branch deployments', async () => {
      const res = await app.request('/health', {
        headers: { Origin: 'https://preview-123.openbarrio-web.pages.dev' },
      });
      expect(res.headers.get('access-control-allow-origin')).toBe(
        'https://preview-123.openbarrio-web.pages.dev'
      );
    });

    it('allows production openbarrio.org domain', async () => {
      const res = await app.request('/health', {
        headers: { Origin: 'https://openbarrio.org' },
      });
      expect(res.headers.get('access-control-allow-origin')).toBe('https://openbarrio.org');
    });

    it('allows Chrome extension origin schemas', async () => {
      const extensionOrigin = 'chrome-extension://abcdefghijklmnopabcdefghijklmnop';
      const res = await app.request('/health', {
        headers: { Origin: extensionOrigin },
      });
      expect(res.headers.get('access-control-allow-origin')).toBe(extensionOrigin);
    });

    it('allows local development environments', async () => {
      const res = await app.request('/health', {
        headers: { Origin: 'http://localhost:5173' },
      });
      expect(res.headers.get('access-control-allow-origin')).toBe('http://localhost:5173');
    });

    it('rejects untrusted third-party origins by omitting Access-Control-Allow-Origin', async () => {
      const res = await app.request('/health', {
        headers: { Origin: 'https://malicious-tracker.evil.com' },
      });
      expect(res.headers.get('access-control-allow-origin')).toBeNull();
    });
  });

  describe('Edge Caching Middleware & Diagnostic Headers', () => {
    it('sets X-OpenBarrio-Cache: MISS on initial query and HIT on second query', async () => {
      const app = buildApp({
        providers: createProviders({ useMocks: true }),
        rateLimit: { enabled: false },
      });

      const endpoint = '/api/v1/audit/refcat/9872023VH5797S0001WX';

      // 1. Initial request -> Cache MISS
      const res1 = await app.request(endpoint);
      expect(res1.status).toBe(200);
      expect(res1.headers.get('x-openbarrio-cache')).toBe('MISS');
      expect(res1.headers.get('cache-control')).toContain('max-age=7776000');

      // 2. Second request -> Cache HIT
      const res2 = await app.request(endpoint);
      expect(res2.status).toBe(200);
      expect(res2.headers.get('x-openbarrio-cache')).toBe('HIT');
    });

    it('respects client Cache-Control: no-cache and bypasses cache', async () => {
      const app = buildApp({
        providers: createProviders({ useMocks: true }),
        rateLimit: { enabled: false },
      });

      const endpoint = '/api/v1/audit/refcat/9872023VH5797S0001WX';

      const res = await app.request(endpoint, {
        headers: { 'Cache-Control': 'no-cache' },
      });

      expect(res.status).toBe(200);
      expect(res.headers.get('x-openbarrio-cache')).toBe('BYPASS');
    });
  });

  describe('Rate Limiting Middleware', () => {
    it('provides standard RateLimit-* headers on allowed requests', async () => {
      const app = buildApp({
        providers: createProviders({ useMocks: true }),
        rateLimit: { limit: 10, windowMs: 60_000 },
      });

      const res = await app.request('/api/v1/audit/refcat/9872023VH5797S0001WX');
      expect(res.status).toBe(200);
      expect(res.headers.get('ratelimit-limit')).toBe('10');
      expect(res.headers.get('ratelimit-remaining')).toBe('9');
      expect(res.headers.get('ratelimit-reset')).toBeDefined();
    });

    it('returns RFC 7807 429 Too Many Requests when rate limit is exceeded', async () => {
      const app = buildApp({
        providers: createProviders({ useMocks: true }),
        rateLimit: { limit: 2, windowMs: 60_000 },
        cache: { enabled: false },
      });

      const endpoint = '/api/v1/audit/refcat/9872023VH5797S0001WX';

      // Request 1: OK
      const res1 = await app.request(endpoint);
      expect(res1.status).toBe(200);

      // Request 2: OK
      const res2 = await app.request(endpoint);
      expect(res2.status).toBe(200);

      // Request 3: Rate Limited (429)
      const res3 = await app.request(endpoint);
      expect(res3.status).toBe(429);
      expect(res3.headers.get('retry-after')).toBeDefined();
      expect(res3.headers.get('content-type')).toContain('application/problem+json');

      const problem = await res3.json();
      expect(problem.type).toBe('https://openbarrio.org/errors/rate-limit-exceeded');
      expect(problem.title).toBe('Rate Limit Exceeded');
      expect(problem.status).toBe(429);
      expect(problem.detail).toContain('Rate limit exceeded');
    });
  });

  describe('Cloudflare D1 SQLite Integration', () => {
    it('queries D1 directly when bound to retrieve INE census tract statistics', async () => {
      const mockD1Row = {
        census_section_code: '2807901001',
        municipality_code: '28079',
        average_net_household_income_eur: 48500.5,
        average_net_person_income_eur: 22045.0,
        median_net_household_income_eur: 42000.0,
        median_net_person_income_eur: 19500.0,
        percentile_in_municipality: 85.0,
        rank_in_municipality: 150,
        total_sections_in_municipality: 1000,
        median_age: 43.5,
        single_person_household_percentage: 29.5,
        updated_at: '2026-10-18T00:00:00Z',
      };

      const mockDb: D1Database = {
        prepare: () => ({
          bind: () => ({
            bind: () => this,
            first: async () => mockD1Row,
            all: async () => ({ results: [mockD1Row], success: true }),
            run: async () => ({ success: true }),
          }),
          first: async () => mockD1Row,
          all: async () => ({ results: [mockD1Row], success: true }),
          run: async () => ({ success: true }),
        }),
        batch: async () => [],
        exec: async () => ({ count: 1 }),
      };

      const ineProvider = new INEProvider({ db: mockDb });
      const income = await ineProvider.getIncomeByCensusSection('2807901001');

      expect(income.censusSectionCode).toBe('2807901001');
      expect(income.averageNetHouseholdIncomeEur).toBe(48500.5);
      expect(income.percentileInMunicipality).toBe(85.0);
      expect(income.rankingInCity.rank).toBe(150);
      expect(income.demographics.medianAge).toBe(43.5);
    });
  });

  describe('Cloudflare R2 Storage Tiles Route', () => {
    it('returns 503 Problem Details when TILES_BUCKET binding is missing', async () => {
      const app = buildApp({ providers: createProviders({ useMocks: true }) });
      const res = await app.request('/api/v1/tiles/census_tracts.pmtiles');

      expect(res.status).toBe(503);
      const problem = await res.json();
      expect(problem.type).toBe('https://openbarrio.org/errors/tiles-bucket-not-configured');
    });

    it('streams PMTiles when TILES_BUCKET binding is provided', async () => {
      const mockBucket: R2Bucket = {
        get: async (key: string) => {
          if (key === 'census_tracts.pmtiles') {
            return {
              body: new ReadableStream(),
              arrayBuffer: async () => new ArrayBuffer(8),
              text: async () => 'pmtiles-binary',
              json: async () => ({}),
              blob: async () => new Blob(),
              httpEtag: '"mock-etag"',
              size: 1024,
            };
          }
          return null;
        },
        put: async () => ({}),
        delete: async () => {},
      };

      const app = new Hono<{ Bindings: { TILES_BUCKET: R2Bucket } }>();
      app.use('*', async (c, next) => {
        c.env = { TILES_BUCKET: mockBucket };
        await next();
      });
      const { createTilesRoutes } = await import('../../src/routes/tiles.routes.js');
      app.route('/api/v1/tiles', createTilesRoutes() as any);

      const res = await app.request('/api/v1/tiles/census_tracts.pmtiles');
      expect(res.status).toBe(200);
      expect(res.headers.get('content-type')).toBe('application/vnd.pmtiles');
      expect(res.headers.get('cache-control')).toContain('immutable');
      expect(res.headers.get('etag')).toBe('"mock-etag"');
    });
  });
});
