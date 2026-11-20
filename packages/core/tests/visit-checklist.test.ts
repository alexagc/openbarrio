import { describe, it, expect } from 'vitest';
import {
  generateVisitChecklist,
  VISIT_CHECKLIST_ITEM_IDS,
  type PropertyAuditReport,
  type LayerStatus,
} from '../src/index.js';

function createBaseReport(): PropertyAuditReport {
  return {
    id: '11111111-1111-4111-8111-111111111111',
    generatedAt: '2026-11-20T00:00:00.000Z',
    property: {
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
        constructionYear: 2015,
        builtSurfaceM2: 1200,
        unitsCount: 12,
        primaryUse: 'Residencial',
        hasCommercialGroundFloor: false,
      },
      unit: {
        cadastralReference: '1234567VK1234S0001AB',
        floor: '3',
        door: 'A',
        builtSurfaceM2: 95,
        use: 'Residencial',
      },
      typology: 'RESIDENTIAL',
    },
    typology: 'RESIDENTIAL',
    environment: {
      noise: {
        dayEveningNightDecibels: 52,
        predominantSource: 'TRAFFIC',
      },
      floodRisk: {
        level: 'NONE',
        returnPeriodYears: null,
        isInPreferentialFlowZone: false,
      },
    },
    energy: {
      ratingEmissions: 'B',
      ratingConsumption: 'B',
      isEstimated: false,
      isExpired: false,
    },
    urbanPlanning: {
      landClassification: 'URBAN_CONSOLIDATED',
      isProtectedLand: false,
      isStressedHousingZone: false,
    },
    score: {
      overallScore: 88,
      subscores: {
        building: 92,
        connectivity: 88,
        environmental: 90,
        socioeconomic: 82,
        urbanPlanning: 90,
      },
      socioeconomicScore: 82,
      buildingHealthScore: 92,
      acousticComfortScore: 88,
      climateSafetyScore: 100,
      keyHighlights: [],
      keyRisks: [],
      trafficLight: 'GREEN',
    },
    layers: {
      catastro: { status: 'ok', sourceName: 'Catastro OVC' },
      ine: { status: 'ok', sourceName: 'INE ADRH' },
      sica: { status: 'ok', sourceName: 'MITECO SICA' },
      snczi: { status: 'ok', sourceName: 'MITECO SNCZI' },
      mivau: { status: 'ok', sourceName: 'MIVAU SERPAVI' },
      cee: { status: 'ok', sourceName: 'CEE Autonómico' },
      radon: { status: 'ok', sourceName: 'CTE DB-HS 6' },
      seismic: { status: 'ok', sourceName: 'IGN NCSE-02' },
      ite: { status: 'ok', sourceName: 'ITE Municipal' },
      vut: { status: 'ok', sourceName: 'INE VUT' },
      urbanPlanning: { status: 'ok', sourceName: 'MIVAU SIU' },
      connectivity: { status: 'ok', sourceName: 'IGN / CNIG' },
    },
  };
}

describe('generateVisitChecklist — golden alert rules & determinism', () => {
  const fixedNow = new Date('2026-11-20T00:00:00.000Z');

  it('produces an empty checklist for a clean modern residential property with all layers ok', () => {
    const report = createBaseReport();
    const checklist = generateVisitChecklist(report, { now: fixedNow });

    expect(checklist.refcat).toBe('1234567VK1234S0001AB');
    expect(checklist.generatedAt).toBe('2026-11-20T00:00:00.000Z');
    expect(checklist.profile).toBe('none');
    expect(checklist.items).toHaveLength(0);
    expect(checklist.counts.total).toBe(0);
  });

  it('is byte-for-byte deterministic with identical inputs', () => {
    const report = createBaseReport();
    report.property.building.constructionYear = 1955;
    report.environment.noise = { dayEveningNightDecibels: 72, predominantSource: 'TRAFFIC' };
    report.layers!.snczi = { status: 'unavailable', sourceName: 'MITECO SNCZI', reason: 'timeout' };

    const a = generateVisitChecklist(report, { now: fixedNow, profile: 'family' });
    const b = generateVisitChecklist(report, { now: fixedNow, profile: 'family' });

    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
    expect(a.items.length).toBeGreaterThan(0);
  });

  it('covers every golden alert rule in VISIT_CHECKLIST_ITEM_IDS', () => {
    const report = createBaseReport();
    report.property.building.constructionYear = 1960; // age_old_building
    report.property.unit = {
      cadastralReference: '1234567VK1234S0001AB',
      floor: 'PB',
      builtSurfaceM2: 45,
      use: 'COMERCIAL',
    };
    report.substandardHousing = {
      severity: 'HIGH',
      detectedUse: 'COMERCIAL',
      floor: 'PB',
      reason: 'Commercial ground floor marketed as residential',
      penaltyApplied: 25,
    };
    report.buildingInspection = {
      status: 'UNFAVORABLE',
      hasDefects: true,
      defectsSummary: ['Facade cracks'],
      municipalRegistry: 'Ayuntamiento de Madrid',
      isPreventiveAlert: true,
      legalNotice: 'RD-L 7/2015',
    };
    report.environment.noise = { dayEveningNightDecibels: 76, predominantSource: 'TRAFFIC' };
    report.environment.floodRisk = {
      level: 'HIGH',
      returnPeriodYears: 10,
      isInPreferentialFlowZone: true,
    };
    report.radon = {
      municipalityZone: 'Zona II',
      requiresMitigation: true,
      riskLevel: 'high',
      contextualReason: 'Ground floor in Zona II',
      floorLevel: 0,
      isGroundContact: true,
    };
    report.energy = {
      ratingEmissions: 'F',
      isExpired: true,
      validUntil: '2024-05-01',
      isEstimated: false,
    };
    report.seismicHazard = {
      basicAccelerationG: 0.15,
      riskLevel: 'HIGH',
      municipalityCode: '18087',
      municipalityName: 'Granada',
      ncseStandardApplied: 'PRE_REGULATION',
      isVulnerableToSeismic: true,
      regulatoryContext: 'Pre-NCSE-94',
    };
    report.vut = {
      vutCount: 42,
      totalDwellings: 400,
      vutRatioPct: 10.5,
      riskLevel: 'critical',
    };
    report.capex = {
      buildingAgeYears: 66,
      iteStatus: 'mandatory_overdue',
      iteDeadlineYear: 2020,
      iteRequired: true,
      accessibilityRisk: 'high',
      hasElevator: false,
      elevatorRisk: true,
      estimatedCommunityExpenseRangeEurMonth: { min: 120, max: 180 },
      estimatedCapExPerM2Eur: { min: 250, max: 400 },
      reserveFundAdequacy: 'deficit_severe',
      estimatedReserveFundDeficitPct: 75,
      renovationPriorities: ['Roof', 'Elevator'],
      thermalEnvelopeLossPct: 45,
      capexRiskScore: 30,
    };
    report.urbanPlanning = {
      landClassification: 'URBAN_UNCONSOLIDATED',
      isProtectedLand: true,
      isStressedHousingZone: true,
    };

    const checklist = generateVisitChecklist(report, { now: fixedNow });
    const ids = checklist.items.map((i) => i.id);

    const expectedTriggered = VISIT_CHECKLIST_ITEM_IDS.filter((id) => id !== 'cee_missing');
    for (const expectedId of expectedTriggered) {
      expect(ids).toContain(expectedId);
    }

    // Now test cee_missing separately when CEE is absent/estimated
    const missingCeeReport = createBaseReport();
    missingCeeReport.energy = undefined;
    const missingCeeChecklist = generateVisitChecklist(missingCeeReport, { now: fixedNow });
    expect(missingCeeChecklist.items.map((i) => i.id)).toContain('cee_missing');
  });

  it('emits unverified items for stale, unavailable, and out_of_coverage layers and never omits them', () => {
    const statuses: LayerStatus[] = ['stale', 'unavailable', 'out_of_coverage'];

    for (const status of statuses) {
      const report = createBaseReport();
      report.layers!.sica = {
        status,
        sourceName: 'MITECO SICA',
        ...(status === 'stale' ? { staleDays: 120, verifiedAt: '2026-07-01T00:00:00.000Z' } : {}),
        ...(status === 'out_of_coverage' ? { reason: 'no_coverage' } : {}),
        ...(status === 'unavailable' ? { reason: 'timeout' } : {}),
      };
      report.layers!.ite = {
        status,
        sourceName: 'ITE Municipal',
        ...(status === 'stale' ? { staleDays: 95, verifiedAt: '2026-08-01T00:00:00.000Z' } : {}),
      };

      const checklist = generateVisitChecklist(report, { now: fixedNow });
      const sicaItem = checklist.items.find((i) => i.id === 'unverified_sica');
      const iteItem = checklist.items.find((i) => i.id === 'unverified_ite');

      expect(sicaItem).toBeDefined();
      expect(sicaItem?.layerStatus).toBe(status);
      expect(sicaItem?.category).toBe('verification');
      expect(sicaItem?.severity).toBe(status === 'stale' ? 'important' : 'critical');

      expect(iteItem).toBeDefined();
      expect(iteItem?.layerStatus).toBe(status);
      expect(iteItem?.severity).toBe(status === 'stale' ? 'info' : 'important');
    }
  });

  it('skips unverified item when layer reason is not_applicable', () => {
    const report = createBaseReport();
    report.layers!.cee = {
      status: 'out_of_coverage',
      sourceName: 'CEE Autonómico',
      reason: 'not_applicable',
    };
    const checklist = generateVisitChecklist(report, { now: fixedNow });
    expect(checklist.items.find((i) => i.id === 'unverified_cee')).toBeUndefined();
  });

  it('reorders items deterministically according to active profile boosts', () => {
    const report = createBaseReport();
    report.environment.noise = { dayEveningNightDecibels: 68, predominantSource: 'TRAFFIC' };
    report.vut = { vutCount: 20, totalDwellings: 400, vutRatioPct: 5.0, riskLevel: 'moderate' };

    const familyChecklist = generateVisitChecklist(report, { now: fixedNow, profile: 'family' });
    const investorChecklist = generateVisitChecklist(report, { now: fixedNow, profile: 'investor' });

    const familyNoiseIdx = familyChecklist.items.findIndex((i) => i.id === 'noise_high');
    const familyVutIdx = familyChecklist.items.findIndex((i) => i.id === 'vut_high_pressure');
    expect(familyNoiseIdx).toBeLessThan(familyVutIdx);

    const investorNoiseIdx = investorChecklist.items.findIndex((i) => i.id === 'noise_high');
    const investorVutIdx = investorChecklist.items.findIndex((i) => i.id === 'vut_high_pressure');
    expect(investorVutIdx).toBeLessThan(investorNoiseIdx);
  });
});
