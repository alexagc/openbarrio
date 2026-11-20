import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { generateVisitChecklist, type PropertyAuditReport } from '@openbarrio/core';
import { VisitChecklistPanel } from '../src/components/dossier/VisitChecklistPanel';
import { formatChecklistExport } from '../src/utils/checklist-export';
import { LanguageProvider, es, en } from '../src/i18n';

function createReportWithAlerts(): PropertyAuditReport {
  return {
    id: '22222222-2222-4222-8222-222222222222',
    generatedAt: '2026-11-20T00:00:00.000Z',
    property: {
      cadastralReference: '9876543VK1234S0001XY',
      address: {
        street: 'Calle Alcalá',
        number: '50',
        postalCode: '28014',
        municipality: 'Madrid',
        province: 'Madrid',
        municipalityCode: '28079',
        provinceCode: '28',
      },
      coordinates: { latitude: 40.418, longitude: -3.695, srs: 'EPSG:4326' },
      building: {
        constructionYear: 1955,
        builtSurfaceM2: 1800,
        unitsCount: 18,
        primaryUse: 'Residencial',
        hasCommercialGroundFloor: false,
      },
      typology: 'RESIDENTIAL',
    },
    typology: 'RESIDENTIAL',
    environment: {
      noise: {
        dayEveningNightDecibels: 72,
        category: 'NOISY',
        predominantSource: 'ROAD_TRAFFIC',
      },
      floodRisk: {
        level: 'NONE',
        returnPeriodYears: null,
        isInPreferentialFlowZone: false,
      },
    },
    energy: {
      ratingEmissions: 'E',
      ratingConsumption: 'E',
      scope: 'building',
      isExpired: true,
      validUntil: '2024-01-15',
      isEstimated: false,
    },
    score: {
      overallScore: 68,
      subscores: {
        building: 62,
        connectivity: 88,
        environmental: 60,
        socioeconomic: 75,
        urbanPlanning: 80,
      },
      socioeconomicScore: 75,
      buildingHealthScore: 62,
      acousticComfortScore: 50,
      climateSafetyScore: 100,
      keyHighlights: [],
      keyRisks: [],
      trafficLight: 'AMBER',
    },
    layers: {
      catastro: { status: 'ok', sourceName: 'Catastro OVC' },
      sica: { status: 'ok', sourceName: 'MITECO SICA' },
      snczi: { status: 'unavailable', sourceName: 'MITECO SNCZI', reason: 'timeout' },
      ite: {
        status: 'stale',
        sourceName: 'ITE Municipal',
        verifiedAt: '2026-06-01T00:00:00.000Z',
        staleDays: 172,
      },
    },
  };
}

describe('VisitChecklistPanel & Export', () => {
  beforeEach(() => {
    localStorage.setItem('openbarrio_lang', 'es');
  });

  it('renders alert items and unverified layer items with interactive checkboxes', () => {
    const report = createReportWithAlerts();
    render(
      <LanguageProvider>
        <VisitChecklistPanel report={report} />
      </LanguageProvider>
    );

    expect(screen.getByTestId('visit-checklist-panel')).toBeDefined();
    expect(screen.getByTestId('checklist-item-age_old_building')).toBeDefined();
    expect(screen.getByTestId('checklist-item-noise_high')).toBeDefined();
    expect(screen.getByTestId('checklist-item-cee_expired')).toBeDefined();
    expect(screen.getByTestId('checklist-item-unverified_snczi')).toBeDefined();
    expect(screen.getByTestId('checklist-item-unverified_ite')).toBeDefined();

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBeGreaterThanOrEqual(5);
    expect(checkboxes[0].getAttribute('aria-checked')).toBe('false');
    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0].getAttribute('aria-checked')).toBe('true');
  });

  it('triggers window.print() when print A4 button is clicked', () => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {});
    const report = createReportWithAlerts();

    render(
      <LanguageProvider>
        <VisitChecklistPanel report={report} />
      </LanguageProvider>
    );

    fireEvent.click(screen.getByTestId('checklist-print-btn'));
    expect(printSpy).toHaveBeenCalledTimes(1);
    printSpy.mockRestore();
  });

  it('formats deterministic Markdown and TXT exports with checkboxes and disclaimer', () => {
    const report = createReportWithAlerts();
    const checklist = generateVisitChecklist(report, {
      now: new Date('2026-11-20T00:00:00.000Z'),
    });

    const translateEn = (key: string, params?: Record<string, string | number>): string => {
      const parts = key.split('.');
      let cur: unknown = en;
      for (const p of parts) {
        cur = (cur as Record<string, unknown>)?.[p];
      }
      if (typeof cur !== 'string') return key;
      if (!params) return cur;
      return Object.entries(params).reduce(
        (acc, [k, v]) => acc.replace(new RegExp(`{{\\s*${k}\\s*}}`, 'g'), String(v)),
        cur
      );
    };

    const md = formatChecklistExport(checklist, 'md', translateEn);
    const txt = formatChecklistExport(checklist, 'txt', translateEn);

    expect(md).toContain('# On-site visit checklist');
    expect(md).toContain('- [ ] **[Critical]**');
    expect(md).toContain('9876543VK1234S0001XY');
    expect(md).toContain(en.checklist.legalDisclaimer);

    expect(txt).toContain('On-site visit checklist');
    expect(txt).toContain('[ ] [Critical]');
    expect(txt).toContain(en.checklist.legalDisclaimer);

    expect(es.checklist.title).not.toBe(en.checklist.title);
  });

  it('matches printable checklist DOM snapshot', () => {
    const report = createReportWithAlerts();
    const { container } = render(
      <LanguageProvider>
        <VisitChecklistPanel report={report} />
      </LanguageProvider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
