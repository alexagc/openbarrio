import { Hono } from 'hono';
import {
  ANALYTICS_MAX_PAYLOAD_BYTES,
  TELEMETRY_RATE_LIMIT_PER_DAY,
  TELEMETRY_RATE_LIMIT_PER_MIN,
  validateAnalyticsEventPayload,
  utf8ByteLength,
} from '@openbarrio/core';
import {
  InvalidParametersError,
  RateLimitExceededError,
  TelemetryPayloadTooLargeError,
  UnsupportedMediaTypeError,
} from '../errors/problem-details.js';
import { TelemetryStore } from '../telemetry/telemetry-store.js';
import type { CloudflareEnv } from '../types/env.js';

interface CounterBucket {
  count: number;
  resetAt: number;
}

/**
 * Per-isolate transient rate limiter for telemetry ingestion.
 * IP addresses live solely in volatile memory buckets and are never persisted or logged.
 */
export class TelemetryIpRateLimiter {
  private readonly minBuckets = new Map<string, CounterBucket>();
  private readonly dayBuckets = new Map<string, CounterBucket>();

  consume(
    ip: string,
    now = Date.now()
  ): { allowed: true } | { allowed: false; retryAfterSeconds: number } {
    const cleanIp = ip || '127.0.0.1';

    if (this.minBuckets.size > 5000) {
      for (const [k, v] of this.minBuckets.entries()) {
        if (now >= v.resetAt) this.minBuckets.delete(k);
      }
    }
    if (this.dayBuckets.size > 5000) {
      for (const [k, v] of this.dayBuckets.entries()) {
        if (now >= v.resetAt) this.dayBuckets.delete(k);
      }
    }

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

    if (minEntry.count > TELEMETRY_RATE_LIMIT_PER_MIN) {
      return {
        allowed: false,
        retryAfterSeconds: Math.max(1, Math.ceil((minEntry.resetAt - now) / 1000)),
      };
    }

    if (dayEntry.count > TELEMETRY_RATE_LIMIT_PER_DAY) {
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

export const defaultTelemetryRateLimiter = new TelemetryIpRateLimiter();

export function resetTelemetryRateLimiter(): void {
  defaultTelemetryRateLimiter.reset();
}

function resolveTransientIp(reqHeaders: { header: (name: string) => string | undefined }): string {
  const cfIp = reqHeaders.header('cf-connecting-ip');
  if (cfIp) return cfIp.trim();
  const realIp = reqHeaders.header('x-real-ip');
  if (realIp) return realIp.trim();
  const forwarded = reqHeaders.header('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]!.trim();
  return '127.0.0.1';
}

export function createTelemetryRoutes(
  store: TelemetryStore,
  rateLimiter: TelemetryIpRateLimiter = defaultTelemetryRateLimiter
): Hono<{ Bindings: CloudflareEnv }> {
  const router = new Hono<{ Bindings: CloudflareEnv }>();

  /**
   * POST /api/v1/telemetry
   * Accepts closed-schema privacy-first telemetry events into batched daily aggregates.
   */
  router.post('/', async (c) => {
    c.header('Cache-Control', 'no-store');

    const ip = resolveTransientIp(c.req);
    const limitResult = rateLimiter.consume(ip);
    if (!limitResult.allowed) {
      c.header('Retry-After', String(limitResult.retryAfterSeconds));
      throw new RateLimitExceededError(limitResult.retryAfterSeconds, '/api/v1/telemetry');
    }

    const contentType = c.req.header('content-type') || '';
    if (!contentType.toLowerCase().includes('application/json')) {
      throw new UnsupportedMediaTypeError('application/json', '/api/v1/telemetry');
    }

    const rawBody = await c.req.text();
    if (utf8ByteLength(rawBody) > ANALYTICS_MAX_PAYLOAD_BYTES) {
      throw new TelemetryPayloadTooLargeError(ANALYTICS_MAX_PAYLOAD_BYTES, '/api/v1/telemetry');
    }

    const validation = validateAnalyticsEventPayload(rawBody);
    if (!validation.valid) {
      if (validation.reason === 'oversize') {
        throw new TelemetryPayloadTooLargeError(ANALYTICS_MAX_PAYLOAD_BYTES, '/api/v1/telemetry');
      }
      throw new InvalidParametersError(
        'Telemetry event payload failed strict closed schema validation.',
        [
          {
            name: 'body',
            reason:
              'Expected closed AnalyticsEvent JSON without extra fields or personal identifiers.',
          },
        ],
        '/api/v1/telemetry'
      );
    }

    store.record(validation.event);

    if (store.shouldFlush()) {
      const flushPromise = store.flush().catch((err) => {
        console.warn(
          '[Telemetry] Batched flush failed (non-blocking):',
          (err as Error)?.message
        );
      });
      let scheduledViaWaitUntil = false;
      try {
        const execCtx = c.executionCtx;
        if (execCtx && typeof execCtx.waitUntil === 'function') {
          execCtx.waitUntil(flushPromise);
          scheduledViaWaitUntil = true;
        }
      } catch {
        // Node.js runtime does not provide ExecutionContext
      }
      if (!scheduledViaWaitUntil) {
        await flushPromise;
      }
    }

    return c.body(null, 204);
  });

  return router;
}
