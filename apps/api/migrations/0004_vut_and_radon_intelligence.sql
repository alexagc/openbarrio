-- Cloudflare D1 Migration 0004: VUT Tourist Housing Saturation & CTE DB-HS 6 Radon Intelligence
-- Stores INE experimental VUT census section data and CTE DB-HS 6 municipal radon classifications.

CREATE TABLE IF NOT EXISTS census_tract_vut (
  census_section_id TEXT PRIMARY KEY,
  total_dwellings INTEGER NOT NULL,
  vut_count INTEGER NOT NULL,
  vut_beds INTEGER NOT NULL,
  vut_ratio_pct REAL NOT NULL,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE INDEX IF NOT EXISTS idx_vut_census ON census_tract_vut(census_section_id);

CREATE TABLE IF NOT EXISTS cte_radon_municipalities (
  municipality_code TEXT PRIMARY KEY,
  municipality_name TEXT NOT NULL,
  province_code TEXT NOT NULL,
  province_name TEXT NOT NULL,
  zone TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE INDEX IF NOT EXISTS idx_radon_muni ON cte_radon_municipalities(municipality_code);
CREATE INDEX IF NOT EXISTS idx_radon_prov ON cte_radon_municipalities(province_code);
