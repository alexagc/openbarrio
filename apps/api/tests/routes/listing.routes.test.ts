import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { LISTING_MAX_PASTE_BYTES } from '@openbarrio/core';
import { buildApp } from '../../src/app.js';
import { createMockProviders } from '../../src/providers/index.js';
import { resetListingRateLimiter } from '../../src/routes/listing.routes.js';
import { resetRateLimiter } from '../../src/middleware/rate-limit.middleware.js';

describe('POST /api/v1/listing/resolve (Zero-Fetch Allowlist Resolver)', () => {
  const app = buildApp({ providers: createMockProviders() });
  let fetchSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    resetListingRateLimiter();
    resetRateLimiter();
    fetchSpy = vi.spyOn(globalThis, 'fetch');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  async function postResolve(
    body: unknown,
    options: { ip?: string; contentType?: string } = {}
  ) {
    return app.request('/api/v1/listing/resolve', {
      method: 'POST',
      headers: {
        'content-type': options.contentType ?? 'application/json',
        'x-real-ip': options.ip ?? '203.0.113.10',
      },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    });
  }

  it('resolves URLs across all 5 portals, strips query params, and NEVER invokes outbound fetch', async () => {
    const cases = [
      {
        portal: 'idealista',
        url: 'https://www.idealista.com/inmueble/104567890/?utm_source=share#map',
        expectedId: '104567890',
        expectedSanitized: 'https://www.idealista.com/inmueble/104567890',
      },
      {
        portal: 'fotocasa',
        url: 'https://www.fotocasa.es/es/comprar/vivienda/madrid/chamberi/calle-santa-engracia/178945612/d?from=list',
        expectedId: '178945612',
        expectedSanitized:
          'https://www.fotocasa.es/es/comprar/vivienda/madrid/chamberi/calle-santa-engracia/178945612/d',
      },
      {
        portal: 'habitaclia',
        url: 'https://www.habitaclia.com/comprar-piso-en-barcelona-123456.htm?tracking=1',
        expectedId: '123456',
        expectedSanitized: 'https://www.habitaclia.com/comprar-piso-en-barcelona-123456.htm',
      },
      {
        portal: 'pisos',
        url: 'https://www.pisos.com/comprar/piso-chamberi_trafalgar-48912345678_109500/',
        expectedId: '48912345678',
        expectedSanitized: 'https://www.pisos.com/comprar/piso-chamberi_trafalgar-48912345678_109500',
      },
      {
        portal: 'yaencontre',
        url: 'https://www.yaencontre.com/venta/piso/madrid/inmueble-38495-12345678',
        expectedId: '12345678',
        expectedSanitized: 'https://www.yaencontre.com/venta/piso/madrid/inmueble-38495-12345678',
      },
    ];

    for (const c of cases) {
      const res = await postResolve({ url: c.url });
      expect(res.status).toBe(200);
      expect(res.headers.get('cache-control')).toBe('no-store');
      const data = (await res.json()) as any;
      expect(data.portal).toBe(c.portal);
      expect(data.sanitizedUrl).toBe(c.expectedSanitized);
      expect(data.extracted.listingId).toBe(c.expectedId);
      expect(data.extractionMethod).toBe('url_only');
    }

    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('extracts cadastral reference, surface m2, and street from optional pasted snippet in memory', async () => {
    const res = await postResolve({
      url: 'https://www.idealista.com/inmueble/104567890/',
      rawText:
        '<div>Piso en Calle de Santa Engracia 45. 112 m² construidos. Ref. Catastral: 9872023VH5797S0001WX</div>',
    });

    expect(res.status).toBe(200);
    const data = (await res.json()) as any;
    expect(data.extractionMethod).toBe('url_and_pasted_text');
    expect(data.confidence).toBe('high');
    expect(data.extracted.cadastralReference).toBe('9872023VH5797S0001WX');
    expect(data.extracted.surfaceM2).toBe(112);
    expect(data.extracted.streetHint).toContain('Calle de Santa Engracia');
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('rejects > 200 KB pasted text with 413 RFC 7807 Problem Details', async () => {
    const oversized = 'A'.repeat(LISTING_MAX_PASTE_BYTES + 64);
    const res = await postResolve({
      url: 'https://www.idealista.com/inmueble/104567890/',
      rawText: oversized,
    });

    expect(res.status).toBe(413);
    expect(res.headers.get('content-type')).toContain('application/problem+json');
    const problem = (await res.json()) as any;
    expect(problem.type).toContain('listing-payload-too-large');
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('rejects HTTP, IP literals, localhost, credentials, and non-allowlisted hosts with RFC 7807', async () => {
    const badUrls = [
      { url: 'http://www.idealista.com/inmueble/104567890/', expectedStatus: 400 },
      { url: 'https://user:pass@www.idealista.com/inmueble/104567890/', expectedStatus: 400 },
      { url: 'not-a-valid-url', expectedStatus: 400 },
      { url: 'https://127.0.0.1/inmueble/104567890/', expectedStatus: 422 },
      { url: 'https://169.254.169.254/latest/meta-data', expectedStatus: 422 },
      { url: 'https://localhost:3001/inmueble/104567890/', expectedStatus: 422 },
      { url: 'https://evil-idealista.com/inmueble/104567890/', expectedStatus: 422 },
    ];

    for (const c of badUrls) {
      const res = await postResolve({ url: c.url });
      expect(res.status).toBe(c.expectedStatus);
      expect(res.headers.get('content-type')).toContain('application/problem+json');
    }

    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('rejects non-JSON Content-Type with 415 RFC 7807', async () => {
    const res = await postResolve('url=https://www.idealista.com/inmueble/1/', {
      contentType: 'text/plain',
    });
    expect(res.status).toBe(415);
    expect(res.headers.get('content-type')).toContain('application/problem+json');
  });

  it('enforces per-IP 10 req/min rate limit with 429 RFC 7807 and Retry-After header', async () => {
    for (let i = 0; i < 10; i++) {
      const ok = await postResolve(
        { url: `https://www.idealista.com/inmueble/10456789${i}/` },
        { ip: '198.51.100.77' }
      );
      expect(ok.status).toBe(200);
    }

    const blocked = await postResolve(
      { url: 'https://www.idealista.com/inmueble/104567899/' },
      { ip: '198.51.100.77' }
    );
    expect(blocked.status).toBe(429);
    expect(blocked.headers.get('content-type')).toContain('application/problem+json');
    expect(Number(blocked.headers.get('retry-after'))).toBeGreaterThanOrEqual(1);
    const problem = (await blocked.json()) as any;
    expect(problem.type).toContain('rate-limit-exceeded');
  });
});
