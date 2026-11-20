-- Cloudflare D1 Migration 0011: GTFS/NAP Transit Stops & Feed Coverage (v1.5.0)
-- Stores normalized public transit stops, peak/off-peak headways, hub travel times,
-- and explicit per-municipality feed coverage percentages from MITMS NAP / Open Consortia.

CREATE TABLE IF NOT EXISTS transit_stops (
  stop_id TEXT PRIMARY KEY,
  feed_id TEXT NOT NULL,
  operator_name TEXT NOT NULL,
  municipality_code TEXT NOT NULL,
  province_code TEXT NOT NULL,
  stop_name TEXT NOT NULL,
  mode TEXT NOT NULL, -- 'metro' | 'rail' | 'tram' | 'bus' | 'ferry'
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  routes_count INTEGER NOT NULL DEFAULT 1,
  peak_headway_min REAL,
  offpeak_headway_min REAL,
  hub_travel_times_json TEXT,
  source_date TEXT NOT NULL,
  license_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE INDEX IF NOT EXISTS idx_transit_stops_coords
  ON transit_stops (latitude, longitude);

CREATE INDEX IF NOT EXISTS idx_transit_stops_muni
  ON transit_stops (municipality_code);

CREATE INDEX IF NOT EXISTS idx_transit_stops_feed
  ON transit_stops (feed_id);

CREATE TABLE IF NOT EXISTS transit_feed_coverage (
  municipality_code TEXT PRIMARY KEY,
  area_name TEXT NOT NULL,
  ingested_feeds_count INTEGER NOT NULL,
  expected_feeds_count INTEGER NOT NULL,
  coverage_pct INTEGER NOT NULL,
  covered_operators_json TEXT NOT NULL,
  missing_operators_json TEXT NOT NULL,
  source_date TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);
