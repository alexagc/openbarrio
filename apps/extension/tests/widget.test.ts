import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { JSDOM } from 'jsdom';
import { OpenBarrioWidget, WIDGET_ROOT_ID } from '../src/content/ui/widget.js';
import type { PropertyAuditReport } from '@openbarrio/core';

describe('OpenBarrioWidget', () => {
  let dom: JSDOM;

  const mockReport: PropertyAuditReport = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    generatedAt: '2026-10-18T12:00:00Z',
    property: {
      cadastralReference: '9872023VH5797S0001WX',
      address: {
        street: 'Calle de Serrano',
        number: '45',
        postalCode: '28001',
        municipality: 'Madrid',
        province: 'Madrid',
      },
      coordinates: {
        latitude: 40.4285,
        longitude: -3.6872,
        srs: 'EPSG:4326',
      },
      building: {
        constructionYear: 1985,
        builtSurfaceM2: 120,
        primaryUse: 'Residencial',
        unitsCount: 16,
        hasCommercialGroundFloor: true,
      },
    },
    neighborhood: {
      censusTractId: '2807901001',
      municipality: 'Madrid',
      averageNetHouseholdIncomeEur: 52000,
      percentileInMunicipality: 88,
      demographics: {
        totalPopulation: 1450,
        medianAge: 46,
      },
    },
    environment: {
      noise: {
        dayEveningNightDecibels: 54,
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
      overallScore: 84,
      socioeconomicScore: 90,
      buildingHealthScore: 80,
      acousticComfortScore: 88,
      climateSafetyScore: 100,
      keyHighlights: ['High-income cluster', 'Quiet residential environment'],
      keyRisks: [],
    },
    rentalBenchmark: {
      officialRangeLowerEurM2: 14.5,
      officialRangeUpperEurM2: 17.8,
      estimatedMonthlyRentLowerEur: 1740,
      estimatedMonthlyRentUpperEur: 2136,
      isStressedHousingZone: true,
    },
  };

  beforeEach(() => {
    dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
      url: 'https://www.idealista.com/inmueble/101234567/',
    });
    // Set global document/window for the widget
    globalThis.document = dom.window.document as unknown as Document;
    globalThis.window = dom.window as unknown as Window & typeof globalThis;
    globalThis.HTMLElement = dom.window.HTMLElement;
  });

  afterEach(() => {
    const root = dom.window.document.getElementById(WIDGET_ROOT_ID);
    if (root && root.parentElement) {
      root.parentElement.removeChild(root);
    }
  });

  it('should mount into document.body with isolated Shadow DOM', () => {
    const widget = new OpenBarrioWidget();
    const root = dom.window.document.getElementById(WIDGET_ROOT_ID);

    expect(root).not.toBeNull();
    expect(widget.getShadowRoot()).not.toBeNull();
    expect(root?.shadowRoot).toBe(widget.getShadowRoot());
  });

  it('should render skeleton loading state with portal identification', () => {
    const widget = new OpenBarrioWidget();
    widget.showLoading('Idealista');

    const shadow = widget.getShadowRoot();
    expect(shadow?.innerHTML).toContain('OpenBarrio');
    expect(shadow?.innerHTML).toContain('Idealista');
    expect(shadow?.innerHTML).toContain('ob-skeleton-shimmer');
  });

  it('should render full audit card with score, stressed zone alert, and environmental metrics', () => {
    const widget = new OpenBarrioWidget();
    widget.showReport(mockReport, 'http://localhost:3000');

    const shadow = widget.getShadowRoot();
    const content = shadow?.innerHTML || '';

    // Overall Barrio Score
    expect(content).toContain('84');
    expect(content).toContain('/100');
    expect(content).toContain('Barrio Score');

    // Stressed housing zone alert (Ley 12/2023)
    expect(content).toContain('Zona Tensionada (Ley 12/2023)');
    expect(content).toContain('Alquiler máx. MIVAU');
    expect(content).toContain('14.5 - 17.8 €/m²');

    // Environmental metrics
    expect(content).toContain('54 dBA · Moderado');
    expect(content).toContain('Sin riesgo');

    // Direct link to OpenBarrio Web report
    expect(content).toContain('Ver Auditoría Completa en OpenBarrio Web ↗');
    expect(content).toContain('refcat=9872023VH5797S0001WX');
  });

  it('should toggle between expanded card and collapsed pill state', () => {
    const widget = new OpenBarrioWidget();
    widget.showReport(mockReport, 'http://localhost:3000');

    let shadow = widget.getShadowRoot();
    expect(shadow?.innerHTML).toContain('ob-card-main');

    // Collapse
    widget.collapse();
    shadow = widget.getShadowRoot();
    expect(shadow?.innerHTML).toContain('ob-pill-expand');
    expect(shadow?.innerHTML).toContain('84/100');

    // Expand
    widget.expand();
    shadow = widget.getShadowRoot();
    expect(shadow?.innerHTML).toContain('ob-card-main');
  });

  it('should render subtle error state gracefully', () => {
    const widget = new OpenBarrioWidget();
    widget.showError('No se pudo georreferenciar', 'http://localhost:3000');

    const shadow = widget.getShadowRoot();
    expect(shadow?.innerHTML).toContain('Buscar manualmente en OpenBarrio Web ↗');
  });

  it('should remove itself completely from DOM on destroy', () => {
    const widget = new OpenBarrioWidget();
    expect(dom.window.document.getElementById(WIDGET_ROOT_ID)).not.toBeNull();

    widget.destroy();
    expect(dom.window.document.getElementById(WIDGET_ROOT_ID)).toBeNull();
  });
});
