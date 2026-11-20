import { describe, it, expect } from 'vitest';
import {
  PROFILE_IDS,
  PROFILE_TEMPLATES,
  PROFILE_MULTIPLIER_MIN,
  PROFILE_MULTIPLIER_MAX,
  SCORING_WEIGHTS_BY_TYPOLOGY,
  METHODOLOGY_VERSION,
  calculateBarrioScore,
  calculateProfileScore,
  getWeightsForProfile,
  clampProfileMultiplier,
  type PropertyTypology,
  type CadastralProperty,
} from '../src/index.js';

const TYPOLOGIES: PropertyTypology[] = [
  'RESIDENTIAL',
  'COMMERCIAL',
  'EQUIPMENT',
  'VACANT_PLOT',
  'RUSTIC',
  'INDUSTRIAL',
];

function createSampleProperty(typology: PropertyTypology): CadastralProperty {
  return {
    cadastralReference: '1234567VK1234S0001AB',
    address: {
      street: 'Calle Mayor',
      number: '10',
      postalCode: '28013',
      municipality: 'Madrid',
      province: 'Madrid',
      municipalityCode: '28079',
      provinceCode: '28',
    },
    coordinates: { lat: 40.4168, lon: -3.7038 },
    building: {
      constructionYear: 2012,
      builtSurfaceM2: 1200,
      unitsCount: 12,
      primaryUse: 'Residencial',
      hasCommercialGroundFloor: false,
    },
    typology,
  };
}

describe('Decision Profiles & Weights v2.1.0', () => {
  it('sets METHODOLOGY_VERSION to 2.1.0', () => {
    expect(METHODOLOGY_VERSION).toBe('2.1.0');
  });

  it('clamps multipliers within [0.6, 1.5] and keeps all template multipliers in bounds', () => {
    expect(clampProfileMultiplier(0.2)).toBe(PROFILE_MULTIPLIER_MIN);
    expect(clampProfileMultiplier(2.0)).toBe(PROFILE_MULTIPLIER_MAX);

    for (const id of PROFILE_IDS) {
      const mult = PROFILE_TEMPLATES[id].pillarWeightMultipliers;
      for (const val of Object.values(mult)) {
        expect(val).toBeGreaterThanOrEqual(PROFILE_MULTIPLIER_MIN);
        expect(val).toBeLessThanOrEqual(PROFILE_MULTIPLIER_MAX);
      }
    }
  });

  it('renormalizes profile weights to sum to 1.0 across every profile x typology', () => {
    for (const typology of TYPOLOGIES) {
      const noneWeights = getWeightsForProfile(typology, 'none');
      expect(noneWeights).toEqual(SCORING_WEIGHTS_BY_TYPOLOGY[typology]);

      for (const profile of PROFILE_IDS) {
        const w = getWeightsForProfile(typology, profile);
        const sum =
          w.connectivity +
          w.building +
          w.socioeconomic +
          w.environmental +
          w.urbanPlanning;
        expect(sum).toBeCloseTo(1, 6);
      }
    }
  });

  it('preserves exact v2.0.0 base score when profile is none (non-regression)', () => {
    const score = calculateBarrioScore({
      property: createSampleProperty('RESIDENTIAL'),
      neighborhood: {
        censusSectionCode: '2807901001',
        municipalityName: 'Madrid',
        averageNetHouseholdIncomeEur: 42000,
        percentileInMunicipality: 82,
      },
      environment: {
        noise: { dayEveningNightDecibels: 52, predominantSource: 'TRAFFIC' },
        floodRisk: { level: 'NONE', returnPeriodYears: null, isInPreferentialFlowZone: false },
      },
      connectivity: {
        walkScore15Min: 92,
      },
      urbanPlanning: {
        landClassification: 'URBAN_CONSOLIDATED',
        isProtectedLand: false,
        isStressedHousingZone: false,
      },
    });

    const noneResult = calculateProfileScore(score, 'RESIDENTIAL', 'none');
    expect(noneResult.overallScore).toBe(score.overallScore);
    expect(noneResult.baseScore).toBe(score.overallScore);
    expect(noneResult.deltaFromBase).toBe(0);
    expect(noneResult.trafficLight).toBe(score.trafficLight);
  });

  it('satisfies monotonicity: increasing a boosted pillar increases or keeps profile score >= base delta', () => {
    const base = calculateBarrioScore({
      property: createSampleProperty('RESIDENTIAL'),
      neighborhood: {
        censusSectionCode: '2807901001',
        municipalityName: 'Madrid',
        averageNetHouseholdIncomeEur: 22000,
        percentileInMunicipality: 35,
      },
      environment: {
        noise: { dayEveningNightDecibels: 48, predominantSource: 'TRAFFIC' },
        floodRisk: { level: 'NONE', returnPeriodYears: null, isInPreferentialFlowZone: false },
      },
      connectivity: { walkScore15Min: 95 },
      urbanPlanning: {
        landClassification: 'URBAN_CONSOLIDATED',
        isProtectedLand: false,
        isStressedHousingZone: false,
      },
    });

    // Family boosts connectivity & environmental (both ~95 here) over socioeconomic (low)
    const familyResult = calculateProfileScore(base, 'RESIDENTIAL', 'family');
    // Investor boosts socioeconomic (low) & building over connectivity/environmental
    const investorResult = calculateProfileScore(base, 'RESIDENTIAL', 'investor');

    expect(familyResult.overallScore).toBeGreaterThan(base.overallScore);
    expect(familyResult.overallScore).toBeGreaterThan(investorResult.overallScore);
    expect(familyResult.baseScore).toBe(base.overallScore);
  });

  it('never upgrades UNCERTAIN or bypasses CRITICAL_LAYER_KEYS cap', () => {
    const uncertainScore = calculateBarrioScore({
      property: createSampleProperty('RESIDENTIAL'),
      connectivity: { walkScore15Min: 95 },
      layers: {
        catastro: { status: 'ok', sourceName: 'Catastro OVC' },
        connectivity: { status: 'ok', sourceName: 'CNIG' },
        ine: { status: 'unavailable', sourceName: 'INE ADRH', reason: 'timeout' },
        sica: { status: 'unavailable', sourceName: 'MITECO SICA', reason: 'timeout' },
        snczi: { status: 'unavailable', sourceName: 'MITECO SNCZI', reason: 'timeout' },
        urbanPlanning: { status: 'unavailable', sourceName: 'MIVAU SIU', reason: 'timeout' },
      },
    });

    expect(uncertainScore.trafficLight).toBe('UNCERTAIN');
    for (const profile of PROFILE_IDS) {
      const res = calculateProfileScore(uncertainScore, 'RESIDENTIAL', profile);
      expect(res.trafficLight).toBe('UNCERTAIN');
    }

    // Now 4/5 pillars ok, but SICA is missing -> ceiling is AMBER (never GREEN)
    const missingCriticalScore = calculateBarrioScore({
      property: createSampleProperty('RESIDENTIAL'),
      neighborhood: {
        censusSectionCode: '2807901001',
        municipalityName: 'Madrid',
        averageNetHouseholdIncomeEur: 50000,
        percentileInMunicipality: 90,
      },
      environment: {
        floodRisk: { level: 'NONE', returnPeriodYears: null, isInPreferentialFlowZone: false },
      },
      connectivity: { walkScore15Min: 95 },
      urbanPlanning: {
        landClassification: 'URBAN_CONSOLIDATED',
        isProtectedLand: false,
        isStressedHousingZone: false,
      },
      layers: {
        catastro: { status: 'ok', sourceName: 'Catastro OVC' },
        ine: { status: 'ok', sourceName: 'INE ADRH' },
        sica: { status: 'unavailable', sourceName: 'MITECO SICA', reason: 'timeout' },
        snczi: { status: 'ok', sourceName: 'MITECO SNCZI' },
        connectivity: { status: 'ok', sourceName: 'CNIG' },
        urbanPlanning: { status: 'ok', sourceName: 'MIVAU SIU' },
      },
    });

    expect(missingCriticalScore.trafficLight).toBe('AMBER');
    for (const profile of PROFILE_IDS) {
      const res = calculateProfileScore(missingCriticalScore, 'RESIDENTIAL', profile);
      expect(res.trafficLight).not.toBe('GREEN');
    }
  });
});
