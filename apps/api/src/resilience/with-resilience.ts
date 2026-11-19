import { LayerKey, LayerReason } from '@openbarrio/core';
import { getProviderResilienceConfig, ProviderResilienceConfig } from './config.js';
import { CircuitBreakerRegistry, defaultBreakerRegistry } from './circuit-breaker.js';

export class ResilienceTimeoutError extends Error {
  readonly providerKey: LayerKey;
  readonly timeoutMs: number;

  constructor(providerKey: LayerKey, timeoutMs: number) {
    super(`Provider '${providerKey}' timed out after ${timeoutMs}ms`);
    this.name = 'ResilienceTimeoutError';
    this.providerKey = providerKey;
    this.timeoutMs = timeoutMs;
  }
}

export class CircuitOpenError extends Error {
  readonly providerKey: LayerKey;

  constructor(providerKey: LayerKey) {
    super(`Circuit breaker is open for provider '${providerKey}'`);
    this.name = 'CircuitOpenError';
    this.providerKey = providerKey;
  }
}

export class TransientUpstreamError extends Error {
  readonly statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'TransientUpstreamError';
    this.statusCode = statusCode;
  }
}

export class InvalidPayloadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidPayloadError';
  }
}

export class NonTransientUpstreamError extends Error {
  readonly statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'NonTransientUpstreamError';
    this.statusCode = statusCode;
  }
}

export interface WithResilienceOptions {
  timeoutMs?: number;
  maxRetries?: number;
  backoffMs?: readonly number[];
  jitterRatio?: number;
  breaker?: CircuitBreakerRegistry;
  signal?: AbortSignal;
  sleep?: (ms: number) => Promise<void>;
  random?: () => number;
}

function defaultSleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isTransientError(err: unknown): boolean {
  if (!err) return false;
  if (err instanceof InvalidPayloadError || err instanceof NonTransientUpstreamError) {
    return false;
  }
  if (err instanceof ResilienceTimeoutError || err instanceof TransientUpstreamError) {
    return true;
  }
  if (err instanceof Error) {
    if (err.name === 'AbortError' || err.name === 'TimeoutError' || err.name === 'TypeError') {
      return true;
    }
    const msg = err.message.toLowerCase();
    if (
      msg.includes('timeout') ||
      msg.includes('timed out') ||
      msg.includes('aborted') ||
      msg.includes('network') ||
      msg.includes('econnreset') ||
      msg.includes('econnrefused') ||
      msg.includes('fetch failed') ||
      /http(?:\s+status)?\s+5\d{2}/.test(msg)
    ) {
      return true;
    }
  }
  return false;
}

export function mapErrorToLayerReason(err: unknown): LayerReason {
  if (err instanceof CircuitOpenError) return 'circuit_open';
  if (err instanceof ResilienceTimeoutError) return 'timeout';
  if (err instanceof InvalidPayloadError) return 'invalid_payload';
  if (err instanceof Error) {
    if (err.name === 'AbortError' || err.name === 'TimeoutError') return 'timeout';
    if (err.message.toLowerCase().includes('timeout') || err.message.toLowerCase().includes('aborted')) {
      return 'timeout';
    }
  }
  return 'upstream_error';
}

function resolveEffectiveConfig(
  providerKey: LayerKey,
  opts?: WithResilienceOptions
): ProviderResilienceConfig {
  const base = getProviderResilienceConfig(providerKey);
  return {
    ...base,
    timeoutMs: opts?.timeoutMs ?? base.timeoutMs,
    maxRetries: opts?.maxRetries ?? base.maxRetries,
    backoffMs: opts?.backoffMs ?? base.backoffMs,
    jitterRatio: opts?.jitterRatio ?? base.jitterRatio,
  };
}

/**
 * Executes an idempotent upstream call protected by timeout (AbortSignal),
 * exponential backoff with jitter on transient errors, and per-isolate circuit breaker.
 */
export async function withResilience<T>(
  providerKey: LayerKey,
  fn: (signal: AbortSignal) => Promise<T>,
  opts: WithResilienceOptions = {}
): Promise<T> {
  const config = resolveEffectiveConfig(providerKey, opts);
  const breaker = opts.breaker ?? defaultBreakerRegistry;
  const sleep = opts.sleep ?? defaultSleep;
  const random = opts.random ?? Math.random;

  if (!breaker.canRequest(providerKey)) {
    throw new CircuitOpenError(providerKey);
  }

  let lastError: unknown;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    const controller = new AbortController();
    let timedOut = false;

    const onCallerAbort = () => {
      controller.abort(opts.signal?.reason);
    };
    if (opts.signal) {
      if (opts.signal.aborted) {
        throw opts.signal.reason ?? new Error('Aborted');
      }
      opts.signal.addEventListener('abort', onCallerAbort, { once: true });
    }

    let timer: ReturnType<typeof setTimeout> | undefined;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timer = setTimeout(() => {
        timedOut = true;
        const timeoutErr = new ResilienceTimeoutError(providerKey, config.timeoutMs);
        controller.abort(timeoutErr);
        reject(timeoutErr);
      }, config.timeoutMs);
    });

    try {
      const result = await Promise.race([fn(controller.signal), timeoutPromise]);
      clearTimeout(timer);
      opts.signal?.removeEventListener('abort', onCallerAbort);
      breaker.recordSuccess(providerKey);
      return result;
    } catch (err) {
      clearTimeout(timer);
      opts.signal?.removeEventListener('abort', onCallerAbort);

      const effectiveErr = timedOut
        ? new ResilienceTimeoutError(providerKey, config.timeoutMs)
        : err;
      lastError = effectiveErr;

      if (opts.signal?.aborted && !timedOut) {
        throw effectiveErr;
      }

      const transient = isTransientError(effectiveErr);
      if (transient && attempt < config.maxRetries) {
        const baseDelay =
          config.backoffMs[Math.min(attempt, config.backoffMs.length - 1)] ?? 300;
        const jitterOffset = baseDelay * config.jitterRatio * (2 * random() - 1);
        const delayMs = Math.max(0, Math.round(baseDelay + jitterOffset));
        await sleep(delayMs);
        continue;
      }

      if (transient || effectiveErr instanceof InvalidPayloadError) {
        breaker.recordFailure(providerKey, mapErrorToLayerReason(effectiveErr));
      }
      throw effectiveErr;
    }
  }

  breaker.recordFailure(providerKey, mapErrorToLayerReason(lastError));
  throw lastError;
}
