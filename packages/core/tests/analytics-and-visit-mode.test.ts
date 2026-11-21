import { describe, it, expect } from 'vitest';
import { Value } from '@sinclair/typebox/value';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_LENS_VALUES,
  ANALYTICS_MAX_PAYLOAD_BYTES,
  ANALYTICS_RETENTION_MONTHS,
  AnalyticsEventSchema,
  TelemetryDailyAggregateSchema,
  VISIT_MODE_MAX_DOSSIERS,
  VISIT_MODE_STALE_WARN_DAYS,
  computeLruEvictionIds,
  computeSavedDossierAgeDays,
  computeTelemetryCutoffDay,
  deriveAnalyticsBucket,
  formatUtcDay,
  isSavedDossierExpired,
  isWithinReturningWindow,
  normalizeVisitDossierId,
  validateAnalyticsEventPayload,
} from '../src/index.js';

describe('Privacy-First Analytics Contracts (@openbarrio/core)', () => {
  it('accepts all closed analytics events and lens values without extra properties', () => {
    for (const eventName of ANALYTICS_EVENTS) {
      if (eventName === 'lens_used') {
        for (const lens of ANALYTICS_LENS_VALUES) {
          expect(Value.Check(AnalyticsEventSchema, { event: 'lens_used', lens })).toBe(true);
          expect(
            Value.Check(AnalyticsEventSchema, {
              event: 'lens_used',
              lens,
              returning14d: true,
            })
          ).toBe(true);
        }
      } else {
        expect(Value.Check(AnalyticsEventSchema, { event: eventName })).toBe(true);
        expect(Value.Check(AnalyticsEventSchema, { event: eventName, returning14d: false })).toBe(
          true
        );
      }
    }
  });

  it('strictly rejects unknown events, invalid lens values, and PII / unknown fields', () => {
    expect(Value.Check(AnalyticsEventSchema, { event: 'page_view' })).toBe(false);
    expect(Value.Check(AnalyticsEventSchema, { event: 'lens_used' })).toBe(false);
    expect(Value.Check(AnalyticsEventSchema, { event: 'lens_used', lens: 'satellite' })).toBe(
      false
    );
    expect(Value.Check(AnalyticsEventSchema, { event: 'dossier_generated', lens: 'layer' })).toBe(
      false
    );

    const piiPayloads = [
      { event: 'dossier_generated', refcat: '9872023VH5797S0001WX' },
      { event: 'dossier_generated', address: 'Gran Vía 28, Madrid' },
      { event: 'dossier_generated', lat: 40.42, lon: -3.7 },
      { event: 'dossier_generated', ip: '192.168.1.1' },
      { event: 'dossier_generated', userId: 'abc-123' },
      { event: 'dossier_generated', email: 'user@example.com' },
      { event: 'dossier_generated', municipality: 'Madrid' },
      { event: 'lens_used', lens: 'layer', visitorId: 'uuid-v4' },
    ];

    for (const payload of piiPayloads) {
      expect(Value.Check(AnalyticsEventSchema, payload)).toBe(false);
      const rawRes = validateAnalyticsEventPayload(JSON.stringify(payload));
      expect(rawRes).toEqual({ valid: false, reason: 'schema_invalid' });
    }
  });

  it('rejects oversized (> 1 KB) and invalid JSON telemetry payloads', () => {
    const oversized = JSON.stringify({
      event: 'dossier_generated',
      extra: 'x'.repeat(ANALYTICS_MAX_PAYLOAD_BYTES + 100),
    });
    expect(validateAnalyticsEventPayload(oversized)).toEqual({
      valid: false,
      reason: 'oversize',
    });

    expect(validateAnalyticsEventPayload('{broken')).toEqual({
      valid: false,
      reason: 'invalid_json',
    });

    const valid = validateAnalyticsEventPayload(
      JSON.stringify({ event: 'lens_used', lens: 'profile', returning14d: true })
    );
    expect(valid).toEqual({
      valid: true,
      event: { event: 'lens_used', lens: 'profile', returning14d: true },
    });
  });

  it('derives low-cardinality daily buckets and validates aggregate DTO schema', () => {
    expect(deriveAnalyticsBucket({ event: 'dossier_generated' })).toBe('standard');
    expect(deriveAnalyticsBucket({ event: 'dossier_generated', returning14d: true })).toBe(
      'returning_14d'
    );
    expect(deriveAnalyticsBucket({ event: 'lens_used', lens: 'layer' })).toBe('layer');
    expect(deriveAnalyticsBucket({ event: 'lens_used', lens: 'checklist', returning14d: true })).toBe(
      'checklist:returning_14d'
    );

    expect(
      Value.Check(TelemetryDailyAggregateSchema, {
        day: '2026-11-19',
        event: 'dossier_generated',
        bucket: 'standard',
        count: 12,
      })
    ).toBe(true);
    expect(
      Value.Check(TelemetryDailyAggregateSchema, {
        day: '2026/11/19',
        event: 'dossier_generated',
        bucket: 'standard',
        count: 12,
      })
    ).toBe(false);
  });

  it('computes 13-month retention cutoff day and 14-day returning window accurately', () => {
    const now = new Date('2026-11-19T12:00:00.000Z');
    expect(formatUtcDay(now)).toBe('2026-11-19');
    expect(ANALYTICS_RETENTION_MONTHS).toBe(13);
    expect(computeTelemetryCutoffDay(now)).toBe('2025-10-19');

    expect(isWithinReturningWindow('2026-11-19', '2026-11-19')).toBe(false);
    expect(isWithinReturningWindow('2026-11-18', '2026-11-19')).toBe(true);
    expect(isWithinReturningWindow('2026-11-05', '2026-11-19')).toBe(true);
    expect(isWithinReturningWindow('2026-11-04', '2026-11-19')).toBe(false);
    expect(isWithinReturningWindow('2026-11-20', '2026-11-19')).toBe(false);
    expect(isWithinReturningWindow('2026-02-31', '2026-11-19')).toBe(false);
  });
});

describe('Visit Mode PWA Contracts (@openbarrio/core)', () => {
  it('normalizes cadastral references into canonical dossier IDs', () => {
    expect(normalizeVisitDossierId(' 9872023-vh5797s.0001wx ')).toBe('9872023VH5797S0001WX');
  });

  it('computes saved dossier expiration strictly beyond VISIT_MODE_STALE_WARN_DAYS (30 days)', () => {
    const now = new Date('2026-11-19T12:00:00.000Z');
    expect(VISIT_MODE_STALE_WARN_DAYS).toBe(30);

    const exact30DaysAgo = new Date(now.getTime() - 30 * 86_400_000).toISOString();
    expect(computeSavedDossierAgeDays(exact30DaysAgo, now)).toBe(30);
    expect(isSavedDossierExpired(exact30DaysAgo, now)).toBe(false);

    const thirtyOneDaysAgo = new Date(now.getTime() - 31 * 86_400_000).toISOString();
    expect(computeSavedDossierAgeDays(thirtyOneDaysAgo, now)).toBe(31);
    expect(isSavedDossierExpired(thirtyOneDaysAgo, now)).toBe(true);
  });

  it('enforces deterministic LRU eviction beyond max 10 saved dossiers', () => {
    expect(VISIT_MODE_MAX_DOSSIERS).toBe(10);

    const tenEntries = Array.from({ length: 10 }, (_, idx) => ({
      id: `RC${String(idx + 1).padStart(2, '0')}`,
      lastAccessedAt: new Date(Date.UTC(2026, 10, idx + 1)).toISOString(),
    }));
    expect(computeLruEvictionIds(tenEntries)).toEqual([]);

    const twelveEntries = [
      ...tenEntries,
      { id: 'RC11', lastAccessedAt: new Date(Date.UTC(2026, 10, 15)).toISOString() },
      { id: 'RC12', lastAccessedAt: new Date(Date.UTC(2026, 10, 16)).toISOString() },
    ];
    expect(computeLruEvictionIds(twelveEntries)).toEqual(['RC01', 'RC02']);

    // Simulate touching RC01 recently so RC02 becomes the oldest to evict
    const touchedEntries = twelveEntries.map((e) =>
      e.id === 'RC01'
        ? { ...e, lastAccessedAt: new Date(Date.UTC(2026, 10, 20)).toISOString() }
        : e
    );
    expect(computeLruEvictionIds(touchedEntries)).toEqual(['RC02', 'RC03']);
  });
});
