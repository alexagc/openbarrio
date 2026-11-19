import { CircuitState, LayerKey } from '@openbarrio/core';
import { getProviderResilienceConfig } from './config.js';

export interface BreakerSnapshot {
  providerKey: LayerKey;
  circuitState: CircuitState;
  recentFailures: number;
  lastSuccessAt?: number;
  lastErrorAt?: number;
  openedAt?: number;
  lastErrorReason?: string;
}

interface InternalBreakerState {
  state: CircuitState;
  failureTimestamps: number[];
  openedAt?: number;
  lastSuccessAt?: number;
  lastErrorAt?: number;
  lastErrorReason?: string;
  probeInFlight: boolean;
}

/**
 * Per-isolate in-memory circuit breaker registry for external public-data providers.
 * Note: In Cloudflare Workers, state is scoped to each V8 isolate rather than globally distributed.
 */
export class CircuitBreakerRegistry {
  private readonly states = new Map<LayerKey, InternalBreakerState>();
  private readonly nowFn: () => number;

  constructor(nowFn: () => number = () => Date.now()) {
    this.nowFn = nowFn;
  }

  private getOrCreate(providerKey: LayerKey): InternalBreakerState {
    let entry = this.states.get(providerKey);
    if (!entry) {
      entry = {
        state: 'closed',
        failureTimestamps: [],
        probeInFlight: false,
      };
      this.states.set(providerKey, entry);
    }
    return entry;
  }

  private pruneFailures(entry: InternalBreakerState, windowMs: number, now: number): void {
    const cutoff = now - windowMs;
    entry.failureTimestamps = entry.failureTimestamps.filter((ts) => ts > cutoff);
  }

  canRequest(providerKey: LayerKey): boolean {
    const config = getProviderResilienceConfig(providerKey);
    const entry = this.getOrCreate(providerKey);
    const now = this.nowFn();

    if (entry.state === 'closed') {
      return true;
    }

    if (entry.state === 'open') {
      const elapsed = entry.openedAt !== undefined ? now - entry.openedAt : 0;
      if (elapsed >= config.halfOpenAfterMs) {
        entry.state = 'half_open';
        entry.probeInFlight = true;
        return true;
      }
      return false;
    }

    // half_open: allow a single probe at a time
    if (!entry.probeInFlight) {
      entry.probeInFlight = true;
      return true;
    }
    return false;
  }

  recordSuccess(providerKey: LayerKey): void {
    const entry = this.getOrCreate(providerKey);
    const now = this.nowFn();
    entry.state = 'closed';
    entry.failureTimestamps = [];
    entry.openedAt = undefined;
    entry.lastSuccessAt = now;
    entry.probeInFlight = false;
  }

  recordFailure(providerKey: LayerKey, reason?: string): void {
    const config = getProviderResilienceConfig(providerKey);
    const entry = this.getOrCreate(providerKey);
    const now = this.nowFn();

    entry.lastErrorAt = now;
    entry.lastErrorReason = reason;

    if (entry.state === 'half_open') {
      entry.state = 'open';
      entry.openedAt = now;
      entry.probeInFlight = false;
      entry.failureTimestamps.push(now);
      this.pruneFailures(entry, config.failureWindowMs, now);
      return;
    }

    entry.failureTimestamps.push(now);
    this.pruneFailures(entry, config.failureWindowMs, now);

    if (entry.failureTimestamps.length >= config.failureThreshold) {
      entry.state = 'open';
      entry.openedAt = now;
      entry.probeInFlight = false;
    }
  }

  getSnapshot(providerKey: LayerKey): BreakerSnapshot {
    const config = getProviderResilienceConfig(providerKey);
    const entry = this.getOrCreate(providerKey);
    const now = this.nowFn();
    this.pruneFailures(entry, config.failureWindowMs, now);

    let effectiveState = entry.state;
    if (
      effectiveState === 'open' &&
      entry.openedAt !== undefined &&
      now - entry.openedAt >= config.halfOpenAfterMs
    ) {
      effectiveState = 'half_open';
    }

    return {
      providerKey,
      circuitState: effectiveState,
      recentFailures: entry.failureTimestamps.length,
      lastSuccessAt: entry.lastSuccessAt,
      lastErrorAt: entry.lastErrorAt,
      openedAt: entry.openedAt,
      lastErrorReason: entry.lastErrorReason,
    };
  }

  getAllSnapshots(keys: readonly LayerKey[]): BreakerSnapshot[] {
    return keys.map((k) => this.getSnapshot(k));
  }

  reset(providerKey?: LayerKey): void {
    if (providerKey) {
      this.states.delete(providerKey);
      return;
    }
    this.states.clear();
  }
}

export const defaultBreakerRegistry = new CircuitBreakerRegistry();
