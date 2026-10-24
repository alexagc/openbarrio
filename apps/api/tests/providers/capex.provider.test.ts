import { describe, it, expect } from 'vitest';
import { Value } from '@sinclair/typebox/value';
import { CadastralProperty, BuildingCapExRiskSchema } from '@openbarrio/core';
import { calculateBuildingCapExRisk } from '../../src/providers/capex.provider.js';

describe('calculateBuildingCapExRisk Provider', () => {
  const currentYear = new Date().getFullYear();

  function createMockProperty(building: Partial<CadastralProperty['building']>, unit?: CadastralProperty['unit']): CadastralProperty {
    return {
      cadastralReference: '9872023VH5797S0001WX',
      address: {
        street: 'Calle de Alcalá',
        number: '42',
        postalCode: '28014',
        municipality: 'Madrid',
        province: 'Madrid',
        provinceCode: '28',
        municipalityCode: '079',
      },
      coordinates: {
        latitude: 40.418,
        longitude: -3.698,
        srs: 'EPSG:4326',
      },
      building: {
        constructionYear: 1980,
        builtSurfaceM2: 1200,
        primaryUse: 'Residencial',
        unitsCount: 12,
        hasCommercialGroundFloor: false,
        ...building,
      },
      unit,
    };
  }

  it('calculates optimal risk for a brand new modern building (2022)', () => {
    const prop = createMockProperty({
      constructionYear: 2022,
      builtSurfaceM2: 2400,
      unitsCount: 16,
    });

    const capex = calculateBuildingCapExRisk(prop);

    expect(Value.Check(BuildingCapExRiskSchema, capex)).toBe(true);
    expect(capex.buildingAgeYears).toBe(currentYear - 2022);
    expect(capex.iteStatus).toBe('exempt');
    expect(capex.iteRequired).toBe(false);
    expect(capex.iteDeadlineYear).toBe(2072);
    expect(capex.accessibilityRisk).toBe('low');
    expect(capex.hasElevator).toBe(true);
    expect(capex.elevatorRisk).toBe(false);
    expect(capex.reserveFundAdequacy).toBe('optimal');
    expect(capex.estimatedReserveFundDeficitPct).toBe(0);
    expect(capex.capexRiskScore).toBeGreaterThanOrEqual(85);
    expect(capex.thermalEnvelopeLossPct).toBe(8);
  });

  it('detects mandatory overdue ITE and severe risk for a pre-1974 building without elevator', () => {
    const prop = createMockProperty(
      {
        constructionYear: 1965,
        builtSurfaceM2: 1500,
        unitsCount: 15, // ~5 floors
      },
      {
        cadastralReference: '9872023VH5797S0004AB',
        floor: '04',
        door: 'A',
        use: 'Residencial',
        builtSurfaceM2: 90,
        participationCoefficient: 6.67,
      }
    );

    const capex = calculateBuildingCapExRisk(prop);

    expect(Value.Check(BuildingCapExRiskSchema, capex)).toBe(true);
    expect(capex.buildingAgeYears).toBe(currentYear - 1965);
    expect(capex.iteStatus).toBe('mandatory_overdue');
    expect(capex.iteRequired).toBe(true);
    expect(capex.iteDeadlineYear).toBe(2015);
    expect(capex.accessibilityRisk).toBe('high');
    expect(capex.hasElevator).toBe(false);
    expect(capex.elevatorRisk).toBe(true);
    expect(capex.reserveFundAdequacy).toBe('deficit_severe');
    expect(capex.estimatedReserveFundDeficitPct).toBeGreaterThanOrEqual(28);
    expect(capex.renovationPriorities).toContain('Accesibilidad cota cero e instalación de ascensor');
    expect(capex.renovationPriorities).toContain('Fachada y petos de cubierta');
    expect(capex.renovationPriorities).toContain('SATE / Aislamiento térmico de envolvente');
    expect(capex.capexRiskScore).toBeLessThan(50);
  });

  it('marks 1975 building as mandatory_in_progress for ITE when age >= 50', () => {
    const prop = createMockProperty({
      constructionYear: 1975,
      builtSurfaceM2: 800,
      unitsCount: 8,
    });

    const capex = calculateBuildingCapExRisk(prop);

    expect(Value.Check(BuildingCapExRiskSchema, capex)).toBe(true);
    expect(capex.iteStatus).toBe('mandatory_in_progress');
    expect(capex.iteRequired).toBe(true);
    expect(capex.iteDeadlineYear).toBe(2025);
    expect(capex.reserveFundAdequacy).toBe('deficit_severe');
  });

  it('marks building approaching 50 years (e.g. 1978) as due_soon', () => {
    const prop = createMockProperty({
      constructionYear: 1978,
      builtSurfaceM2: 900,
      unitsCount: 9,
    });

    const capex = calculateBuildingCapExRisk(prop);

    expect(Value.Check(BuildingCapExRiskSchema, capex)).toBe(true);
    expect(capex.iteStatus).toBe('due_soon');
    expect(capex.iteRequired).toBe(true);
    expect(capex.iteDeadlineYear).toBe(2028);
    expect(capex.reserveFundAdequacy).toBe('deficit_moderate');
  });

  it('marks established building (e.g. 1995) as favorable_active', () => {
    const prop = createMockProperty({
      constructionYear: 1995,
      builtSurfaceM2: 1200,
      unitsCount: 10,
    });

    const capex = calculateBuildingCapExRisk(prop);

    expect(Value.Check(BuildingCapExRiskSchema, capex)).toBe(true);
    expect(capex.iteStatus).toBe('favorable_active');
    expect(capex.iteRequired).toBe(false);
    expect(capex.reserveFundAdequacy).toBe('optimal');
  });

  it('handles low-rise single-family home without elevator requirement', () => {
    const prop = createMockProperty({
      constructionYear: 2010,
      builtSurfaceM2: 180,
      unitsCount: 1,
    });

    const capex = calculateBuildingCapExRisk(prop);

    expect(Value.Check(BuildingCapExRiskSchema, capex)).toBe(true);
    expect(capex.hasElevator).toBe(false);
    expect(capex.elevatorRisk).toBe(false);
    expect(capex.accessibilityRisk).toBe('low');
    expect(capex.estimatedCommunityExpenseRangeEurMonth.min).toBeGreaterThanOrEqual(40);
  });

  it('handles high-rise multi-unit residential building with elevator', () => {
    const prop = createMockProperty(
      {
        constructionYear: 1998,
        builtSurfaceM2: 4500,
        unitsCount: 36,
      },
      {
        cadastralReference: '9872023VH5797S0025ZA',
        floor: '07',
        door: 'B',
        use: 'Residencial',
        builtSurfaceM2: 110,
        participationCoefficient: 2.78,
      }
    );

    const capex = calculateBuildingCapExRisk(prop);

    expect(Value.Check(BuildingCapExRiskSchema, capex)).toBe(true);
    expect(capex.hasElevator).toBe(true);
    expect(capex.elevatorRisk).toBe(false);
    expect(capex.estimatedCommunityExpenseRangeEurMonth.min).toBeGreaterThanOrEqual(40);
    expect(capex.estimatedCommunityExpenseRangeEurMonth.max).toBeGreaterThan(
      capex.estimatedCommunityExpenseRangeEurMonth.min
    );
  });
});
