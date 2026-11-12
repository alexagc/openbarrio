import { describe, it, expect } from 'vitest';
import { Value } from '@sinclair/typebox/value';
import {
  evaluateRadonRisk,
  evaluateVutSaturation,
  calculateFiscalEstimate,
  calculateBarrioScore,
  BuildingSurroundingsSchema,
  BuildingSurroundingsDTO,
  CadastralProperty,
  CensusTractIncome,
} from '../src/index.js';

describe('Phase 16 Core Civic Intelligence & Urban 3D DTOs', () => {
  describe('CTE DB-HS 6 Radon Evaluation Engine', () => {
    it('evaluates ground floor dwelling in Zona II as high risk requiring mitigation', () => {
      const evaluation = evaluateRadonRisk('Zona II', 0, 10);
      expect(evaluation.municipalityZone).toBe('Zona II');
      expect(evaluation.isGroundContact).toBe(true);
      expect(evaluation.requiresMitigation).toBe(true);
      expect(evaluation.riskLevel).toBe('high');
      expect(evaluation.contextualReason).toContain('Zona II (riesgo elevado');
    });

    it('evaluates upper floor (planta 3) in Zona II as negligible risk with height mitigation', () => {
      const evaluation = evaluateRadonRisk('Zona II', 3, 10);
      expect(evaluation.municipalityZone).toBe('Zona II');
      expect(evaluation.isGroundContact).toBe(false);
      expect(evaluation.requiresMitigation).toBe(false);
      expect(evaluation.riskLevel).toBe('negligible');
      expect(evaluation.contextualReason).toContain('Planta 3');
    });

    it('evaluates single family home in Zona I as moderate risk requiring mitigation', () => {
      const evaluation = evaluateRadonRisk('Zona I', undefined, 1);
      expect(evaluation.municipalityZone).toBe('Zona I');
      expect(evaluation.isGroundContact).toBe(true);
      expect(evaluation.requiresMitigation).toBe(true);
      expect(evaluation.riskLevel).toBe('moderate');
    });

    it('evaluates dwellings in Zona 0 as negligible risk without mitigation requirements', () => {
      const evaluation = evaluateRadonRisk('Zona 0', 0, 1);
      expect(evaluation.municipalityZone).toBe('Zona 0');
      expect(evaluation.requiresMitigation).toBe(false);
      expect(evaluation.riskLevel).toBe('negligible');
    });
  });

  describe('INE VUT Saturation Evaluation Engine', () => {
    it('evaluates low saturation (< 3%) with 0 penalty', () => {
      const vut = evaluateVutSaturation('2807901001', 1000, 15, 60);
      expect(vut.vutRatioPct).toBe(1.5);
      expect(vut.saturationRisk).toBe('low');
      expect(vut.penaltyApplied).toBe(0);
      expect(vut.isEstimated).toBe(false);
      expect(vut.source).toContain('Oficial');
    });

    it('identifies model fallback as statistical estimation', () => {
      const vut = evaluateVutSaturation('2807901099', 1000, 40, 160, true);
      expect(vut.isEstimated).toBe(true);
      expect(vut.source).toContain('Estimación Heurística Territorial');
    });

    it('evaluates moderate saturation (3% to 8%) with 5-10 penalty points', () => {
      const vut = evaluateVutSaturation('2807901002', 1000, 50, 200);
      expect(vut.vutRatioPct).toBe(5.0);
      expect(vut.saturationRisk).toBe('moderate');
      expect(vut.penaltyApplied).toBeGreaterThanOrEqual(5);
      expect(vut.penaltyApplied).toBeLessThanOrEqual(10);
    });

    it('evaluates critical saturation (>= 8%) with 15-25 penalty points and alert', () => {
      const vut = evaluateVutSaturation('2807901003', 1000, 120, 500);
      expect(vut.vutRatioPct).toBe(12.0);
      expect(vut.saturationRisk).toBe('critical');
      expect(vut.penaltyApplied).toBeGreaterThanOrEqual(15);
      expect(vut.description).toContain('Alerta crítica por saturación');
    });
  });

  describe('Barrio Score Recalibration with VUT', () => {
    const mockProperty: CadastralProperty = {
      cadastralReference: '2807901VK4720F0001AB',
      address: {
        street: 'Calle Mayor',
        number: '10',
        postalCode: '28013',
        municipality: 'Madrid',
        province: 'Madrid',
        provinceCode: '28',
      },
      coordinates: { latitude: 40.4168, longitude: -3.7038, srs: 'EPSG:4326' },
      building: {
        constructionYear: 2010,
        builtSurfaceM2: 120,
        primaryUse: 'Residencial',
        unitsCount: 10,
        hasCommercialGroundFloor: false,
      },
    };

    const mockNeighborhood: CensusTractIncome = {
      censusSectionCode: '2807901001',
      averageNetHouseholdIncomeEur: 42000,
      percentileInMunicipality: 80,
      demographics: { totalPopulation: 1500, medianAge: 42 },
    };

    it('penalizes urbanPlanning subscore when critical VUT saturation is present', () => {
      const baselineScore = calculateBarrioScore(mockProperty, mockNeighborhood);
      const criticalVut = evaluateVutSaturation('2807901001', 1000, 140, 560);
      const penalizedScore = calculateBarrioScore(
        mockProperty,
        mockNeighborhood,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        criticalVut
      );

      expect(penalizedScore.subscores.urbanPlanning).toBeLessThan(baselineScore.subscores.urbanPlanning);
      expect(penalizedScore.keyRisks.some((r) => r.includes('Critical tourist apartment saturation'))).toBe(true);
    });
  });

  describe('Fiscal Engine & Surface Discrepancy', () => {
    it('calculates regional ITP for Madrid at 6%', () => {
      const fiscal = calculateFiscalEstimate({
        cadastralReference: '2807901VK4720F0001AB',
        provinceCode: '28',
        municipalityName: 'Madrid',
        purchasePriceEur: 300000,
        cadastralSurfaceM2: 80,
      });

      expect(fiscal.itpRatePct).toBe(6.0);
      expect(fiscal.itpQuotaEur).toBe(18000);
      expect(fiscal.autonomousCommunity).toBe('Comunidad de Madrid');
      expect(fiscal.ibiEstimatedAnnualQuotaEur).toBeGreaterThan(0);
    });

    it('calculates regional ITP for Cataluña at 10%', () => {
      const fiscal = calculateFiscalEstimate({
        cadastralReference: '0801901VK4720F0001AB',
        provinceCode: '08',
        municipalityName: 'Barcelona',
        purchasePriceEur: 400000,
        cadastralSurfaceM2: 90,
      });

      expect(fiscal.itpRatePct).toBe(10.0);
      expect(fiscal.itpQuotaEur).toBe(40000);
      expect(fiscal.autonomousCommunity).toBe('Cataluña');
    });

    it('detects surface discrepancy exceeding +15%', () => {
      const fiscal = calculateFiscalEstimate({
        cadastralReference: '2807901VK4720F0001AB',
        provinceCode: '28',
        municipalityName: 'Madrid',
        purchasePriceEur: 350000,
        cadastralSurfaceM2: 80,
        advertisedSurfaceM2: 110,
      });

      expect(fiscal.surfaceDiscrepancyPct).toBe(37.5);
      expect(fiscal.surfaceAlert).toContain('+38% m² publicitados vs Catastro');
    });
  });

  describe('Energy Performance Certificate Schema & Expiration', () => {
    const mockProperty: CadastralProperty = {
      cadastralReference: '2807901VK4720F0001AB',
      address: {
        street: 'Calle Mayor',
        number: '10',
        postalCode: '28013',
        municipality: 'Madrid',
        province: 'Madrid',
        provinceCode: '28',
      },
      coordinates: { latitude: 40.4168, longitude: -3.7038, srs: 'EPSG:4326' },
      building: {
        constructionYear: 2010,
        builtSurfaceM2: 120,
        primaryUse: 'Residencial',
        unitsCount: 10,
        hasCommercialGroundFloor: false,
      },
    };

    const mockNeighborhood: CensusTractIncome = {
      censusSectionCode: '2807901001',
      averageNetHouseholdIncomeEur: 42000,
      percentileInMunicipality: 80,
      demographics: { totalPopulation: 1500, medianAge: 42 },
    };

    it('penalizes building score and flags risk when official CEE is expired under RD 390/2021', () => {
      const activeScore = calculateBarrioScore(
        mockProperty,
        mockNeighborhood,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        {
          ratingEmissions: 'D',
          ratingConsumption: 'D',
          isEstimated: false,
          isExpired: false,
          validUntil: '2030-05-01',
          scope: 'unit',
        }
      );

      const expiredScore = calculateBarrioScore(
        mockProperty,
        mockNeighborhood,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        {
          ratingEmissions: 'D',
          ratingConsumption: 'D',
          isEstimated: false,
          isExpired: true,
          validUntil: '2023-01-15',
          scope: 'unit',
        }
      );

      expect(expiredScore.subscores.building).toBeLessThan(activeScore.subscores.building);
      expect(expiredScore.keyRisks.some((r) => r.includes('Official Energy Performance Certificate expired'))).toBe(true);
    });
  });

  describe('BuildingSurroundingsDTO Validation', () => {
    it('validates a valid BuildingSurroundingsDTO object schema', () => {
      const data: BuildingSurroundingsDTO = {
        targetRefcat: '2807901VK4720F',
        parcels: [
          {
            cadastralReference: '2807901VK4720E',
            floors: 5,
            heightMeters: 17.0,
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [-3.704, 40.416],
                  [-3.703, 40.416],
                  [-3.703, 40.417],
                  [-3.704, 40.417],
                  [-3.704, 40.416],
                ],
              ],
            },
            distanceMeters: 25,
            primaryUse: 'Residencial',
          },
        ],
      };

      expect(Value.Check(BuildingSurroundingsSchema, data)).toBe(true);
    });
  });
});
