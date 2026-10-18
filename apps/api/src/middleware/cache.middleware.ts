import type { Context, MiddlewareHandler } from 'hono';

export interface EdgeCacheOptions {
  ttlSeconds?: number;
  enabled?: boolean;
}

interface MemoryCacheItem {
  body: string;
  headers: [string, string][];
  status: number;
  expiresAt: number;
}

// In-memory cache fallback for Node.js environments and automated integration tests
const memoryCache = new Map<string, MemoryCacheItem>();

/**
 * Clears the in-memory edge cache fallback (used in testing).
 */
export function clearEdgeMemoryCache(): void {
  memoryCache.clear();
}

/**
 * Cloudflare Cache API & Edge Caching middleware.
 * Caches official public cadastral, INE, and environmental audits for 90 days (7,776,000s)
 * at the edge network with diagnostic headers.
 */
export function edgeCacheMiddleware(options: EdgeCacheOptions = {}): MiddlewareHandler {
  const ttlSeconds = options.ttlSeconds ?? 7_776_000; // 90 days TTL
  const enabled = options.enabled ?? true;

  return async (c: Context, next) => {
    if (!enabled || c.req.method !== 'GET') {
      return next();
    }

    const path = c.req.path;
    // Only cache versioned data endpoints, bypass health and swagger docs
    if (path === '/health' || path.startsWith('/docs')) {
      return next();
    }

    // Bypass if client explicitly requests bypass
    const clientCacheControl = c.req.header('cache-control');
    if (clientCacheControl?.includes('no-cache') || clientCacheControl?.includes('no-store')) {
      await next();
      c.header('X-OpenBarrio-Cache', 'BYPASS');
      return;
    }

    const cacheKeyUrl = c.req.url;
    const cacheKey = new Request(cacheKeyUrl, { method: 'GET' });

    // 1. Try Cloudflare native Cache API (available in Cloudflare Workers)
    const cfCache = (globalThis as any).caches?.default;
    if (cfCache) {
      try {
        const cachedResponse = await cfCache.match(cacheKey);
        if (cachedResponse) {
          const hitResponse = new Response(cachedResponse.body, cachedResponse);
          hitResponse.headers.set('X-OpenBarrio-Cache', 'HIT');
          return hitResponse;
        }
      } catch (err: any) {
        console.warn('[CacheMiddleware] Cloudflare Cache API match warning:', err?.message);
      }
    } else {
      // 2. Fallback to in-memory cache in Node.js / test execution
      const memoryItem = memoryCache.get(cacheKeyUrl);
      if (memoryItem && memoryItem.expiresAt > Date.now()) {
        const headers = new Headers(memoryItem.headers);
        headers.set('X-OpenBarrio-Cache', 'HIT');
        return new Response(memoryItem.body, {
          status: memoryItem.status,
          headers,
        });
      }
    }

    // Cache MISS: Proceed with upstream execution
    await next();

    // Cache only successful responses
    if (c.res.status === 200) {
      const cacheControlHeader = `public, max-age=${ttlSeconds}, s-maxage=${ttlSeconds}, stale-while-revalidate=86400`;
      c.header('Cache-Control', cacheControlHeader);
      c.header('X-OpenBarrio-Cache', 'MISS');

      if (cfCache) {
        try {
          const resToCache = c.res.clone();
          if (c.executionCtx && typeof c.executionCtx.waitUntil === 'function') {
            c.executionCtx.waitUntil(cfCache.put(cacheKey, resToCache));
          } else {
            await cfCache.put(cacheKey, resToCache);
          }
        } catch (err: any) {
          console.warn('[CacheMiddleware] Cloudflare Cache API put warning:', err?.message);
        }
      } else {
        // Save to in-memory fallback
        try {
          const cloned = c.res.clone();
          const bodyText = await cloned.text();
          const headersList: [string, string][] = [];
          cloned.headers.forEach((val, key) => {
            headersList.push([key, val]);
          });
          // Also include the newly set cache headers
          headersList.push(['cache-control', cacheControlHeader]);
          headersList.push(['x-openbarrio-cache', 'MISS']);

          memoryCache.set(cacheKeyUrl, {
            body: bodyText,
            headers: headersList,
            status: cloned.status,
            expiresAt: Date.now() + ttlSeconds * 1000,
          });
        } catch {
          // Non-blocking in-memory cache error
        }
      }
    } else {
      c.header('X-OpenBarrio-Cache', 'MISS');
    }
  };
}
