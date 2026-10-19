import type { Context, MiddlewareHandler } from 'hono';
import { RateLimitExceededError } from '../errors/problem-details.js';

export interface RateLimitOptions {
  limit?: number;
  windowMs?: number;
  enabled?: boolean;
  skip?: (c: Context) => boolean;
}

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// In-memory rate limiting store for edge isolate / runtime
const rateLimitStore = new Map<string, RateLimitRecord>();

/**
 * Resets the in-memory rate limit store (used in automated testing).
 */
export function resetRateLimiter(): void {
  rateLimitStore.clear();
}

/**
 * Resolves the client IP identifier from Cloudflare or standard proxy headers.
 */
function resolveClientIp(c: Context): string {
  const cfIp = c.req.header('cf-connecting-ip');
  if (cfIp) return cfIp.trim();

  const realIp = c.req.header('x-real-ip');
  if (realIp) return realIp.trim();

  const forwardedFor = c.req.header('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  return '127.0.0.1';
}

/**
 * Prunes expired entries from the store to prevent memory leaks in long-lived processes.
 */
function pruneExpiredEntries(now: number): void {
  for (const [key, record] of rateLimitStore.entries()) {
    if (now >= record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Edge Rate Limiting middleware protecting upstream Spanish public services
 * from request flooding and abuse.
 */
export function rateLimitMiddleware(options: RateLimitOptions = {}): MiddlewareHandler {
  const limit = options.limit ?? 60; // 60 requests
  const windowMs = options.windowMs ?? 60_000; // 1 minute
  const enabled = options.enabled ?? true;

  return async (c, next) => {
    if (!enabled) {
      return next();
    }

    // Skip preflight OPTIONS and diagnostic documentation/health endpoints
    if (c.req.method === 'OPTIONS') {
      return next();
    }

    const path = c.req.path;
    if (path === '/health' || path.startsWith('/docs') || path.includes('/tiles/')) {
      return next();
    }

    if (options.skip && options.skip(c)) {
      return next();
    }

    const now = Date.now();
    if (rateLimitStore.size > 5000) {
      pruneExpiredEntries(now);
    }

    const clientIp = resolveClientIp(c);
    const key = `${clientIp}:${Math.floor(now / windowMs)}`;
    let record = rateLimitStore.get(key);

    if (!record || now >= record.resetTime) {
      record = {
        count: 1,
        resetTime: now + windowMs,
      };
      rateLimitStore.set(key, record);
    } else {
      record.count += 1;
    }

    const remaining = Math.max(0, limit - record.count);
    const resetSeconds = Math.ceil(record.resetTime / 1000);

    c.header('RateLimit-Limit', String(limit));
    c.header('RateLimit-Remaining', String(remaining));
    c.header('RateLimit-Reset', String(resetSeconds));

    if (record.count > limit) {
      const retryAfterSeconds = Math.max(1, Math.ceil((record.resetTime - now) / 1000));
      c.header('Retry-After', String(retryAfterSeconds));

      let instance: string;
      try {
        const url = new URL(c.req.url);
        instance = url.pathname + url.search;
      } catch {
        instance = path;
      }

      throw new RateLimitExceededError(retryAfterSeconds, instance);
    }

    await next();
  };
}
