import { Hono } from 'hono';
import { Value } from '@sinclair/typebox/value';
import {
  LISTING_MAX_PASTE_BYTES,
  LISTING_RATE_LIMIT_PER_DAY,
  LISTING_RATE_LIMIT_PER_MIN,
  ListingResolveRequestSchema,
  ListingResolveResponseSchema,
  utf8ByteLength,
} from '@openbarrio/core';
import {
  InvalidParametersError,
  ListingPayloadTooLargeError,
  ListingUrlInvalidError,
  RateLimitExceededError,
  UnsupportedMediaTypeError,
} from '../errors/problem-details.js';
import { resolveListingMetadata } from '../services/listing-resolver.service.js';
import type { CloudflareEnv } from '../types/env.js';

interface CounterBucket {
  count: number;
  resetAt: number;
}

/**
 * Per-isolate in-memory sliding-window rate limiter enforcing 10 req/min and 100 req/day per IP.
 * Best-effort within a Worker isolate without external write amplification.
 */
export class ListingIpRateLimiter {
  private readonly minBuckets = new Map<string, CounterBucket>();
  private readonly dayBuckets = new Map<string, CounterBucket>();

  consume(ip: string, now = Date.now()): { allowed: true } | { allowed: false; retryAfterSeconds: number } {
    const cleanIp = ip || '127.0.0.1';

    let minEntry = this.minBuckets.get(cleanIp);
    if (!minEntry || now >= minEntry.resetAt) {
      minEntry = { count: 1, resetAt: now + 60_000 };
      this.minBuckets.set(cleanIp, minEntry);
    } else {
      minEntry.count += 1;
    }

    let dayEntry = this.dayBuckets.get(cleanIp);
    if (!dayEntry || now >= dayEntry.resetAt) {
      dayEntry = { count: 1, resetAt: now + 86_400_000 };
      this.dayBuckets.set(cleanIp, dayEntry);
    } else {
      dayEntry.count += 1;
    }

    if (minEntry.count > LISTING_RATE_LIMIT_PER_MIN) {
      return {
        allowed: false,
        retryAfterSeconds: Math.max(1, Math.ceil((minEntry.resetAt - now) / 1000)),
      };
    }

    if (dayEntry.count > LISTING_RATE_LIMIT_PER_DAY) {
      return {
        allowed: false,
        retryAfterSeconds: Math.max(1, Math.ceil((dayEntry.resetAt - now) / 1000)),
      };
    }

    return { allowed: true };
  }

  reset(): void {
    this.minBuckets.clear();
    this.dayBuckets.clear();
  }
}

export const defaultListingRateLimiter = new ListingIpRateLimiter();

export function resetListingRateLimiter(): void {
  defaultListingRateLimiter.reset();
}

function resolveIp(reqHeaders: { header: (name: string) => string | undefined }): string {
  const cfIp = reqHeaders.header('cf-connecting-ip');
  if (cfIp) return cfIp.trim();
  const realIp = reqHeaders.header('x-real-ip');
  if (realIp) return realIp.trim();
  const forwarded = reqHeaders.header('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]!.trim();
  return '127.0.0.1';
}

export function createListingRoutes(
  rateLimiter: ListingIpRateLimiter = defaultListingRateLimiter
): Hono<{ Bindings: CloudflareEnv }> {
  const router = new Hono<{ Bindings: CloudflareEnv }>();

  /**
   * POST /api/v1/listing/resolve
   * Parses an allowlisted portal listing URL and optional pasted text strictly in memory.
   */
  router.post('/resolve', async (c) => {
    c.header('Cache-Control', 'no-store');

    const ip = resolveIp(c.req);
    const limitResult = rateLimiter.consume(ip);
    if (!limitResult.allowed) {
      c.header('Retry-After', String(limitResult.retryAfterSeconds));
      throw new RateLimitExceededError(limitResult.retryAfterSeconds, '/api/v1/listing/resolve');
    }

    const contentType = c.req.header('content-type') || '';
    if (!contentType.toLowerCase().includes('application/json')) {
      throw new UnsupportedMediaTypeError('application/json', '/api/v1/listing/resolve');
    }

    const rawBody = await c.req.text();
    if (utf8ByteLength(rawBody) > LISTING_MAX_PASTE_BYTES + 16_384) {
      throw new ListingPayloadTooLargeError(LISTING_MAX_PASTE_BYTES, '/api/v1/listing/resolve');
    }

    let parsedBody: unknown;
    try {
      parsedBody = JSON.parse(rawBody);
    } catch {
      throw new ListingUrlInvalidError('Request body must be valid JSON.', '/api/v1/listing/resolve');
    }

    if (!Value.Check(ListingResolveRequestSchema, parsedBody)) {
      throw new InvalidParametersError(
        'Request body failed ListingResolveRequest schema validation.',
        [{ name: 'body', reason: 'Expected { url: string, rawText?: string }' }],
        '/api/v1/listing/resolve'
      );
    }

    const resolved = resolveListingMetadata(parsedBody);
    if (!Value.Check(ListingResolveResponseSchema, resolved)) {
      throw new Error('ListingResolveResponse schema assertion failed');
    }

    return c.json(resolved, 200);
  });

  return router;
}
