import { Hono } from 'hono';
import { IMunicipalityProvider } from '../providers/types.js';
import type { CloudflareEnv } from '../types/env.js';

export function createMunicipalitiesRoutes(
  municipalityProvider: IMunicipalityProvider
): Hono<{ Bindings: CloudflareEnv }> {
  const router = new Hono<{ Bindings: CloudflareEnv }>();

  /**
   * GET /api/v1/municipalities
   * Search or list Spanish municipalities for programmatic directory.
   */
  router.get('/', async (c) => {
    const query = c.req.query('q') || c.req.query('query') || undefined;
    const province = c.req.query('province') || undefined;
    const page = c.req.query('page') ? parseInt(c.req.query('page')!, 10) : 1;
    const limit = c.req.query('limit') ? parseInt(c.req.query('limit')!, 10) : 20;

    const result = await municipalityProvider.listMunicipalities({
      query,
      province,
      page,
      limit,
    });

    c.header('Cache-Control', 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200');
    return c.json(result, 200);
  });

  /**
   * GET /api/v1/municipalities/:slugOrCode
   * Get detailed municipal statistics and civic intelligence.
   */
  router.get('/:slugOrCode', async (c) => {
    const slugOrCode = c.req.param('slugOrCode');
    if (!slugOrCode || slugOrCode.trim().length === 0) {
      return c.json({ error: 'Missing municipality identifier' }, 400);
    }

    try {
      const detail = await municipalityProvider.getBySlugOrCode(slugOrCode);
      c.header('Cache-Control', 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200');
      return c.json(detail, 200);
    } catch {
      return c.json({ error: 'Municipality not found' }, 404);
    }
  });

  return router;
}
