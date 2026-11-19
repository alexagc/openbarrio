-- Migration: D1 persistent source snapshots for stale-while-revalidate resilience (v1.4.0)

CREATE TABLE IF NOT EXISTS source_snapshots (
  provider_key TEXT NOT NULL,
  cache_key TEXT NOT NULL,
  data_json TEXT NOT NULL,
  data_hash TEXT NOT NULL,
  source_date TEXT,
  verified_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  PRIMARY KEY (provider_key, cache_key)
);

CREATE INDEX IF NOT EXISTS idx_source_snapshots_expires_at
  ON source_snapshots (expires_at);

CREATE INDEX IF NOT EXISTS idx_source_snapshots_provider_verified
  ON source_snapshots (provider_key, verified_at DESC);
