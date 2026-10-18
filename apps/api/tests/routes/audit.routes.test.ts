import { describe, it, expect, beforeAll } from 'vitest';
import { FastifyInstance } from 'fastify';
import { buildApp } from '../../src/app.js';
import { createProviders } from '../../src/providers/index.js';

describe('Fastify Audit Routes Integration', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    // Explicitly use mock providers for isolated deterministic integration testing
    const providers = createProviders({ useMocks: true });
    app = await buildApp({ providers, logger: false });
    await app.ready();
  });

  describe('GET /health', () => {
    it('returns 200 OK with health status', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/health',
      });

      expect(response.statusCode).toBe(200);
      const json = response.json();
      expect(json.status).toBe('ok');
      expect(json.service).toBe('openbarrio-api');
    });
  });

  describe('GET /docs/json', () => {
    it('serves OpenAPI 3.0 specification exposing audit endpoints and schemas', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/docs/json',
      });

      expect(response.statusCode).toBe(200);
      const openapi = response.json();
      expect(openapi.openapi).toMatch(/^3\./);
      expect(openapi.paths['/api/v1/audit/coords']).toBeDefined();
      expect(openapi.paths['/api/v1/audit/refcat/{refcat}']).toBeDefined();
    });
  });

  describe('GET /api/v1/audit/coords', () => {
    it('returns 200 with complete due diligence audit report for valid coordinates', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/audit/coords?lat=40.42028&lon=-3.70379',
      });

      expect(response.statusCode).toBe(200);
      const report = response.json();

      expect(report.id).toBeDefined();
      expect(report.generatedAt).toBeDefined();
      expect(report.property.cadastralReference).toBe('9872023VH5797S0001WX');
      expect(report.property.address.municipality).toBe('Madrid');
      expect(report.neighborhood.censusSectionCode).toBe('2807901001');
      expect(report.neighborhood.averageNetHouseholdIncomeEur).toBeGreaterThan(0);
      expect(report.environment.noise).toBeDefined();
      expect(report.score.overallScore).toBeGreaterThanOrEqual(0);
      expect(report.score.overallScore).toBeLessThanOrEqual(100);
      expect(report.score.keyHighlights.length).toBeGreaterThan(0);
    });

    it('returns 400 Bad Request with RFC 7807 Problem Details on invalid coordinates query', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/audit/coords?lat=999&lon=-3.70379', // Invalid latitude > 90
      });

      expect(response.statusCode).toBe(400);
      expect(response.headers['content-type']).toContain('application/problem+json');

      const problem = response.json();
      expect(problem.type).toBe('https://openbarrio.org/errors/invalid-parameters');
      expect(problem.title).toBe('Invalid Request Parameters');
      expect(problem.status).toBe(400);
      expect(problem.instance).toBe('/api/v1/audit/coords?lat=999&lon=-3.70379');
      expect(problem.invalidParams).toBeDefined();
    });

    it('returns 404 Not Found with RFC 7807 when coordinates do not match any property', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/audit/coords?lat=0&lon=0',
      });

      expect(response.statusCode).toBe(404);
      expect(response.headers['content-type']).toContain('application/problem+json');

      const problem = response.json();
      expect(problem.type).toBe('https://openbarrio.org/errors/cadastral-not-found');
      expect(problem.status).toBe(404);
    });
  });

  describe('GET /api/v1/audit/refcat/:refcat', () => {
    it('returns 200 with complete report for existing cadastral reference', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/audit/refcat/9872023VH5797S0001WX',
      });

      expect(response.statusCode).toBe(200);
      const report = response.json();

      expect(report.property.cadastralReference).toBe('9872023VH5797S0001WX');
      expect(report.property.building.constructionYear).toBe(1924);
      expect(report.score.overallScore).toBeGreaterThanOrEqual(0);
    });

    it('returns 404 Not Found with RFC 7807 for non-existent cadastral reference', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/audit/refcat/00000000000000',
      });

      expect(response.statusCode).toBe(404);
      expect(response.headers['content-type']).toContain('application/problem+json');

      const problem = response.json();
      expect(problem.type).toBe('https://openbarrio.org/errors/cadastral-not-found');
      expect(problem.status).toBe(404);
      expect(problem.detail).toContain('00000000000000');
    });

    it('returns 400 Bad Request with RFC 7807 when refcat violates format schema', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/audit/refcat/invalid-chars!',
      });

      expect(response.statusCode).toBe(400);
      expect(response.headers['content-type']).toContain('application/problem+json');

      const problem = response.json();
      expect(problem.type).toBe('https://openbarrio.org/errors/invalid-parameters');
      expect(problem.status).toBe(400);
    });
  });
});
