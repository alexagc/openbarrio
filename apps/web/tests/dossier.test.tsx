import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AuditDossier } from '../src/components/AuditDossier';
import { PropertyAuditReport } from '@openbarrio/core';

describe('AuditDossier Component (Stitch Civic Precision)', () => {
  const mockReport: PropertyAuditReport = {
    id: 'test-dossier-id',
    generatedAt: '2026-10-18T20:00:00.000Z',
    property: {
      cadastralReference: '9872023VH5797S0001WX',
      address: {
        street: 'Gran Vía',
        number: '28',
        postalCode: '28013',
        municipality: 'Madrid',
        province: 'Madrid',
      },
      coordinates: { latitude: 40.42028, longitude: -3.70379, srs: 'EPSG:4326' },
      building: {
        constructionYear: 1924,
        builtSurfaceM2: 31500,
        primaryUse: 'Residencial Colectivo',
        unitsCount: 48,
        hasCommercialGroundFloor: true,
      },
    },
    neighborhood: {
      censusTractCode: '2807901043',
      averageNetHouseholdIncomeEur: 45200,
      averageNetPersonIncomeEur: 22600,
      incomePercentile: 82,
      incomeQuintile: 5,
      municipality: 'Madrid',
      province: 'Madrid',
    },
    environment: {
      noise: {
        dayEveningNightDecibels: 64,
        source: 'ROAD_TRAFFIC',
      },
      floodRisk: {
        level: 'NONE',
        returnPeriodYears: null,
      },
    },
    score: {
      overallScore: 84,
      socioeconomicScore: 82,
      buildingHealthScore: 80,
      acousticComfortScore: 75,
      climateSafetyScore: 100,
      keyHighlights: ['ITE Favorable (2021)', 'Sin Cargas Registrales Ocultas'],
      keyRisks: ['Aislamiento acústico exigido 38 dBA'],
    },
    rentalBenchmark: {
      officialRangeLowerEurM2: 14.2,
      officialRangeUpperEurM2: 18.5,
      estimatedMonthlyRentLowerEur: 1200,
      estimatedMonthlyRentUpperEur: 1650,
      isStressedHousingZone: false,
    },
  };

  it('renders official property header and cadastral reference with copy action', () => {
    render(<AuditDossier report={mockReport} />);

    expect(screen.getByText(/Gran Vía 28, 28013 Madrid/i)).toBeTruthy();
    expect(screen.getAllByText(/9872023VH5797S0001WX/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/31\.500 m² construidos/i)).toBeTruthy();
    expect(screen.getByText(/Descargar GML/i)).toBeTruthy();
    expect(screen.getByText(/Exportar Dossier PDF/i)).toBeTruthy();
  });

  it('renders Barrio Score circular gauge and all 4 sub-scores', () => {
    render(<AuditDossier report={mockReport} />);

    expect(screen.getByText('84')).toBeTruthy();
    expect(screen.getByText(/Índice Integral OpenBarrio/i)).toBeTruthy();
    expect(screen.getByText(/82\/100/i)).toBeTruthy();
    expect(screen.getByText(/80\/100/i)).toBeTruthy();
    expect(screen.getByText(/75\/100/i)).toBeTruthy();
    expect(screen.getByText(/100\/100/i)).toBeTruthy();
  });

  it('renders Ficha Catastral, INE Demografía, MITECO and MIVAU sections', () => {
    render(<AuditDossier report={mockReport} />);

    expect(screen.getByText(/Ficha Catastral Oficial/i)).toBeTruthy();
    expect(screen.getByText('1924')).toBeTruthy();
    expect(screen.getByText(/Demografía & Renta de Hogar/i)).toBeTruthy();
    expect(screen.getByText(/45\.200/i)).toBeTruthy();
    expect(screen.getByText(/Confort Acústico & Tráfico/i)).toBeTruthy();
    expect(screen.getByText(/64 dBA Lden/i)).toBeTruthy();
    expect(screen.getByText(/Riesgo Hidrológico & Climático/i)).toBeTruthy();
    expect(screen.getByText(/Índice Alquiler MIVAU & Yield/i)).toBeTruthy();
    expect(screen.getByText(/14,20 €\/m² - 18,50 €\/m²/i)).toBeTruthy();
  });

  it('renders Due Diligence clearance and risk chips with municipal sign-off', () => {
    render(<AuditDossier report={mockReport} />);

    expect(screen.getByText(/Dictámenes de Due Diligence & Afecciones Legales/i)).toBeTruthy();
    expect(screen.getByText(/ITE Favorable \(2021\)/i)).toBeTruthy();
    expect(screen.getByText(/Aislamiento acústico exigido 38 dBA/i)).toBeTruthy();
    expect(screen.getByText(/Expediente: MAD-AUD-2026-9872023V/i)).toBeTruthy();
  });
});
