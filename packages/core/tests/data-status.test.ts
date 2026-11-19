import { describe, it, expect } from 'vitest';
import { Value } from '@sinclair/typebox/value';
import {
  STALE_FRESH_DAYS,
  STALE_AMBER_DAYS,
  STALE_MAX_DAYS,
  CRITICAL_LAYER_KEYS,
  LayerStatusInfoSchema,
  SourcesStatusResponseSchema,
  computeStaleAgeDays,
  isStaleAmber,
  isStaleExpired,
  isLayerUsable,
  layerOk,
  layerStale,
  layerUnavailable,
  layerOutOfCoverage,
  toLayerStatusInfo,
} from '../src/types/data-status.js';
import { EnvironmentalDataSchema } from '../src/types/environmental.js';

describe('Data Status & Typed LayerResult Contracts', () => {
  it('defines canonical stale thresholds and critical layers', () => {
    expect(STALE_FRESH_DAYS).toBe(30);
    expect(STALE_AMBER_DAYS).toBe(90);
    expect(STALE_MAX_DAYS).toBe(365);
    expect(CRITICAL_LAYER_KEYS).toEqual(['sica', 'snczi']);
  });

  it('constructs valid LayerResult helpers and converts to LayerStatusInfo', () => {
    const ok = layerOk('MITECO SICA', { dB: 58 }, { sourceDate: '2025-11-01', verifiedAt: '2026-11-19T10:00:00.000Z' });
    expect(ok.status).toBe('ok');
    expect(ok.data).toEqual({ dB: 58 });
    expect(isLayerUsable(ok.status)).toBe(true);
    expect(Value.Check(LayerStatusInfoSchema, toLayerStatusInfo(ok))).toBe(true);

    const stale = layerStale('MITECO SNCZI', { level: 'NONE' }, {
      verifiedAt: '2026-07-01T00:00:00.000Z',
      reason: 'upstream_error',
      staleDays: 141,
    });
    expect(stale.status).toBe('stale');
    expect(isLayerUsable(stale.status)).toBe(true);
    expect(isStaleAmber(stale.staleDays)).toBe(true);
    expect(isStaleExpired(stale.staleDays!)).toBe(false);
    expect(Value.Check(LayerStatusInfoSchema, toLayerStatusInfo(stale))).toBe(true);

    const unavail = layerUnavailable('MITECO SICA', 'timeout');
    expect(unavail.status).toBe('unavailable');
    expect(unavail.data).toBeUndefined();
    expect(isLayerUsable(unavail.status)).toBe(false);
    expect(Value.Check(LayerStatusInfoSchema, toLayerStatusInfo(unavail))).toBe(true);

    const ooc = layerOutOfCoverage('MITECO SICA');
    expect(ooc.status).toBe('out_of_coverage');
    expect(ooc.reason).toBe('no_coverage');
    expect(isLayerUsable(ooc.status)).toBe(false);
    expect(Value.Check(LayerStatusInfoSchema, toLayerStatusInfo(ooc))).toBe(true);
  });

  it('computes stale age days and handles expiration boundary at 365 days', () => {
    const now = new Date('2026-11-19T00:00:00.000Z');
    expect(computeStaleAgeDays('2026-10-20T00:00:00.000Z', now)).toBe(30);
    expect(isStaleAmber(89)).toBe(false);
    expect(isStaleAmber(90)).toBe(true);
    expect(isStaleExpired(365)).toBe(false);
    expect(isStaleExpired(366)).toBe(true);
    expect(computeStaleAgeDays('not-a-date', now)).toBeGreaterThan(STALE_MAX_DAYS);
  });

  it('allows partial/absent noise and floodRisk in EnvironmentalDataSchema', () => {
    expect(Value.Check(EnvironmentalDataSchema, {})).toBe(true);
    expect(
      Value.Check(EnvironmentalDataSchema, {
        noise: {
          dayEveningNightDecibels: 60,
          category: 'MODERATE',
          predominantSource: 'ROAD_TRAFFIC',
        },
      })
    ).toBe(true);
  });

  it('validates SourcesStatusResponseSchema', () => {
    const sample = {
      generatedAt: '2026-11-19T12:00:00.000Z',
      overallStatus: 'degraded',
      sources: [
        {
          key: 'sica',
          sourceName: 'MITECO SICA',
          status: 'outage',
          circuitState: 'open',
          recentFailures: 5,
          lastErrorAt: '2026-11-19T11:59:00.000Z',
        },
      ],
    };
    expect(Value.Check(SourcesStatusResponseSchema, sample)).toBe(true);
  });
});
