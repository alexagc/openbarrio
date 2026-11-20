import { type AuditScoreBreakdown } from '../types/audit.js';
import { type PropertyTypology } from '../types/catastro.js';
import { type ActiveProfileId, type ProfileId } from '../types/visit-checklist.js';
import {
  evaluateOverallTrafficLight,
  type PillarKey,
  type TrafficLightState,
} from './traffic-light.js';
import {
  DEFAULT_SCORING_WEIGHTS,
  SCORING_WEIGHTS_BY_TYPOLOGY,
  type ScoringWeights,
  getWeightsForTypology,
  renormalizeWeights,
} from './weights.js';

export const PROFILE_IDS = ['family', 'investor', 'senior', 'renter'] as const;

export const PROFILE_MULTIPLIER_MIN = 0.6;
export const PROFILE_MULTIPLIER_MAX = 1.5;

export type DossierTabKey = 'summary' | 'building' | 'environment' | 'market';

export type DossierSectionKey =
  | 'amenities'
  | 'noise'
  | 'flood'
  | 'radon'
  | 'building_inspection'
  | 'seismic'
  | 'energy'
  | 'capex'
  | 'rental'
  | 'fiscal'
  | 'vut'
  | 'market_trends';

export interface ProfileTemplate {
  id: ProfileId;
  pillarWeightMultipliers: ScoringWeights;
  tabOrder: readonly DossierTabKey[];
  sectionOrder: readonly DossierSectionKey[];
  /**
   * Non-scoring focus signals used for dossier ordering and checklist prioritization.
   */
  focusSignals: readonly string[];
}

export const PROFILE_TEMPLATES: Record<ProfileId, ProfileTemplate> = {
  family: {
    id: 'family',
    pillarWeightMultipliers: {
      connectivity: 1.4,
      environmental: 1.4,
      building: 0.8,
      socioeconomic: 0.8,
      urbanPlanning: 0.8,
    },
    tabOrder: ['summary', 'environment', 'building', 'market'],
    sectionOrder: [
      'amenities',
      'noise',
      'flood',
      'radon',
      'building_inspection',
      'energy',
      'capex',
      'seismic',
      'rental',
      'fiscal',
      'vut',
      'market_trends',
    ],
    focusSignals: ['education', 'healthcare', 'parks', 'noise'],
  },
  investor: {
    id: 'investor',
    pillarWeightMultipliers: {
      socioeconomic: 1.4,
      building: 1.4,
      connectivity: 0.8,
      environmental: 0.8,
      urbanPlanning: 0.8,
    },
    tabOrder: ['summary', 'market', 'building', 'environment'],
    sectionOrder: [
      'fiscal',
      'rental',
      'market_trends',
      'capex',
      'building_inspection',
      'vut',
      'energy',
      'seismic',
      'radon',
      'amenities',
      'noise',
      'flood',
    ],
    focusSignals: ['market_trends', 'capex', 'ite', 'vut'],
  },
  senior: {
    id: 'senior',
    pillarWeightMultipliers: {
      connectivity: 1.4,
      environmental: 1.4,
      building: 0.8,
      socioeconomic: 0.8,
      urbanPlanning: 0.8,
    },
    tabOrder: ['summary', 'environment', 'building', 'market'],
    sectionOrder: [
      'amenities',
      'noise',
      'building_inspection',
      'capex',
      'radon',
      'flood',
      'energy',
      'seismic',
      'rental',
      'fiscal',
      'vut',
      'market_trends',
    ],
    focusSignals: ['healthcare', 'transit', 'accessibility', 'noise'],
  },
  renter: {
    id: 'renter',
    pillarWeightMultipliers: {
      building: 1.4,
      socioeconomic: 1.4,
      connectivity: 0.8,
      environmental: 0.8,
      urbanPlanning: 0.8,
    },
    tabOrder: ['summary', 'market', 'building', 'environment'],
    sectionOrder: [
      'rental',
      'energy',
      'building_inspection',
      'noise',
      'amenities',
      'vut',
      'capex',
      'radon',
      'flood',
      'seismic',
      'fiscal',
      'market_trends',
    ],
    focusSignals: ['serpavi', 'cee', 'substandard_housing', 'noise'],
  },
};

export interface ProfileScoreResult {
  profile: ActiveProfileId;
  overallScore: number;
  baseScore: number;
  deltaFromBase: number;
  trafficLight: TrafficLightState;
  weightsUsed: ScoringWeights;
}

export function isProfileId(value: string | null | undefined): value is ProfileId {
  return Boolean(value && (PROFILE_IDS as readonly string[]).includes(value));
}

export function clampProfileMultiplier(multiplier: number): number {
  return Math.min(PROFILE_MULTIPLIER_MAX, Math.max(PROFILE_MULTIPLIER_MIN, multiplier));
}

/**
 * Computes normalized pillar weights for a given typology and decision profile.
 * When `profile === 'none'`, returns exact v2.0.0 base typology weights.
 */
export function getWeightsForProfile(
  typology: PropertyTypology,
  profile: ActiveProfileId = 'none'
): ScoringWeights {
  const base = SCORING_WEIGHTS_BY_TYPOLOGY[typology] ?? DEFAULT_SCORING_WEIGHTS;
  if (profile === 'none') {
    return base;
  }

  const multipliers = PROFILE_TEMPLATES[profile].pillarWeightMultipliers;
  const pillars: PillarKey[] = [
    'connectivity',
    'building',
    'socioeconomic',
    'environmental',
    'urbanPlanning',
  ];

  const raw: ScoringWeights = {
    connectivity: base.connectivity * clampProfileMultiplier(multipliers.connectivity),
    building: base.building * clampProfileMultiplier(multipliers.building),
    socioeconomic: base.socioeconomic * clampProfileMultiplier(multipliers.socioeconomic),
    environmental: base.environmental * clampProfileMultiplier(multipliers.environmental),
    urbanPlanning: base.urbanPlanning * clampProfileMultiplier(multipliers.urbanPlanning),
  };

  const sum = pillars.reduce((acc, p) => acc + raw[p], 0);
  if (sum <= 0) {
    return base;
  }

  return {
    connectivity: raw.connectivity / sum,
    building: raw.building / sum,
    socioeconomic: raw.socioeconomic / sum,
    environmental: raw.environmental / sum,
    urbanPlanning: raw.urbanPlanning / sum,
  };
}

/**
 * Computes the profile-weighted BarrioScore alongside the immutable base score.
 * Never overrides UNCERTAIN or critical-layer (SICA/SNCZI) traffic-light caps.
 */
export function calculateProfileScore(
  score: AuditScoreBreakdown,
  typology: PropertyTypology,
  profile: ActiveProfileId = 'none'
): ProfileScoreResult {
  const baseTrafficLight: TrafficLightState = score.trafficLight ?? 'UNCERTAIN';
  if (profile === 'none') {
    return {
      profile: 'none',
      overallScore: score.overallScore,
      baseScore: score.overallScore,
      deltaFromBase: 0,
      trafficLight: baseTrafficLight,
      weightsUsed: score.weightsUsed ?? getWeightsForTypology(typology),
    };
  }

  const profileWeights = getWeightsForProfile(typology, profile);
  const availability = score.pillarAvailability ?? {
    connectivity: true,
    building: true,
    socioeconomic: true,
    environmental: true,
    urbanPlanning: true,
  };

  const { weightsUsed, activeWeightSum } = renormalizeWeights(profileWeights, availability);
  const { subscores } = score;

  const rawOverall =
    subscores.connectivity * weightsUsed.connectivity +
    subscores.building * weightsUsed.building +
    subscores.socioeconomic * weightsUsed.socioeconomic +
    subscores.environmental * weightsUsed.environmental +
    subscores.urbanPlanning * weightsUsed.urbanPlanning;

  const overallScore =
    activeWeightSum > 0 ? Math.round(Math.min(100, Math.max(0, rawOverall))) : 0;

  let trafficLight: TrafficLightState = baseTrafficLight;
  if (baseTrafficLight !== 'UNCERTAIN') {
    if (score.coverage) {
      trafficLight = evaluateOverallTrafficLight(overallScore, score.coverage);
    } else {
      trafficLight = overallScore >= 75 ? 'GREEN' : overallScore >= 50 ? 'AMBER' : 'RED';
    }
  }

  return {
    profile,
    overallScore,
    baseScore: score.overallScore,
    deltaFromBase: overallScore - score.overallScore,
    trafficLight,
    weightsUsed,
  };
}
