import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { Hono } from 'hono';
import { buildApp } from '../../src/app.js';
import { createProviders } from '../../src/providers/index.js';
import { resetRateLimiter } from '../../src/middleware/rate-limit.middleware.js';
import { clearEdgeMemoryCache } from '../../src/middleware/cache.middleware.js';

describe('Hono Audit Routes Integration', () => {
  let app: Hono;

  beforeAll(() => {
    // Explicitly use mock providers for isolated deterministic integration testing
    const providers = createProviders({ useMocks: true });
    app = buildApp({ providers }) as any;
  });

  beforeEach(() => {
    resetRateLimiter();
    clearEdgeMemoryCache();
  });

  describe('GET /health', () => {
    it('returns 200 OK with health status', async () => {
      const response = await app.request('/health');

      expect(response.status).toBe(200);
      const json = await response.json();
      expect(json.status).toBe('ok');
      expect(json.service).toBe('openbarrio-api');
    });
  });

  describe('GET /docs/json', () => {
    it('serves OpenAPI 3.0 specification exposing audit endpoints and schemas', async () => {
      const response = await app.request('/docs/json');

      expect(response.status).toBe(200);
      const openapi = await response.json();
      expect(openapi.openapi).toMatch(/^3\./);
      expect(openapi.paths['/api/v1/audit/coords']).toBeDefined();
      expect(openapi.paths['/api/v1/audit/refcat/{refcat}']).toBeDefined();
    });
  });

  describe('GET /api/v1/audit/coords', () => {
    it('returns 200 with complete due diligence audit report for valid coordinates', async () => {
      const response = await app.request('/api/v1/audit/coords?lat=40.42028&lon=-3.70379');

      expect(response.status).toBe(200);
      const report = await response.json();

      expect(report.id).toBeDefined();
      expect(report.generatedAt).toBeDefined();
      expect(report.property.cadastralReference).toBe('9872023VH5797S0001WX');
      expect(report.property.address.municipality).toBe('Madrid');
      expect(report.neighborhood.censusSectionCode).toBe('2807901001');
      expect(report.neighborhood.averageNetHouseholdIncomeEur).toBeGreaterThan(0);
      expect(report.environment.noise).toBeDefined();
      expect(report.environment.noise.dayEveningNightDecibels).toBeGreaterThan(0);
      expect(report.environment.floodRisk).toBeDefined();
      expect(report.environment.floodRisk.level).toBeDefined();
      expect(report.rentalBenchmark).toBeDefined();
      expect(report.rentalBenchmark.officialRangeLowerEurM2).toBeGreaterThan(0);
      expect(report.rentalBenchmark.officialRangeUpperEurM2).toBeGreaterThan(
        report.rentalBenchmark.officialRangeLowerEurM2
      );
      expect(report.rentalBenchmark.isStressedHousingZone).toBe(false);
      expect(report.score.overallScore).toBeGreaterThanOrEqual(0);
      expect(report.score.overallScore).toBeLessThanOrEqual(100);
      expect(report.score.keyHighlights.length).toBeGreaterThan(0);
    });

    it('returns 400 Bad Request with RFC 7807 Problem Details on invalid coordinates query', async () => {
      const response = await app.request('/api/v1/audit/coords?lat=999&lon=-3.70379');

      expect(response.status).toBe(400);
      expect(response.headers.get('content-type')).toContain('application/problem+json');

      const problem = await response.json();
      expect(problem.type).toBe('https://openbarrio.org/errors/invalid-parameters');
      expect(problem.title).toBe('Invalid Request Parameters');
      expect(problem.status).toBe(400);
      expect(problem.instance).toBe('/api/v1/audit/coords?lat=999&lon=-3.70379');
      expect(problem.invalidParams).toBeDefined();
    });

    it('returns 404 Not Found with RFC 7807 when coordinates do not match any property', async () => {
      const response = await app.request('/api/v1/audit/coords?lat=0&lon=0');

      expect(response.status).toBe(404);
      expect(response.headers.get('content-type')).toContain('application/problem+json');

      const problem = await response.json();
      expect(problem.type).toBe('https://openbarrio.org/errors/cadastral-not-found');
      expect(problem.status).toBe(404);
    });
  });

  describe('GET /api/v1/audit/refcat/:refcat', () => {
    it('returns 200 with complete report for existing cadastral reference', async () => {
      const response = await app.request('/api/v1/audit/refcat/9872023VH5797S0001WX');

      expect(response.status).toBe(200);
      const report = await response.json();

      expect(report.property.cadastralReference).toBe('9872023VH5797S0001WX');
      expect(report.property.building.constructionYear).toBe(1924);
      expect(report.rentalBenchmark).toBeDefined();
      expect(report.rentalBenchmark.estimatedMonthlyRentLowerEur).toBeGreaterThan(0);
      expect(report.rentalBenchmark.estimatedMonthlyRentUpperEur).toBeGreaterThan(
        report.rentalBenchmark.estimatedMonthlyRentLowerEur
      );
      expect(report.environment.floodRisk.level).toBeDefined();
      expect(report.environment.noise.category).toBeDefined();
      expect(report.score.overallScore).toBeGreaterThanOrEqual(0);
    });

    it('returns 200 with complete report when refcat contains spaces or hyphens', async () => {
      const response = await app.request('/api/v1/audit/refcat/9872023%20VH5797S%200001%20WX');

      expect(response.status).toBe(200);
      const report = await response.json();
      expect(report.property.cadastralReference).toBe('9872023VH5797S0001WX');
    });

    it('returns 404 Not Found with RFC 7807 for non-existent cadastral reference', async () => {
      const response = await app.request('/api/v1/audit/refcat/00000000000000');

      expect(response.status).toBe(404);
      expect(response.headers.get('content-type')).toContain('application/problem+json');

      const problem = await response.json();
      expect(problem.type).toBe('https://openbarrio.org/errors/cadastral-not-found');
      expect(problem.status).toBe(404);
      expect(problem.detail).toContain('00000000000000');
    });

    it('returns 400 Bad Request with RFC 7807 when refcat violates format schema', async () => {
      const response = await app.request('/api/v1/audit/refcat/invalid-chars!');

      expect(response.status).toBe(400);
      expect(response.headers.get('content-type')).toContain('application/problem+json');

      const problem = await response.json();
      expect(problem.type).toBe('https://openbarrio.org/errors/invalid-parameters');
      expect(problem.status).toBe(400);
    });
  });

  describe('GET /api/v1/tiles/miteco', () => {
    it('returns image/png with CORS for MITECO noise proxy endpoint', async () => {
      const response = await app.request('/api/v1/tiles/miteco/noise?bbox=-412554,4926988,-412054,4927488&width=256&height=256');

      expect(response.status).toBe(200);
      expect(response.headers.get('content-type')).toContain('image/png');
      expect(response.headers.get('access-control-allow-origin')).toBe('*');
    });

    it('returns image/png with CORS for MITECO flood proxy endpoint', async () => {
      const response = await app.request('/api/v1/tiles/miteco/flood?bbox=-412554,4926988,-412054,4927488&width=256&height=256');

      expect(response.status).toBe(200);
      expect(response.headers.get('content-type')).toContain('image/png');
      expect(response.headers.get('access-control-allow-origin')).toBe('*');
    });

    it('returns image/png with CORS for INE income ADRH proxy endpoint', async () => {
      const response = await app.request('/api/v1/tiles/ine/income?bbox=-412554,4926988,-412054,4927488&width=256&height=256');

      expect(response.status).toBe(200);
      expect(response.headers.get('content-type')).toContain('image/png');
      expect(response.headers.get('access-control-allow-origin')).toBe('*');
    });
  });
});
