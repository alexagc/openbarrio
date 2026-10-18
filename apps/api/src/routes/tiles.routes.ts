import { Hono } from 'hono';
import type { CloudflareEnv } from '../types/env.js';

export function createTilesRoutes(): Hono<{ Bindings: CloudflareEnv }> {
  const router = new Hono<{ Bindings: CloudflareEnv }>();

  // GET /tiles/:filename (e.g. census_tracts.pmtiles)
  router.get('/:filename', async (c) => {
    const filename = c.req.param('filename');

    if (!c.env?.TILES_BUCKET) {
      return c.json(
        {
          type: 'https://openbarrio.org/errors/tiles-bucket-not-configured',
          title: 'Tiles Storage Not Configured',
          status: 503,
          detail: 'Cloudflare R2 storage binding (TILES_BUCKET) is not available in current environment',
          instance: c.req.path,
        },
        503,
        { 'content-type': 'application/problem+json' }
      );
    }

    try {
      const object = await c.env.TILES_BUCKET.get(filename);

      if (!object) {
        return c.json(
          {
            type: 'https://openbarrio.org/errors/tile-not-found',
            title: 'Tile Resource Not Found',
            status: 404,
            detail: `The requested tile resource '${filename}' was not found in Cloudflare R2`,
            instance: c.req.path,
          },
          404,
          { 'content-type': 'application/problem+json' }
        );
      }

      const headers = new Headers();
      headers.set(
        'Content-Type',
        filename.endsWith('.pmtiles')
          ? 'application/vnd.pmtiles'
          : filename.endsWith('.json') || filename.endsWith('.geojson')
          ? 'application/geo+json'
          : 'application/octet-stream'
      );
      headers.set('Cache-Control', 'public, max-age=7776000, immutable');
      if (object.httpEtag) {
        headers.set('ETag', object.httpEtag);
      }

      return new Response(object.body, {
        status: 200,
        headers,
      });
    } catch (err: any) {
      return c.json(
        {
          type: 'https://openbarrio.org/errors/r2-fetch-error',
          title: 'Tile Retrieval Error',
          status: 502,
          detail: `Failed reading tile '${filename}' from Cloudflare R2: ${err?.message || 'Storage error'}`,
          instance: c.req.path,
        },
        502,
        { 'content-type': 'application/problem+json' }
      );
    }
  });

  return router;
}
