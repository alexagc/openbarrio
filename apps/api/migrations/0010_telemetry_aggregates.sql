-- Migration: Batched daily privacy-first telemetry aggregates (v1.5.0)
-- Stores strictly aggregate daily event counts with zero PII, zero cookies,
-- zero IP addresses, and automated 13-month retention pruning.

CREATE TABLE IF NOT EXISTS telemetry_daily_aggregates (
  day TEXT NOT NULL,
  event TEXT NOT NULL,
  bucket TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (day, event, bucket)
);

CREATE INDEX IF NOT EXISTS idx_telemetry_daily_aggregates_day
  ON telemetry_daily_aggregates (day);
