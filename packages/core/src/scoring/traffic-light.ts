import { Type, Static } from '@sinclair/typebox';
import {
  CRITICAL_LAYER_KEYS,
  LayerKey,
  LayerKeySchema,
  LayerStatusInfo,
  isLayerUsable,
} from '../types/data-status.js';

export const TrafficLightStateSchema = Type.Union([
  Type.Literal('GREEN'),
  Type.Literal('AMBER'),
  Type.Literal('RED'),
  Type.Literal('UNCERTAIN'),
]);

export const PillarKeySchema = Type.Union([
  Type.Literal('connectivity'),
  Type.Literal('building'),
  Type.Literal('socioeconomic'),
  Type.Literal('environmental'),
  Type.Literal('urbanPlanning'),
]);

export const ScoreConfidenceSchema = Type.Union([
  Type.Literal('high'),
  Type.Literal('partial'),
  Type.Literal('uncertain'),
]);

export const CoverageLevelSchema = Type.Union([
  Type.Literal('high'),
  Type.Literal('partial'),
  Type.Literal('low'),
]);

export const PillarAvailabilitySchema = Type.Object({
  connectivity: Type.Boolean(),
  building: Type.Boolean(),
  socioeconomic: Type.Boolean(),
  environmental: Type.Boolean(),
  urbanPlanning: Type.Boolean(),
});

export const PillarTrafficLightsSchema = Type.Object({
  connectivity: TrafficLightStateSchema,
  building: TrafficLightStateSchema,
  socioeconomic: TrafficLightStateSchema,
  environmental: TrafficLightStateSchema,
  urbanPlanning: TrafficLightStateSchema,
});

export const AuditCoverageSchema = Type.Object({
  ok: Type.Number({ minimum: 0 }),
  total: Type.Number({ minimum: 0 }),
  level: CoverageLevelSchema,
  pillarsWithData: Type.Number({ minimum: 0, maximum: 5 }),
  pillarsTotal: Type.Number({ minimum: 5, maximum: 5 }),
  missingCriticalLayers: Type.Array(LayerKeySchema),
});

export type TrafficLightState = Static<typeof TrafficLightStateSchema>;
export type PillarKey = Static<typeof PillarKeySchema>;
export type ScoreConfidence = Static<typeof ScoreConfidenceSchema>;
export type CoverageLevel = Static<typeof CoverageLevelSchema>;
export type PillarAvailability = Static<typeof PillarAvailabilitySchema>;
export type PillarTrafficLights = Static<typeof PillarTrafficLightsSchema>;
export type AuditCoverage = Static<typeof AuditCoverageSchema>;

/**
 * Computes layer and pillar data coverage along with missing critical layers (SICA, SNCZI).
 */
export function computeAuditCoverage(
  layers: Partial<Record<LayerKey, LayerStatusInfo>>,
  pillarAvailability: PillarAvailability
): AuditCoverage {
  let ok = 0;
  let total = 0;

  for (const info of Object.values(layers)) {
    if (!info || info.reason === 'not_applicable') {
      continue;
    }
    total += 1;
    if (isLayerUsable(info.status)) {
      ok += 1;
    }
  }

  const missingCriticalLayers: LayerKey[] = [];
  for (const criticalKey of CRITICAL_LAYER_KEYS) {
    const info = layers[criticalKey];
    if (info && (info.status === 'unavailable' || info.status === 'out_of_coverage')) {
      missingCriticalLayers.push(criticalKey);
    }
  }

  const pillarsWithData = Object.values(pillarAvailability).filter(Boolean).length;
  const pillarsTotal = 5;

  let level: CoverageLevel;
  if (pillarsWithData >= 4 && missingCriticalLayers.length === 0 && (total === 0 || ok / total >= 0.8)) {
    level = 'high';
  } else if (pillarsWithData >= 3) {
    level = 'partial';
  } else {
    level = 'low';
  }

  return {
    ok,
    total,
    level,
    pillarsWithData,
    pillarsTotal,
    missingCriticalLayers,
  };
}

/**
 * Evaluates a single pillar traffic-light state.
 * Confirmed hazards (score < 50) always surface as RED even if a sibling sub-layer is missing.
 */
export function evaluatePillarTrafficLight(
  score: number,
  available: boolean,
  criticalMissing: boolean = false
): TrafficLightState {
  if (!available) {
    return 'UNCERTAIN';
  }
  if (score < 50) {
    return 'RED';
  }
  if (criticalMissing) {
    return 'UNCERTAIN';
  }
  return score >= 75 ? 'GREEN' : 'AMBER';
}

/**
 * Evaluates the overall report traffic-light state.
 * - Fewer than 3 pillars (<60%) yields UNCERTAIN (gray).
 * - Any missing critical layer prevents GREEN (ceiling is AMBER, unless score <50 -> RED).
 */
export function evaluateOverallTrafficLight(
  overallScore: number,
  coverage: AuditCoverage
): TrafficLightState {
  if (coverage.pillarsWithData <= 2) {
    return 'UNCERTAIN';
  }

  const base: TrafficLightState =
    overallScore >= 75 ? 'GREEN' : overallScore >= 50 ? 'AMBER' : 'RED';

  if (coverage.missingCriticalLayers.length > 0 && base === 'GREEN') {
    return 'AMBER';
  }

  return base;
}

/**
 * Derives overall score confidence from coverage and critical-layer completeness.
 */
export function computeScoreConfidence(coverage: AuditCoverage): ScoreConfidence {
  if (coverage.pillarsWithData <= 2) {
    return 'uncertain';
  }
  if (
    coverage.missingCriticalLayers.length > 0 ||
    coverage.pillarsWithData < coverage.pillarsTotal ||
    coverage.level !== 'high'
  ) {
    return 'partial';
  }
  return 'high';
}
