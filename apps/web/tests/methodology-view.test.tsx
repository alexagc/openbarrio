import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  METHODOLOGY_VERSION,
  SCORING_MODIFIERS,
  SCORING_WEIGHTS_BY_TYPOLOGY,
  type PropertyAuditReport,
} from '@openbarrio/core';
import { LanguageProvider } from '../src/i18n';
import { MethodologyView } from '../src/views/MethodologyView';
import { AuditDossier } from '../src/components/AuditDossier';
import { useWorkspaceStore } from '../src/store/workspace.store';
import {
  parseLocalizedRoute,
  getLocalizedPath,
  getHreflangAlternates,
} from '../src/utils/seo-routes';

const minimalReport: PropertyAuditReport = {
  id: '00000000-0000-4000-8000-000000000001',
  generatedAt: '2026-11-19T10:00:00.000Z',
  property: {
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
    coordinates: { latitude: 40.42028, longitude: -3.70379, srs: 'EPSG:4326' },
    building: {
      constructionYear: 1995,
      builtSurfaceM2: 110,
      primaryUse: 'Residencial',
      unitsCount: 16,
      hasCommercialGroundFloor: false,
    },
  },
  environment: {},
  score: {
    overallScore: 82,
    subscores: {
      building: 80,
      connectivity: 85,
      environmental: 80,
      socioeconomic: 82,
      urbanPlanning: 84,
    },
    socioeconomicScore: 82,
    buildingHealthScore: 80,
    acousticComfortScore: 80,
    climateSafetyScore: 100,
    keyHighlights: [],
    keyRisks: [],
    methodologyVersion: METHODOLOGY_VERSION,
  },
};

describe('MethodologyView (/metodologia)', () => {
  beforeEach(() => {
    window.localStorage.setItem('openbarrio_lang', 'es');
    useWorkspaceStore.setState({ viewMode: 'landing' });
  });

  it('renders live METHODOLOGY_VERSION, weights table, and modifiers from @openbarrio/core with accessible markup', () => {
    render(
      <LanguageProvider>
        <MethodologyView />
      </LanguageProvider>
    );

    expect(screen.getByTestId('methodology-version-badge').textContent).toContain(
      METHODOLOGY_VERSION
    );

    const weightsTable = screen.getByTestId('methodology-weights-table');
    expect(weightsTable.querySelectorAll('thead th[scope="col"]').length).toBe(6);
    expect(weightsTable.querySelectorAll('tbody th[scope="row"]').length).toBe(
      Object.keys(SCORING_WEIGHTS_BY_TYPOLOGY).length
    );
    expect(weightsTable.textContent).toContain('35%'); // INDUSTRIAL building weight
    expect(weightsTable.textContent).toContain('30%'); // RUSTIC env/urbanPlanning weight

    const modifiersTable = screen.getByTestId('methodology-modifiers-table');
    expect(modifiersTable.querySelectorAll('tbody th[scope="row"]').length).toBe(
      SCORING_MODIFIERS.length
    );

    const regions = screen.getAllByRole('region');
    expect(regions.length).toBeGreaterThanOrEqual(2);
    for (const r of regions) {
      expect(r.getAttribute('tabindex')).toBe('0');
    }
  });

  it('links directly from AuditDossier to the methodology view', () => {
    render(
      <LanguageProvider>
        <AuditDossier report={minimalReport} />
      </LanguageProvider>
    );

    const linkBtn = screen.getByTestId('dossier-methodology-link');
    expect(linkBtn.textContent).toContain(METHODOLOGY_VERSION);
    fireEvent.click(linkBtn);

    expect(useWorkspaceStore.getState().viewMode).toBe('methodology');
  });

  it('resolves all 5 localized slugs and hreflang alternates for methodology', () => {
    expect(parseLocalizedRoute('/metodologia')).toMatchObject({ viewMode: 'methodology', lang: 'es' });
    expect(parseLocalizedRoute('/methodology')).toMatchObject({ viewMode: 'methodology', lang: 'en' });
    expect(parseLocalizedRoute('/metodoloxia')).toMatchObject({ viewMode: 'methodology', lang: 'gl' });
    expect(parseLocalizedRoute('/ca/metodologia')).toMatchObject({ viewMode: 'methodology', lang: 'ca' });
    expect(parseLocalizedRoute('/eu/metodologia')).toMatchObject({ viewMode: 'methodology', lang: 'eu' });

    expect(getLocalizedPath('methodology', 'en')).toBe('/methodology');
    expect(getLocalizedPath('methodology', 'gl')).toBe('/metodoloxia');

    const alternates = getHreflangAlternates('methodology');
    expect(alternates.map((a) => a.lang)).toEqual(['es', 'en', 'ca', 'gl', 'eu', 'x-default']);
  });
});
