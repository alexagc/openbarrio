import { describe, it, expect } from 'vitest';
import { calculateBarrioScore } from '../src/scoring/barrio-score.js';
import { CadastralProperty } from '../src/types/catastro.js';
import { CensusTractIncome } from '../src/types/ine.js';
import { EnvironmentalData } from '../src/types/environmental.js';

describe('Barrio Scoring Engine', () => {
  const mockModernProperty: CadastralProperty = {
    cadastralReference: '9872023VH5797S0001WX',
    address: {
      street: 'Calle de Alcalá',
      number: '42',
      postalCode: '28014',
      municipality: 'Madrid',
      province: 'Madrid',
    },
    coordinates: {
      latitude: 40.418,
      longitude: -3.698,
      srs: 'EPSG:4326',
    },
    building: {
      constructionYear: 2018,
      builtSurfaceM2: 120,
      primaryUse: 'Residencial',
      unitsCount: 16,
      hasCommercialGroundFloor: true,
    },
  };

  const mockWealthyNeighborhood: CensusTractIncome = {
    censusSectionCode: '2807901001',
    averageNetHouseholdIncomeEur: 52000,
    averageNetPersonIncomeEur: 23500,
    percentileInMunicipality: 88,
    rankingInCity: { rank: 120, totalSections: 2450 },
    demographics: { medianAge: 44, singlePersonHouseholdPercentage: 28 },
  };

  const mockSafeEnvironment: EnvironmentalData = {
    noise: {
      dayEveningNightDecibels: 52,
      category: 'QUIET',
      predominantSource: 'ROAD_TRAFFIC',
    },
    floodRisk: {
      level: 'NONE',
      returnPeriodYears: null,
      isInPreferentialFlowZone: false,
    },
  };

  it('calculates top-tier score for modern building in prime area with safe environment', () => {
    const score = calculateBarrioScore(mockModernProperty, mockWealthyNeighborhood, mockSafeEnvironment);

    expect(score.overallScore).toBeGreaterThanOrEqual(85);
    expect(score.buildingHealthScore).toBeGreaterThanOrEqual(95);
    expect(score.socioeconomicScore).toBeGreaterThanOrEqual(80);
    expect(score.acousticComfortScore).toBeGreaterThanOrEqual(85);
    expect(score.climateSafetyScore).toBe(100);

    expect(score.keyHighlights.some((h) => h.includes('CTE'))).toBe(true);
    expect(score.keyHighlights.some((h) => h.includes('Top'))).toBe(true);
    expect(score.keyHighlights.some((h) => h.includes('Zero significant fluvial'))).toBe(true);
  });

  it('correctly flags pre-1980 building, lower income percentile, and flood/noise risks', () => {
    const vintageProperty: CadastralProperty = {
      ...mockModernProperty,
      building: {
        constructionYear: 1965,
        builtSurfaceM2: 85,
        primaryUse: 'Residencial',
        unitsCount: 120,
        hasCommercialGroundFloor: false,
      },
    };

    const modestNeighborhood: CensusTractIncome = {
      ...mockWealthyNeighborhood,
      averageNetHouseholdIncomeEur: 21000,
      averageNetPersonIncomeEur: 9800,
      percentileInMunicipality: 20,
    };

    const riskyEnvironment: EnvironmentalData = {
      noise: {
        dayEveningNightDecibels: 72,
        category: 'NOISY',
        predominantSource: 'ROAD_TRAFFIC',
      },
      floodRisk: {
        level: 'MEDIUM',
        returnPeriodYears: 100,
        isInPreferentialFlowZone: true,
      },
    };

    const score = calculateBarrioScore(vintageProperty, modestNeighborhood, riskyEnvironment);

    expect(score.overallScore).toBeLessThan(60);
    expect(score.buildingHealthScore).toBeLessThan(60);
    expect(score.climateSafetyScore).toBeLessThanOrEqual(40);

    expect(score.keyRisks.some((r) => r.includes('Pre-1980') || r.includes('ITE/IEE'))).toBe(true);
    expect(score.keyRisks.some((r) => r.includes('Below-median'))).toBe(true);
    expect(score.keyRisks.some((r) => r.includes('preferential water flow zone'))).toBe(true);
  });

  it('handles absent optional environmental data gracefully with defaults', () => {
    const score = calculateBarrioScore(mockModernProperty, mockWealthyNeighborhood);

    expect(score.overallScore).toBeGreaterThanOrEqual(80);
    expect(score.acousticComfortScore).toBe(80);
    expect(score.climateSafetyScore).toBe(98);
  });
});
