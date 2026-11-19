import { describe, it, expect } from 'vitest';
import {
  computeAuditCoverage,
  evaluatePillarTrafficLight,
  evaluateOverallTrafficLight,
  computeScoreConfidence,
  PillarAvailability,
} from '../src/scoring/traffic-light.js';
import type { LayerKey, LayerStatusInfo } from '../src/types/data-status.js';

const fullAvailability: PillarAvailability = {
  connectivity: true,
  building: true,
  socioeconomic: true,
  environmental: true,
  urbanPlanning: true,
};

const fullLayers: Partial<Record<LayerKey, LayerStatusInfo>> = {
  catastro: { status: 'ok', sourceName: 'Catastro OVC' },
  ine: { status: 'ok', sourceName: 'INE ADRH' },
  sica: { status: 'ok', sourceName: 'MITECO SICA' },
  snczi: { status: 'ok', sourceName: 'MITECO SNCZI' },
  connectivity: { status: 'ok', sourceName: 'IGN Equipamientos' },
  urbanPlanning: { status: 'ok', sourceName: 'MIVAU SIU' },
};

describe('Traffic-Light UNCERTAIN State & Audit Coverage', () => {
  it('computes high coverage and GREEN traffic light when all layers and critical sources are available', () => {
    const coverage = computeAuditCoverage(fullLayers, fullAvailability);
    expect(coverage.ok).toBe(6);
    expect(coverage.total).toBe(6);
    expect(coverage.level).toBe('high');
    expect(coverage.pillarsWithData).toBe(5);
    expect(coverage.pillarsTotal).toBe(5);
    expect(coverage.missingCriticalLayers).toEqual([]);

    expect(evaluateOverallTrafficLight(85, coverage)).toBe('GREEN');
    expect(computeScoreConfidence(coverage)).toBe('high');
  });

  it('caps overall traffic light at AMBER (never GREEN) when SICA or SNCZI critical layer is missing', () => {
    const degradedLayers: Partial<Record<LayerKey, LayerStatusInfo>> = {
      ...fullLayers,
      sica: { status: 'unavailable', sourceName: 'MITECO SICA', reason: 'timeout' },
    };
    const coverage = computeAuditCoverage(degradedLayers, fullAvailability);
    expect(coverage.missingCriticalLayers).toEqual(['sica']);
    expect(coverage.level).toBe('partial');

    expect(evaluateOverallTrafficLight(92, coverage)).toBe('AMBER');
    expect(evaluateOverallTrafficLight(40, coverage)).toBe('RED');
    expect(computeScoreConfidence(coverage)).toBe('partial');
  });

  it('excludes not_applicable layers from coverage total denominator', () => {
    const layers: Partial<Record<LayerKey, LayerStatusInfo>> = {
      ...fullLayers,
      mivau: { status: 'out_of_coverage', sourceName: 'MIVAU SERPAVI', reason: 'not_applicable' },
    };
    const coverage = computeAuditCoverage(layers, fullAvailability);
    expect(coverage.total).toBe(6);
    expect(coverage.ok).toBe(6);
    expect(coverage.level).toBe('high');
  });

  it('marks overall traffic light UNCERTAIN when fewer than 3 pillars (<60%) have data', () => {
    const lowAvailability: PillarAvailability = {
      connectivity: false,
      building: true,
      socioeconomic: true,
      environmental: false,
      urbanPlanning: false,
    };
    const coverage = computeAuditCoverage(
      {
        catastro: { status: 'ok', sourceName: 'Catastro OVC' },
        ine: { status: 'ok', sourceName: 'INE ADRH' },
        sica: { status: 'unavailable', sourceName: 'MITECO SICA', reason: 'upstream_error' },
        snczi: { status: 'unavailable', sourceName: 'MITECO SNCZI', reason: 'upstream_error' },
      },
      lowAvailability
    );
    expect(coverage.pillarsWithData).toBe(2);
    expect(coverage.level).toBe('low');
    expect(evaluateOverallTrafficLight(90, coverage)).toBe('UNCERTAIN');
    expect(computeScoreConfidence(coverage)).toBe('uncertain');
  });

  it('evaluates pillar traffic light states preserving RED hazards over critical missing sub-layers', () => {
    expect(evaluatePillarTrafficLight(0, false)).toBe('UNCERTAIN');
    expect(evaluatePillarTrafficLight(88, true, false)).toBe('GREEN');
    expect(evaluatePillarTrafficLight(65, true, false)).toBe('AMBER');
    expect(evaluatePillarTrafficLight(35, true, false)).toBe('RED');
    expect(evaluatePillarTrafficLight(88, true, true)).toBe('UNCERTAIN');
    expect(evaluatePillarTrafficLight(25, true, true)).toBe('RED');
  });
});
