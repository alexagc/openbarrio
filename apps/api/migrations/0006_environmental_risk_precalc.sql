-- Cloudflare D1 Migration 0006: Pre-calculated MITECO SNCZI Flood Risk & SICA Acoustic Noise Risk
-- Enables sub-5ms Edge due diligence queries without blocking on ministerial WMS/WFS external latencies.

-- 1. SNCZI Inundation & Fluvial Flood Risk Pre-calculated Table
CREATE TABLE IF NOT EXISTS census_tract_snczi_risk (
  cusec TEXT,                                    -- 10-digit census section code (NULL for municipal aggregate)
  municipality_code TEXT NOT NULL,               -- 5-digit INE municipality code (e.g. '46250' Valencia, '30001' Murcia)
  flood_risk_level TEXT NOT NULL DEFAULT 'NONE', -- 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH'
  return_period_years INTEGER,                   -- Return period (10, 50, 100, 500, or NULL)
  is_in_preferential_flow_zone INTEGER NOT NULL DEFAULT 0, -- 1 if inside Zona de Flujo Preferente (ZFP)
  source_layer TEXT DEFAULT 'SNCZI_VECTOR',      -- Layer provenance ('Zi_laminas_q10', 'ZFP', etc.)
  updated_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_snczi_cusec_muni ON census_tract_snczi_risk(municipality_code, ifnull(cusec, ''));
CREATE INDEX IF NOT EXISTS idx_snczi_cusec ON census_tract_snczi_risk(cusec);
CREATE INDEX IF NOT EXISTS idx_snczi_muni ON census_tract_snczi_risk(municipality_code);

-- 2. SICA Strategic Noise Map (MER) Acoustic Isochrones Pre-calculated Table
CREATE TABLE IF NOT EXISTS census_tract_sica_noise (
  cusec TEXT,                                         -- 10-digit census section code (NULL for municipal aggregate)
  municipality_code TEXT NOT NULL,                    -- 5-digit INE municipality code (e.g. '28079' Madrid, '08019' Barcelona)
  day_evening_night_decibels REAL NOT NULL DEFAULT 52.0, -- Lden decibels dB(A)
  category TEXT NOT NULL DEFAULT 'QUIET',             -- 'QUIET' | 'MODERATE' | 'NOISY' | 'VERY_NOISY'
  predominant_source TEXT NOT NULL DEFAULT 'NONE',    -- 'ROAD_TRAFFIC' | 'RAILWAY' | 'AIRPORT' | 'INDUSTRIAL' | 'NONE'
  updated_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_sica_cusec_muni ON census_tract_sica_noise(municipality_code, ifnull(cusec, ''));
CREATE INDEX IF NOT EXISTS idx_sica_cusec ON census_tract_sica_noise(cusec);
CREATE INDEX IF NOT EXISTS idx_sica_muni ON census_tract_sica_noise(municipality_code);
