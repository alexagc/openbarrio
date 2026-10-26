-- Cloudflare D1 Migration 0003: Energy Performance Certificates & Longitudinal Market Series
-- Stores official regional energy ratings (ICAEN, IVACE, EVE, Madrid DGIEM) and INE IPV / ADRH historical series.

CREATE TABLE IF NOT EXISTS building_energy_certificates (
  cadastral_reference TEXT PRIMARY KEY,
  rating_emissions TEXT NOT NULL,
  rating_consumption TEXT NOT NULL,
  co2_emissions REAL,
  primary_energy REAL,
  registration_number TEXT,
  scope TEXT NOT NULL DEFAULT 'building',
  valid_until TEXT,
  is_estimated INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE INDEX IF NOT EXISTS idx_cee_refcat ON building_energy_certificates(cadastral_reference);

CREATE TABLE IF NOT EXISTS market_historical_series (
  id TEXT PRIMARY KEY,
  census_section_id TEXT NOT NULL,
  period TEXT NOT NULL,
  housing_price_index REAL,
  household_income REAL,
  annual_variation_pct REAL
);

CREATE INDEX IF NOT EXISTS idx_market_census ON market_historical_series(census_section_id);
CREATE INDEX IF NOT EXISTS idx_market_period ON market_historical_series(period);
