-- Cloudflare D1 Migration 0008: Building Technical Inspection (ITE/IEE) & IGN NCSE-02 Seismic Hazard
-- Stores municipal ITE/IEE public registry records and municipal seismic acceleration ratings.

CREATE TABLE IF NOT EXISTS municipal_ite_records (
  cadastral_reference TEXT PRIMARY KEY,
  municipality TEXT NOT NULL,
  status TEXT NOT NULL, -- 'FAVORABLE', 'UNFAVORABLE', 'PENDING', 'EXEMPT'
  inspection_year INTEGER,
  next_inspection_due_year INTEGER,
  has_defects INTEGER NOT NULL DEFAULT 0,
  defects_summary TEXT, -- JSON array of strings
  municipal_registry TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE INDEX IF NOT EXISTS idx_ite_muni ON municipal_ite_records(municipality);
CREATE INDEX IF NOT EXISTS idx_ite_status ON municipal_ite_records(status);

CREATE TABLE IF NOT EXISTS ign_seismic_hazard (
  municipality_code TEXT PRIMARY KEY,
  municipality_name TEXT NOT NULL,
  province_code TEXT NOT NULL,
  province_name TEXT NOT NULL,
  basic_acceleration_g REAL NOT NULL,
  risk_level TEXT NOT NULL, -- 'VERY_LOW', 'LOW', 'MEDIUM', 'HIGH'
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE INDEX IF NOT EXISTS idx_seismic_muni ON ign_seismic_hazard(municipality_code);
CREATE INDEX IF NOT EXISTS idx_seismic_prov ON ign_seismic_hazard(province_code);
CREATE INDEX IF NOT EXISTS idx_seismic_level ON ign_seismic_hazard(risk_level);
