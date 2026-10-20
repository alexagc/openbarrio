-- Cloudflare D1 Migration 0002: Civic Facilities Schema for 15-Minute City Walkability
-- Stores geocoded public amenities (healthcare, education, transit, parks) for Edge spatial queries.

CREATE TABLE IF NOT EXISTS civic_facilities (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  subtype TEXT,
  name TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  municipality_code TEXT NOT NULL,
  postal_code TEXT
);

CREATE INDEX IF NOT EXISTS idx_facilities_coords ON civic_facilities(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_facilities_type ON civic_facilities(type);
