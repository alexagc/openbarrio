import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThematicLensSelector } from '../src/components/map/ThematicLensSelector';
import { AuditDossier } from '../src/components/AuditDossier';
import { TransparencyView } from '../src/views/TransparencyView';
import { parseUrlState } from '../src/hooks/useUrlSync';
import { LanguageProvider } from '../src/i18n';
import { PropertyAuditReport } from '@openbarrio/core';

// Mock report fixture
const mockReport: PropertyAuditReport = {
  id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  generatedAt: new Date().toISOString(),
  property: {
    cadastralReference: '28001A001000120001AZ',
    address: {
      street: 'Calle de Santa Engracia',
      number: '42',
      postalCode: '28010',
      municipality: 'Madrid',
      province: 'Madrid',
    },
    coordinates: {
      latitude: 40.4352,
      longitude: -3.7001,
      srs: 'EPSG:4326',
    },
    building: {
      constructionYear: 1940,
      builtSurfaceM2: 82,
      primaryUse: 'Residencial',
      unitsCount: 12,
      hasCommercialGroundFloor: false,
    },
    unit: {
      cadastralReference: '28001A001000120001AZ',
      builtSurfaceM2: 82,
      floor: '3',
      door: 'B',
      use: 'Residencial',
    },
  },
  neighborhood: {
    censusSectionCode: '2807901001',
    averageNetHouseholdIncomeEur: 42000,
    averageNetPersonIncomeEur: 21000,
    percentileInMunicipality: 85,
    rankingInCity: { rank: 1, totalSections: 10 },
    demographics: { medianAge: 44, singlePersonHouseholdPercentage: 25 },
  },
  environment: {
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
  },
  score: {
    overallScore: 84,
    subscores: {
      connectivity: 88,
      urbanPlanning: 85,
      building: 80,
      environmental: 82,
      socioeconomic: 85,
    },
    socioeconomicScore: 85,
    buildingHealthScore: 80,
    acousticComfortScore: 82,
    climateSafetyScore: 85,
    keyHighlights: ['Excelente caminabilidad', 'Bajo nivel de ruido ambiental'],
    keyRisks: [],
  },
  rentalBenchmark: {
    isStressedHousingZone: true,
    officialRangeLowerEurM2: 14.5,
    officialRangeUpperEurM2: 18.2,
    estimatedMonthlyRentLowerEur: 1189,
    estimatedMonthlyRentUpperEur: 1492,
  },
  energy: {
    scope: 'unit',
    ratingEmissions: 'C',
    ratingConsumption: 'C',
    isExpired: false,
    isEstimated: false,
  },
};

describe('Phase 20: Release v1.0.0 — Radical Clarity & Features', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('ThematicLensSelector Component', () => {
    it('renders all 4 lenses with correct labels and triggers onSelectLens', () => {
      const handleSelect = vi.fn();
      render(
        <ThematicLensSelector
          activeLens="urban"
          onSelectLens={handleSelect}
        />
      );

      expect(screen.getByTestId('thematic-lens-tabs')).toBeTruthy();
      expect(screen.getByText('Vida Urbana')).toBeTruthy();
      expect(screen.getByText('Silencio')).toBeTruthy();
      expect(screen.getByText('Riesgos Naturales')).toBeTruthy();
      expect(screen.getByText('Luz 3D')).toBeTruthy();

      // Click Silencio lens
      fireEvent.click(screen.getByTestId('lens-tab-silence'));
      expect(handleSelect).toHaveBeenCalledWith('silence');

      // Click Riesgos Naturales lens
      fireEvent.click(screen.getByTestId('lens-tab-risks'));
      expect(handleSelect).toHaveBeenCalledWith('risks');

      // Click Luz 3D lens
      fireEvent.click(screen.getByTestId('lens-tab-solar'));
      expect(handleSelect).toHaveBeenCalledWith('solar');
    });
  });

  describe('Dossier Critical Alerts & Direct Pillar Architecture', () => {
    it('renders direct score gauge, urban planning regime, and highlights & risks without redundant cards', () => {
      render(<AuditDossier report={mockReport} />);

      expect(screen.getByTestId('tab-summary')).toBeTruthy();
      expect(screen.getByText('Régimen Urbanístico del Suelo:')).toBeTruthy();
      expect(screen.getAllByText('Suelo Urbano Consolidado (SUC)').length).toBeGreaterThan(0);
      expect(screen.getByText('Excelente caminabilidad')).toBeTruthy();
    });

    it('displays critical alert banner when high risk flag is present (flood or expired CEE)', () => {
      const riskyReport: PropertyAuditReport = {
        ...mockReport,
        environment: {
          ...mockReport.environment,
          floodRisk: {
            level: 'HIGH',
            returnPeriodYears: 50,
            isInPreferentialFlowZone: true,
          },
        },
        energy: {
          scope: 'unit',
          ratingEmissions: 'G',
          ratingConsumption: 'G',
          isExpired: true,
          isEstimated: false,
        },
        score: {
          ...mockReport.score,
          overallScore: 42,
          keyRisks: ['Riesgo de inundación fluvial frecuente', 'Discrepancia en superficie m²'],
        },
      };

      render(<AuditDossier report={riskyReport} />);

      expect(screen.getByTestId('dossier-critical-alert-banner')).toBeTruthy();
      expect(screen.getByText(/Alerta Máxima Detectada/i)).toBeTruthy();
      expect(screen.getByText(/Atención Crítica Requerida/i)).toBeTruthy();
    });
  });

  describe('TransparencyView & Official Sources Routing', () => {
    it('renders dedicated official sources catalog with INSPIRE and Legal Guarantees', () => {
      render(
        <LanguageProvider>
          <TransparencyView />
        </LanguageProvider>
      );

      expect(screen.getByText(/Catálogo de Fuentes Oficiales & Soberanía de Datos/i)).toBeTruthy();
      expect(screen.getByText(/Directiva INSPIRE 2007\/2\/CE/i)).toBeTruthy();
      expect(screen.getByText(/Ley 19\/2013 de Transparencia/i)).toBeTruthy();
      expect(screen.getAllByText(/Iniciativa Aporta/i).length).toBeGreaterThan(0);
    });

    it('parses /fuentes-oficiales into transparency viewMode in parseUrlState', () => {
      const originalLocation = window.location;
      Object.defineProperty(window, 'location', {
        writable: true,
        value: {
          pathname: '/fuentes-oficiales',
          search: '',
          href: 'http://localhost/fuentes-oficiales',
        },
      });

      const parsed = parseUrlState();
      expect(parsed.viewMode).toBe('transparency');

      Object.defineProperty(window, 'location', {
        writable: true,
        value: originalLocation,
      });
    });

    it('parses canonical /informe/:refcat route into map viewMode with refcat', () => {
      const originalLocation = window.location;
      Object.defineProperty(window, 'location', {
        writable: true,
        value: {
          pathname: '/informe/28001A001000120001AZ',
          search: '',
          href: 'http://localhost/informe/28001A001000120001AZ',
        },
      });

      const parsed = parseUrlState();
      expect(parsed.viewMode).toBe('map');
      expect(parsed.refcat).toBe('28001A001000120001AZ');

      Object.defineProperty(window, 'location', {
        writable: true,
        value: originalLocation,
      });
    });
  });
});
