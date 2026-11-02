-- Cloudflare D1 Migration 0005: MIVAU SERPAVI Statutory Rental Benchmarks
-- Stores official rental benchmark ranges (€/m2) and Stressed Housing Market status under Spanish Housing Law 12/2023.

CREATE TABLE IF NOT EXISTS mivau_serpavi_benchmarks (
  cusec TEXT,                     -- 10-digit census section code (NULL for municipal aggregate)
  municipality_code TEXT NOT NULL, -- 5-digit INE municipality code (e.g., '08019' Barcelona, '28079' Madrid)
  is_stressed_market INTEGER NOT NULL DEFAULT 0, -- 1 if declared Zona Tensionada (Law 12/2023)
  lower_bound_eur_m2 REAL NOT NULL,
  median_eur_m2 REAL NOT NULL,
  upper_bound_eur_m2 REAL NOT NULL,
  sample_size INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_serpavi_cusec_muni ON mivau_serpavi_benchmarks(municipality_code, ifnull(cusec, ''));
CREATE INDEX IF NOT EXISTS idx_serpavi_cusec ON mivau_serpavi_benchmarks(cusec);
CREATE INDEX IF NOT EXISTS idx_serpavi_muni ON mivau_serpavi_benchmarks(municipality_code);
