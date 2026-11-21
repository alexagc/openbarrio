import type { PropertyTypology } from '../types/catastro.js';
import type { PillarAvailability, PillarKey } from './traffic-light.js';

export const METHODOLOGY_VERSION = '2.1.0';

export interface ScoringWeights {
  connectivity: number;
  building: number;
  socioeconomic: number;
  environmental: number;
  urbanPlanning: number;
}

/**
 * Single declarative source of truth for BarrioScore pillar weights per property typology.
 * Both scoring computation and public methodology documentation/UI consume this table.
 */
export const SCORING_WEIGHTS_BY_TYPOLOGY: Record<PropertyTypology, ScoringWeights> = {
  RESIDENTIAL: {
    connectivity: 0.25,
    building: 0.25,
    socioeconomic: 0.20,
    environmental: 0.15,
    urbanPlanning: 0.15,
  },
  COMMERCIAL: {
    connectivity: 0.25,
    building: 0.25,
    socioeconomic: 0.20,
    environmental: 0.15,
    urbanPlanning: 0.15,
  },
  EQUIPMENT: {
    connectivity: 0.25,
    building: 0.25,
    socioeconomic: 0.20,
    environmental: 0.15,
    urbanPlanning: 0.15,
  },
  VACANT_PLOT: {
    connectivity: 0.25,
    building: 0.05,
    socioeconomic: 0.20,
    environmental: 0.25,
    urbanPlanning: 0.25,
  },
  RUSTIC: {
    connectivity: 0.15,
    building: 0.05,
    socioeconomic: 0.20,
    environmental: 0.30,
    urbanPlanning: 0.30,
  },
  INDUSTRIAL: {
    connectivity: 0.15,
    building: 0.35,
    socioeconomic: 0.10,
    environmental: 0.15,
    urbanPlanning: 0.25,
  },
};

export const DEFAULT_SCORING_WEIGHTS: ScoringWeights =
  SCORING_WEIGHTS_BY_TYPOLOGY.RESIDENTIAL;

export interface EnvironmentalSubweights {
  withAqi: {
    sica: number;
    snczi: number;
    airQuality: number;
  };
  withoutAqi: {
    sica: number;
    snczi: number;
  };
}

export const ENVIRONMENTAL_SUBWEIGHTS: EnvironmentalSubweights = {
  withAqi: {
    sica: 0.50,
    snczi: 0.35,
    airQuality: 0.15,
  },
  withoutAqi: {
    sica: 0.55,
    snczi: 0.45,
  },
};

export interface ScoringModifierEntry {
  id: string;
  pillar: PillarKey | 'building_and_urbanPlanning';
  points: number;
  signedLabel: string;
  rule: string;
}

/**
 * Declarative registry of all explicit bonuses and penalties applied in BarrioScore.
 */
export const SCORING_MODIFIERS: ScoringModifierEntry[] = [
  {
    id: 'renovation_post_2000',
    pillar: 'building',
    points: 15,
    signedLabel: '+15',
    rule: 'Documented major structural renovation from year 2000 onward (capped at 95).',
  },
  {
    id: 'low_density_residential',
    pillar: 'building',
    points: 5,
    signedLabel: '+5',
    rule: 'Residential building with balanced multi-unit count between 2 and 40 units.',
  },
  {
    id: 'high_density_residential',
    pillar: 'building',
    points: -5,
    signedLabel: '-5',
    rule: 'High-density residential complex exceeding 100 cadastral units.',
  },
  {
    id: 'cee_official_ab',
    pillar: 'building',
    points: 5,
    signedLabel: '+5',
    rule: 'Official non-estimated Energy Performance Certificate rated Class A or B.',
  },
  {
    id: 'cee_low_fg',
    pillar: 'building',
    points: -5,
    signedLabel: '-5',
    rule: 'Low Energy Performance Certificate rating Class F or G.',
  },
  {
    id: 'cee_expired',
    pillar: 'building',
    points: -2,
    signedLabel: '-2',
    rule: 'Expired Energy Performance Certificate requiring renewal under RD 390/2021.',
  },
  {
    id: 'substandard_housing',
    pillar: 'building_and_urbanPlanning',
    points: -25,
    signedLabel: '-25',
    rule: 'High-severity commercial-to-residential conversion risk without habitability status.',
  },
  {
    id: 'ite_favorable',
    pillar: 'building',
    points: 5,
    signedLabel: '+5',
    rule: 'Favorable Technical Building Inspection (ITE/IEE favorable) in municipal registry.',
  },
  {
    id: 'ite_unfavorable',
    pillar: 'building',
    points: -20,
    signedLabel: '-20',
    rule: 'Unfavorable Technical Building Inspection (ITE/IEE desfavorable) with active defects.',
  },
  {
    id: 'seismic_vulnerability',
    pillar: 'building',
    points: -8,
    signedLabel: '-8',
    rule: 'Pre-NCSE-94 structure in seismic zone ab >= 0.08g, or environmental penalty when ab >= 0.12g.',
  },
  {
    id: 'preferential_flood_zone',
    pillar: 'environmental',
    points: -25,
    signedLabel: '-25',
    rule: 'Flood safety sub-score penalty when parcel lies within MITECO Preferential Flow Zone.',
  },
  {
    id: 'protected_land',
    pillar: 'urbanPlanning',
    points: -20,
    signedLabel: '-20',
    rule: 'Parcel intersects an environmental, heritage, or scenic protection overlay.',
  },
  {
    id: 'vut_moderate',
    pillar: 'urbanPlanning',
    points: -5,
    signedLabel: '-5 to -10',
    rule: 'Moderate tourist-apartment density (3% <= VUT ratio < 8% in census tract).',
  },
  {
    id: 'vut_critical',
    pillar: 'urbanPlanning',
    points: -15,
    signedLabel: '-15 to -25',
    rule: 'Critical tourist-apartment saturation (VUT ratio >= 8% in census tract).',
  },
];

export interface MethodologyChangelogEntry {
  version: string;
  date: string;
  summary: string;
}

export const METHODOLOGY_CHANGELOG: MethodologyChangelogEntry[] = [
  {
    version: '2.1.0',
    date: '2026-11-20',
    summary:
      'Added deterministic decision-profile weight multipliers (family, investor, senior, renter) with [0.6-1.5] clamp and renormalization while preserving immutable base BarrioScore and UNCERTAIN/critical-layer caps.',
  },
  {
    version: '2.0.0',
    date: '2026-11-19',
    summary:
      'Eliminated silent favorable defaults on unavailable/out-of-coverage layers; added proportional weight renormalization across verified pillars, UNCERTAIN (<3/5 pillars) traffic-light state, and SICA/SNCZI critical-layer green ceiling.',
  },
  {
    version: '1.0.0',
    date: '2026-10-01',
    summary:
      'Initial 5-pillar weighted BarrioScore across Catastro OVC, INE ADRH, MITECO SICA/SNCZI, MIVAU SERPAVI/SIU, and CNIG 15-minute civic connectivity.',
  },
];

export function getWeightsForTypology(
  typology: PropertyTypology,
  customWeights?: ScoringWeights
): ScoringWeights {
  if (customWeights && customWeights !== DEFAULT_SCORING_WEIGHTS) {
    return customWeights;
  }
  return SCORING_WEIGHTS_BY_TYPOLOGY[typology] ?? DEFAULT_SCORING_WEIGHTS;
}

/**
 * Proportionally renormalizes base pillar weights over the subset of pillars with usable data.
 * Pillars without usable data always receive weight 0 so missing data never inflates the score.
 */
export function renormalizeWeights(
  baseWeights: ScoringWeights,
  availability: PillarAvailability
): { weightsUsed: ScoringWeights; activeWeightSum: number } {
  const keys = Object.keys(availability) as PillarKey[];
  const activeWeightSum = keys.reduce(
    (sum, key) => (availability[key] ? sum + baseWeights[key] : sum),
    0
  );

  const weightsUsed: ScoringWeights = {
    connectivity:
      availability.connectivity && activeWeightSum > 0
        ? baseWeights.connectivity / activeWeightSum
        : 0,
    building:
      availability.building && activeWeightSum > 0
        ? baseWeights.building / activeWeightSum
        : 0,
    socioeconomic:
      availability.socioeconomic && activeWeightSum > 0
        ? baseWeights.socioeconomic / activeWeightSum
        : 0,
    environmental:
      availability.environmental && activeWeightSum > 0
        ? baseWeights.environmental / activeWeightSum
        : 0,
    urbanPlanning:
      availability.urbanPlanning && activeWeightSum > 0
        ? baseWeights.urbanPlanning / activeWeightSum
        : 0,
  };

  return { weightsUsed, activeWeightSum };
}
