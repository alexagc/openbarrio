-- Cloudflare D1 Migration 0007: Cadastral Write-Through LRU Cache (90-day TTL)
-- Stores official Catastro OVC and INSPIRE WFS query results to reduce repeat latency from 1,500ms to <3ms.

CREATE TABLE IF NOT EXISTS cadastral_cache (
  cache_key TEXT PRIMARY KEY,               -- Unique key (e.g. 'prop:28079...', 'units:28079...', 'geom:28079...', 'surroundings:28079...', 'coords:40.42028,-3.70379')
  cache_type TEXT NOT NULL,                 -- 'property' | 'units' | 'geometry' | 'surroundings' | 'coordinates'
  refcat TEXT,                              -- 14 or 20 character cadastral reference if available
  data_json TEXT NOT NULL,                  -- Serialized JSON payload
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  updated_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  expires_at TEXT NOT NULL,                 -- ISO timestamp for 90-day expiration
  access_count INTEGER NOT NULL DEFAULT 1,  -- Access frequency counter for LRU
  last_accessed_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE INDEX IF NOT EXISTS idx_cadastral_cache_refcat ON cadastral_cache(refcat);
CREATE INDEX IF NOT EXISTS idx_cadastral_cache_type ON cadastral_cache(cache_type);
CREATE INDEX IF NOT EXISTS idx_cadastral_cache_expires ON cadastral_cache(expires_at);
CREATE INDEX IF NOT EXISTS idx_cadastral_cache_lru ON cadastral_cache(last_accessed_at);
