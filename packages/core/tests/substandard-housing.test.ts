import { describe, it, expect } from 'vitest';
import { Value } from '@sinclair/typebox/value';
import {
  detectSubstandardHousingAlert,
  isGroundOrBasementFloor,
  isNonResidentialCadastralUse,
  lacksResidentialSubdivision,
  SubstandardHousingAlertSchema,
  CommercialHousingAlertSchema,
  InfraviviendaRiskSchema,
  calculateBarrioScore,
  computeBarrioScore,
  CadastralProperty,
  CensusTractIncome,
  EnvironmentalData,
  PropertyAuditReportSchema,
  AuditScoreBreakdownSchema,
} from '../src/index.js';

describe('Phase 22: Infravivienda / Substandard Commercial-to-Residential Heuristic', () => {
  const baseCoordinates = {
    latitude: 40.418,
    longitude: -3.698,
    srs: 'EPSG:4326' as const,
  };

  const baseAddress = {
    street: 'Calle de Lavapiés',
    number: '12',
    postalCode: '28012',
    municipality: 'Madrid',
    province: 'Madrid',
  };

  const mockNeighborhood: CensusTractIncome = {
    censusSectionCode: '2807901045',
    averageNetHouseholdIncomeEur: 36000,
    averageNetPersonIncomeEur: 16500,
    percentileInMunicipality: 55,
    rankingInCity: { rank: 1100, totalSections: 2450 },
    demographics: { medianAge: 39, singlePersonHouseholdPercentage: 35 },
  };

  const mockEnvironment: EnvironmentalData = {
    noise: {
      dayEveningNightDecibels: 58,
      category: 'MODERATE',
      predominantSource: 'ROAD_TRAFFIC',
    },
    floodRisk: {
      level: 'NONE',
      returnPeriodYears: null,
      isInPreferentialFlowZone: false,
    },
  };

  describe('1. Floor Detection Heuristic (isGroundOrBasementFloor)', () => {
    it('identifies ground floor designators accurately', () => {
      const groundFloorTokens = ['PB', '00', '0', 'BAJO', 'BJ', 'B', 'Bja', 'Planta Baja', 'pl. baja', 'EN', 'ENTRESUELO'];
      for (const token of groundFloorTokens) {
        expect(isGroundOrBasementFloor(token), `Failed for token ${token}`).toBe(true);
      }
    });

    it('identifies basement and semi-basement designators accurately', () => {
      const basementTokens = ['SS', 'S1', 'S2', 'SEMISOTANO', 'SEMISÓTANO', 'SOTANO', 'SÓTANO', 'SOT', '-1', '-2', 'SS1'];
      for (const token of basementTokens) {
        expect(isGroundOrBasementFloor(token), `Failed for token ${token}`).toBe(true);
      }
    });

    it('rejects standard residential upper floors', () => {
      const upperFloors = ['01', '02', '03', '04', '1', '2', '3', '10', 'Ático', 'AT'];
      for (const token of upperFloors) {
        expect(isGroundOrBasementFloor(token), `Failed for upper floor ${token}`).toBe(false);
      }
    });

    it('safely handles missing or empty floor inputs', () => {
      expect(isGroundOrBasementFloor(null)).toBe(false);
      expect(isGroundOrBasementFloor(undefined)).toBe(false);
      expect(isGroundOrBasementFloor('')).toBe(false);
      expect(isGroundOrBasementFloor('   ')).toBe(false);
    });
  });

  describe('2. Non-Residential Usage Detection Heuristic (isNonResidentialCadastralUse)', () => {
    it('identifies non-residential cadastral categories', () => {
      const nonResidentialUses = [
        'COMERCIAL',
        'Comercio',
        'ALMACÉN',
        'Almacen',
        'INDUSTRIAL',
        'Industria',
        'OFICINAS',
        'Oficina',
        'APARCAMIENTO',
        'Garaje',
        'Estacionamiento',
        'Local',
        'Local Comercial',
        'Trastero',
        'Nave Industrial',
      ];
      for (const use of nonResidentialUses) {
        expect(isNonResidentialCadastralUse(use), `Failed for non-residential use ${use}`).toBe(true);
      }
    });

    it('rejects legitimate residential dwelling categories', () => {
      expect(isNonResidentialCadastralUse('RESIDENCIAL')).toBe(false);
      expect(isNonResidentialCadastralUse('Residencial')).toBe(false);
      expect(isNonResidentialCadastralUse('VIVIENDA')).toBe(false);
      expect(isNonResidentialCadastralUse('Vivienda unifamiliar')).toBe(false);
    });

    it('handles undefined or null usage inputs', () => {
      expect(isNonResidentialCadastralUse(null)).toBe(false);
      expect(isNonResidentialCadastralUse(undefined)).toBe(false);
      expect(isNonResidentialCadastralUse('')).toBe(false);
    });
  });

  describe('3. Subdivision Evaluation (lacksResidentialSubdivision)', () => {
    it('detects when property explicitly lacks horizontal division', () => {
      const propWithoutHd: CadastralProperty = {
        cadastralReference: '1234567VK4713D0001AZ',
        address: baseAddress,
        coordinates: baseCoordinates,
        building: {
          constructionYear: 1970,
          builtSurfaceM2: 200,
          primaryUse: 'Comercial',
          unitsCount: 1,
          hasCommercialGroundFloor: true,
        },
        hasHorizontalDivision: false,
      };
      expect(lacksResidentialSubdivision(propWithoutHd)).toBe(true);
    });

    it('returns false when horizontal division exists or is undefined', () => {
      const propWithHd: CadastralProperty = {
        cadastralReference: '1234567VK4713D0001AZ',
        address: baseAddress,
        coordinates: baseCoordinates,
        building: {
          constructionYear: 1995,
          builtSurfaceM2: 500,
          primaryUse: 'Residencial',
          unitsCount: 8,
          hasCommercialGroundFloor: false,
        },
        hasHorizontalDivision: true,
      };
      expect(lacksResidentialSubdivision(propWithHd)).toBe(false);
    });
  });

  describe('4. detectSubstandardHousingAlert Heuristic', () => {
    it('triggers HIGH alert for ground floor commercial premises (PB + COMERCIAL)', () => {
      const commercialGroundFloor: CadastralProperty = {
        cadastralReference: '9872023VH5797S0001PB',
        address: baseAddress,
        coordinates: baseCoordinates,
        building: {
          constructionYear: 1965,
          builtSurfaceM2: 85,
          primaryUse: 'Residencial',
          unitsCount: 12,
          hasCommercialGroundFloor: true,
        },
        unit: {
          cadastralReference: '9872023VH5797S0001PB',
          floor: 'PB',
          door: '01',
          use: 'Comercial',
          builtSurfaceM2: 55,
        },
      };

      const alert = detectSubstandardHousingAlert(commercialGroundFloor);
      expect(alert.severity).toBe('HIGH');
      expect(alert.penaltyApplied).toBe(25);
      expect(alert.isGroundFloorOrBasement).toBe(true);
      expect(alert.floor).toBe('PB');
      expect(alert.detectedUse).toBe('Comercial');
      expect(alert.warningMessage).toContain('Infravivienda');
      expect(alert.legalRisks.length).toBeGreaterThanOrEqual(3);
      expect(alert.legalRisks.some((r) => r.includes('Cédula de Habitabilidad'))).toBe(true);
      expect(alert.legalRisks.some((r) => r.includes('Padrón Municipal'))).toBe(true);
      expect(alert.legalRisks.some((r) => r.includes('sanction'))).toBe(true);
    });

    it('triggers HIGH alert for basement warehouse (SS + ALMACÉN)', () => {
      const basementStorage: CadastralProperty = {
        cadastralReference: '9872023VH5797S0002SS',
        address: baseAddress,
        coordinates: baseCoordinates,
        building: {
          constructionYear: 1950,
          builtSurfaceM2: 60,
          primaryUse: 'Residencial',
          unitsCount: 10,
          hasCommercialGroundFloor: true,
        },
        unit: {
          cadastralReference: '9872023VH5797S0002SS',
          floor: 'SS',
          door: '01',
          use: 'Almacén',
          builtSurfaceM2: 42,
        },
      };

      const alert = detectSubstandardHousingAlert(basementStorage);
      expect(alert.severity).toBe('HIGH');
      expect(alert.penaltyApplied).toBe(25);
      expect(alert.isGroundFloorOrBasement).toBe(true);
      expect(alert.floor).toBe('SS');
      expect(alert.detectedUse).toBe('Almacén');
    });

    it('triggers HIGH alert for ground floor workshop/industrial unit (00 + INDUSTRIAL)', () => {
      const groundWorkshop: CadastralProperty = {
        cadastralReference: '9872023VH5797S000300',
        address: baseAddress,
        coordinates: baseCoordinates,
        building: {
          constructionYear: 1978,
          builtSurfaceM2: 110,
          primaryUse: 'Residencial',
          unitsCount: 14,
          hasCommercialGroundFloor: true,
        },
        unit: {
          cadastralReference: '9872023VH5797S000300',
          floor: '00',
          door: 'B',
          use: 'Industrial',
          builtSurfaceM2: 95,
        },
      };

      const alert = detectSubstandardHousingAlert(groundWorkshop);
      expect(alert.severity).toBe('HIGH');
      expect(alert.penaltyApplied).toBe(25);
      expect(alert.isGroundFloorOrBasement).toBe(true);
    });

    it('triggers HIGH alert for semi-basement office (SEMISOTANO + OFICINAS)', () => {
      const semiBasementOffice: CadastralProperty = {
        cadastralReference: '9872023VH5797S0004SB',
        address: baseAddress,
        coordinates: baseCoordinates,
        building: {
          constructionYear: 1982,
          builtSurfaceM2: 70,
          primaryUse: 'Residencial',
          unitsCount: 8,
          hasCommercialGroundFloor: false,
        },
        unit: {
          cadastralReference: '9872023VH5797S0004SB',
          floor: 'SEMISOTANO',
          door: 'A',
          use: 'Oficinas',
          builtSurfaceM2: 65,
        },
      };

      const alert = detectSubstandardHousingAlert(semiBasementOffice);
      expect(alert.severity).toBe('HIGH');
      expect(alert.penaltyApplied).toBe(25);
      expect(alert.isGroundFloorOrBasement).toBe(true);
    });

    it('triggers HIGH alert when property lacks residential horizontal division (hasHorizontalDivision: false)', () => {
      const undividedCommercial: CadastralProperty = {
        cadastralReference: '9872023VH5797S0005UN',
        address: baseAddress,
        coordinates: baseCoordinates,
        building: {
          constructionYear: 1980,
          builtSurfaceM2: 150,
          primaryUse: 'Comercial',
          unitsCount: 1,
          hasCommercialGroundFloor: true,
        },
        hasHorizontalDivision: false,
      };

      const alert = detectSubstandardHousingAlert(undividedCommercial);
      expect(alert.severity).toBe('HIGH');
      expect(alert.lacksResidentialSubdivision).toBe(true);
      expect(alert.penaltyApplied).toBe(25);
    });

    it('returns NONE for legitimate ground-floor residential dwelling (PB + RESIDENCIAL)', () => {
      const residentialGroundFloor: CadastralProperty = {
        cadastralReference: '9872023VH5797S0006PB',
        address: baseAddress,
        coordinates: baseCoordinates,
        building: {
          constructionYear: 2015,
          builtSurfaceM2: 120,
          primaryUse: 'Residencial',
          unitsCount: 16,
          hasCommercialGroundFloor: false,
        },
        unit: {
          cadastralReference: '9872023VH5797S0006PB',
          floor: 'PB',
          door: 'A',
          use: 'Residencial',
          builtSurfaceM2: 85,
        },
      };

      const alert = detectSubstandardHousingAlert(residentialGroundFloor);
      expect(alert.severity).toBe('NONE');
      expect(alert.penaltyApplied).toBe(0);
      expect(alert.legalRisks).toHaveLength(0);
      expect(alert.warningMessage).toContain('conforms to registered residential usage standards');
    });

    it('returns NONE for standard upper-floor residential apartment', () => {
      const standardApartment: CadastralProperty = {
        cadastralReference: '9872023VH5797S000703',
        address: baseAddress,
        coordinates: baseCoordinates,
        building: {
          constructionYear: 2005,
          builtSurfaceM2: 100,
          primaryUse: 'Residencial',
          unitsCount: 20,
          hasCommercialGroundFloor: true,
        },
        unit: {
          cadastralReference: '9872023VH5797S000703',
          floor: '03',
          door: 'B',
          use: 'Residencial',
          builtSurfaceM2: 82,
        },
      };

      const alert = detectSubstandardHousingAlert(standardApartment);
      expect(alert.severity).toBe('NONE');
      expect(alert.penaltyApplied).toBe(0);
    });

    it('returns NONE for upper-floor office space in divided building (floor 03 + OFICINA + hasHorizontalDivision: true)', () => {
      const upperOffice: CadastralProperty = {
        cadastralReference: '9872023VH5797S0008OF',
        address: baseAddress,
        coordinates: baseCoordinates,
        building: {
          constructionYear: 2000,
          builtSurfaceM2: 90,
          primaryUse: 'Oficinas',
          unitsCount: 10,
          hasCommercialGroundFloor: true,
        },
        unit: {
          cadastralReference: '9872023VH5797S0008OF',
          floor: '03',
          door: 'IZQ',
          use: 'Oficinas',
          builtSurfaceM2: 90,
        },
        hasHorizontalDivision: true,
      };

      const alert = detectSubstandardHousingAlert(upperOffice);
      expect(alert.severity).toBe('NONE');
      expect(alert.penaltyApplied).toBe(0);
    });

    it('returns NONE for VACANT_PLOT and RUSTIC properties', () => {
      const plot: CadastralProperty = {
        cadastralReference: '000100200VK4713D0001AZ',
        address: baseAddress,
        coordinates: baseCoordinates,
        building: {
          constructionYear: 0,
          builtSurfaceM2: 0,
          primaryUse: 'Solar Urbano',
          unitsCount: 0,
          hasCommercialGroundFloor: false,
        },
        typology: 'VACANT_PLOT',
      };
      const alertPlot = detectSubstandardHousingAlert(plot);
      expect(alertPlot.severity).toBe('NONE');

      const rustic: CadastralProperty = {
        cadastralReference: '28079A001000010000AB',
        address: baseAddress,
        coordinates: baseCoordinates,
        building: {
          constructionYear: 0,
          builtSurfaceM2: 0,
          primaryUse: 'Agrario',
          unitsCount: 0,
          hasCommercialGroundFloor: false,
        },
        typology: 'RUSTIC',
      };
      const alertRustic = detectSubstandardHousingAlert(rustic);
      expect(alertRustic.severity).toBe('NONE');
    });
  });

  describe('5. Integration with Barrio Scoring Engine (calculateBarrioScore & computeBarrioScore)', () => {
    const commercialGroundFloorProperty: CadastralProperty = {
      cadastralReference: '9872023VH5797S0001PB',
      address: baseAddress,
      coordinates: baseCoordinates,
      building: {
        constructionYear: 2010,
        builtSurfaceM2: 75,
        primaryUse: 'Residencial',
        unitsCount: 15,
        hasCommercialGroundFloor: true,
      },
      unit: {
        cadastralReference: '9872023VH5797S0001PB',
        floor: 'PB',
        door: '01',
        use: 'Comercial',
        builtSurfaceM2: 60,
      },
    };

    const regularResidentialProperty: CadastralProperty = {
      ...commercialGroundFloorProperty,
      unit: {
        ...commercialGroundFloorProperty.unit!,
        use: 'Residencial',
        floor: '02',
      },
    };

    it('applies up to 25 points penalty to buildingHealthScore and urbanPlanningScore when substandard housing is detected', () => {
      const regularScore = calculateBarrioScore(regularResidentialProperty, mockNeighborhood, mockEnvironment);
      const substandardScore = calculateBarrioScore(commercialGroundFloorProperty, mockNeighborhood, mockEnvironment);

      // Building health penalty: ~25 points difference
      expect(substandardScore.subscores.building).toBeLessThanOrEqual(regularScore.subscores.building - 20);
      expect(substandardScore.buildingHealthScore).toBeLessThanOrEqual(regularScore.buildingHealthScore - 20);

      // Urban planning penalty: 25 points difference
      expect(substandardScore.subscores.urbanPlanning).toBe(regularScore.subscores.urbanPlanning - 25);

      // Overall composite score must be lower
      expect(substandardScore.overallScore).toBeLessThan(regularScore.overallScore);
    });

    it('inserts high-priority due diligence alerts at the beginning of keyRisks', () => {
      const score = calculateBarrioScore(commercialGroundFloorProperty, mockNeighborhood, mockEnvironment);

      expect(score.keyRisks.length).toBeGreaterThan(0);
      const topRisk = score.keyRisks[0];
      expect(topRisk).toContain('CRITICAL ALERT');
      expect(topRisk).toContain('Infravivienda');
      expect(topRisk).toContain('Comercial');

      expect(score.keyRisks.some((r) => r.includes('cédula de habitabilidad'))).toBe(true);
      expect(score.keyRisks.some((r) => r.includes('padrón'))).toBe(true);
    });

    it('attaches substandardHousing alert object directly to AuditScoreBreakdown', () => {
      const score = calculateBarrioScore(commercialGroundFloorProperty, mockNeighborhood, mockEnvironment);

      expect(score.substandardHousing).toBeDefined();
      expect(score.substandardHousing?.severity).toBe('HIGH');
      expect(score.substandardHousing?.floor).toBe('PB');
      expect(score.substandardHousing?.detectedUse).toBe('Comercial');
      expect(score.substandardHousing?.penaltyApplied).toBe(25);
    });

    it('ensures computeBarrioScore alias returns identical output to calculateBarrioScore', () => {
      const resCalc = calculateBarrioScore(commercialGroundFloorProperty, mockNeighborhood, mockEnvironment);
      const resComp = computeBarrioScore(commercialGroundFloorProperty, mockNeighborhood, mockEnvironment);

      expect(resComp).toEqual(resCalc);
    });
  });

  describe('6. TypeBox Schema Validation Parity', () => {
    it('validates SubstandardHousingAlertSchema, CommercialHousingAlertSchema, and InfraviviendaRiskSchema', () => {
      const sampleProperty: CadastralProperty = {
        cadastralReference: '9872023VH5797S0001PB',
        address: baseAddress,
        coordinates: baseCoordinates,
        building: {
          constructionYear: 1980,
          builtSurfaceM2: 50,
          primaryUse: 'Residencial',
          unitsCount: 10,
          hasCommercialGroundFloor: true,
        },
        unit: {
          cadastralReference: '9872023VH5797S0001PB',
          floor: 'BJ',
          door: 'A',
          use: 'Almacén',
          builtSurfaceM2: 45,
        },
      };

      const alert = detectSubstandardHousingAlert(sampleProperty);
      expect(Value.Check(SubstandardHousingAlertSchema, alert)).toBe(true);
      expect(Value.Check(CommercialHousingAlertSchema, alert)).toBe(true);
      expect(Value.Check(InfraviviendaRiskSchema, alert)).toBe(true);
    });

    it('validates AuditScoreBreakdownSchema with substandardHousing payload', () => {
      const sampleProperty: CadastralProperty = {
        cadastralReference: '9872023VH5797S0001PB',
        address: baseAddress,
        coordinates: baseCoordinates,
        building: {
          constructionYear: 1980,
          builtSurfaceM2: 50,
          primaryUse: 'Residencial',
          unitsCount: 10,
          hasCommercialGroundFloor: true,
        },
        unit: {
          cadastralReference: '9872023VH5797S0001PB',
          floor: 'BJ',
          door: 'A',
          use: 'Almacén',
          builtSurfaceM2: 45,
        },
      };

      const score = calculateBarrioScore(sampleProperty, mockNeighborhood, mockEnvironment);
      expect(Value.Check(AuditScoreBreakdownSchema, score)).toBe(true);
    });

    it('validates PropertyAuditReportSchema with optional substandardHousing field', () => {
      const sampleProperty: CadastralProperty = {
        cadastralReference: '9872023VH5797S0001PB',
        address: baseAddress,
        coordinates: baseCoordinates,
        building: {
          constructionYear: 1980,
          builtSurfaceM2: 50,
          primaryUse: 'Residencial',
          unitsCount: 10,
          hasCommercialGroundFloor: true,
        },
        unit: {
          cadastralReference: '9872023VH5797S0001PB',
          floor: 'BJ',
          door: 'A',
          use: 'Almacén',
          builtSurfaceM2: 45,
        },
      };

      const score = calculateBarrioScore(sampleProperty, mockNeighborhood, mockEnvironment);
      const alert = detectSubstandardHousingAlert(sampleProperty);

      const mockReport = {
        id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        generatedAt: new Date().toISOString(),
        property: sampleProperty,
        neighborhood: mockNeighborhood,
        environment: mockEnvironment,
        score,
        substandardHousing: alert,
      };

      expect(Value.Check(PropertyAuditReportSchema, mockReport)).toBe(true);
    });
  });
});
