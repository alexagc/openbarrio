import fs from 'node:fs';
import path from 'node:path';
import { Readable } from 'node:stream';
import { Hono } from 'hono';
import type { CloudflareEnv } from '../types/env.js';

function findLocalTileFile(filename: string): string | null {
  const candidates = [
    process.env.TILES_DIR ? path.join(process.env.TILES_DIR, filename) : null,
    path.resolve(process.cwd(), 'packages/etl/dist/openbarrio-etl-dist', filename),
    path.resolve(process.cwd(), '../../packages/etl/dist/openbarrio-etl-dist', filename),
    path.resolve(process.cwd(), 'packages/etl/dist', filename),
    path.resolve(process.cwd(), '../../packages/etl/dist', filename),
    path.resolve(process.cwd(), 'data', filename),
    path.resolve(process.cwd(), '../../data', filename),
    `/workspace/packages/etl/dist/openbarrio-etl-dist/${filename}`,
    `/workspace/packages/etl/dist/${filename}`,
    `/workspace/data/${filename}`,
  ].filter(Boolean) as string[];

  for (const candidate of candidates) {
    try {
      if (fs.existsSync(candidate)) {
        return candidate;
      }
    } catch {
      // Ignore
    }
  }
  return null;
}

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

    const upstream = `https://gis.miteco.gob.es/geoserver/evaluacionambiental/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=TRUE&LAYERS=mer_carretera_lden,mer_aglomeracion_lden,mer_ferrocarril_lden,mer_aeropuerto_lden&CRS=EPSG:3857&WIDTH=${encodeURIComponent(width)}&HEIGHT=${encodeURIComponent(height)}&BBOX=${encodeURIComponent(bbox)}`;

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 10000);
      const res = await fetch(upstream, {
        signal: controller.signal,
        headers: { 'User-Agent': 'OpenBarrio-DueDiligence/0.1' },
        ...({ cf: { cacheTtl: 2592000, cacheEverything: true } } as any),
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

    const upstream = `https://gis.miteco.gob.es/geoserver/agua/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=TRUE&LAYERS=Zi_laminas_q10,Zi_laminas_q50,Zi_laminas_q100,Zi_laminas_q500,ZI_Laminas_ZFP&CRS=EPSG:3857&WIDTH=${encodeURIComponent(width)}&HEIGHT=${encodeURIComponent(height)}&BBOX=${encodeURIComponent(bbox)}`;

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 10000);
      const res = await fetch(upstream, {
        signal: controller.signal,
        headers: { 'User-Agent': 'OpenBarrio-DueDiligence/0.1' },
        ...({ cf: { cacheTtl: 2592000, cacheEverything: true } } as any),
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

  // GET /tiles/ine/income?bbox=...&width=256&height=256
  router.get('/ine/income', async (c) => {
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

    const upstream = `https://www.ine.es/servergis/rest/services/ws/ADRH_renta_media_por_hogar/MapServer/export?bbox=${encodeURIComponent(bbox)}&size=${encodeURIComponent(width)},${encodeURIComponent(height)}&f=image&transparent=true&bboxSR=3857&imageSR=3857`;

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 10000);
      const res = await fetch(upstream, {
        signal: controller.signal,
        headers: { 'User-Agent': 'OpenBarrio-DueDiligence/0.1' },
        ...({ cf: { cacheTtl: 2592000, cacheEverything: true } } as any),
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

  // GET /tiles/:filename (e.g. census_tracts.pmtiles, floods.pmtiles, noise.pmtiles)
  // Supports RFC 7233 HTTP Range 206 Partial Content for PMTiles byte-range streaming
  router.get('/:filename', async (c) => {
    const filename = c.req.param('filename');

    const rangeHeader = c.req.header('range');
    let rangeOption: { offset?: number; length?: number; suffix?: number } | undefined;
    let requestedStart: number | undefined;
    let requestedEnd: number | undefined;

    if (rangeHeader && rangeHeader.startsWith('bytes=')) {
      const parts = rangeHeader.slice(6).split('-');
      if (parts.length === 2) {
        if (parts[0] !== '' && parts[1] !== '') {
          requestedStart = parseInt(parts[0], 10);
          requestedEnd = parseInt(parts[1], 10);
          if (!isNaN(requestedStart) && !isNaN(requestedEnd) && requestedEnd >= requestedStart) {
            rangeOption = { offset: requestedStart, length: requestedEnd - requestedStart + 1 };
          }
        } else if (parts[0] !== '' && parts[1] === '') {
          requestedStart = parseInt(parts[0], 10);
          if (!isNaN(requestedStart)) {
            rangeOption = { offset: requestedStart };
          }
        } else if (parts[0] === '' && parts[1] !== '') {
          const suffix = parseInt(parts[1], 10);
          if (!isNaN(suffix)) {
            rangeOption = { suffix };
          }
        }
      }
    }

    const contentType = filename.endsWith('.pmtiles')
      ? 'application/vnd.pmtiles'
      : filename.endsWith('.json') || filename.endsWith('.geojson')
      ? 'application/geo+json'
      : 'application/octet-stream';

    // 1. If Cloudflare R2 is configured, stream from R2
    if (c.env?.TILES_BUCKET) {
      try {
        const object = rangeOption
          ? await c.env.TILES_BUCKET.get(filename, { range: rangeOption })
          : await c.env.TILES_BUCKET.get(filename);

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
        headers.set('Content-Type', contentType);
        headers.set('Cache-Control', 'public, max-age=7776000, immutable');
        headers.set('Accept-Ranges', 'bytes');
        headers.set('Access-Control-Allow-Origin', '*');

        if (object.httpEtag) {
          headers.set('ETag', object.httpEtag);
        }

        if (rangeHeader && rangeOption) {
          const totalSize = (object as any).size ?? 0;
          let start = requestedStart ?? 0;
          let end = requestedEnd ?? (totalSize > 0 ? totalSize - 1 : 0);
          if ((object as any).range) {
            start = (object as any).range.offset ?? start;
            const len = (object as any).range.length ?? (end - start + 1);
            end = start + len - 1;
          } else if (rangeOption.length) {
            end = start + rangeOption.length - 1;
          }

          const contentLength = Math.max(0, end - start + 1);
          headers.set('Content-Range', `bytes ${start}-${end}/${totalSize || '*'}`);
          headers.set('Content-Length', String(contentLength));

          return new Response(object.body, {
            status: 206,
            headers,
          });
        }

        if ((object as any).size !== undefined) {
          headers.set('Content-Length', String((object as any).size));
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
    }

    // 2. Local filesystem fallback for development / containerized environments
    const localFilePath = findLocalTileFile(filename);
    if (localFilePath) {
      try {
        const stat = await fs.promises.stat(localFilePath);
        const totalSize = stat.size;

        const headers = new Headers();
        headers.set('Content-Type', contentType);
        headers.set('Cache-Control', 'public, max-age=7776000, immutable');
        headers.set('Accept-Ranges', 'bytes');
        headers.set('Access-Control-Allow-Origin', '*');

        if (rangeHeader && rangeHeader.startsWith('bytes=')) {
          let start = requestedStart ?? 0;
          let end = requestedEnd ?? (totalSize > 0 ? totalSize - 1 : 0);
          if (rangeOption?.suffix) {
            start = Math.max(0, totalSize - rangeOption.suffix);
            end = totalSize - 1;
          }

          if (isNaN(start) || isNaN(end) || start > end || start >= totalSize) {
            return new Response(null, {
              status: 416,
              headers: {
                'Content-Range': `bytes */${totalSize}`,
                'Access-Control-Allow-Origin': '*',
              },
            });
          }

          end = Math.min(end, totalSize - 1);
          const contentLength = Math.max(0, end - start + 1);

          const fd = await fs.promises.open(localFilePath, 'r');
          const buffer = Buffer.alloc(contentLength);
          await fd.read(buffer, 0, contentLength, start);
          await fd.close();

          headers.set('Content-Range', `bytes ${start}-${end}/${totalSize}`);
          headers.set('Content-Length', String(contentLength));

          return new Response(buffer, {
            status: 206,
            headers,
          });
        }

        headers.set('Content-Length', String(totalSize));
        const stream = fs.createReadStream(localFilePath);
        const webStream = Readable.toWeb(stream);

        return new Response(webStream as any, {
          status: 200,
          headers,
        });
      } catch (err: any) {
        return c.json(
          {
            type: 'https://openbarrio.org/errors/local-tile-error',
            title: 'Local Tile File Read Error',
            status: 500,
            detail: `Failed reading local tile '${filename}': ${err?.message || 'IO error'}`,
            instance: c.req.path,
          },
          500,
          { 'content-type': 'application/problem+json' }
        );
      }
    }

    return c.json(
      {
        type: 'https://openbarrio.org/errors/tiles-bucket-not-configured',
        title: 'Tiles Storage Not Configured',
        status: 503,
        detail: `Cloudflare R2 storage binding (TILES_BUCKET) is not available and tile '${filename}' was not found locally`,
        instance: c.req.path,
      },
      503,
      { 'content-type': 'application/problem+json' }
    );
  });

  return router;
}
