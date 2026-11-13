import { describe, it, expect } from 'vitest';
import {
  evaluateBuildingInspectionAlert,
  resolveMunicipalRegistry,
  LEGAL_NOTICE_RDL_7_2015,
  evaluateSeismicVulnerability,
  resolveSeismicRiskLevel,
  resolveNcseStandardApplied,
  generateParametricIsochrones,
  calculatePedestrianIsochrones,
  calculateBarrioScore,
  CadastralProperty,
  CensusTractIncome,
  CivicFacility,
} from '../src/index.js';

describe('Phase 23: Building Inspection (ITE/IEE), Seismic Hazard & Pedestrian Isochrones', () => {
  const baseProperty: CadastralProperty = {
    cadastralReference: '1234567AB1234C0001XY',
    address: {
      street: 'Calle Mayor',
      number: '10',
      postalCode: '28013',
      municipality: 'Madrid',
      province: 'Madrid',
      provinceCode: '28',
      municipalityCode: '079',
    },
    coordinates: {
      latitude: 40.4168,
      longitude: -3.7038,
      srs: 'EPSG:4326',
    },
    building: {
      constructionYear: 1960,
      builtSurfaceM2: 500,
      primaryUse: 'Residencial',
      unitsCount: 12,
      hasCommercialGroundFloor: true,
    },
  };

  const baseNeighborhood: CensusTractIncome = {
    censusSectionCode: '2807901001',
    averageNetHouseholdIncomeEur: 42000,
    averageNetPersonIncomeEur: 19000,
    percentileInMunicipality: 70,
    rankingInCity: { rank: 300, totalSections: 2450 },
    demographics: { medianAge: 46, singlePersonHouseholdPercentage: 30 },
  };

  describe('1. Building Technical Inspection (ITE/IEE) & Preventive Alert', () => {
    it('triggers PREVENTIVE_REQUIRED alert for buildings over 50 years without official record', () => {
      // 1960 is 66 years old in 2026 (> 50 years)
      const evaluation = evaluateBuildingInspectionAlert(baseProperty);

      expect(evaluation.status).toBe('PREVENTIVE_REQUIRED');
      expect(evaluation.isPreventiveAlert).toBe(true);
      expect(evaluation.hasDefects).toBe(false);
      expect(evaluation.municipalRegistry).toContain('Madrid');
      expect(evaluation.legalNotice).toBe(LEGAL_NOTICE_RDL_7_2015);
      expect(evaluation.legalNotice).toContain('Real Decreto Legislativo 7/2015');
    });

    it('marks buildings under 50 years as EXEMPT with correct nextInspectionDueYear', () => {
      const modernProperty: CadastralProperty = {
        ...baseProperty,
        building: {
          ...baseProperty.building,
          constructionYear: 2005,
        },
      };

      const evaluation = evaluateBuildingInspectionAlert(modernProperty);
      expect(evaluation.status).toBe('EXEMPT');
      expect(evaluation.isPreventiveAlert).toBe(false);
      expect(evaluation.nextInspectionDueYear).toBe(2055);
    });

    it('respects official FAVORABLE ITE/IEE registration', () => {
      const evaluation = evaluateBuildingInspectionAlert(baseProperty, {
        status: 'FAVORABLE',
        inspectionYear: 2022,
        hasDefects: false,
        defectsSummary: [],
        accessibilityFulfillment: true,
        energyCertificationIncluded: true,
      });

      expect(evaluation.status).toBe('FAVORABLE');
      expect(evaluation.isPreventiveAlert).toBe(false);
      expect(evaluation.hasDefects).toBe(false);
      expect(evaluation.inspectionYear).toBe(2022);
      expect(evaluation.nextInspectionDueYear).toBe(2032);
      expect(evaluation.accessibilityFulfillment).toBe(true);
      expect(evaluation.energyCertificationIncluded).toBe(true);
    });

    it('respects official UNFAVORABLE ITE/IEE record with defects summary', () => {
      const evaluation = evaluateBuildingInspectionAlert(baseProperty, {
        status: 'UNFAVORABLE',
        inspectionYear: 2023,
        hasDefects: true,
        defectsSummary: ['Fisuras graves en cornisa y desprendimientos en fachada'],
      });

      expect(evaluation.status).toBe('UNFAVORABLE');
      expect(evaluation.isPreventiveAlert).toBe(false);
      expect(evaluation.hasDefects).toBe(true);
      expect(evaluation.defectsSummary).toHaveLength(1);
      expect(evaluation.defectsSummary[0]).toContain('Fisuras graves');
    });

    it('resolves competent municipal registries across Spanish regions', () => {
      expect(resolveMunicipalRegistry({ ...baseProperty, address: { ...baseProperty.address, municipality: 'Barcelona', provinceCode: '08' } }))
        .toContain("Agència de l'Habitatge de Catalunya");

      expect(resolveMunicipalRegistry({ ...baseProperty, address: { ...baseProperty.address, municipality: 'Bilbao', provinceCode: '48' } }))
        .toContain('Eusko Jaurlaritza');

      expect(resolveMunicipalRegistry({ ...baseProperty, address: { ...baseProperty.address, municipality: 'València', provinceCode: '46' } }))
        .toContain('Ajuntament de València');
    });
  });

  describe('2. Seismic Hazard & Vulnerability Evaluation (IGN NCSE-02)', () => {
    it('accurately resolves high-risk seismic zones (Granada ab=0.23g, Lorca ab=0.19g)', () => {
      const granada = evaluateSeismicVulnerability('18087', 1980);
      expect(granada.basicAccelerationG).toBe(0.23);
      expect(granada.riskLevel).toBe('HIGH');
      expect(granada.isVulnerableToSeismic).toBe(true); // Pre-1994 and ab >= 0.08
      expect(granada.ncseStandardApplied).toBe('PGS_1');

      const lorca = evaluateSeismicVulnerability('30024', 1975);
      expect(lorca.basicAccelerationG).toBe(0.19);
      expect(lorca.riskLevel).toBe('HIGH');
      expect(lorca.isVulnerableToSeismic).toBe(true);
    });

    it('identifies non-vulnerable modern construction in seismic zones (Post-1994)', () => {
      const modernGranada = evaluateSeismicVulnerability('18087', 2005);
      expect(modernGranada.basicAccelerationG).toBe(0.23);
      expect(modernGranada.riskLevel).toBe('HIGH');
      expect(modernGranada.isVulnerableToSeismic).toBe(false); // Post-1994 is compliant
      expect(modernGranada.ncseStandardApplied).toBe('NCSE_02');
    });

    it('resolves baseline low seismic hazard for Madrid and Barcelona (ab=0.04g)', () => {
      const madrid = evaluateSeismicVulnerability('28079', 1970);
      expect(madrid.basicAccelerationG).toBe(0.04);
      expect(madrid.riskLevel).toBe('VERY_LOW');
      expect(madrid.isVulnerableToSeismic).toBe(false);

      const bcn = evaluateSeismicVulnerability('08019', 2010);
      expect(bcn.basicAccelerationG).toBe(0.04);
      expect(bcn.riskLevel).toBe('VERY_LOW');
    });

    it('classifies risk levels correctly based on acceleration thresholds', () => {
      expect(resolveSeismicRiskLevel(0.24)).toBe('HIGH');
      expect(resolveSeismicRiskLevel(0.16)).toBe('HIGH');
      expect(resolveSeismicRiskLevel(0.12)).toBe('MEDIUM');
      expect(resolveSeismicRiskLevel(0.08)).toBe('MEDIUM');
      expect(resolveSeismicRiskLevel(0.06)).toBe('LOW');
      expect(resolveSeismicRiskLevel(0.04)).toBe('VERY_LOW');
    });

    it('resolves regulatory standards chronologically', () => {
      expect(resolveNcseStandardApplied(1960)).toBe('PRE_REGULATION');
      expect(resolveNcseStandardApplied(1975)).toBe('PGS_1');
      expect(resolveNcseStandardApplied(1996)).toBe('NCSE_94');
      expect(resolveNcseStandardApplied(2015)).toBe('NCSE_02');
    });
  });

  describe('3. Pedestrian Isochrones & 15-Minute City Walkability', () => {
    const center: [number, number] = [-3.7038, 40.4168];

    const sampleFacilities: CivicFacility[] = [
      { id: 'h1', type: 'healthcare', subtype: 'clinic', name: 'Centro de Salud Centro', distanceMeters: 250, walkTimeMinutes: 3.3 },
      { id: 't1', type: 'transit', subtype: 'metro', name: 'Sol Metro', distanceMeters: 180, walkTimeMinutes: 2.4 },
      { id: 'e1', type: 'education', subtype: 'school', name: 'Colegio Público Pi i Margall', distanceMeters: 550, walkTimeMinutes: 7.3 },
      { id: 'p1', type: 'park', subtype: 'plaza', name: 'Plaza Mayor', distanceMeters: 300, walkTimeMinutes: 4.0 },
      { id: 'h2', type: 'healthcare', subtype: 'hospital', name: 'Hospital Clínico', distanceMeters: 900, walkTimeMinutes: 12.0 },
      { id: 'e2', type: 'education', subtype: 'institute', name: 'IES Lope de Vega', distanceMeters: 1000, walkTimeMinutes: 13.3 },
    ];

    it('generates valid GeoJSON FeatureCollection with 3 isochrone polygon rings (5, 10, 15 min)', () => {
      const geojson = generateParametricIsochrones(center);

      expect(geojson.type).toBe('FeatureCollection');
      expect(geojson.features).toHaveLength(3);

      const [f15, f10, f5] = geojson.features;
      expect(f15.properties.minutes).toBe(15);
      expect(f15.properties.radiusMeters).toBe(1125);
      expect(f15.geometry.type).toBe('Polygon');
      expect(f15.geometry.coordinates[0].length).toBeGreaterThan(30);

      expect(f10.properties.minutes).toBe(10);
      expect(f10.properties.radiusMeters).toBe(750);

      expect(f5.properties.minutes).toBe(5);
      expect(f5.properties.radiusMeters).toBe(375);
    });

    it('calculates facility counts and breakdown across 5, 10, and 15 min bands', () => {
      const result = calculatePedestrianIsochrones(center, sampleFacilities);

      // Within 5 min: h1 (3.3 min), t1 (2.4 min), p1 (4.0 min) -> 3 facilities
      expect(result.isochrone5Min.facilitiesCount).toBe(3);
      expect(result.isochrone5Min.facilitiesBreakdown.healthcare).toBe(1);
      expect(result.isochrone5Min.facilitiesBreakdown.transit).toBe(1);
      expect(result.isochrone5Min.facilitiesBreakdown.park).toBe(1);

      // Within 10 min: + e1 (7.3 min) -> 4 facilities
      expect(result.isochrone10Min.facilitiesCount).toBe(4);
      expect(result.isochrone10Min.facilitiesBreakdown.education).toBe(1);

      // Within 15 min: + h2 (12.0 min) + e2 (13.3 min) -> 6 facilities total
      expect(result.isochrone15Min.facilitiesCount).toBe(6);
      expect(result.totalFacilitiesWithin15Min).toBe(6);
      expect(result.isochrone15Min.facilitiesBreakdown.healthcare).toBe(2);
      expect(result.isochrone15Min.facilitiesBreakdown.education).toBe(2);
    });
  });

  describe('4. Scoring Engine Integration (Building Health & Environmental Impacts)', () => {
    it('applies 20-point penalty and critical alert for UNFAVORABLE ITE/IEE', () => {
      const baseline = calculateBarrioScore(baseProperty, baseNeighborhood);
      const unfavorableIte = evaluateBuildingInspectionAlert(baseProperty, {
        status: 'UNFAVORABLE',
        defectsSummary: ['Daños estructurales en forjados'],
      });

      const scored = calculateBarrioScore(
        baseProperty,
        baseNeighborhood,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        unfavorableIte
      );

      expect(scored.buildingHealthScore).toBe(baseline.buildingHealthScore - 20);
      expect(scored.keyRisks.some((r) => r.includes('CRITICAL: Unfavorable Technical Building Inspection'))).toBe(true);
    });

    it('awards +5 bonus and highlight for FAVORABLE ITE/IEE', () => {
      const baseline = calculateBarrioScore(baseProperty, baseNeighborhood);
      const favorableIte = evaluateBuildingInspectionAlert(baseProperty, {
        status: 'FAVORABLE',
        inspectionYear: 2023,
      });

      const scored = calculateBarrioScore(
        baseProperty,
        baseNeighborhood,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        favorableIte
      );

      expect(scored.buildingHealthScore).toBe(baseline.buildingHealthScore + 5);
      expect(scored.keyHighlights.some((h) => h.includes('Favorable Technical Building Inspection'))).toBe(true);
    });

    it('flags preventive warning when building inspection has isPreventiveAlert=true', () => {
      const preventiveIte = evaluateBuildingInspectionAlert(baseProperty); // Age > 50 -> PREVENTIVE_REQUIRED
      expect(preventiveIte.isPreventiveAlert).toBe(true);

      const scored = calculateBarrioScore(
        baseProperty,
        baseNeighborhood,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        preventiveIte
      );

      expect(scored.keyRisks.some((r) => r.includes('Preventive IEE/ITE alert'))).toBe(true);
      expect(scored.keyRisks.some((r) => r.includes('Real Decreto Legislativo 7/2015'))).toBe(true);
    });

    it('penalizes building health score for pre-1994 buildings in seismic zones (ab >= 0.08g)', () => {
      const baseline = calculateBarrioScore(baseProperty, baseNeighborhood);
      // Property built in 1960 in Granada (ab=0.23g)
      const seismicHazard = evaluateSeismicVulnerability('18087', 1960);
      expect(seismicHazard.isVulnerableToSeismic).toBe(true);

      const scored = calculateBarrioScore(
        baseProperty,
        baseNeighborhood,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        seismicHazard
      );

      expect(scored.buildingHealthScore).toBe(baseline.buildingHealthScore - 8);
      expect(scored.keyRisks.some((r) => r.includes('Seismic vulnerability alert'))).toBe(true);
    });

    it('penalizes environmental score for elevated seismic hazard zones (ab >= 0.12g)', () => {
      const baseline = calculateBarrioScore(baseProperty, baseNeighborhood);
      const granadaSeismic = evaluateSeismicVulnerability('18087', 2010); // ab=0.23g >= 0.12g
      expect(granadaSeismic.basicAccelerationG).toBeGreaterThanOrEqual(0.12);

      const scored = calculateBarrioScore(
        baseProperty,
        baseNeighborhood,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        granadaSeismic
      );

      expect(scored.subscores.environmental).toBe(baseline.subscores.environmental - 8);
      expect(scored.keyRisks.some((r) => r.includes('Elevated seismic hazard zone'))).toBe(true);
    });
  });
});
