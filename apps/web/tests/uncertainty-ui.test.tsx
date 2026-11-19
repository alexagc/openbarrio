import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PropertyAuditReport, calculateBarrioScore } from '@openbarrio/core';
import { LanguageProvider } from '../src/i18n';
import { LayerStatusBadge } from '../src/components/common/LayerStatusBadge';
import { DataUnavailableState } from '../src/components/common/DataUnavailableState';
import { ScoreGauge } from '../src/components/ScoreGauge';
import { PillarCards } from '../src/components/PillarCard';
import { AuditDossier } from '../src/components/AuditDossier';

const sampleProperty = {
  cadastralReference: '9872023VH5797S0001WX',
  address: {
    street: 'Gran Vía',
    number: '28',
    postalCode: '28013',
    municipality: 'Madrid',
    province: 'Madrid',
    provinceCode: '28',
    municipalityCode: '079',
  },
  coordinates: { latitude: 40.42028, longitude: -3.70379, srs: 'EPSG:4326' as const },
  building: {
    constructionYear: 1924,
    builtSurfaceM2: 120,
    primaryUse: 'Residencial',
    unitsCount: 16,
    hasCommercialGroundFloor: true,
  },
};

function renderWithI18n(ui: React.ReactElement) {
  return render(<LanguageProvider>{ui}</LanguageProvider>);
}

describe('Uncertainty UI & Gray States (v1.4.0)', () => {
  it('renders LayerStatusBadge distinctly for ok, stale (<90d vs >=90d amber), unavailable, and out_of_coverage', () => {
    const { rerender } = renderWithI18n(
      <LayerStatusBadge info={{ status: 'ok', sourceName: 'MITECO SICA' }} showOk />
    );
    expect(screen.getByTestId('layer-status-badge').getAttribute('data-status')).toBe('ok');

    rerender(
      <LanguageProvider>
        <LayerStatusBadge
          info={{
            status: 'stale',
            sourceName: 'MITECO SICA',
            verifiedAt: '2026-10-10T10:00:00Z',
            staleDays: 40,
          }}
        />
      </LanguageProvider>
    );
    const stale40 = screen.getByTestId('layer-status-badge');
    expect(stale40.getAttribute('data-status')).toBe('stale');
    expect(stale40.getAttribute('data-amber')).toBe('false');
    expect(stale40.textContent).toContain('2026-10-10');

    rerender(
      <LanguageProvider>
        <LayerStatusBadge
          info={{
            status: 'stale',
            sourceName: 'MITECO SNCZI',
            verifiedAt: '2026-07-01T10:00:00Z',
            staleDays: 141,
          }}
        />
      </LanguageProvider>
    );
    const stale141 = screen.getByTestId('layer-status-badge');
    expect(stale141.getAttribute('data-status')).toBe('stale');
    expect(stale141.getAttribute('data-amber')).toBe('true');

    rerender(
      <LanguageProvider>
        <LayerStatusBadge
          info={{ status: 'unavailable', sourceName: 'INE ADRH', reason: 'timeout' }}
        />
      </LanguageProvider>
    );
    expect(screen.getByTestId('layer-status-badge').getAttribute('data-status')).toBe('unavailable');

    rerender(
      <LanguageProvider>
        <LayerStatusBadge
          info={{ status: 'out_of_coverage', sourceName: 'MITECO SICA', reason: 'no_coverage' }}
        />
      </LanguageProvider>
    );
    expect(screen.getByTestId('layer-status-badge').getAttribute('data-status')).toBe(
      'out_of_coverage'
    );
  });

  it('renders DataUnavailableState with distinct copy for out_of_coverage vs unavailable', () => {
    const { rerender } = renderWithI18n(
      <DataUnavailableState
        info={{ status: 'unavailable', sourceName: 'MITECO SICA', reason: 'upstream_error' }}
        fallbackSource="MITECO SICA"
      />
    );
    const unavail = screen.getByTestId('data-unavailable-state');
    expect(unavail.getAttribute('data-status')).toBe('unavailable');
    expect(unavail.textContent).toContain('MITECO SICA');

    rerender(
      <LanguageProvider>
        <DataUnavailableState
          info={{ status: 'out_of_coverage', sourceName: 'MITECO SNCZI', reason: 'no_coverage' }}
          fallbackSource="MITECO SNCZI"
        />
      </LanguageProvider>
    );
    const ooc = screen.getByTestId('data-unavailable-state');
    expect(ooc.getAttribute('data-status')).toBe('out_of_coverage');
    expect(ooc.textContent).toContain('MITECO SNCZI');
  });

  it('renders UNCERTAIN gray ScoreGauge and AuditDossier safely when neighborhood, noise, and floodRisk are absent', () => {
    const layers = {
      catastro: { status: 'ok' as const, sourceName: 'Sede Electrónica del Catastro (OVC)' },
      ine: { status: 'unavailable' as const, sourceName: 'INE ADRH', reason: 'timeout' as const },
      sica: {
        status: 'unavailable' as const,
        sourceName: 'MITECO SICA',
        reason: 'upstream_error' as const,
      },
      snczi: {
        status: 'out_of_coverage' as const,
        sourceName: 'MITECO SNCZI',
        reason: 'no_coverage' as const,
      },
    };

    const score = calculateBarrioScore({
      property: sampleProperty,
      neighborhood: undefined,
      environment: {},
      layers,
    });

    expect(score.trafficLight).toBe('UNCERTAIN');

    renderWithI18n(<ScoreGauge score={score} cityOrProvince="Madrid" layers={layers} />);
    const gauge = screen.getByTestId('score-gauge');
    expect(gauge.getAttribute('data-traffic-light')).toBe('UNCERTAIN');
    expect(screen.getByTestId('score-uncertainty-notice')).toBeDefined();
    expect(screen.getByTestId('score-coverage-badge').textContent).toContain('1/5');

    const report: PropertyAuditReport = {
      id: 'audit-uncertain-1',
      generatedAt: '2026-11-19T12:00:00Z',
      property: sampleProperty,
      typology: 'RESIDENTIAL',
      environment: {},
      score,
      layers,
      coverage: score.coverage,
    };

    renderWithI18n(<AuditDossier report={report} />);
    expect(screen.getByTestId('pillar-card-socioeconomic').textContent).toContain('INE ADRH');
    expect(screen.getByTestId('pillar-card-environmental').getAttribute('data-traffic-light')).toBe(
      'UNCERTAIN'
    );
    // Must not fabricate quiet dBA or safe flood labels when data is absent
    expect(screen.getByTestId('pillar-card-environmental').textContent).not.toContain('52 dBA');
    expect(screen.getByTestId('pillar-card-environmental').textContent).not.toContain('Riesgo Nulo');
  });

  it('renders PillarCards with optional connectivity/neighborhood without fabricating dummy amenities', () => {
    renderWithI18n(
      <PillarCards
        property={sampleProperty}
        environment={{}}
        layers={{
          connectivity: {
            status: 'out_of_coverage',
            sourceName: 'IGN / CNIG Equipamientos',
            reason: 'no_coverage',
          },
          ine: { status: 'unavailable', sourceName: 'INE ADRH', reason: 'upstream_error' },
        }}
      />
    );
    expect(screen.queryByText('Centro de Salud (CAP)')).toBeNull();
    expect(screen.queryByText('32 AQI · Buena')).toBeNull();
  });
});
