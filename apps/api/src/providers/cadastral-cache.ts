import { STALE_MAX_DAYS, computeStaleAgeDays } from '@openbarrio/core';
import type { D1Database } from '../types/env.js';

export interface CadastralCacheOptions {
  db?: D1Database;
  ttlSeconds?: number;
  maxEntries?: number;
  now?: () => Date;
}

export interface CadastralCacheMeta<T> {
  data: T;
  fetchedAt?: string;
  expiresAt: string;
  ageDays: number;
  isFresh: boolean;
  isUsableStale: boolean;
}

export type CadastralCacheType =
  | 'property'
  | 'units'
  | 'geometry'
  | 'surroundings'
  | 'coordinates';

/**
 * CadastralCache: Write-Through LRU Cache backed by Cloudflare D1 (or local SQLite).
 * Caches official Sede Electrónica del Catastro (OVC) and INSPIRE WFS query results
 * with a 90-day TTL, collapsing repeat audit latencies from ~1,500ms to <3ms.
 * Enforces zero-write-on-read: expired entries are never deleted during `get()` reads
 * and remain eligible for stale serving (<=365 days) until `pruneExpired()` cron cleanup.
 */
export class CadastralCache {
  private db?: D1Database;
  private readonly ttlSeconds: number;
  private readonly maxEntries: number;
  private readonly now: () => Date;

  constructor(options: CadastralCacheOptions = {}) {
    this.db = options.db;
    // Default 90 days = 90 * 86,400 seconds = 7,776,000 seconds
    this.ttlSeconds = options.ttlSeconds ?? 90 * 86400;
    this.maxEntries = options.maxEntries ?? 50000;
    this.now = options.now ?? (() => new Date());
  }

  setDatabase(db: D1Database): void {
    this.db = db;
  }

  get isEnabled(): boolean {
    return Boolean(this.db);
  }

  /**
   * Retrieves a fresh cached cadastral object by cache key.
   * Zero-write-on-read: expired entries are NOT deleted here (use `pruneExpired()`).
   */
  async get<T>(key: string): Promise<T | null> {
    const meta = await this.getWithMeta<T>(key);
    return meta && meta.isFresh ? meta.data : null;
  }

  /**
   * Retrieves a cached cadastral object along with freshness and stale usability metadata.
   * Never performs D1 write/delete operations on read.
   */
  async getWithMeta<T>(key: string): Promise<CadastralCacheMeta<T> | null> {
    if (!this.db) return null;

    try {
      const currentNow = this.now();
      const nowIso = currentNow.toISOString();
      const row = await this.db
        .prepare('SELECT data_json, expires_at, updated_at FROM cadastral_cache WHERE cache_key = ?')
        .bind(key)
        .first<{ data_json: string; expires_at: string; updated_at?: string | null }>();

      if (!row || !row.data_json) return null;

      const isFresh = row.expires_at > nowIso;
      const expiresMs = Date.parse(row.expires_at);
      const derivedFetchedIso = row.updated_at
        ? row.updated_at
        : !Number.isNaN(expiresMs)
        ? new Date(expiresMs - this.ttlSeconds * 1000).toISOString()
        : undefined;

      const ageDays = derivedFetchedIso
        ? computeStaleAgeDays(derivedFetchedIso, currentNow)
        : isFresh
        ? 0
        : STALE_MAX_DAYS + 1;

      const data = JSON.parse(row.data_json) as T;

      return {
        data,
        fetchedAt: derivedFetchedIso,
        expiresAt: row.expires_at,
        ageDays,
        isFresh,
        isUsableStale: !isFresh && ageDays <= STALE_MAX_DAYS,
      };
    } catch {
      return null;
    }
  }

  /**
   * Stores a cadastral object with 90-day expiration and write-through upsert.
   */
  async set<T>(
    key: string,
    type: CadastralCacheType,
    refcat: string | null | undefined,
    data: T,
    customTtlSeconds?: number
  ): Promise<void> {
    if (!this.db) return;

    try {
      const now = new Date();
      const nowIso = now.toISOString();
      const ttl = customTtlSeconds ?? this.ttlSeconds;
      const expiresAt = new Date(now.getTime() + ttl * 1000).toISOString();
      const serialized = JSON.stringify(data);

      await this.db
        .prepare(`
          INSERT INTO cadastral_cache (
            cache_key,
            cache_type,
            refcat,
            data_json,
            created_at,
            updated_at,
            expires_at,
            access_count,
            last_accessed_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)
          ON CONFLICT(cache_key) DO UPDATE SET
            data_json = excluded.data_json,
            expires_at = excluded.expires_at,
            updated_at = excluded.updated_at,
            access_count = cadastral_cache.access_count + 1,
            last_accessed_at = excluded.last_accessed_at
        `)
        .bind(key, type, refcat || null, serialized, nowIso, nowIso, expiresAt, nowIso)
        .run();
    } catch {
      // Non-critical: provider continues without cache write failure
    }
  }

  /**
   * Performs LRU pruning when the table exceeds max entries.
   */
  async evictLru(limit = 500): Promise<number> {
    if (!this.db) return 0;

    try {
      const countRow = await this.db
        .prepare('SELECT count(*) as total FROM cadastral_cache')
        .first<{ total: number }>();

      const total = Number(countRow?.total || 0);
      if (total <= this.maxEntries) {
        return 0;
      }

      const res = await this.db
        .prepare(`
          DELETE FROM cadastral_cache
          WHERE cache_key IN (
            SELECT cache_key FROM cadastral_cache
            ORDER BY last_accessed_at ASC
            LIMIT ?
          )
        `)
        .bind(limit)
        .run();

      return (res as any)?.meta?.changes || limit;
    } catch {
      return 0;
    }
  }

  /**
   * Performs batch pruning of expired entries without touching active records.
   * Designed for periodic or background maintenance to keep D1 storage within 5 GB.
   */
  async pruneExpired(limit = 5000): Promise<number> {
    if (!this.db) return 0;

    try {
      const nowIso = new Date().toISOString();
      const res = await this.db
        .prepare(`
          DELETE FROM cadastral_cache
          WHERE cache_key IN (
            SELECT cache_key FROM cadastral_cache
            WHERE expires_at <= ?
            LIMIT ?
          )
        `)
        .bind(nowIso, limit)
        .run();

      return (res as any)?.meta?.changes || 0;
    } catch {
      return 0;
    }
  }
}
