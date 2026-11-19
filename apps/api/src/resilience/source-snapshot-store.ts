import { LayerKey, STALE_MAX_DAYS, computeStaleAgeDays } from '@openbarrio/core';
import type { D1Database } from '../types/env.js';

const ONE_DAY_MS = 86_400_000;

export interface SourceSnapshotRecord<T> {
  providerKey: LayerKey;
  cacheKey: string;
  data: T;
  dataHash: string;
  sourceDate?: string;
  verifiedAt: string;
  expiresAt: string;
  ageDays: number;
}

export interface LatestProviderSnapshotSummary {
  lastVerifiedAt: string;
  sourceDate?: string;
}

export interface SourceSnapshotStoreOptions {
  db?: D1Database;
  now?: () => Date;
}

export async function computeSnapshotHash(payloadJson: string): Promise<string> {
  const bytes = new TextEncoder().encode(payloadJson);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * D1-backed snapshot store enforcing OpenBarrio's zero-write-on-read policy.
 * - Reads never mutate D1.
 * - Writes occur only when content hash changes OR >= 24h elapsed since last verification.
 * - Expired cleanup executes solely via explicit cron `pruneExpired()`.
 */
export class SourceSnapshotStore {
  private db?: D1Database;
  private readonly now: () => Date;

  constructor(options: SourceSnapshotStoreOptions = {}) {
    this.db = options.db;
    this.now = options.now ?? (() => new Date());
  }

  setDatabase(db: D1Database): void {
    this.db = db;
  }

  getDatabase(): D1Database | undefined {
    return this.db;
  }

  async get<T>(providerKey: LayerKey, cacheKey: string): Promise<SourceSnapshotRecord<T> | null> {
    if (!this.db) return null;

    try {
      const row = await this.db
        .prepare(
          'SELECT data_json, data_hash, source_date, verified_at, expires_at FROM source_snapshots WHERE provider_key = ?1 AND cache_key = ?2 LIMIT 1'
        )
        .bind(providerKey, cacheKey)
        .first<{
          data_json: string;
          data_hash: string;
          source_date: string | null;
          verified_at: string;
          expires_at: string;
        }>();

      if (!row || !row.data_json || !row.verified_at) {
        return null;
      }

      const data = JSON.parse(row.data_json) as T;
      const ageDays = computeStaleAgeDays(row.verified_at, this.now());

      return {
        providerKey,
        cacheKey,
        data,
        dataHash: row.data_hash,
        ...(row.source_date ? { sourceDate: row.source_date } : {}),
        verifiedAt: row.verified_at,
        expiresAt: row.expires_at,
        ageDays,
      };
    } catch (err) {
      console.warn('[SourceSnapshotStore] Read error (non-blocking):', (err as Error)?.message);
      return null;
    }
  }

  /**
   * Persists a verified upstream payload only if its hash changed or >= 24h elapsed
   * since the stored `verified_at` timestamp (D7 quota protection).
   */
  async saveIfChanged<T>(
    providerKey: LayerKey,
    cacheKey: string,
    data: T,
    sourceDate?: string
  ): Promise<boolean> {
    if (!this.db) return false;

    const currentNow = this.now();
    const nowIso = currentNow.toISOString();
    const expiresIso = new Date(currentNow.getTime() + STALE_MAX_DAYS * ONE_DAY_MS).toISOString();
    const dataJson = JSON.stringify(data);
    const dataHash = await computeSnapshotHash(dataJson);

    try {
      const existing = await this.db
        .prepare(
          'SELECT data_hash, verified_at FROM source_snapshots WHERE provider_key = ?1 AND cache_key = ?2 LIMIT 1'
        )
        .bind(providerKey, cacheKey)
        .first<{ data_hash: string; verified_at: string }>();

      if (existing && existing.data_hash === dataHash) {
        const lastVerifiedMs = Date.parse(existing.verified_at);
        if (!Number.isNaN(lastVerifiedMs) && currentNow.getTime() - lastVerifiedMs < ONE_DAY_MS) {
          return false;
        }
      }

      await this.db
        .prepare(
          `INSERT INTO source_snapshots (provider_key, cache_key, data_json, data_hash, source_date, verified_at, expires_at)
           VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)
           ON CONFLICT(provider_key, cache_key) DO UPDATE SET
             data_json = excluded.data_json,
             data_hash = excluded.data_hash,
             source_date = excluded.source_date,
             verified_at = excluded.verified_at,
             expires_at = excluded.expires_at`
        )
        .bind(providerKey, cacheKey, dataJson, dataHash, sourceDate ?? null, nowIso, expiresIso)
        .run();

      return true;
    } catch (err) {
      console.warn('[SourceSnapshotStore] Write failed (non-blocking):', (err as Error)?.message);
      return false;
    }
  }

  /**
   * Read-only summary of latest snapshot timestamps grouped by provider_key.
   */
  async listLatestByProvider(): Promise<Partial<Record<LayerKey, LatestProviderSnapshotSummary>>> {
    if (!this.db) return {};

    try {
      const res = await this.db
        .prepare(
          `SELECT s.provider_key, s.verified_at, s.source_date
           FROM source_snapshots s
           INNER JOIN (
             SELECT provider_key, MAX(verified_at) AS max_verified_at
             FROM source_snapshots
             GROUP BY provider_key
           ) latest
             ON s.provider_key = latest.provider_key
            AND s.verified_at = latest.max_verified_at`
        )
        .all<{ provider_key: string; verified_at: string; source_date: string | null }>();

      const out: Partial<Record<LayerKey, LatestProviderSnapshotSummary>> = {};
      for (const row of res.results || []) {
        const key = row.provider_key as LayerKey;
        out[key] = {
          lastVerifiedAt: row.verified_at,
          ...(row.source_date ? { sourceDate: row.source_date } : {}),
        };
      }
      return out;
    } catch (err) {
      console.warn('[SourceSnapshotStore] Status summary read failed:', (err as Error)?.message);
      return {};
    }
  }

  async pruneExpired(): Promise<number> {
    if (!this.db) return 0;

    try {
      const nowIso = this.now().toISOString();
      const res = await this.db
        .prepare('DELETE FROM source_snapshots WHERE expires_at <= ?1')
        .bind(nowIso)
        .run();
      const meta = res.meta as { changes?: number } | undefined;
      return Number(meta?.changes || 0);
    } catch (err) {
      console.warn('[SourceSnapshotStore] Prune failed:', (err as Error)?.message);
      return 0;
    }
  }
}
