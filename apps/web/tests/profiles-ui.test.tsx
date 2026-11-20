import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { type PropertyAuditReport } from '@openbarrio/core';
import { AuditDossier } from '../src/components/AuditDossier';
import { CertifiedPdfReport } from '../src/components/CertifiedPdfReport';
import { parseUrlState } from '../src/hooks/useUrlSync';
import { LanguageProvider } from '../src/i18n';
import { useWorkspaceStore } from '../src/store/workspace.store';

function createSampleAuditReport(): PropertyAuditReport {
  return {
    id: '33333333-3333-4333-8333-333333333333',
    generatedAt: '2026-11-20T00:00:00.000Z',
    property: {
      cadastralReference: '1234567VK4713D0001AZ',
      address: {
        street: 'C/ Princesa',
        number: '22',
        postalCode: '28008',
        municipality: 'Madrid',
        province: 'Madrid',
        municipalityCode: '28079',
        provinceCode: '28',
      },
      coordinates: { latitude: 40.4285, longitude: -3.7134, srs: 'EPSG:4326' },
      building: {
        constructionYear: 1998,
        builtSurfaceM2: 3200,
        primaryUse: 'Residencial Colectivo',
        unitsCount: 16,
        hasCommercialGroundFloor: true,
      },
      typology: 'RESIDENTIAL',
    },
    typology: 'RESIDENTIAL',
    neighborhood: {
      censusSectionCode: '2807901028',
      averageNetHouseholdIncomeEur: 28000,
      percentileInMunicipality: 45,
    },
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
    connectivity: {
      walkScore15Min: 95,
    },
    energy: {
      ratingEmissions: 'C',
      isEstimated: false,
      isExpired: false,
    },
    capex: {
      buildingAgeYears: 28,
      iteStatus: 'favorable_active',
      iteDeadlineYear: 2028,
      iteRequired: false,
      accessibilityRisk: 'low',
      hasElevator: true,
      elevatorRisk: false,
      estimatedCommunityExpenseRangeEurMonth: { min: 70, max: 110 },
      estimatedCapExPerM2Eur: { min: 30, max: 60 },
      reserveFundAdequacy: 'optimal',
      estimatedReserveFundDeficitPct: 0,
      renovationPriorities: [],
      thermalEnvelopeLossPct: 18,
      capexRiskScore: 84,
    },
    rentalBenchmark: {
      officialRangeLowerEurM2: 14,
      officialRangeUpperEurM2: 18,
      estimatedMonthlyRentLowerEur: 1100,
      estimatedMonthlyRentUpperEur: 1400,
      isStressedHousingZone: false,
    },
    score: {
      overallScore: 76,
      subscores: {
        building: 82,
        connectivity: 95,
        socioeconomic: 52,
        environmental: 90,
        urbanPlanning: 85,
      },
      socioeconomicScore: 52,
      buildingHealthScore: 82,
      acousticComfortScore: 88,
      climateSafetyScore: 100,
      keyHighlights: [],
      keyRisks: [],
      trafficLight: 'GREEN',
      pillarAvailability: {
        connectivity: true,
        building: true,
        socioeconomic: true,
        environmental: true,
        urbanPlanning: true,
      },
      coverage: {
        ok: 6,
        total: 6,
        level: 'high',
        pillarsWithData: 5,
        pillarsTotal: 5,
        missingCriticalLayers: [],
      },
    },
  };
}

describe('Decision Profiles UI & URL Sync', () => {
  beforeEach(() => {
    localStorage.setItem('openbarrio_lang', 'es');
    useWorkspaceStore.setState({ activeProfile: 'none' });
  });

  it('parses ?perfil= from URL cleanly', () => {
    window.history.replaceState({}, '', '/informe/1234567VK4713D0001AZ?perfil=investor');
    const parsed = parseUrlState();
    expect(parsed.profile).toBe('investor');

    window.history.replaceState({}, '', '/informe/1234567VK4713D0001AZ?perfil=invalid');
    expect(parseUrlState().profile).toBe('none');
  });

  it('always displays active profile chip and shows both base and profile scores when selected', () => {
    const report = createSampleAuditReport();
    render(
      <LanguageProvider>
        <AuditDossier report={report} />
      </LanguageProvider>
    );

    const chip = screen.getByTestId('active-profile-chip');
    expect(chip).toBeDefined();
    expect(chip.textContent).toContain('Ninguno');
    expect(screen.getByTestId('base-barrio-score-value').textContent).toBe('76');
    expect(screen.queryByTestId('profile-score-card')).toBeNull();

    fireEvent.click(screen.getByTestId('profile-btn-family'));
    expect(screen.getByTestId('active-profile-chip').textContent).toContain('Familia');
    expect(screen.getByTestId('base-barrio-score-value').textContent).toBe('76');
    expect(screen.getByTestId('profile-score-card')).toBeDefined();
    expect(screen.getByTestId('profile-score-value').textContent).not.toBe('76/100');
  });

  it('reorders market cards when renter vs investor profile is active', () => {
    const report = createSampleAuditReport();
    render(
      <LanguageProvider>
        <AuditDossier report={report} activeTab="market" activeProfile="renter" />
      </LanguageProvider>
    );

    const marketTab = screen.getByTestId('tab-market');
    const sections = Array.from(marketTab.querySelectorAll('[data-section]')).map((el) =>
      el.getAttribute('data-section')
    );
    expect(sections[0]).toBe('rental');
    expect(sections[1]).toBe('fiscal');
  });

  it('surfaces active profile chip in CertifiedPdfReport', () => {
    const report = createSampleAuditReport();
    render(
      <LanguageProvider>
        <CertifiedPdfReport report={report} activeProfile="senior" />
      </LanguageProvider>
    );

    const pdfChip = screen.getByTestId('pdf-active-profile-chip');
    expect(pdfChip).toBeDefined();
    expect(pdfChip.textContent).toContain('Mayor');
  });
});
