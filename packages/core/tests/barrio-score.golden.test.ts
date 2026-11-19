import { describe, it, expect } from 'vitest';
import { calculateBarrioScore } from '../src/scoring/barrio-score.js';
import type { CadastralProperty } from '../src/types/catastro.js';
import type { CensusTractIncome } from '../src/types/ine.js';
import type { EnvironmentalData } from '../src/types/environmental.js';
import type { CivicConnectivityData } from '../src/types/connectivity.js';
import type { UrbanPlanningData } from '../src/types/urban-planning.js';
import type { EnergyPerformanceCertificate } from '../src/types/energy.js';
import type { BuildingInspection } from '../src/types/building-inspection.js';
import type { SeismicHazard } from '../src/types/seismic.js';
import type { VutEvaluationDTO } from '../src/types/vut.js';

const baseNeighborhood: CensusTractIncome = {
  censusSectionCode: '2807901001',
  averageNetHouseholdIncomeEur: 52000,
  averageNetPersonIncomeEur: 23500,
  percentileInMunicipality: 88,
  rankingInCity: { rank: 120, totalSections: 2450 },
  demographics: { medianAge: 44, singlePersonHouseholdPercentage: 28 },
};

const safeEnvironment: EnvironmentalData = {
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
  airQuality: {
    aqiIndex: 25,
    category: 'GOOD',
    stationName: 'Plaza del Carmen',
  },
};

const primeConnectivity: CivicConnectivityData = {
  walkScore15Min: 92,
  facilitiesWithin15MinCount: 14,
};

const consolidatedUrban: UrbanPlanningData = {
  landClassification: 'URBAN_CONSOLIDATED',
  zoningCode: 'NZ-1',
  isProtectedLand: false,
  declaredRenovationsCount: 1,
  lastRenovationYear: 2021,
  isStressedHousingZone: false,
};

const classAEnergy: EnergyPerformanceCertificate = {
  ratingEmissions: 'A',
  ratingConsumption: 'A',
  co2Emissions: 6.5,
  scope: 'building',
  isEstimated: false,
};

const favorableIte: BuildingInspection = {
  status: 'FAVORABLE',
  inspectionYear: 2024,
  nextInspectionDueYear: 2034,
  hasDefects: false,
  defectsSummary: [],
  municipalRegistry: 'Ayuntamiento de Madrid',
  isPreventiveAlert: false,
  legalNotice: 'RD-L 7/2015',
};

const lowSeismic: SeismicHazard = {
  basicAccelerationG: 0.04,
  riskLevel: 'VERY_LOW',
  municipalityCode: '28079',
  municipalityName: 'Madrid',
  ncseStandardApplied: 'NCSE_02',
  isVulnerableToSeismic: false,
  regulatoryContext: 'Low seismic risk',
};

const lowVut: VutEvaluationDTO = {
  censusSectionId: '2807901001',
  totalDwellings: 1500,
  vutCount: 15,
  vutBeds: 60,
  vutRatioPct: 1.0,
  saturationRisk: 'low',
  penaltyApplied: 0,
  description: 'Low saturation',
};

function makeProperty(overrides: Partial<CadastralProperty> = {}): CadastralProperty {
  return {
    cadastralReference: '9872023VH5797S0001WX',
    address: {
      street: 'Calle de Alcalá',
      number: '42',
      postalCode: '28014',
      municipality: 'Madrid',
      province: 'Madrid',
    },
    coordinates: { latitude: 40.418, longitude: -3.698, srs: 'EPSG:4326' },
    building: {
      constructionYear: 2018,
      builtSurfaceM2: 120,
      primaryUse: 'Residencial',
      unitsCount: 16,
      hasCommercialGroundFloor: true,
    },
    typology: 'RESIDENTIAL',
    ...overrides,
  };
}

describe('BarrioScore Golden Snapshots (v1.3.2 safety net)', () => {
  it('golden 1: RESIDENTIAL modern prime (all pillars favorable)', () => {
    const score = calculateBarrioScore(
      makeProperty(),
      baseNeighborhood,
      safeEnvironment,
      undefined,
      primeConnectivity,
      consolidatedUrban,
      undefined,
      classAEnergy,
      lowVut,
      favorableIte,
      lowSeismic
    );

    expect(score.subscores).toEqual({
      connectivity: 92,
      building: 100,
      socioeconomic: 84,
      environmental: 94,
      urbanPlanning: 95,
    });
    expect(score.overallScore).toBe(93);
  });

  it('golden 2: RESIDENTIAL vintage with noise, flood ZFP, unfavorable ITE, and seismic vulnerability', () => {
    const vintageProp = makeProperty({
      building: {
        constructionYear: 1965,
        builtSurfaceM2: 85,
        primaryUse: 'Residencial',
        unitsCount: 120,
        hasCommercialGroundFloor: false,
      },
    });
    const modestNeighborhood: CensusTractIncome = {
      ...baseNeighborhood,
      averageNetHouseholdIncomeEur: 21000,
      percentileInMunicipality: 20,
    };
    const riskyEnv: EnvironmentalData = {
      noise: { dayEveningNightDecibels: 72, category: 'NOISY', predominantSource: 'ROAD_TRAFFIC' },
      floodRisk: { level: 'MEDIUM', returnPeriodYears: 100, isInPreferentialFlowZone: true },
    };
    const unfavorableIte: BuildingInspection = {
      ...favorableIte,
      status: 'UNFAVORABLE',
      hasDefects: true,
      defectsSummary: ['Facade cracks'],
    };
    const highSeismic: SeismicHazard = {
      ...lowSeismic,
      basicAccelerationG: 0.19,
      riskLevel: 'HIGH',
      municipalityCode: '18087',
      municipalityName: 'Granada',
      ncseStandardApplied: 'PRE_REGULATION',
      isVulnerableToSeismic: true,
    };

    const score = calculateBarrioScore(
      vintageProp,
      modestNeighborhood,
      riskyEnv,
      undefined,
      { walkScore15Min: 60, facilitiesWithin15MinCount: 5 },
      {
        landClassification: 'URBAN_CONSOLIDATED',
        isProtectedLand: false,
        declaredRenovationsCount: 0,
        lastRenovationYear: null,
        isStressedHousingZone: false,
      },
      undefined,
      undefined,
      undefined,
      unfavorableIte,
      highSeismic
    );

    expect(score.subscores).toEqual({
      connectivity: 60,
      building: 22,
      socioeconomic: 25,
      environmental: 31,
      urbanPlanning: 95,
    });
    expect(score.overallScore).toBe(44);
  });

  it('golden 3: RESIDENTIAL substandard commercial-to-residential ground floor', () => {
    const substandardProp = makeProperty({
      cadastralReference: '9872023VH5797S0002AB',
      typology: 'RESIDENTIAL',
      building: {
        constructionYear: 1990,
        builtSurfaceM2: 45,
        primaryUse: 'Comercial',
        unitsCount: 1,
        hasCommercialGroundFloor: false,
      },
      unit: {
        cadastralReference: '9872023VH5797S0002AB',
        floor: 'PB',
        door: '01',
        use: 'Comercial',
        builtSurfaceM2: 45,
      },
    });

    const score = calculateBarrioScore(
      substandardProp,
      baseNeighborhood,
      safeEnvironment,
      undefined,
      primeConnectivity,
      consolidatedUrban
    );

    expect(score.subscores).toEqual({
      connectivity: 92,
      building: 70,
      socioeconomic: 84,
      environmental: 94,
      urbanPlanning: 70,
    });
    expect(score.overallScore).toBe(82);
  });

  it('golden 4: VACANT_PLOT typology weighting and scoring', () => {
    const vacantPlot = makeProperty({
      cadastralReference: '000100200VK4713D0001AZ',
      typology: 'VACANT_PLOT',
      building: {
        constructionYear: 0,
        builtSurfaceM2: 0,
        plotSurfaceM2: 500,
        primaryUse: 'Solar Urbano',
        unitsCount: 0,
        hasCommercialGroundFloor: false,
      },
    });

    const score = calculateBarrioScore(
      vacantPlot,
      baseNeighborhood,
      safeEnvironment,
      undefined,
      primeConnectivity,
      consolidatedUrban
    );

    expect(score.subscores).toEqual({
      connectivity: 92,
      building: 95,
      socioeconomic: 84,
      environmental: 94,
      urbanPlanning: 95,
    });
    expect(score.overallScore).toBe(92);
  });

  it('golden 5: RUSTIC typology weighting and scoring', () => {
    const rusticProp = makeProperty({
      cadastralReference: '28079A001000010000AB',
      typology: 'RUSTIC',
      building: {
        constructionYear: 0,
        builtSurfaceM2: 0,
        plotSurfaceM2: 12000,
        primaryUse: 'Agrario',
        unitsCount: 0,
        hasCommercialGroundFloor: false,
      },
    });

    const score = calculateBarrioScore(
      rusticProp,
      baseNeighborhood,
      safeEnvironment,
      undefined,
      { walkScore15Min: 30, facilitiesWithin15MinCount: 1 },
      {
        landClassification: 'RUSTIC_PROTECTED',
        isProtectedLand: true,
        declaredRenovationsCount: 0,
        lastRenovationYear: null,
        isStressedHousingZone: false,
      }
    );

    expect(score.subscores).toEqual({
      connectivity: 30,
      building: 85,
      socioeconomic: 84,
      environmental: 94,
      urbanPlanning: 20,
    });
    expect(score.overallScore).toBe(60);
  });

  it('golden 6: INDUSTRIAL typology weighting and scoring', () => {
    const industrialProp = makeProperty({
      cadastralReference: '8839201VK4713D0001AZ',
      typology: 'INDUSTRIAL',
      building: {
        constructionYear: 2012,
        builtSurfaceM2: 2500,
        primaryUse: 'Industrial',
        unitsCount: 1,
        hasCommercialGroundFloor: false,
      },
    });

    const score = calculateBarrioScore(
      industrialProp,
      baseNeighborhood,
      safeEnvironment,
      undefined,
      primeConnectivity,
      consolidatedUrban
    );

    expect(score.subscores).toEqual({
      connectivity: 92,
      building: 95,
      socioeconomic: 84,
      environmental: 94,
      urbanPlanning: 95,
    });
    expect(score.overallScore).toBe(93);
  });

  it('golden 7: COMMERCIAL typology scoring', () => {
    const commercialProp = makeProperty({
      typology: 'COMMERCIAL',
      building: {
        constructionYear: 2008,
        builtSurfaceM2: 180,
        primaryUse: 'Comercial',
        unitsCount: 2,
        hasCommercialGroundFloor: true,
      },
    });

    const score = calculateBarrioScore(
      commercialProp,
      baseNeighborhood,
      safeEnvironment,
      undefined,
      primeConnectivity,
      consolidatedUrban,
      undefined,
      classAEnergy
    );

    expect(score.subscores).toEqual({
      connectivity: 92,
      building: 100,
      socioeconomic: 84,
      environmental: 94,
      urbanPlanning: 95,
    });
    expect(score.overallScore).toBe(93);
  });

  it('golden 8: EQUIPMENT typology scoring', () => {
    const equipmentProp = makeProperty({
      typology: 'EQUIPMENT',
      building: {
        constructionYear: 1995,
        builtSurfaceM2: 1500,
        primaryUse: 'Equipamiento Público',
        unitsCount: 1,
        hasCommercialGroundFloor: false,
      },
    });

    const score = calculateBarrioScore(
      equipmentProp,
      baseNeighborhood,
      safeEnvironment,
      undefined,
      primeConnectivity,
      consolidatedUrban
    );

    expect(score.subscores).toEqual({
      connectivity: 92,
      building: 95,
      socioeconomic: 84,
      environmental: 94,
      urbanPlanning: 95,
    });
    expect(score.overallScore).toBe(92);
  });
});
