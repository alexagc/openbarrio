-- Cloudflare D1 Migration 0012: SETELECO / CNMC Broadband & 5G Coverage (v1.5.0)
-- Stores municipal and historical ESP (Entidad Singular de Población) broadband metrics
-- with explicit granularity and source year disclosures (informational only; zero BarrioScore weight).

CREATE TABLE IF NOT EXISTS broadband_coverage (
  territory_code TEXT PRIMARY KEY,
  municipality_code TEXT NOT NULL,
  entity_name TEXT NOT NULL,
  granularity TEXT NOT NULL, -- 'parcel' | 'population_entity' | 'municipality'
  ftth_pct REAL NOT NULL,
  fixed_max_mbps INTEGER,
  mobile_5g_pct REAL,
  source_year INTEGER NOT NULL,
  source_date TEXT NOT NULL,
  source_dataset TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE INDEX IF NOT EXISTS idx_broadband_muni_gran
  ON broadband_coverage (municipality_code, granularity);

CREATE INDEX IF NOT EXISTS idx_broadband_year
  ON broadband_coverage (source_year);
