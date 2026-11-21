import type { PropertyAuditReport } from './audit.js';
import { computeStaleAgeDays, type LayerKey, type LayerStatusInfo } from './data-status.js';
import type { TrafficLightState } from '../scoring/traffic-light.js';

/**
 * PWA Visit Mode configuration constants.
 * Saved dossiers stay strictly local on the user's device via IndexedDB.
 */
export const VISIT_MODE_MAX_DOSSIERS = 10;
export const VISIT_MODE_SCHEMA_VERSION = 1;
export const VISIT_MODE_CACHE_PREFIX = 'ob-shell-v';
export const VISIT_MODE_DOSSIER_DB_NAME = 'ob-dossier-v1';
export const VISIT_MODE_DOSSIER_STORE_NAME = 'saved_dossiers';
export const VISIT_MODE_STALE_WARN_DAYS = 30;

export const SW_EXCLUDED_PATH_PREFIXES = [
  '/api/v1/listing/resolve',
  '/api/v1/telemetry',
  '/api/v1/status/sources',
  '/api/v1/tiles',
] as const;

export interface SavedVisitDossier {
  id: string;
  schemaVersion: number;
  savedAt: string;
  lastAccessedAt: string;
  label: string;
  municipality: string;
  overallScore: number;
  trafficLight?: TrafficLightState;
  report: PropertyAuditReport;
  sourcesSnapshotAtSave: Partial<Record<LayerKey, LayerStatusInfo>>;
  profileId: string | null;
  checklist: unknown | null;
}

export interface SavedVisitDossierSummary {
  id: string;
  savedAt: string;
  lastAccessedAt: string;
  label: string;
  municipality: string;
  overallScore: number;
  trafficLight?: TrafficLightState;
}

/**
 * Normalizes a Spanish Cadastral Reference into a canonical IndexedDB key.
 */
export function normalizeVisitDossierId(refcat: string): string {
  return String(refcat || '')
    .replace(/[\s\-_.]/g, '')
    .toUpperCase();
}

/**
 * Computes whole elapsed days since a visit dossier was saved locally.
 */
export function computeSavedDossierAgeDays(savedAt: string, now: Date = new Date()): number {
  return computeStaleAgeDays(savedAt, now);
}

/**
 * Returns true when a locally saved visit dossier exceeds the freshness threshold (> 30 days by default).
 */
export function isSavedDossierExpired(
  savedAt: string,
  now: Date = new Date(),
  maxDays: number = VISIT_MODE_STALE_WARN_DAYS
): boolean {
  return computeSavedDossierAgeDays(savedAt, now) > maxDays;
}

/**
 * Computes deterministic LRU eviction IDs when saved dossier entries exceed `maxEntries`.
 * Entries are ordered by `lastAccessedAt` ascending with lexicographical `id` tie-breaking.
 */
export function computeLruEvictionIds(
  entries: ReadonlyArray<{ id: string; lastAccessedAt: string }>,
  maxEntries: number = VISIT_MODE_MAX_DOSSIERS
): string[] {
  if (maxEntries < 0) {
    return entries.map((e) => e.id);
  }
  const excess = entries.length - maxEntries;
  if (excess <= 0) {
    return [];
  }

  const sorted = [...entries].sort((a, b) => {
    const timeA = Date.parse(a.lastAccessedAt);
    const timeB = Date.parse(b.lastAccessedAt);
    const safeA = Number.isNaN(timeA) ? 0 : timeA;
    const safeB = Number.isNaN(timeB) ? 0 : timeB;
    if (safeA !== safeB) {
      return safeA - safeB;
    }
    return a.id.localeCompare(b.id);
  });

  return sorted.slice(0, excess).map((entry) => entry.id);
}
