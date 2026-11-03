import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AuditDossier } from '../src/components/AuditDossier';
import { PropertyAuditReport, detectPropertyTypology } from '@openbarrio/core';

const baseMockReport: PropertyAuditReport = {
  id: 'test-typology-report-01',
  generatedAt: '2026-11-03T10:00:00.000Z',
  property: {
    cadastralReference: '1234567VK4713D0001AZ',
    address: {
      street: 'Calle Alcalá',
      number: '100',
      postalCode: '28009',
      municipality: 'Madrid',
      province: 'Madrid',
    },
    coordinates: { latitude: 40.42, longitude: -3.68, srs: 'EPSG:4326' },
    building: {
      constructionYear: 1985,
      builtSurfaceM2: 1200,
      primaryUse: 'Residencial',
      unitsCount: 12,
      hasCommercialGroundFloor: false,
    },
  },
  neighborhood: {
    censusSectionCode: '2807901001',
    averageNetHouseholdIncomeEur: 55000,
    averageNetPersonIncomeEur: 27500,
    percentileInMunicipality: 85,
    rankingInCity: { rank: 12, totalSections: 120 },
    demographics: { medianAge: 42, singlePersonHouseholdPercentage: 30 },
  },
  environment: {
    noise: {
      dayEveningNightDecibels: 55,
      category: 'MODERATE',
      predominantSource: 'ROAD_TRAFFIC',
    },
    floodRisk: {
      level: 'NONE',
      returnPeriodYears: null,
      isInPreferentialFlowZone: false,
    },
  },
  score: {
    overallScore: 82,
    subscores: {
      building: 80,
      connectivity: 85,
      environmental: 80,
      socioeconomic: 85,
      urbanPlanning: 80,
    },
    socioeconomicScore: 85,
    buildingHealthScore: 80,
    acousticComfortScore: 80,
    climateSafetyScore: 100,
    keyHighlights: ['Standard residential zone'],
    keyRisks: [],
  },
  rentalBenchmark: {
    officialRangeLowerEurM2: 14.5,
    officialRangeUpperEurM2: 18.2,
    estimatedMonthlyRentLowerEur: 1100,
    estimatedMonthlyRentUpperEur: 1400,
    isStressedHousingZone: true,
  },
  capex: {
    buildingAgeYears: 39,
    iteStatus: 'favorable_active',
    iteDeadlineYear: 2030,
    iteRequired: true,
    accessibilityRisk: 'low',
    hasElevator: true,
    elevatorRisk: false,
    estimatedCommunityExpenseRangeEurMonth: { min: 70, max: 110 },
    estimatedCapExPerM2Eur: { min: 20, max: 40 },
    reserveFundAdequacy: 'optimal',
    estimatedReserveFundDeficitPct: 0,
    renovationPriorities: [],
    thermalEnvelopeLossPct: 15,
    capexRiskScore: 35,
  },
  energy: {
    ratingEmissions: 'D',
    ratingConsumption: 'E',
    scope: 'building',
    isEstimated: false,
  },
};

describe('Non-Residential Typology Adaptation (Phase 18 Stream B)', () => {
  it('correctly classifies typologies via detectPropertyTypology helper', () => {
    expect(detectPropertyTypology('SOLAR', 0, 0)).toBe('VACANT_PLOT');
    expect(detectPropertyTypology('SUELO SIN EDIFICAR', null, 0)).toBe('VACANT_PLOT');
    expect(detectPropertyTypology('INDUSTRIAL', 1995, 1)).toBe('INDUSTRIAL');
    expect(detectPropertyTypology('ALMACEN', 2005, 1)).toBe('INDUSTRIAL');
    expect(detectPropertyTypology('RÚSTICO', 0, 0)).toBe('RUSTIC');
    expect(detectPropertyTypology('COMERCIAL', 2010, 2)).toBe('COMMERCIAL');
    expect(detectPropertyTypology('EQUIPAMIENTO', 1990, 1)).toBe('EQUIPMENT');
    expect(detectPropertyTypology('RESIDENCIAL', 2008, 20)).toBe('RESIDENTIAL');
  });

  it('renders distinctive Solar Urbano badge and adapts building tab for VACANT_PLOT', () => {
    const vacantReport: PropertyAuditReport = {
      ...baseMockReport,
      typology: 'VACANT_PLOT',
      property: {
        ...baseMockReport.property,
        building: {
          ...baseMockReport.property.building,
          constructionYear: 0,
          builtSurfaceM2: 850,
          primaryUse: 'Solar Urbano',
          unitsCount: 0,
        },
      },
      capex: undefined,
      energy: undefined,
    };

    render(<AuditDossier report={vacantReport} activeTab="building" />);

    // Typology badge verification
    const badge = screen.getByTestId('dossier-typology-badge');
    expect(badge).toBeTruthy();
    expect(badge.textContent).toContain('Solar Urbano');

    // Building tab verification: displays vacant plot notice instead of residential CapEx
    const vacantNotice = screen.getByTestId('vacant-plot-notice');
    expect(vacantNotice).toBeTruthy();
    expect(vacantNotice.textContent).toContain('Parcela sin edificación');
  });

  it('suppresses residential rental module for non-residential typologies in market tab', () => {
    const industrialReport: PropertyAuditReport = {
      ...baseMockReport,
      typology: 'INDUSTRIAL',
      property: {
        ...baseMockReport.property,
        building: {
          ...baseMockReport.property.building,
          primaryUse: 'Industrial / Nave',
        },
      },
    };

    render(<AuditDossier report={industrialReport} activeTab="market" />);

    const badge = screen.getByTestId('dossier-typology-badge');
    expect(badge.textContent).toContain('Nave Industrial');

    // MIVAU SERPAVI residential module must not be displayed for industrial properties
    expect(screen.queryByText(/Rango Oficial de Alquiler/i)).toBeNull();
  });

  it('renders rustic plot notice for RUSTIC typology', () => {
    const rusticReport: PropertyAuditReport = {
      ...baseMockReport,
      typology: 'RUSTIC',
      property: {
        ...baseMockReport.property,
        cadastralReference: '45001A002000030000AB',
        building: {
          ...baseMockReport.property.building,
          constructionYear: 0,
          builtSurfaceM2: 50000,
          primaryUse: 'Agrario / Rústico',
          unitsCount: 0,
        },
      },
      capex: undefined,
      energy: undefined,
    };

    render(<AuditDossier report={rusticReport} activeTab="building" />);

    const badge = screen.getByTestId('dossier-typology-badge');
    expect(badge.textContent).toContain('Finca Rústica');

    const rusticNotice = screen.getByTestId('rustic-plot-notice');
    expect(rusticNotice).toBeTruthy();
    expect(rusticNotice.textContent).toContain('Finca rústica');
  });

  it('calibrates header, technical overview, fiscal simulator and trends for rustic parcel with plot surface', () => {
    const rusticParcelReport: PropertyAuditReport = {
      ...baseMockReport,
      typology: 'RUSTIC',
      property: {
        ...baseMockReport.property,
        cadastralReference: '39041A50200077',
        plotSurfaceM2: 6258,
        building: {
          ...baseMockReport.property.building,
          constructionYear: 0,
          builtSurfaceM2: 0,
          plotSurfaceM2: 6258,
          primaryUse: 'Agrario / Rústico',
          unitsCount: 0,
        },
      },
      marketTrends: {
        censusSectionId: '3904101001',
        provinceName: 'Cantabria',
        autonomousCommunity: 'Cantabria',
        timeSeries: [
          { period: '2018', housingPriceIndex: 105.0, householdIncome: 24500 },
          { period: '2022', housingPriceIndex: 118.0, householdIncome: 27800 },
        ],
        summary: {
          fiveYearIncomeGrowthPct: 13.5,
          fiveYearPriceIndexGrowthPct: 12.4,
          gentrificationIndicator: 'stable',
        },
      },
      capex: undefined,
      energy: undefined,
    };

    // 1. Check building & header
    const { unmount: unmountBuilding } = render(<AuditDossier report={rusticParcelReport} activeTab="building" />);

    // Header subtitle shows ground land surface (6258 / 6.258 m² de terreno · Finca Rústica), NOT 0 m² built
    expect(screen.getByText(/6[.,]?258 m² de terreno · Finca Rústica/i)).toBeDefined();

    // Technical overview shows Superficie de Parcela and 6258 / 6.258 m² terreno
    expect(screen.getByText('Superficie de Parcela')).toBeDefined();
    expect(screen.getByText(/6[.,]?258 m² terreno/i)).toBeDefined();

    unmountBuilding();

    // 2. Check summary tab (Score Gauge & Land Classification strip)
    const { unmount: unmountSummary } = render(
      <AuditDossier
        report={{
          ...rusticParcelReport,
          score: {
            ...rusticParcelReport.score,
            overallScore: 50,
          },
          urbanPlanning: {
            landClassification: 'RUSTIC_PROTECTED',
            zoningCode: 'SNU-P',
            isProtectedLand: true,
            declaredRenovationsCount: 0,
            lastRenovationYear: null,
            isStressedHousingZone: false,
          },
        }}
        activeTab="summary"
      />
    );

    // Score gauge shows rustic appropriate badge and suppresses ITE/isolation warnings
    expect(screen.getByText('Moderado · Suelo No Urbanizable / Entorno Rural')).toBeDefined();
    expect(screen.queryByText(/Revisar Aislamiento o ITE/i)).toBeNull();

    // Land classification strip shows SNU-P regime, not "Suelo Urbano"
    expect(screen.getByText('Suelo No Urbanizable Protegido (SNU-P) · Régimen Rústico')).toBeDefined();
    expect(screen.queryByText('Régimen SUC Consolidado · INSPIRE Compliant')).toBeNull();

    unmountSummary();

    // 3. Check market tab (Fiscal Simulator & Trends)
    render(<AuditDossier report={rusticParcelReport} activeTab="market" />);

    // Fiscal Simulator shows rustic specific labels & ground surface
    expect(screen.getByText('Simulador Fiscal Rústico (ITP & IBI)')).toBeDefined();
    expect(screen.getByText('Superficie Terreno / Parcela')).toBeDefined();
    expect(screen.getByText(/6[.,]?258 m² suelo/i)).toBeDefined();
    expect(screen.getByText('Tipo IBI Rústico')).toBeDefined();
    expect(screen.getByText('IBI Rústico Estimado')).toBeDefined();

    // Trends card shows rural demographic stability and suppresses IPV toggle
    expect(screen.getByText('Evolución Histórica de Renta Municipal')).toBeDefined();
    expect(screen.getByText('Entorno Rural / Demografía Estable')).toBeDefined();
    expect(screen.getByText('Ámbito Territorial')).toBeDefined();
    expect(screen.queryByText('IPV Precios')).toBeNull();
  });
});
