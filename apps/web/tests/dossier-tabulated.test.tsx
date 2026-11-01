import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AuditDossier } from '../src/components/AuditDossier';
import { CartographicLegendsHud } from '../src/components/CartographicLegendsHud';
import { parseUrlState } from '../src/hooks/useUrlSync';
import { PropertyAuditReport } from '@openbarrio/core';

const mockReport: PropertyAuditReport = {
  id: 'test-dossier-15b',
  generatedAt: '2026-11-01T20:00:00.000Z',
  property: {
    cadastralReference: '1234567VK4713D0001AZ',
    address: {
      street: 'C/ Princesa',
      number: '22',
      postalCode: '28008',
      municipality: 'Madrid',
      province: 'Madrid',
    },
    coordinates: { latitude: 40.4285, longitude: -3.7134, srs: 'EPSG:4326' },
    building: {
      constructionYear: 1954,
      builtSurfaceM2: 4200,
      primaryUse: 'Residencial Colectivo',
      unitsCount: 16,
      hasCommercialGroundFloor: true,
    },
  },
  neighborhood: {
    censusSectionCode: '2807901028',
    averageNetHouseholdIncomeEur: 49500,
    averageNetPersonIncomeEur: 24750,
    percentileInMunicipality: 89,
    rankingInCity: { rank: 11, totalSections: 150 },
    demographics: { medianAge: 44, singlePersonHouseholdPercentage: 38 },
  },
  environment: {
    noise: {
      dayEveningNightDecibels: 59,
      category: 'MODERATE',
      predominantSource: 'ROAD_TRAFFIC',
    },
    floodRisk: {
      level: 'NONE',
      returnPeriodYears: null,
      isInPreferentialFlowZone: false,
    },
    airQuality: {
      aqiIndex: 22,
      category: 'GOOD',
      stationName: 'Madrid Plaza de España',
      no2MicrogramsM3: 18,
      pm25MicrogramsM3: 7,
      pm10MicrogramsM3: 12,
    },
  },
  connectivity: {
    walkScore15Min: 96,
    facilitiesWithin15MinCount: 38,
    nearestHealthcare: {
      id: 'cs-arguelles',
      type: 'healthcare',
      subtype: 'primary_care',
      name: 'CS Argüelles',
      distanceMeters: 280,
      walkTimeMinutes: 3.5,
    },
    nearestEducation: {
      id: 'col-princesa',
      type: 'education',
      subtype: 'school',
      name: 'Colegio Público Portugal',
      distanceMeters: 390,
      walkTimeMinutes: 4.8,
    },
    nearestTransit: {
      id: 'metro-ventura',
      type: 'transit',
      subtype: 'metro',
      name: 'Metro Ventura Rodríguez',
      distanceMeters: 110,
      walkTimeMinutes: 1.4,
    },
    nearestPark: {
      id: 'park-oeste',
      type: 'park',
      subtype: 'urban_park',
      name: 'Parque del Oeste',
      distanceMeters: 550,
      walkTimeMinutes: 6.9,
    },
  },
  urbanPlanning: {
    landClassification: 'URBAN_CONSOLIDATED',
    zoningCode: 'NZ-3 (Ensanche)',
    isProtectedLand: false,
    declaredRenovationsCount: 1,
    lastRenovationYear: 2016,
    isStressedHousingZone: true,
  },
  score: {
    overallScore: 88,
    subscores: {
      building: 82,
      connectivity: 96,
      environmental: 80,
      socioeconomic: 89,
      urbanPlanning: 92,
    },
    socioeconomicScore: 89,
    buildingHealthScore: 82,
    acousticComfortScore: 78,
    climateSafetyScore: 100,
    keyHighlights: ['ITE Favorable (2022)', 'Edificio Consolidado'],
    keyRisks: ['Aislamiento térmico medio'],
  },
  rentalBenchmark: {
    officialRangeLowerEurM2: 15.5,
    officialRangeUpperEurM2: 19.8,
    estimatedMonthlyRentLowerEur: 1350,
    estimatedMonthlyRentUpperEur: 1750,
    isStressedHousingZone: true,
  },
};

describe('Dossier Tabulated Layout & HUD (Fase 15B)', () => {
  it('renders all 4 tabs and switches active tab on click', () => {
    const handleTabChange = vi.fn();
    render(<AuditDossier report={mockReport} activeTab="summary" onTabChange={handleTabChange} />);

    // Verify all 4 tab buttons exist
    const summaryTab = screen.getByRole('tab', { name: /Resumen & Score/i });
    const buildingTab = screen.getByRole('tab', { name: /Edificio & Sostenibilidad/i });
    const environmentTab = screen.getByRole('tab', { name: /Entorno & Conectividad/i });
    const marketTab = screen.getByRole('tab', { name: /Mercado & Finanzas/i });

    expect(summaryTab).toBeTruthy();
    expect(buildingTab).toBeTruthy();
    expect(environmentTab).toBeTruthy();
    expect(marketTab).toBeTruthy();

    // Click building tab
    fireEvent.click(buildingTab);
    expect(handleTabChange).toHaveBeenCalledWith('building');

    // Click environment tab
    fireEvent.click(environmentTab);
    expect(handleTabChange).toHaveBeenCalledWith('environment');

    // Click market tab
    fireEvent.click(marketTab);
    expect(handleTabChange).toHaveBeenCalledWith('market');
  });

  it('parses ?tab=building, ?tab=environment, ?tab=market from URL', () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        pathname: '/map',
        search: '?refcat=1234567VK4713D0001AZ&tab=building',
        href: 'http://localhost/map?refcat=1234567VK4713D0001AZ&tab=building',
      },
    });

    const parsedBuilding = parseUrlState();
    expect(parsedBuilding.viewMode).toBe('map');
    expect(parsedBuilding.dossierTab).toBe('building');
    expect(parsedBuilding.refcat).toBe('1234567VK4713D0001AZ');

    window.location.search = '?tab=environment';
    const parsedEnv = parseUrlState();
    expect(parsedEnv.dossierTab).toBe('environment');

    window.location.search = '?tab=market';
    const parsedMarket = parseUrlState();
    expect(parsedMarket.dossierTab).toBe('market');
  });

  it('auto-minimizes CartographicLegendsHud into badge when isDragging is true', () => {
    const activeLayers = {
      cadastre: true,
      noise: true,
      flood: false,
      income: true,
      isochrones: false,
    };

    const { rerender } = render(<CartographicLegendsHud activeLayers={activeLayers} isDragging={false} />);
    expect(screen.getByText(/Leyenda Cartográfica/i)).toBeTruthy();
    expect(screen.queryByTestId('hud-drag-badge')).toBeNull();

    // When map is dragged
    rerender(<CartographicLegendsHud activeLayers={activeLayers} isDragging={true} />);
    expect(screen.getByTestId('hud-drag-badge')).toBeTruthy();
    expect(screen.getByText(/HUD: Cartografía Activa/i)).toBeTruthy();
  });
});
