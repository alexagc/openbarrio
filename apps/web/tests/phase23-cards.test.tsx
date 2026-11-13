import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BuildingInspectionCard } from '../src/components/dossier/BuildingInspectionCard';
import { SeismicSafetyCard } from '../src/components/dossier/SeismicSafetyCard';
import { PedestrianIsochronesCard } from '../src/components/dossier/PedestrianIsochronesCard';
import { AuditDossier } from '../src/components/AuditDossier';
import {
  evaluateBuildingInspectionAlert,
  evaluateSeismicVulnerability,
  calculatePedestrianIsochrones,
  CadastralProperty,
  PropertyAuditReport,
} from '@openbarrio/core';

describe('Phase 23 Structural Health, ITE/IEE & 15-Minute City WalkScore', () => {
  const mockModernProperty: CadastralProperty = {
    cadastralReference: '2807901VK4720F0001AB',
    address: {
      street: 'Gran Vía',
      number: '28',
      postalCode: '28013',
      municipality: 'Madrid',
      province: 'Madrid',
      provinceCode: '28',
      municipalityCode: '28079',
    },
    coordinates: { latitude: 40.42028, longitude: -3.70379, srs: 'EPSG:4326' },
    building: {
      constructionYear: 2012,
      builtSurfaceM2: 120,
      primaryUse: 'Residencial',
      unitsCount: 16,
      hasCommercialGroundFloor: true,
    },
  };

  const mockVintageProperty: CadastralProperty = {
    cadastralReference: '1808701VG4110A0001ZX',
    address: {
      street: 'Calle Reyes Católicos',
      number: '12',
      postalCode: '18001',
      municipality: 'Granada',
      province: 'Granada',
      provinceCode: '18',
      municipalityCode: '18087',
    },
    coordinates: { latitude: 37.1773, longitude: -3.5986, srs: 'EPSG:4326' },
    building: {
      constructionYear: 1962,
      builtSurfaceM2: 240,
      primaryUse: 'Residencial',
      unitsCount: 8,
      hasCommercialGroundFloor: true,
    },
  };

  describe('1. BuildingInspectionCard Component', () => {
    it('renders favorable ITE inspection badge with next due date', () => {
      const inspection = evaluateBuildingInspectionAlert(mockModernProperty, {
        status: 'FAVORABLE',
        inspectionYear: 2022,
        hasDefects: false,
        municipalRegistry: 'Ayuntamiento de Madrid - Censo ITE',
        accessibilityFulfillment: true,
      });

      render(
        <BuildingInspectionCard
          inspection={inspection}
          property={mockModernProperty}
        />
      );

      expect(screen.getByTestId('building-inspection-card')).toBeDefined();
      expect(screen.getByText(/ITE Favorable/i)).toBeDefined();
      expect(screen.getByText(/Año 2022/i)).toBeDefined();
      expect(screen.getByText(/Año 2032/i)).toBeDefined();
      expect(screen.getByText(/Sin Defectos/i)).toBeDefined();
      expect(screen.getByText(/Accesibilidad Universal/i)).toBeDefined();
    });

    it('renders unfavorable ITE with actionable defects list', () => {
      const inspection = evaluateBuildingInspectionAlert(mockVintageProperty, {
        status: 'UNFAVORABLE',
        inspectionYear: 2021,
        hasDefects: true,
        defectsSummary: ['Fisuras en peto de cubierta', 'Desprendimiento en cornisa de fachada'],
        municipalRegistry: 'Ayuntamiento de Granada - Registro ITE',
      });

      render(
        <BuildingInspectionCard
          inspection={inspection}
          property={mockVintageProperty}
        />
      );

      expect(screen.getByTestId('building-inspection-card')).toBeDefined();
      expect(screen.getAllByText(/Defectos Activos/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText(/Fisuras en peto de cubierta/i)).toBeDefined();
      expect(screen.getByText(/Desprendimiento en cornisa de fachada/i)).toBeDefined();
    });

    it('triggers preventive alert for building >50 years old citing RD-L 7/2015', () => {
      // Vintage property built in 1962 with no official record
      const inspection = evaluateBuildingInspectionAlert(mockVintageProperty);

      render(
        <BuildingInspectionCard
          inspection={inspection}
          property={mockVintageProperty}
        />
      );

      expect(screen.getByTestId('building-inspection-card')).toBeDefined();
      expect(screen.getByTestId('ite-preventive-banner')).toBeDefined();
      expect(screen.getByText(/Alerta Legal >50 Años/i)).toBeDefined();
      expect(screen.getByText(/RD-L 7\/2015 Art\. 29/i)).toBeDefined();
      expect(screen.getByText(/Aviso Preventivo de Deber de Conservación/i)).toBeDefined();
    });
  });

  describe('2. SeismicSafetyCard Component', () => {
    it('renders low seismic hazard for Madrid baseline (ab = 0.04g)', () => {
      const seismic = evaluateSeismicVulnerability('28079', 2012, undefined, 'Madrid');

      render(
        <SeismicSafetyCard
          seismic={seismic}
          constructionYear={2012}
          municipality="Madrid"
        />
      );

      expect(screen.getByTestId('seismic-safety-card')).toBeDefined();
      expect(screen.getAllByText(/ab = 0\.04g/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText(/Peligrosidad Muy Baja/i)).toBeDefined();
      expect(screen.getByText(/Riesgo Sísmico Reducido/i)).toBeDefined();
      expect(screen.queryByTestId('seismic-vulnerability-banner')).toBeNull();
    });

    it('renders high seismic hazard and vulnerability alert for Granada vintage building', () => {
      // Granada has ab = 0.23g and building is from 1962 (pre-NCSE-94)
      const seismic = evaluateSeismicVulnerability('18087', 1962, undefined, 'Granada');

      render(
        <SeismicSafetyCard
          seismic={seismic}
          constructionYear={1962}
          municipality="Granada"
        />
      );

      expect(screen.getByTestId('seismic-safety-card')).toBeDefined();
      expect(screen.getByText(/Peligrosidad Alta/i)).toBeDefined();
      expect(screen.getAllByText(/0\.23g/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getByTestId('seismic-vulnerability-banner')).toBeDefined();
      expect(screen.getByText(/Alerta de Vulnerabilidad Estructural Sísmica/i)).toBeDefined();
      expect(screen.getByText(/Vulnerabilidad Elevada/i)).toBeDefined();
    });
  });

  describe('3. PedestrianIsochronesCard Component', () => {
    it('renders 5, 10, and 15 min catchment counts with tortuosity factor 1.25x', () => {
      const isochrones = calculatePedestrianIsochrones([-3.70379, 40.42028], [
        {
          id: 'fac-1',
          name: 'Centro de Salud Gran Vía',
          type: 'healthcare',
          subtype: 'primary_care',
          distanceMeters: 220,
          walkTimeMinutes: 2.9,
        },
        {
          id: 'fac-2',
          name: 'Metro Gran Vía',
          type: 'transit',
          subtype: 'metro',
          distanceMeters: 180,
          walkTimeMinutes: 2.4,
        },
        {
          id: 'fac-3',
          name: 'Colegio Público Isabel la Católica',
          type: 'education',
          subtype: 'school',
          distanceMeters: 450,
          walkTimeMinutes: 6.0,
        },
        {
          id: 'fac-4',
          name: 'Jardines de Sabatini',
          type: 'park',
          subtype: 'urban_park',
          distanceMeters: 850,
          walkTimeMinutes: 11.3,
        },
      ]);

      render(
        <PedestrianIsochronesCard
          isochrones={isochrones}
          connectivity={{
            walkScore15Min: 92,
            facilitiesWithin15MinCount: 4,
          }}
        />
      );

      expect(screen.getByTestId('pedestrian-isochrones-card')).toBeDefined();
      expect(screen.getByText(/WalkScore 92\/100/i)).toBeDefined();
      expect(screen.getByText(/5 min \(~375m\)/i)).toBeDefined();
      expect(screen.getByText(/10 min \(~750m\)/i)).toBeDefined();
      expect(screen.getByText(/15 min \(~1\.125m\)/i)).toBeDefined();
      expect(screen.getByText(/Factor de tortuosidad peatonal real 1\.25x/i)).toBeDefined();
    });
  });

  describe('4. AuditDossier Integration', () => {
    const mockReport: PropertyAuditReport = {
      id: 'a0000000-0000-0000-0000-000000000001',
      generatedAt: '2026-11-13T16:00:00Z',
      property: mockVintageProperty,
      neighborhood: {
        censusSectionCode: '1808701001',
        averageNetHouseholdIncomeEur: 32000,
        averageNetPersonIncomeEur: 14500,
        percentileInMunicipality: 65,
        rankingInCity: { rank: 20, totalSections: 80 },
        demographics: { medianAge: 44, singlePersonHouseholdPercentage: 25 },
      },
      environment: {
        noise: { dayEveningNightDecibels: 52, category: 'MODERATE', predominantSource: 'ROAD_TRAFFIC' },
        floodRisk: { level: 'NONE', returnPeriodYears: null, isInPreferentialFlowZone: false },
      },
      connectivity: {
        walkScore15Min: 85,
        facilitiesWithin15MinCount: 18,
      },
      urbanPlanning: {
        landClassification: 'URBAN_CONSOLIDATED',
        zoningCode: 'NZ-Granada',
        isProtectedLand: false,
        declaredRenovationsCount: 1,
        lastRenovationYear: 2005,
        isStressedHousingZone: false,
      },
      score: {
        overallScore: 78,
        subscores: {
          building: 70,
          connectivity: 85,
          environmental: 75,
          socioeconomic: 80,
          urbanPlanning: 85,
        },
        socioeconomicScore: 80,
        buildingHealthScore: 70,
        acousticComfortScore: 85,
        climateSafetyScore: 100,
        keyHighlights: ['Ubicación consolidada'],
        keyRisks: ['Finca >50 años: obligación de IEE (RD-L 7/2015)'],
      },
    };

    it('renders critical alert for vintage property requiring preventive IEE in Tab 1', () => {
      render(<AuditDossier report={mockReport} />);

      expect(screen.getByTestId('dossier-critical-alert-banner')).toBeDefined();
      expect(screen.getAllByText(/Alerta preventiva: Finca de más de 50 años/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/Vulnerabilidad sísmica/i).length).toBeGreaterThanOrEqual(1);
    });

    it('displays BuildingInspectionCard and SeismicSafetyCard when clicking Building Tab', () => {
      render(<AuditDossier report={mockReport} activeTab="building" />);

      expect(screen.getByTestId('building-inspection-card')).toBeDefined();
      expect(screen.getByTestId('seismic-safety-card')).toBeDefined();
    });

    it('displays PedestrianIsochronesCard when clicking Environment Tab', () => {
      render(<AuditDossier report={mockReport} activeTab="environment" />);

      expect(screen.getByTestId('pedestrian-isochrones-card')).toBeDefined();
    });
  });
});
