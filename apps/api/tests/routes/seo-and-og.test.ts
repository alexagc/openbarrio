import { describe, it, expect, beforeEach } from 'vitest';
import { Hono } from 'hono';
import { createV1Routes } from '../../src/routes/index.js';
import { createMockProviders, ProviderContainer } from '../../src/providers/index.js';

describe('Phase 21: Programmatic SEO & OpenGraph Routes Integration', () => {
  let app: Hono;
  let providers: ProviderContainer;

  beforeEach(() => {
    providers = createMockProviders();
    app = new Hono();
    app.route('/api/v1', createV1Routes(providers));
  });

  describe('GET /api/v1/municipalities', () => {
    it('returns list of Spanish municipalities with pagination and cache headers', async () => {
      const res = await app.request('/api/v1/municipalities?limit=5');
      expect(res.status).toBe(200);
      expect(res.headers.get('Cache-Control')).toContain('max-age=86400');

      const json = await res.json();
      expect(json.items).toBeDefined();
      expect(json.items.length).toBe(5);
      expect(json.total).toBeGreaterThan(10);
      expect(json.items[0]).toHaveProperty('code');
      expect(json.items[0]).toHaveProperty('slug');
      expect(json.items[0]).toHaveProperty('averageHouseholdIncomeEur');
    });

    it('filters municipalities by query parameter', async () => {
      const res = await app.request('/api/v1/municipalities?q=Madrid');
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.items.length).toBeGreaterThan(0);
      expect(json.items[0].name).toBe('Madrid');
      expect(json.items[0].code).toBe('28079');
    });
  });

  describe('GET /api/v1/municipalities/:slugOrCode', () => {
    it('returns rich profile for a municipality by slug', async () => {
      const res = await app.request('/api/v1/municipalities/barcelona');
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.name).toBe('Barcelona');
      expect(json.code).toBe('08019');
      expect(json.isStressedMarket).toBe(true);
      expect(json.itpGeneralRatePct).toBe(10);
      expect(json.serpaviMedianEurM2).toBeGreaterThan(0);
    });

    it('returns rich profile for a municipality by INE code', async () => {
      const res = await app.request('/api/v1/municipalities/28079');
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.name).toBe('Madrid');
      expect(json.radonZone).toBe('Zona I');
    });
  });

  describe('GET /api/v1/og/municipio/:slug', () => {
    it('generates a 1200x630 dynamic SVG image with cache headers', async () => {
      const res = await app.request('/api/v1/og/municipio/madrid');
      expect(res.status).toBe(200);
      expect(res.headers.get('Content-Type')).toContain('image/svg+xml');
      expect(res.headers.get('Cache-Control')).toContain('max-age=604800');

      const svg = await res.text();
      expect(svg).toContain('<svg');
      expect(svg).toContain('Madrid');
      expect(svg).toContain('OPENBARRIO');
      expect(svg).toContain('BARRIOSCORE');
    });
  });

  describe('GET /api/v1/og/tool/:tool', () => {
    it('generates dynamic SVG for micro-tool /comprobar-metros-catastro', async () => {
      const res = await app.request('/api/v1/og/tool/comprobar-metros-catastro');
      expect(res.status).toBe(200);
      expect(res.headers.get('Content-Type')).toContain('image/svg+xml');

      const svg = await res.text();
      expect(svg).toContain('Comprobador de Metros de Catastro');
      expect(svg).toContain('CATASTRO OVC');
    });

    it('generates dynamic SVG for micro-tool /calculadora-alquiler-legal', async () => {
      const res = await app.request('/api/v1/og/tool/calculadora-alquiler-legal');
      expect(res.status).toBe(200);
      const svg = await res.text();
      expect(svg).toContain('Calculadora de Alquiler Legal');
    });
  });

  describe('GET /api/v1/sitemap/sitemap.xml', () => {
    it('generates valid multilingual XML sitemap with hreflang alternates', async () => {
      const res = await app.request('/api/v1/sitemap/sitemap.xml');
      expect(res.status).toBe(200);
      expect(res.headers.get('Content-Type')).toContain('application/xml');

      const xml = await res.text();
      expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
      expect(xml).toContain('xmlns:xhtml="http://www.w3.org/1999/xhtml"');
      expect(xml).toContain('https://openbarrio.org/comprobar-metros-catastro');
      expect(xml).toContain('https://openbarrio.org/check-cadastral-surface');
      expect(xml).toContain('https://openbarrio.org/comprovar-metres-cadastre');
      expect(xml).toContain('<xhtml:link rel="alternate" hreflang="es"');
      expect(xml).toContain('<xhtml:link rel="alternate" hreflang="en"');
      expect(xml).toContain('<xhtml:link rel="alternate" hreflang="ca"');
      expect(xml).toContain('<xhtml:link rel="alternate" hreflang="x-default"');
      expect(xml).toContain('https://openbarrio.org/municipio/madrid');
      expect(xml).toContain('https://openbarrio.org/municipality/madrid');
      expect(xml).toContain('https://openbarrio.org/municipi/madrid');
    });
  });
});
