import { describe, it, expect } from 'vitest';
import { Value } from '@sinclair/typebox/value';
import {
  BuildingCapExRiskSchema,
  BuildingCapExRisk,
  PropertyAuditReportSchema,
} from '../src/index.js';

describe('BuildingCapExRiskSchema TypeBox Validation', () => {
  const validCapExSample: BuildingCapExRisk = {
    buildingAgeYears: 54,
    iteStatus: 'mandatory_overdue',
    iteDeadlineYear: 2020,
    iteRequired: true,
    accessibilityRisk: 'high',
    hasElevator: false,
    elevatorRisk: true,
    estimatedCommunityExpenseRangeEurMonth: { min: 65, max: 110 },
    estimatedCapExPerM2Eur: { min: 140, max: 280 },
    reserveFundAdequacy: 'deficit_severe',
    estimatedReserveFundDeficitPct: 35,
    renovationPriorities: [
      'Fachada y petos de cubierta',
      'Impermeabilización',
      'Accesibilidad cota cero',
    ],
    thermalEnvelopeLossPct: 42,
    capexRiskScore: 38,
  };

  it('should validate a complete, valid BuildingCapExRisk object', () => {
    expect(Value.Check(BuildingCapExRiskSchema, validCapExSample)).toBe(true);
    const errors = [...Value.Errors(BuildingCapExRiskSchema, validCapExSample)];
    expect(errors).toHaveLength(0);
  });

  it('should reject invalid iteStatus values', () => {
    const invalid = { ...validCapExSample, iteStatus: 'unknown_status' };
    expect(Value.Check(BuildingCapExRiskSchema, invalid)).toBe(false);
  });

  it('should reject invalid accessibilityRisk values', () => {
    const invalid = { ...validCapExSample, accessibilityRisk: 'extreme' };
    expect(Value.Check(BuildingCapExRiskSchema, invalid)).toBe(false);
  });

  it('should reject capexRiskScore outside 0-100 range', () => {
    const invalidOver = { ...validCapExSample, capexRiskScore: 105 };
    expect(Value.Check(BuildingCapExRiskSchema, invalidOver)).toBe(false);

    const invalidUnder = { ...validCapExSample, capexRiskScore: -5 };
    expect(Value.Check(BuildingCapExRiskSchema, invalidUnder)).toBe(false);
  });

  it('should validate all permitted iteStatus variants', () => {
    const statuses = [
      'mandatory_overdue',
      'mandatory_in_progress',
      'favorable_active',
      'exempt',
      'due_soon',
    ] as const;

    for (const status of statuses) {
      const copy = { ...validCapExSample, iteStatus: status };
      expect(Value.Check(BuildingCapExRiskSchema, copy)).toBe(true);
    }
  });

  it('should validate all permitted reserveFundAdequacy variants', () => {
    const levels = ['optimal', 'deficit_moderate', 'deficit_severe'] as const;

    for (const level of levels) {
      const copy = { ...validCapExSample, reserveFundAdequacy: level };
      expect(Value.Check(BuildingCapExRiskSchema, copy)).toBe(true);
    }
  });

  it('allows PropertyAuditReportSchema with optional capex field', () => {
    const mockReport = {
      id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      generatedAt: '2026-10-24T18:00:00.000Z',
      property: {
        cadastralReference: '0549711VK4704H0001IJ',
        address: {
          street: 'Calle Mayor',
          number: '1',
          postalCode: '28013',
          municipality: 'Madrid',
          province: 'Madrid',
        },
        coordinates: {
          latitude: 40.4168,
          longitude: -3.7038,
          srs: 'EPSG:4326' as const,
        },
        building: {
          constructionYear: 1970,
          builtSurfaceM2: 1200,
          primaryUse: 'Residencial',
          unitsCount: 12,
          hasCommercialGroundFloor: false,
        },
      },
      neighborhood: {
        censusSectionCode: '2807901001',
        averageNetHouseholdIncomeEur: 42000,
        averageNetPersonIncomeEur: 19000,
        percentileInMunicipality: 75,
        rankingInCity: { rank: 150, totalSections: 600 },
        demographics: { medianAge: 44, singlePersonHouseholdPercentage: 28 },
      },
      environment: {
        noise: {
          dayEveningNightDecibels: 58,
          category: 'MODERATE' as const,
          predominantSource: 'ROAD_TRAFFIC',
        },
        floodRisk: {
          level: 'NONE' as const,
          returnPeriodYears: null,
          isInPreferentialFlowZone: false,
        },
      },
      score: {
        overallScore: 82,
        subscores: {
          building: 75,
          connectivity: 85,
          environmental: 80,
          socioeconomic: 84,
          urbanPlanning: 85,
        },
        socioeconomicScore: 84,
        buildingHealthScore: 75,
        acousticComfortScore: 80,
        climateSafetyScore: 100,
        keyHighlights: ['Centric location'],
        keyRisks: ['ITE due soon'],
      },
      capex: validCapExSample,
    };

    expect(Value.Check(PropertyAuditReportSchema, mockReport)).toBe(true);
  });
});
