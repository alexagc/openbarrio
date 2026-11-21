import { describe, it, expect } from 'vitest';
import { Value } from '@sinclair/typebox/value';
import {
  ALL_LAYER_KEYS,
  BROADBAND_STALE_MAX_DAYS,
  BroadbandCoverageSchema,
  evaluateBroadbandLayerStatus,
} from '../src/index.js';

describe('Broadband Coverage Contracts & Staleness Policy', () => {
  const fixedNow = new Date('2026-11-19T12:00:00.000Z');

  it('registers broadband in ALL_LAYER_KEYS with 15 layers total', () => {
    expect(ALL_LAYER_KEYS).toContain('broadband');
    expect(ALL_LAYER_KEYS).toHaveLength(15);
    expect(BROADBAND_STALE_MAX_DAYS).toBe(2190);
  });

  it('validates municipal and population_entity payloads against BroadbandCoverageSchema', () => {
    const validMunicipal = {
      municipalityCode: '28079',
      territoryCode: '28079',
      entityName: 'Madrid',
      granularity: 'municipality',
      ftthPct: 99.1,
      fixedMaxMbps: 10000,
      mobile5gPct: 98.4,
      sourceYear: 2025,
      sourceDate: '2026-11-01',
      sourceDataset: 'CNMCData / SETELECO Municipal 2025',
      disclaimer: 'Municipal aggregate; does not guarantee active CTO at this specific portal.',
      informativeOnly: true as const,
    };
    expect(Value.Check(BroadbandCoverageSchema, validMunicipal)).toBe(true);

    const invalidPct = { ...validMunicipal, ftthPct: 120 };
    expect(Value.Check(BroadbandCoverageSchema, invalidPct)).toBe(false);

    const invalidGranularity = { ...validMunicipal, granularity: 'province' };
    expect(Value.Check(BroadbandCoverageSchema, invalidGranularity)).toBe(false);
  });

  it('evaluates municipal freshness, historical ESP 2020 staleness, and >2190d expiration', () => {
    // 1. Fresh municipal (18d <= 30d) -> ok
    expect(evaluateBroadbandLayerStatus('2026-11-01', 'municipality', fixedNow)).toEqual({
      status: 'ok',
      staleDays: 18,
    });

    // 2. Aged municipal SETELECO 2024 -> stale (within 2190d ceiling)
    const aged2024 = evaluateBroadbandLayerStatus('2024-06-30', 'municipality', fixedNow);
    expect(aged2024.status).toBe('stale');
    expect(aged2024.staleDays).toBeGreaterThan(365);
    expect(aged2024.staleDays).toBeLessThanOrEqual(BROADBAND_STALE_MAX_DAYS);

    // 3. Discontinued SETELECO ESP 2020 ('population_entity') -> always stale within 2190d
    const esp2020 = evaluateBroadbandLayerStatus('2020-12-31', 'population_entity', fixedNow);
    expect(esp2020.status).toBe('stale');
    expect(esp2020.staleDays).toBeLessThanOrEqual(BROADBAND_STALE_MAX_DAYS);

    // Even if synthetic population_entity carried a recent cutoff, never classify as ok
    expect(evaluateBroadbandLayerStatus('2026-11-17', 'population_entity', fixedNow)).toEqual({
      status: 'stale',
      staleDays: 2,
    });

    // 4. Older than 2190d -> unavailable
    const expired = evaluateBroadbandLayerStatus('2020-11-10', 'population_entity', fixedNow);
    expect(expired.status).toBe('unavailable');
    expect(expired.staleDays).toBeGreaterThan(BROADBAND_STALE_MAX_DAYS);

    // 5. Invalid date -> unavailable
    const invalidDate = evaluateBroadbandLayerStatus('not-a-date', 'municipality', fixedNow);
    expect(invalidDate.status).toBe('unavailable');
    expect(invalidDate.staleDays).toBeGreaterThan(BROADBAND_STALE_MAX_DAYS);
  });
});
