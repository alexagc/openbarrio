import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import {
  ALL_LAYER_KEYS,
  calculateBarrioScore,
  type BroadbandCoverage,
  type PropertyAuditReport,
  type TransitAccessibility,
} from '@openbarrio/core';
import { LanguageProvider } from '../src/i18n';
import type { SupportedLanguage } from '../src/i18n/types';
import { PedestrianIsochronesCard } from '../src/components/dossier/PedestrianIsochronesCard';
import { BroadbandConnectivityCard } from '../src/components/dossier/BroadbandConnectivityCard';
import { AuditDossier } from '../src/components/AuditDossier';
import { SourcesStatusView } from '../src/views/SourcesStatusView';
import { apiClient } from '../src/services/api.client';

const sampleTransitFull: TransitAccessibility = {
  stopsWithin5Min: 3,
  stopsWithin10Min: 6,
  stopsWithin15Min: 11,
  nearestStops: [
    {
      stopId: 'crtm-madrid:SOL',
      feedId: 'crtm-madrid',
      operatorName: 'CRTM Madrid',
      name: 'Sol (L1, L2, L3 · C3, C4)',
      mode: 'metro',
      distanceMeters: 220,
      walkTimeMinutes: 3.7,
      routesCount: 5,
      peakHeadwayMin: 3.0,
      offPeakHeadwayMin: 5.0,
      latitude: 40.4169,
      longitude: -3.7035,
      licenseId: 'MITMS-NAP-RISP',
    },
  ],
  peakHeadwayMin: 3.0,
  offPeakHeadwayMin: 5.0,
  travelTimesToHubs: [
    {
      hubName: 'Atocha Renfe',
      totalMinutes: 10,
      walkMinutes: 4,
      waitMinutes: 2,
      inVehicleMinutes: 4,
      mode: 'rail',
      originStopName: 'Sol',
      lineName: 'C3 / C4',
    },
  ],
  walkSegmentMethod: 'parametric',
  walkSpeedKmH: 4.5,
  tortuosityFactor: 1.25,
  coveragePct: 100,
  coveredOperators: ['Metro de Madrid', 'EMT Madrid', 'Renfe Cercanías'],
  missingOperators: [],
  sourceDate: '2026-11-01',
};

const sampleBroadbandOk: BroadbandCoverage = {
  municipalityCode: '28079',
  territoryCode: '28079',
  entityName: 'Madrid',
  granularity: 'municipality',
  ftthPct: 99.1,
  fixedMaxMbps: 10000,
  mobile5gPct: 98.4,
  sourceYear: 2025,
  sourceDate: '2026-11-01',
  sourceDataset: 'CNMCData / SETELECO Municipal 2025',
  disclaimer: 'Municipal aggregate.',
  informativeOnly: true,
};

const sampleProperty = {
  cadastralReference: '9872023VH5797S0001WX',
  address: {
    street: 'Calle Mayor',
    number: '14',
    postalCode: '28013',
    municipality: 'Madrid',
    province: 'Madrid',
    provinceCode: '28',
    municipalityCode: '28079',
  },
  coordinates: { latitude: 40.4169, longitude: -3.7035, srs: 'EPSG:4326' as const },
  building: {
    constructionYear: 1995,
    builtSurfaceM2: 110,
    primaryUse: 'Residencial',
    unitsCount: 10,
    hasCommercialGroundFloor: false,
  },
};

function renderWithLang(ui: React.ReactElement, lang: SupportedLanguage = 'es') {
  return render(<LanguageProvider initialLanguage={lang}>{ui}</LanguageProvider>);
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Transit Isochrones & Broadband Coverage UI (v1.5.0 Block 3)', () => {
  it('supports Walk <-> GTFS Transit tab switching via click and keyboard arrows', () => {
    renderWithLang(
      <PedestrianIsochronesCard
        connectivity={{ walkScore15Min: 91 }}
        transit={sampleTransitFull}
        transitLayer={{
          status: 'ok',
          sourceName: 'MITMS NAP GTFS Transporte',
          coveragePct: 100,
        }}
      />,
      'en'
    );

    const walkTab = screen.getByTestId('connectivity-tab-walk');
    const transitTab = screen.getByTestId('connectivity-tab-transit');
    const walkPanel = screen.getByTestId('connectivity-panel-walk');
    const transitPanel = screen.getByTestId('connectivity-panel-transit');

    expect(walkTab.getAttribute('aria-selected')).toBe('true');
    expect(transitTab.getAttribute('aria-selected')).toBe('false');
    expect(walkPanel.hasAttribute('hidden')).toBe(false);
    expect(transitPanel.hasAttribute('hidden')).toBe(true);

    // Click GTFS Transit tab
    fireEvent.click(transitTab);
    expect(transitTab.getAttribute('aria-selected')).toBe('true');
    expect(transitPanel.hasAttribute('hidden')).toBe(false);
    expect(walkPanel.hasAttribute('hidden')).toBe(true);
    expect(screen.getByTestId('transit-resolution-badge').textContent).toContain('Parametric walk leg');
    expect(transitPanel.textContent).toContain('Sol (L1, L2, L3 · C3, C4)');
    expect(transitPanel.textContent).toContain('Atocha Renfe');

    // Keyboard ArrowLeft returns focus & selection to Walk tab
    fireEvent.keyDown(transitTab, { key: 'ArrowLeft' });
    expect(walkTab.getAttribute('aria-selected')).toBe('true');
    expect(walkPanel.hasAttribute('hidden')).toBe(false);

    // Keyboard ArrowRight switches back to Transit tab
    fireEvent.keyDown(walkTab, { key: 'ArrowRight' });
    expect(transitTab.getAttribute('aria-selected')).toBe('true');
  });

  it('renders partial out_of_coverage percentage and DataUnavailableState on zero coverage in GTFS Transit tab', () => {
    const partialTransit: TransitAccessibility = {
      ...sampleTransitFull,
      coveragePct: 50,
      coveredOperators: ['Tranvía de Zaragoza'],
      missingOperators: ['Avanza Bus Urbano', 'Renfe Cercanías Zaragoza'],
    };

    const { rerender } = renderWithLang(
      <PedestrianIsochronesCard
        connectivity={{ walkScore15Min: 78 }}
        transit={partialTransit}
        transitLayer={{
          status: 'out_of_coverage',
          sourceName: 'MITMS NAP GTFS Transporte',
          reason: 'no_coverage',
          coveragePct: 50,
        }}
      />,
      'en'
    );

    fireEvent.click(screen.getByTestId('connectivity-tab-transit'));
    const partialBanner = screen.getByTestId('transit-partial-coverage-banner');
    expect(partialBanner.textContent).toContain('50%');
    expect(partialBanner.textContent).toContain('Tranvía de Zaragoza');
    expect(partialBanner.textContent).toContain('Avanza Bus Urbano');

    // Zero coverage -> renders DataUnavailableState without fabricated transit times
    rerender(
      <LanguageProvider initialLanguage="en">
        <PedestrianIsochronesCard
          connectivity={{ walkScore15Min: 60 }}
          transitLayer={{
            status: 'out_of_coverage',
            sourceName: 'MITMS NAP GTFS Transporte',
            reason: 'no_coverage',
            coveragePct: 0,
          }}
        />
      </LanguageProvider>
    );
    expect(screen.getByTestId('connectivity-panel-transit').textContent).toContain('0%');
    expect(screen.queryByText('Atocha Renfe')).toBeNull();
  });

  it('renders BroadbandConnectivityCard across ok municipal, stale ESP 2020, out_of_coverage, and unavailable states', () => {
    const { rerender } = renderWithLang(
      <BroadbandConnectivityCard
        broadband={sampleBroadbandOk}
        broadbandLayer={{
          status: 'ok',
          sourceName: 'SETELECO / CNMC Banda Ancha',
          granularity: 'municipality',
          sourceDate: '2026-11-01',
        }}
      />,
      'en'
    );

    expect(screen.getByTestId('broadband-ftth-pct').textContent).toBe('99.1%');
    expect(screen.getByTestId('broadband-5g-pct').textContent).toBe('98.4%');
    expect(screen.getByTestId('broadband-granularity-badge').textContent).toContain('Municipal aggregate');
    expect(screen.getByTestId('broadband-granularity-disclaimer').textContent).toContain('2025');

    // 2020 SETELECO ESP stale state with missing optional fields
    rerender(
      <LanguageProvider initialLanguage="en">
        <BroadbandConnectivityCard
          broadband={{
            municipalityCode: '44216',
            territoryCode: '44216000100',
            entityName: 'Teruel (ESP 2020)',
            granularity: 'population_entity',
            ftthPct: 78.5,
            fixedMaxMbps: null,
            mobile5gPct: null,
            sourceYear: 2020,
            sourceDate: '2020-12-31',
            sourceDataset: 'SETELECO ESP Serie Histórica 2020',
            disclaimer: 'ESP historical series.',
            informativeOnly: true,
          }}
          broadbandLayer={{
            status: 'stale',
            sourceName: 'SETELECO / CNMC Banda Ancha',
            staleDays: 2150,
            granularity: 'population_entity',
          }}
        />
      </LanguageProvider>
    );
    expect(screen.getByTestId('broadband-granularity-badge').textContent).toContain('ESP');
    expect(screen.getByTestId('broadband-5g-pct').textContent).toBe('Not reported');
    expect(screen.getByTestId('broadband-granularity-disclaimer').textContent).toContain('2020');

    // out_of_coverage -> shows DataUnavailableState cleanly
    rerender(
      <LanguageProvider initialLanguage="en">
        <BroadbandConnectivityCard
          broadbandLayer={{
            status: 'out_of_coverage',
            sourceName: 'SETELECO / CNMC Banda Ancha',
            reason: 'no_coverage',
          }}
        />
      </LanguageProvider>
    );
    expect(screen.getByTestId('broadband-connectivity-card').textContent).toContain('SETELECO / CNMC Banda Ancha');
    expect(screen.queryByTestId('broadband-ftth-pct')).toBeNull();
  });

  it('renders /estado-fuentes transit & broadband transparency notes across all 5 languages', async () => {
    const langs: SupportedLanguage[] = ['es', 'en', 'ca', 'gl', 'eu'];
    vi.spyOn(apiClient, 'getSourcesStatus').mockImplementation(async () => ({
      generatedAt: '2026-11-19T12:00:00.000Z',
      overallStatus: 'operational',
      sources: ALL_LAYER_KEYS.map((key) => ({
        key,
        sourceName:
          key === 'broadband'
            ? 'SETELECO / CNMC Banda Ancha'
            : key === 'transit'
              ? 'MITMS NAP GTFS Transporte'
              : `Source ${key}`,
        status: 'operational',
        circuitState: 'closed',
        recentFailures: 0,
        lastVerifiedAt: '2026-11-19T12:00:00.000Z',
        sourceDate: '2026-11-01',
      })),
    }));

    for (const lang of langs) {
      const { unmount } = renderWithLang(<SourcesStatusView />, lang);
      await waitFor(() => {
        expect(screen.getByText('SETELECO / CNMC Banda Ancha')).toBeDefined();
      });
      expect(document.body.textContent).toContain('GTFS');
      expect(document.body.textContent).toContain('2190');
      unmount();
    }
  });

  it('surfaces BroadbandConnectivityCard and broadband_verify_portal checklist item inside AuditDossier', () => {
    const score = calculateBarrioScore({
      property: sampleProperty,
      neighborhood: {
        censusSectionCode: '2807901001',
        municipalityName: 'Madrid',
        averageNetHouseholdIncomeEur: 38000,
        percentileInMunicipality: 78,
      },
      environment: {
        noise: { dayEveningNightDecibels: 58, predominantSource: 'ROAD_TRAFFIC' },
        floodRisk: { level: 'NONE', returnPeriodYears: null, isInPreferentialFlowZone: false },
      },
      connectivity: { walkScore15Min: 91 },
      urbanPlanning: {
        landClassification: 'URBAN_CONSOLIDATED',
        isProtectedLand: false,
        isStressedHousingZone: false,
      },
    });

    const report: PropertyAuditReport = {
      id: 'audit-bb-transit-1',
      generatedAt: '2026-11-19T12:00:00Z',
      property: sampleProperty,
      typology: 'RESIDENTIAL',
      environment: {
        noise: { dayEveningNightDecibels: 58, predominantSource: 'ROAD_TRAFFIC' },
        floodRisk: { level: 'NONE', returnPeriodYears: null, isInPreferentialFlowZone: false },
      },
      connectivity: { walkScore15Min: 91 },
      transit: sampleTransitFull,
      broadband: sampleBroadbandOk,
      score,
      layers: {
        catastro: { status: 'ok', sourceName: 'Catastro OVC' },
        ine: { status: 'ok', sourceName: 'INE ADRH' },
        sica: { status: 'ok', sourceName: 'MITECO SICA' },
        snczi: { status: 'ok', sourceName: 'MITECO SNCZI' },
        connectivity: { status: 'ok', sourceName: 'CNIG' },
        urbanPlanning: { status: 'ok', sourceName: 'MIVAU SIU' },
        transit: { status: 'ok', sourceName: 'MITMS NAP GTFS Transporte', coveragePct: 100 },
        broadband: {
          status: 'ok',
          sourceName: 'SETELECO / CNMC Banda Ancha',
          granularity: 'municipality',
          sourceDate: '2026-11-01',
        },
      },
    };

    renderWithLang(<AuditDossier report={report} />, 'en');

    // Tab 3 Environment contains BroadbandConnectivityCard
    const envTab = screen.getByTestId('tab-environment');
    expect(envTab.textContent).toContain('99.1%');

    // Tab 5 Checklist includes deterministic broadband_verify_portal alert
    fireEvent.click(screen.getByTestId('tab-btn-checklist'));
    const checklistTab = screen.getByTestId('tab-checklist');
    expect(checklistTab.textContent).toContain('FTTH');
    expect(checklistTab.textContent).toContain('CTO');
  });
});
