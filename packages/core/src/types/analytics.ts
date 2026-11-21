import { Type, type Static } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
import { utf8ByteLength } from './selectors.js';

/**
 * Closed set of privacy-first telemetry events allowed in OpenBarrio.
 * Every event is strictly aggregate-only with zero PII, zero cookies,
 * zero geographic coordinates, and zero cadastral identifiers.
 */
export const ANALYTICS_EVENTS = [
  'dossier_generated',
  'lens_used',
  'checklist_exported',
  'visit_mode_enabled',
] as const;

export const ANALYTICS_LENS_VALUES = ['profile', 'layer', 'checklist'] as const;

export const ANALYTICS_RETENTION_MONTHS = 13;
export const ANALYTICS_RETURNING_WINDOW_DAYS = 14;
export const ANALYTICS_MAX_PAYLOAD_BYTES = 1024;
export const TELEMETRY_RATE_LIMIT_PER_MIN = 30;
export const TELEMETRY_RATE_LIMIT_PER_DAY = 300;
export const ANALYTICS_CONSENT_STORAGE_KEY = 'openbarrio_analytics_v1';

export const AnalyticsEventNameSchema = Type.Union([
  Type.Literal('dossier_generated'),
  Type.Literal('lens_used'),
  Type.Literal('checklist_exported'),
  Type.Literal('visit_mode_enabled'),
]);

export const AnalyticsLensSchema = Type.Union([
  Type.Literal('profile'),
  Type.Literal('layer'),
  Type.Literal('checklist'),
]);

export const AnalyticsConsentStateSchema = Type.Union([
  Type.Literal('undecided'),
  Type.Literal('accepted'),
  Type.Literal('rejected'),
]);

export const AnalyticsEventSchema = Type.Union([
  Type.Object(
    {
      event: Type.Literal('dossier_generated'),
      returning14d: Type.Optional(Type.Boolean()),
    },
    { additionalProperties: false }
  ),
  Type.Object(
    {
      event: Type.Literal('lens_used'),
      lens: AnalyticsLensSchema,
      returning14d: Type.Optional(Type.Boolean()),
    },
    { additionalProperties: false }
  ),
  Type.Object(
    {
      event: Type.Literal('checklist_exported'),
      returning14d: Type.Optional(Type.Boolean()),
    },
    { additionalProperties: false }
  ),
  Type.Object(
    {
      event: Type.Literal('visit_mode_enabled'),
      returning14d: Type.Optional(Type.Boolean()),
    },
    { additionalProperties: false }
  ),
]);

export const TelemetryDailyAggregateSchema = Type.Object(
  {
    day: Type.String({ pattern: '^\\d{4}-\\d{2}-\\d{2}$' }),
    event: AnalyticsEventNameSchema,
    bucket: Type.String({ minLength: 1, maxLength: 64 }),
    count: Type.Integer({ minimum: 0 }),
  },
  { additionalProperties: false }
);

export type AnalyticsEventName = Static<typeof AnalyticsEventNameSchema>;
export type AnalyticsLens = Static<typeof AnalyticsLensSchema>;
export type AnalyticsConsentState = Static<typeof AnalyticsConsentStateSchema>;
export type AnalyticsEvent = Static<typeof AnalyticsEventSchema>;
export type TelemetryDailyAggregate = Static<typeof TelemetryDailyAggregateSchema>;

const ONE_DAY_MS = 86_400_000;

/**
 * Formats a Date into an ISO-8601 UTC day string (`YYYY-MM-DD`).
 */
export function formatUtcDay(date: Date = new Date()): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Derives the low-cardinality aggregation bucket key for daily counters.
 */
export function deriveAnalyticsBucket(event: AnalyticsEvent): string {
  if (event.event === 'lens_used') {
    return event.returning14d ? `${event.lens}:returning_14d` : event.lens;
  }
  return event.returning14d ? 'returning_14d' : 'standard';
}

/**
 * Computes the UTC cutoff day (`YYYY-MM-DD`) strictly `retentionMonths` earlier.
 * Aggregates older than this cutoff are purged by the monthly maintenance cron.
 */
export function computeTelemetryCutoffDay(
  now: Date = new Date(),
  retentionMonths: number = ANALYTICS_RETENTION_MONTHS
): string {
  const cutoff = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - retentionMonths, now.getUTCDate())
  );
  return formatUtcDay(cutoff);
}

function parseUtcDayMs(dayStr: string): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dayStr);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const dt = new Date(Date.UTC(year, month - 1, day));
  if (
    dt.getUTCFullYear() !== year ||
    dt.getUTCMonth() !== month - 1 ||
    dt.getUTCDate() !== day
  ) {
    return null;
  }
  return dt.getTime();
}

/**
 * Returns true when `todayDay` is 1..`windowDays` calendar days after `lastSeenDay`.
 */
export function isWithinReturningWindow(
  lastSeenDay: string,
  todayDay: string,
  windowDays: number = ANALYTICS_RETURNING_WINDOW_DAYS
): boolean {
  const lastMs = parseUtcDayMs(lastSeenDay);
  const todayMs = parseUtcDayMs(todayDay);
  if (lastMs === null || todayMs === null) {
    return false;
  }
  const diffDays = Math.round((todayMs - lastMs) / ONE_DAY_MS);
  return diffDays >= 1 && diffDays <= windowDays;
}

export type AnalyticsPayloadValidationResult =
  | { valid: true; event: AnalyticsEvent }
  | { valid: false; reason: 'oversize' | 'invalid_json' | 'schema_invalid' };

/**
 * Validates raw JSON telemetry payload against byte budget (<= 1 KB) and strict closed TypeBox schema.
 */
export function validateAnalyticsEventPayload(
  rawJson: string
): AnalyticsPayloadValidationResult {
  if (utf8ByteLength(rawJson) > ANALYTICS_MAX_PAYLOAD_BYTES) {
    return { valid: false, reason: 'oversize' };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawJson);
  } catch {
    return { valid: false, reason: 'invalid_json' };
  }

  if (!Value.Check(AnalyticsEventSchema, parsed)) {
    return { valid: false, reason: 'schema_invalid' };
  }

  return { valid: true, event: parsed };
}
