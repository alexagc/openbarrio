import {
  ANALYTICS_RETENTION_MONTHS,
  computeTelemetryCutoffDay,
  deriveAnalyticsBucket,
  formatUtcDay,
  type AnalyticsEvent,
  type AnalyticsEventName,
} from '@openbarrio/core';
import type { D1Database } from '../types/env.js';

interface BufferedAggregateEntry {
  day: string;
  event: AnalyticsEventName;
  bucket: string;
  delta: number;
}

export interface TelemetryStoreOptions {
  db?: D1Database;
  flushThresholdEvents?: number;
  flushIntervalMs?: number;
  now?: () => Date;
}

export interface TelemetryFlushResult {
  flushedBuckets: number;
  flushedEvents: number;
}

/**
 * In-memory isolate aggregator flushing privacy-first daily event counts in batches
 * to Cloudflare D1 (`telemetry_daily_aggregates`) to respect the 100k writes/day budget.
 */
export class TelemetryStore {
  private db?: D1Database;
  private readonly flushThresholdEvents: number;
  private readonly flushIntervalMs: number;
  private readonly now: () => Date;
  private readonly buffer = new Map<string, BufferedAggregateEntry>();
  private pendingEventCount = 0;
  private lastFlushAtMs: number;

  constructor(options: TelemetryStoreOptions = {}) {
    this.db = options.db;
    this.flushThresholdEvents = options.flushThresholdEvents ?? 50;
    this.flushIntervalMs = options.flushIntervalMs ?? 60_000;
    this.now = options.now ?? (() => new Date());
    this.lastFlushAtMs = this.now().getTime();
  }

  setDatabase(db: D1Database): void {
    this.db = db;
  }

  getDatabase(): D1Database | undefined {
    return this.db;
  }

  /**
   * Accumulates a validated aggregate telemetry event in memory without performing hot-path D1 writes.
   */
  record(event: AnalyticsEvent, nowOverride?: Date): void {
    const currentNow = nowOverride ?? this.now();
    const day = formatUtcDay(currentNow);
    const bucket = deriveAnalyticsBucket(event);
    const key = `${day}|${event.event}|${bucket}`;

    const existing = this.buffer.get(key);
    if (existing) {
      existing.delta += 1;
    } else {
      this.buffer.set(key, {
        day,
        event: event.event,
        bucket,
        delta: 1,
      });
    }
    this.pendingEventCount += 1;
  }

  /**
   * Returns true when the isolate buffer has reached its batch event threshold or time interval.
   */
  shouldFlush(nowOverride?: Date): boolean {
    if (this.buffer.size === 0) return false;
    if (this.pendingEventCount >= this.flushThresholdEvents) return true;
    const nowMs = (nowOverride ?? this.now()).getTime();
    return nowMs - this.lastFlushAtMs >= this.flushIntervalMs;
  }

  /**
   * Atomically flushes buffered daily aggregates into D1 using a single `db.batch()` call.
   * Restores unsaved counts back into the buffer if D1 fails so no counts are silently dropped.
   */
  async flush(nowOverride?: Date): Promise<TelemetryFlushResult> {
    if (!this.db || this.buffer.size === 0) {
      return { flushedBuckets: 0, flushedEvents: 0 };
    }

    const currentNow = nowOverride ?? this.now();
    const updatedAtIso = currentNow.toISOString();
    const snapshot = Array.from(this.buffer.entries());
    const flushedEvents = snapshot.reduce((sum, [, entry]) => sum + entry.delta, 0);

    this.buffer.clear();
    this.pendingEventCount = 0;

    try {
      const statements = snapshot.map(([, entry]) =>
        this.db!
          .prepare(
            `INSERT INTO telemetry_daily_aggregates (day, event, bucket, count, updated_at)
             VALUES (?1, ?2, ?3, ?4, ?5)
             ON CONFLICT(day, event, bucket) DO UPDATE SET
               count = count + excluded.count,
               updated_at = excluded.updated_at`
          )
          .bind(entry.day, entry.event, entry.bucket, entry.delta, updatedAtIso)
      );

      await this.db.batch(statements);
      this.lastFlushAtMs = currentNow.getTime();

      return {
        flushedBuckets: snapshot.length,
        flushedEvents,
      };
    } catch (err) {
      for (const [key, entry] of snapshot) {
        const current = this.buffer.get(key);
        if (current) {
          current.delta += entry.delta;
        } else {
          this.buffer.set(key, { ...entry });
        }
        this.pendingEventCount += entry.delta;
      }
      console.warn('[TelemetryStore] Batch flush failed (non-blocking):', (err as Error)?.message);
      return { flushedBuckets: 0, flushedEvents: 0 };
    }
  }

  /**
   * Deletes daily aggregates strictly older than the configured 13-month retention cutoff.
   */
  async pruneExpired(nowOverride?: Date): Promise<number> {
    if (!this.db) return 0;

    try {
      const cutoffDay = computeTelemetryCutoffDay(
        nowOverride ?? this.now(),
        ANALYTICS_RETENTION_MONTHS
      );
      const res = await this.db
        .prepare('DELETE FROM telemetry_daily_aggregates WHERE day < ?1')
        .bind(cutoffDay)
        .run();
      const meta = res.meta as { changes?: number } | undefined;
      return Number(meta?.changes || 0);
    } catch (err) {
      console.warn('[TelemetryStore] Prune failed (non-blocking):', (err as Error)?.message);
      return 0;
    }
  }

  getPendingStats(): { buckets: number; events: number } {
    return {
      buckets: this.buffer.size,
      events: this.pendingEventCount,
    };
  }

  reset(nowOverride?: Date): void {
    this.buffer.clear();
    this.pendingEventCount = 0;
    this.lastFlushAtMs = (nowOverride ?? this.now()).getTime();
  }
}
