import { describe, it, expect } from 'vitest';
import { calculateBarrioScore } from '../src/scoring/barrio-score.js';
import { CadastralProperty } from '../src/types/catastro.js';
import { CensusTractIncome } from '../src/types/ine.js';
import { EnvironmentalData } from '../src/types/environmental.js';
import { CivicConnectivityData } from '../src/types/connectivity.js';
import { UrbanPlanningData } from '../src/types/urban-planning.js';

describe('Barrio Scoring Engine v0.3.0', () => {
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

  const mockCivicConnectivity: CivicConnectivityData = {
    walkScore15Min: 92,
    facilitiesWithin15MinCount: 14,
    nearestHealthcare: {
      id: 'hosp-1',
      type: 'healthcare',
      subtype: 'primary_care',
      name: 'Centro de Salud Justicia',
      distanceMeters: 280,
      walkTimeMinutes: 3.7,
    },
    nearestEducation: {
      id: 'edu-1',
      type: 'education',
      subtype: 'school',
      name: 'CEIP Isabel la Católica',
      distanceMeters: 350,
      walkTimeMinutes: 4.6,
    },
    nearestTransit: {
      id: 'trn-1',
      type: 'transit',
      subtype: 'metro',
      name: 'Metro Banco de España',
      distanceMeters: 190,
      walkTimeMinutes: 2.5,
    },
    nearestPark: {
      id: 'prk-1',
      type: 'park',
      subtype: 'urban_park',
      name: 'Jardines del Buen Retiro',
      distanceMeters: 450,
      walkTimeMinutes: 6.0,
    },
  };

  const mockUrbanPlanning: UrbanPlanningData = {
    landClassification: 'URBAN_CONSOLIDATED',
    zoningCode: 'NZ-1',
    isProtectedLand: false,
    declaredRenovationsCount: 1,
    lastRenovationYear: 2021,
    isStressedHousingZone: true,
  };

  it('calculates top-tier score for modern building in prime area with safe environment', () => {
    const score = calculateBarrioScore(mockModernProperty, mockWealthyNeighborhood, mockSafeEnvironment);

    expect(score.overallScore).toBeGreaterThanOrEqual(85);
    expect(score.buildingHealthScore).toBeGreaterThanOrEqual(95);
    expect(score.socioeconomicScore).toBeGreaterThanOrEqual(80);
    expect(score.acousticComfortScore).toBeGreaterThanOrEqual(85);
    expect(score.climateSafetyScore).toBe(100);

    // Verify subscores existence in v0.3.0
    expect(score.subscores).toBeDefined();
    expect(score.subscores.building).toBeGreaterThanOrEqual(95);
    expect(score.subscores.socioeconomic).toBeGreaterThanOrEqual(80);
    expect(score.subscores.connectivity).toBeGreaterThanOrEqual(70);
    expect(score.subscores.environmental).toBeGreaterThanOrEqual(85);
    expect(score.subscores.urbanPlanning).toBeGreaterThanOrEqual(80);

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
    expect(score.subscores.building).toBeLessThan(60);
    expect(score.subscores.environmental).toBeLessThan(50);

    expect(score.keyRisks.some((r) => r.includes('Pre-1980') || r.includes('ITE/IEE'))).toBe(true);
    expect(score.keyRisks.some((r) => r.includes('Below-median'))).toBe(true);
    expect(score.keyRisks.some((r) => r.includes('preferential water flow zone'))).toBe(true);
  });

  it('handles absent optional environmental data gracefully with defaults', () => {
    const score = calculateBarrioScore(mockModernProperty, mockWealthyNeighborhood);

    expect(score.overallScore).toBeGreaterThanOrEqual(80);
    expect(score.acousticComfortScore).toBe(80);
    expect(score.climateSafetyScore).toBe(98);
    expect(score.subscores.environmental).toBeGreaterThanOrEqual(80);
  });

  it('adds due diligence alert when property is in a declared stressed housing zone', () => {
    const stressedBenchmark = {
      officialRangeLowerEurM2: 14.5,
      officialRangeUpperEurM2: 18.2,
      estimatedMonthlyRentLowerEur: 1740,
      estimatedMonthlyRentUpperEur: 2184,
      isStressedHousingZone: true,
    };

    const score = calculateBarrioScore(
      mockModernProperty,
      mockWealthyNeighborhood,
      mockSafeEnvironment,
      stressedBenchmark
    );

    expect(score.keyRisks.some((r) => r.includes('Zona Tensionada'))).toBe(true);
  });

  it('adds positive highlight when property is outside declared stressed housing zones', () => {
    const unstressedBenchmark = {
      officialRangeLowerEurM2: 10.0,
      officialRangeUpperEurM2: 12.5,
      estimatedMonthlyRentLowerEur: 1200,
      estimatedMonthlyRentUpperEur: 1500,
      isStressedHousingZone: false,
    };

    const score = calculateBarrioScore(
      mockModernProperty,
      mockWealthyNeighborhood,
      mockSafeEnvironment,
      unstressedBenchmark
    );

    expect(score.keyHighlights.some((h) => h.includes('Unrestricted rental market'))).toBe(true);
  });

  it('incorporates comprehensive 15-minute civic connectivity indicators and highlights', () => {
    const score = calculateBarrioScore(
      mockModernProperty,
      mockWealthyNeighborhood,
      mockSafeEnvironment,
      undefined,
      mockCivicConnectivity,
      mockUrbanPlanning
    );

    expect(score.subscores.connectivity).toBe(92);
    expect(score.keyHighlights.some((h) => h.includes('15-minute civic connectivity'))).toBe(true);
    expect(score.keyHighlights.some((h) => h.includes('Centro de Salud Justicia'))).toBe(true);
    expect(score.keyHighlights.some((h) => h.includes('Metro Banco de España'))).toBe(true);
    expect(score.keyHighlights.some((h) => h.includes('CEIP Isabel la Católica'))).toBe(true);
    expect(score.keyHighlights.some((h) => h.includes('Jardines del Buen Retiro'))).toBe(true);
  });

  it('correctly handles poor civic connectivity with risk flag', () => {
    const poorConnectivity: CivicConnectivityData = {
      walkScore15Min: 35,
      facilitiesWithin15MinCount: 1,
    };

    const score = calculateBarrioScore(
      mockModernProperty,
      mockWealthyNeighborhood,
      mockSafeEnvironment,
      undefined,
      poorConnectivity
    );

    expect(score.subscores.connectivity).toBe(35);
    expect(score.keyRisks.some((r) => r.includes('Limited 15-minute civic walkability'))).toBe(true);
  });

  it('evaluates urban planning classification, protection flags and structural renovation', () => {
    const rusticProtected: UrbanPlanningData = {
      landClassification: 'RUSTIC_PROTECTED',
      isProtectedLand: true,
      declaredRenovationsCount: 0,
      lastRenovationYear: null,
      isStressedHousingZone: false,
    };

    const score = calculateBarrioScore(
      mockModernProperty,
      mockWealthyNeighborhood,
      mockSafeEnvironment,
      undefined,
      undefined,
      rusticProtected
    );

    expect(score.subscores.urbanPlanning).toBeLessThanOrEqual(30);
    expect(score.keyRisks.some((r) => r.includes('Suelo Rústico Protegido'))).toBe(true);
    expect(score.keyRisks.some((r) => r.includes('protection zone'))).toBe(true);
  });

  it('integrates air quality (AQI) data into the environmental subscore', () => {
    const envWithGoodAqi: EnvironmentalData = {
      ...mockSafeEnvironment,
      airQuality: {
        aqiIndex: 25,
        category: 'GOOD',
        stationName: 'Plaza del Carmen',
        no2MicrogramsM3: 18,
        pm25MicrogramsM3: 7,
      },
    };

    const scoreGood = calculateBarrioScore(mockModernProperty, mockWealthyNeighborhood, envWithGoodAqi);
    expect(scoreGood.keyHighlights.some((h) => h.includes('air quality recorded at station Plaza del Carmen'))).toBe(true);
    expect(scoreGood.subscores.environmental).toBeGreaterThanOrEqual(90);

    const envWithPoorAqi: EnvironmentalData = {
      ...mockSafeEnvironment,
      airQuality: {
        aqiIndex: 165,
        category: 'POOR',
        stationName: 'Escuelas Aguirre',
        no2MicrogramsM3: 88,
        pm10MicrogramsM3: 75,
      },
    };

    const scorePoor = calculateBarrioScore(mockModernProperty, mockWealthyNeighborhood, envWithPoorAqi);
    expect(scorePoor.keyRisks.some((r) => r.includes('Poor air quality recorded at station Escuelas Aguirre'))).toBe(true);
    expect(scorePoor.subscores.environmental).toBeLessThan(scoreGood.subscores.environmental);
  });

  it('guarantees all subscores and overall score are bounded between 0 and 100', () => {
    const score = calculateBarrioScore(
      mockModernProperty,
      mockWealthyNeighborhood,
      mockSafeEnvironment,
      undefined,
      mockCivicConnectivity,
      mockUrbanPlanning
    );

    const subscores = score.subscores;
    expect(subscores.building).toBeGreaterThanOrEqual(0);
    expect(subscores.building).toBeLessThanOrEqual(100);
    expect(subscores.connectivity).toBeGreaterThanOrEqual(0);
    expect(subscores.connectivity).toBeLessThanOrEqual(100);
    expect(subscores.environmental).toBeGreaterThanOrEqual(0);
    expect(subscores.environmental).toBeLessThanOrEqual(100);
    expect(subscores.socioeconomic).toBeGreaterThanOrEqual(0);
    expect(subscores.socioeconomic).toBeLessThanOrEqual(100);
    expect(subscores.urbanPlanning).toBeGreaterThanOrEqual(0);
    expect(subscores.urbanPlanning).toBeLessThanOrEqual(100);
    expect(score.overallScore).toBeGreaterThanOrEqual(0);
    expect(score.overallScore).toBeLessThanOrEqual(100);
  });

  it('incorporates Energy Performance Certificate (CEE) ratings into building score and key highlights/risks', () => {
    const scoreWithHighCee = calculateBarrioScore(
      mockModernProperty,
      mockWealthyNeighborhood,
      mockSafeEnvironment,
      undefined,
      mockCivicConnectivity,
      mockUrbanPlanning,
      undefined,
      {
        ratingEmissions: 'A',
        ratingConsumption: 'A',
        co2Emissions: 7.2,
        isEstimated: false,
        scope: 'building',
      }
    );

    expect(scoreWithHighCee.keyHighlights.some((h) => h.includes('High Energy Performance Certificate'))).toBe(true);

    const scoreWithLowCee = calculateBarrioScore(
      mockModernProperty,
      mockWealthyNeighborhood,
      mockSafeEnvironment,
      undefined,
      mockCivicConnectivity,
      mockUrbanPlanning,
      undefined,
      {
        ratingEmissions: 'G',
        ratingConsumption: 'G',
        co2Emissions: 62.5,
        isEstimated: true,
        scope: 'building',
      }
    );

    expect(scoreWithLowCee.keyRisks.some((r) => r.includes('Low Energy Performance rating'))).toBe(true);
  });
});
