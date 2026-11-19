import { describe, it, expect } from 'vitest';
import { calculateBarrioScore, BarrioScoreInput } from '../src/scoring/barrio-score.js';
import type { LayerKey, LayerStatusInfo } from '../src/types/data-status.js';
import type { PillarKey } from '../src/scoring/traffic-light.js';

function createCompleteInput(): BarrioScoreInput {
  return {
    property: {
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
        hasCommercialGroundFloor: false,
      },
      typology: 'RESIDENTIAL',
    },
    neighborhood: {
      censusSectionCode: '2807901001',
      averageNetHouseholdIncomeEur: 66000,
      averageNetPersonIncomeEur: 28000,
      percentileInMunicipality: 100,
      rankingInCity: { rank: 1, totalSections: 2000 },
      demographics: { medianAge: 42, singlePersonHouseholdPercentage: 25 },
    },
    environment: {
      noise: { dayEveningNightDecibels: 45, category: 'QUIET', predominantSource: 'NONE' },
      floodRisk: { level: 'NONE', returnPeriodYears: null, isInPreferentialFlowZone: false },
      airQuality: { aqiIndex: 18, category: 'GOOD', stationName: 'Madrid Centro' },
    },
    connectivity: {
      walkScore15Min: 100,
      facilitiesWithin15MinCount: 18,
    },
    urbanPlanning: {
      landClassification: 'URBAN_CONSOLIDATED',
      isProtectedLand: false,
      declaredRenovationsCount: 1,
      lastRenovationYear: 2020,
      isStressedHousingZone: false,
    },
    energy: {
      ratingEmissions: 'A',
      ratingConsumption: 'A',
      scope: 'building',
      isEstimated: false,
    },
    buildingInspection: {
      status: 'FAVORABLE',
      inspectionYear: 2024,
      hasDefects: false,
      defectsSummary: [],
      municipalRegistry: 'Madrid',
      isPreventiveAlert: false,
      legalNotice: 'RD-L 7/2015',
    },
    vut: {
      censusSectionId: '2807901001',
      totalDwellings: 1500,
      vutCount: 10,
      vutBeds: 40,
      vutRatioPct: 0.67,
      saturationRisk: 'low',
      penaltyApplied: 0,
      description: 'Low',
      isEstimated: false,
    },
    layers: {
      catastro: { status: 'ok', sourceName: 'Catastro OVC' },
      ine: { status: 'ok', sourceName: 'INE ADRH' },
      sica: { status: 'ok', sourceName: 'MITECO SICA' },
      snczi: { status: 'ok', sourceName: 'MITECO SNCZI' },
      airQuality: { status: 'ok', sourceName: 'MITECO ICA' },
      connectivity: { status: 'ok', sourceName: 'IGN Equipamientos' },
      urbanPlanning: { status: 'ok', sourceName: 'MIVAU SIU' },
      cee: { status: 'ok', sourceName: 'CEE Autonómico' },
      ite: { status: 'ok', sourceName: 'ITE Municipal' },
      vut: { status: 'ok', sourceName: 'INE VUT' },
    },
  };
}

describe('BarrioScore Missing-Data Policy Properties', () => {
  const baseline = calculateBarrioScore(createCompleteInput());

  it('baseline with all favorable layers yields GREEN traffic light and high confidence', () => {
    expect(baseline.trafficLight).toBe('GREEN');
    expect(baseline.scoreConfidence).toBe('high');
    expect(baseline.coverage?.pillarsWithData).toBe(5);
    expect(baseline.weightsUsed).toBeDefined();
    const sum = Object.values(baseline.weightsUsed!).reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(1, 9);
  });

  const nonIncreasingLayers: LayerKey[] = [
    'catastro',
    'ine',
    'sica',
    'snczi',
    'airQuality',
    'connectivity',
    'urbanPlanning',
    'cee',
    'ite',
    'vut',
  ];

  for (const layerKey of nonIncreasingLayers) {
    for (const badStatus of ['unavailable', 'out_of_coverage'] as const) {
      it(`marking layer '${layerKey}' as '${badStatus}' never grants new highlights/bonuses and drops affected subscore`, () => {
        const input = createCompleteInput();
        const nextLayers: Partial<Record<LayerKey, LayerStatusInfo>> = {
          ...input.layers,
          [layerKey]: {
            status: badStatus,
            sourceName: input.layers?.[layerKey]?.sourceName ?? layerKey,
            reason: badStatus === 'unavailable' ? 'upstream_error' : 'no_coverage',
          },
        };
        const degraded = calculateBarrioScore({ ...input, layers: nextLayers });

        // Never adds new positive highlights or favorable bonuses
        for (const h of degraded.keyHighlights) {
          expect(baseline.keyHighlights).toContain(h);
        }
        expect(degraded.keyHighlights.length).toBeLessThanOrEqual(baseline.keyHighlights.length);

        // Directly affected dimension never improves (and becomes 0 when pillar/sublayer is absent)
        if (layerKey === 'catastro' || layerKey === 'cee' || layerKey === 'ite') {
          expect(degraded.buildingHealthScore).toBeLessThanOrEqual(baseline.buildingHealthScore);
          expect(degraded.overallScore).toBeLessThanOrEqual(baseline.overallScore);
        } else if (layerKey === 'ine') {
          expect(degraded.socioeconomicScore).toBe(0);
          expect(degraded.weightsUsed?.socioeconomic).toBe(0);
        } else if (layerKey === 'sica') {
          expect(degraded.acousticComfortScore).toBe(0);
        } else if (layerKey === 'snczi') {
          expect(degraded.climateSafetyScore).toBe(0);
        } else if (layerKey === 'connectivity') {
          expect(degraded.subscores.connectivity).toBe(0);
          expect(degraded.weightsUsed?.connectivity).toBe(0);
        } else if (layerKey === 'urbanPlanning' || layerKey === 'vut') {
          expect(degraded.subscores.urbanPlanning).toBeLessThanOrEqual(baseline.subscores.urbanPlanning);
        }

        if (badStatus === 'unavailable' || badStatus === 'out_of_coverage') {
          expect(degraded.coverage!.ok).toBeLessThan(baseline.coverage!.ok);
        }
      });
    }
  }

  for (const criticalLayer of ['sica', 'snczi'] as const) {
    for (const badStatus of ['unavailable', 'out_of_coverage'] as const) {
      it(`marking critical layer '${criticalLayer}' as '${badStatus}' NEVER leaves global trafficLight GREEN and marks environmental pillar UNCERTAIN`, () => {
        const input = createCompleteInput();
        const degraded = calculateBarrioScore({
          ...input,
          layers: {
            ...input.layers,
            [criticalLayer]: {
              status: badStatus,
              sourceName: criticalLayer === 'sica' ? 'MITECO SICA' : 'MITECO SNCZI',
              reason: badStatus === 'unavailable' ? 'timeout' : 'no_coverage',
            },
          },
        });

        expect(degraded.trafficLight).not.toBe('GREEN');
        expect(degraded.pillarTrafficLights?.environmental).toBe('UNCERTAIN');
        expect(degraded.coverage?.missingCriticalLayers).toContain(criticalLayer);
        expect(degraded.keyRisks.some((r) => r.includes('not evaluated'))).toBe(true);
      });
    }
  }

  it('guarantees weightsUsed always sums to 1 across available pillars and is 0 for unavailable pillars', () => {
    const input = createCompleteInput();
    const partial = calculateBarrioScore({
      ...input,
      layers: {
        ...input.layers,
        ine: { status: 'unavailable', sourceName: 'INE ADRH', reason: 'upstream_error' },
        connectivity: { status: 'unavailable', sourceName: 'IGN', reason: 'upstream_error' },
      },
    });

    const weights = partial.weightsUsed!;
    const sum = Object.values(weights).reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(1, 9);

    for (const p of Object.keys(partial.pillarAvailability!) as PillarKey[]) {
      if (!partial.pillarAvailability![p]) {
        expect(weights[p]).toBe(0);
      } else {
        expect(weights[p]).toBeGreaterThan(0);
      }
    }
  });

  it('produces UNCERTAIN traffic light whenever <= 2 pillars have data', () => {
    const input = createCompleteInput();
    const uncertain = calculateBarrioScore({
      property: input.property,
      neighborhood: input.neighborhood,
    });

    expect(uncertain.coverage?.pillarsWithData).toBe(2);
    expect(uncertain.trafficLight).toBe('UNCERTAIN');
    expect(uncertain.scoreConfidence).toBe('uncertain');
  });
});
