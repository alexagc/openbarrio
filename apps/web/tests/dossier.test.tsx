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
      censusSectionCode: '2807901043',
      averageNetHouseholdIncomeEur: 45200,
      averageNetPersonIncomeEur: 22600,
      percentileInMunicipality: 82,
      rankingInCity: { rank: 14, totalSections: 150 },
      demographics: { medianAge: 46, singlePersonHouseholdPercentage: 42 },
    },
    environment: {
      noise: {
        dayEveningNightDecibels: 64,
        category: 'MODERATE',
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
        stationName: 'Madrid Plaza del Carmen',
        no2MicrogramsM3: 20,
        pm25MicrogramsM3: 8,
        pm10MicrogramsM3: 14,
      },
    },
    connectivity: {
      walkScore15Min: 98,
      facilitiesWithin15MinCount: 42,
      nearestHealthcare: {
        id: 'cs-palma',
        type: 'healthcare',
        subtype: 'primary_care',
        name: 'CS Palma Norte',
        distanceMeters: 320,
        walkTimeMinutes: 4.2,
      },
      nearestEducation: {
        id: 'ies-isabel',
        type: 'education',
        subtype: 'school',
        name: 'IES Isabel la Católica',
        distanceMeters: 450,
        walkTimeMinutes: 5.8,
      },
      nearestTransit: {
        id: 'metro-granvia',
        type: 'transit',
        subtype: 'metro',
        name: 'Metro Gran Vía (L1, L5)',
        distanceMeters: 80,
        walkTimeMinutes: 1.1,
      },
      nearestPark: {
        id: 'park-sabatini',
        type: 'park',
        subtype: 'urban_park',
        name: 'Jardines de Sabatini',
        distanceMeters: 750,
        walkTimeMinutes: 9.8,
      },
    },
    urbanPlanning: {
      landClassification: 'URBAN_CONSOLIDATED',
      zoningCode: 'NZ-1 (Casco Central)',
      isProtectedLand: false,
      declaredRenovationsCount: 2,
      lastRenovationYear: 2018,
      isStressedHousingZone: false,
    },
    score: {
      overallScore: 84,
      subscores: {
        building: 80,
        connectivity: 98,
        environmental: 85,
        socioeconomic: 82,
        urbanPlanning: 92,
      },
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
    expect(screen.getByText(/14[,.]20 €\/m² - 18[,.]50 €\/m²/i)).toBeTruthy();
  });

  it('renders Due Diligence clearance and risk chips with municipal sign-off', () => {
    render(<AuditDossier report={mockReport} />);

    expect(screen.getByText(/Dictámenes de Due Diligence & Afecciones Legales/i)).toBeTruthy();
    expect(screen.getByText(/ITE Favorable \(2021\)/i)).toBeTruthy();
    expect(screen.getByText(/Aislamiento acústico exigido 38 dBA/i)).toBeTruthy();
    expect(screen.getByText(/Expediente: MAD-AUD-2026-9872023V/i)).toBeTruthy();
  });

  it('renders 5-axis SVG Radar Chart within Hero Bento cell', () => {
    render(<AuditDossier report={mockReport} />);

    const radarSvg = screen.getByRole('img', { name: /5-axis Barrio Due Diligence Radar Chart/i });
    expect(radarSvg).toBeTruthy();
    expect(screen.getByText(/Pentágono de Balance Territorial/i)).toBeTruthy();
  });

  it('renders all 5 Dedicated Bento Pillar cards including Civic Connectivity and Urban Planning', () => {
    render(<AuditDossier report={mockReport} />);

    // Pillar 1: Civic Connectivity (15-min city)
    expect(screen.getByText(/Conectividad Cívica & 15-Min/i)).toBeTruthy();
    expect(screen.getByText(/98\/100/i)).toBeTruthy();
    expect(screen.getByText(/CS Palma Norte/i)).toBeTruthy();
    expect(screen.getByText(/IES Isabel la Católica/i)).toBeTruthy();
    expect(screen.getByText(/Metro Gran Vía \(L1, L5\)/i)).toBeTruthy();
    expect(screen.getByText(/Jardines de Sabatini/i)).toBeTruthy();

    // Pillar 2: Building Health
    expect(screen.getByText(/CTE \(Código Técnico RD 314\/2006\)|Pre-normativa/i)).toBeTruthy();
    expect(screen.getByText(/2 registradas \(última en 2018\)/i)).toBeTruthy();

    // Pillar 3: Socioeconomic Profile
    expect(screen.getByText(/Percentil 82º Madrid/i)).toBeTruthy();

    // Pillar 4: Environmental Comfort (including Air Quality)
    expect(screen.getByText(/Calidad del Aire \(AQI\)/i)).toBeTruthy();
    expect(screen.getByText(/25 AQI · Buena/i)).toBeTruthy();

    // Pillar 5: Urban Planning & Legal
    expect(screen.getByText(/Planeamiento Urbanístico & Régimen Legal/i)).toBeTruthy();
    expect(screen.getByText(/Suelo Urbano Consolidado \(SUC\)/i)).toBeTruthy();
    expect(screen.getByText(/NZ-1 \(Casco Central\)/i)).toBeTruthy();
  });
});
