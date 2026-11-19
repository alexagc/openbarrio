import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  withResilience,
  CircuitBreakerRegistry,
  CircuitOpenError,
  ResilienceTimeoutError,
  TransientUpstreamError,
  InvalidPayloadError,
  NonTransientUpstreamError,
  RESILIENCE_CONFIG,
} from '../../src/resilience/index.js';

describe('Resilience Primitives (Timeout, Backoff + Jitter, Circuit Breaker)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('defines centralized config with D10 defaults per provider', () => {
    expect(RESILIENCE_CONFIG.sica.timeoutMs).toBe(8000);
    expect(RESILIENCE_CONFIG.sica.maxRetries).toBe(2);
    expect(RESILIENCE_CONFIG.sica.backoffMs).toEqual([300, 900]);
    expect(RESILIENCE_CONFIG.sica.failureThreshold).toBe(5);
    expect(RESILIENCE_CONFIG.sica.failureWindowMs).toBe(60_000);
    expect(RESILIENCE_CONFIG.sica.halfOpenAfterMs).toBe(60_000);
  });

  it('retries transient failures with exponential backoff + jitter and succeeds', async () => {
    const sleepCalls: number[] = [];
    const breaker = new CircuitBreakerRegistry(() => Date.now());
    let calls = 0;

    const result = await withResilience(
      'sica',
      async () => {
        calls += 1;
        if (calls < 3) {
          throw new TransientUpstreamError('503 Service Unavailable', 503);
        }
        return 'ok-after-retries';
      },
      {
        breaker,
        random: () => 0.5, // zero jitter offset -> exact 300ms and 900ms
        sleep: async (ms) => {
          sleepCalls.push(ms);
        },
      }
    );

    expect(result).toBe('ok-after-retries');
    expect(calls).toBe(3);
    expect(sleepCalls).toEqual([300, 900]);
    expect(breaker.getSnapshot('sica').circuitState).toBe('closed');
    expect(breaker.getSnapshot('sica').recentFailures).toBe(0);
  });

  it('does NOT retry non-transient 4xx or InvalidPayloadError failures', async () => {
    const breaker = new CircuitBreakerRegistry(() => Date.now());
    let calls4xx = 0;
    await expect(
      withResilience(
        'snczi',
        async () => {
          calls4xx += 1;
          throw new NonTransientUpstreamError('HTTP 400 Bad Request', 400);
        },
        { breaker, sleep: async () => {} }
      )
    ).rejects.toThrow(NonTransientUpstreamError);
    expect(calls4xx).toBe(1);
    expect(breaker.getSnapshot('snczi').recentFailures).toBe(0);

    let callsInvalid = 0;
    await expect(
      withResilience(
        'snczi',
        async () => {
          callsInvalid += 1;
          throw new InvalidPayloadError('HTML returned instead of GeoJSON');
        },
        { breaker, sleep: async () => {} }
      )
    ).rejects.toThrow(InvalidPayloadError);
    expect(callsInvalid).toBe(1);
    expect(breaker.getSnapshot('snczi').recentFailures).toBe(1);
  });

  it('aborts and retries on timeout using AbortSignal and fake timers', async () => {
    const breaker = new CircuitBreakerRegistry(() => Date.now());
    let attempts = 0;

    const promise = withResilience(
      'sica',
      async (signal) => {
        attempts += 1;
        return new Promise((_resolve, reject) => {
          signal.addEventListener('abort', () => reject(signal.reason), { once: true });
        });
      },
      {
        timeoutMs: 1000,
        maxRetries: 1,
        backoffMs: [200],
        breaker,
        random: () => 0.5,
      }
    );
    const caught = promise.catch((err) => err);

    await vi.advanceTimersByTimeAsync(1000);
    await vi.advanceTimersByTimeAsync(200);
    await vi.advanceTimersByTimeAsync(1000);

    const err = await caught;
    expect(err).toBeInstanceOf(ResilienceTimeoutError);
    expect(attempts).toBe(2);
    expect(breaker.getSnapshot('sica').recentFailures).toBe(1);
  });

  it('opens circuit breaker after 5 failures within 60s, transitions to half_open after 60s, and recovers on probe success', async () => {
    let fakeNow = 1_000_000;
    const breaker = new CircuitBreakerRegistry(() => fakeNow);

    // 5 consecutive failures open the circuit
    for (let i = 0; i < 5; i++) {
      await expect(
        withResilience(
          'sica',
          async () => {
            throw new TransientUpstreamError('502 Bad Gateway', 502);
          },
          { breaker, maxRetries: 0 }
        )
      ).rejects.toThrow(TransientUpstreamError);
      fakeNow += 1000;
    }

    expect(breaker.getSnapshot('sica').circuitState).toBe('open');

    // Immediate call is rejected immediately with CircuitOpenError without calling fn
    const spyFn = vi.fn(async () => 'never-called');
    await expect(withResilience('sica', spyFn, { breaker })).rejects.toThrow(CircuitOpenError);
    expect(spyFn).not.toHaveBeenCalled();

    // Advance 60s -> half_open probe succeeds -> closed
    fakeNow += 60_000;
    expect(breaker.getSnapshot('sica').circuitState).toBe('half_open');

    const recovered = await withResilience('sica', async () => 'recovered', { breaker });
    expect(recovered).toBe('recovered');
    expect(breaker.getSnapshot('sica').circuitState).toBe('closed');
    expect(breaker.getSnapshot('sica').recentFailures).toBe(0);
  });

  it('re-opens circuit breaker immediately if half_open probe fails', async () => {
    let fakeNow = 1_000_000;
    const breaker = new CircuitBreakerRegistry(() => fakeNow);

    for (let i = 0; i < 5; i++) {
      await expect(
        withResilience(
          'snczi',
          async () => {
            throw new TransientUpstreamError('503', 503);
          },
          { breaker, maxRetries: 0 }
        )
      ).rejects.toThrow();
    }
    expect(breaker.getSnapshot('snczi').circuitState).toBe('open');

    fakeNow += 60_000;
    await expect(
      withResilience(
        'snczi',
        async () => {
          throw new TransientUpstreamError('still down', 503);
        },
        { breaker, maxRetries: 0 }
      )
    ).rejects.toThrow(TransientUpstreamError);

    expect(breaker.getSnapshot('snczi').circuitState).toBe('open');
  });
});
