import { Hono } from 'hono';
import type { CloudflareEnv } from '../types/env.js';

const TRANSPARENT_PNG = new Uint8Array([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
  0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
  0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00,
  0x0a, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x60, 0x00, 0x00, 0x00,
  0x02, 0x00, 0x01, 0xe2, 0x21, 0xbc, 0x33, 0x00, 0x00, 0x00, 0x00, 0x49,
  0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
]);

export function createTilesRoutes(): Hono<{ Bindings: CloudflareEnv }> {
  const router = new Hono<{ Bindings: CloudflareEnv }>();

  // GET /tiles/miteco/noise?bbox=...&width=256&height=256
  router.get('/miteco/noise', async (c) => {
    const bbox = c.req.query('bbox');
    const width = c.req.query('width') || '256';
    const height = c.req.query('height') || '256';

    if (!bbox) {
      return new Response(TRANSPARENT_PNG, {
        status: 200,
        headers: {
          'Content-Type': 'image/png',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const upstream = `https://gis.miteco.gob.es/geoserver/evaluacionambiental/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=TRUE&LAYERS=mer_carretera_lden,mer_aglomeracion_lden,mer_ferrocarril_lden,mer_aeropuerto_lden&STYLES=&CRS=EPSG:3857&WIDTH=${encodeURIComponent(width)}&HEIGHT=${encodeURIComponent(height)}&BBOX=${encodeURIComponent(bbox)}`;

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(upstream, {
        signal: controller.signal,
        headers: { 'User-Agent': 'OpenBarrio-DueDiligence/0.1' },
      });
      clearTimeout(timer);

      if (res.ok) {
        const body = await res.arrayBuffer();
        return new Response(body, {
          status: 200,
          headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=604800, s-maxage=2592000',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
    } catch {
      // Fall through to transparent tile
    }

    return new Response(TRANSPARENT_PNG, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    });
  });

  // GET /tiles/miteco/flood?bbox=...&width=256&height=256
  router.get('/miteco/flood', async (c) => {
    const bbox = c.req.query('bbox');
    const width = c.req.query('width') || '256';
    const height = c.req.query('height') || '256';

    if (!bbox) {
      return new Response(TRANSPARENT_PNG, {
        status: 200,
        headers: {
          'Content-Type': 'image/png',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const upstream = `https://gis.miteco.gob.es/geoserver/agua/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=TRUE&LAYERS=Zi_laminas_q100,Zi_laminas_q500,ZI_Laminas_ZFP&STYLES=&CRS=EPSG:3857&WIDTH=${encodeURIComponent(width)}&HEIGHT=${encodeURIComponent(height)}&BBOX=${encodeURIComponent(bbox)}`;

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(upstream, {
        signal: controller.signal,
        headers: { 'User-Agent': 'OpenBarrio-DueDiligence/0.1' },
      });
      clearTimeout(timer);

      if (res.ok) {
        const body = await res.arrayBuffer();
        return new Response(body, {
          status: 200,
          headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=604800, s-maxage=2592000',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
    } catch {
      // Fall through to transparent tile
    }

    return new Response(TRANSPARENT_PNG, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    });
  });

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
