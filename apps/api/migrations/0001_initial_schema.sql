-- Cloudflare D1 Migration 0001: INE ADRH Census Tract Income Schema
-- Stores official Spanish census tract income statistics for sub-5ms Edge lookups.

CREATE TABLE IF NOT EXISTS census_tract_income (
  census_section_code TEXT PRIMARY KEY,
  municipality_code TEXT NOT NULL,
  average_net_household_income_eur REAL NOT NULL,
  average_net_person_income_eur REAL NOT NULL,
  median_net_household_income_eur REAL NOT NULL,
  median_net_person_income_eur REAL NOT NULL,
  percentile_in_municipality REAL NOT NULL,
  rank_in_municipality INTEGER NOT NULL,
  total_sections_in_municipality INTEGER NOT NULL,
  median_age REAL NOT NULL,
  single_person_household_percentage REAL NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_census_tract_muni ON census_tract_income (municipality_code);
