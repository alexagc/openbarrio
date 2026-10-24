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
      censusSectionCode: '2807901001',
      averageNetHouseholdIncomeEur: 52000,
      averageNetPersonIncomeEur: 24000,
      percentileInMunicipality: 88,
      rankingInCity: { rank: 12, totalSections: 150 },
      demographics: {
        medianAge: 46,
        singlePersonHouseholdPercentage: 28,
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
      subscores: {
        building: 80,
        connectivity: 85,
        environmental: 85,
        socioeconomic: 90,
        urbanPlanning: 80,
      },
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

    // 5-Axis Mini Radar SVG & Horizontal Division Unit Pill
    expect(content).toContain('ob-mini-radar');
    expect(content).toContain('ob-unit-pill');
    expect(content).toContain('🏢 Edificio (16 inmuebles) · Ver unidades');
  });

  it('should render compact 5-axis mini radar SVG graphing the 5 subscores with Civic Precision styling', () => {
    const widget = new OpenBarrioWidget();
    widget.showReport(mockReport, 'http://localhost:3000');

    const shadow = widget.getShadowRoot();
    const radarSvg = shadow?.querySelector('svg.ob-mini-radar');
    expect(radarSvg).not.toBeNull();
    expect(radarSvg?.getAttribute('width')).toBe('120');
    expect(radarSvg?.getAttribute('height')).toBe('120');
    expect(radarSvg?.getAttribute('viewBox')).toBe('0 0 120 120');

    // Translucent polygon fill and stroke matching Civic Precision theme
    const dataPolygon = radarSvg?.querySelector('polygon[fill="rgba(104, 219, 169, 0.25)"]');
    expect(dataPolygon).not.toBeNull();
    expect(dataPolygon?.getAttribute('stroke')).toBe('#68dba9');
    expect(dataPolygon?.getAttribute('points')).toBeTruthy();

    // Verify 5 vertices rendered in data polygon points
    const pointsAttr = dataPolygon?.getAttribute('points') || '';
    const pointsList = pointsAttr.trim().split(/\s+/);
    expect(pointsList.length).toBe(5);

    // Verify radar container exists
    const container = shadow?.querySelector('.ob-mini-radar-container');
    expect(container).not.toBeNull();
  });

  it('should render unit switcher badge with direct link to Web Dossier when unitsCount > 1', () => {
    const widget = new OpenBarrioWidget();
    widget.showReport(mockReport, 'http://localhost:3000');

    const shadow = widget.getShadowRoot();
    const unitPill = shadow?.querySelector('.ob-unit-pill');
    expect(unitPill).not.toBeNull();
    expect(unitPill?.textContent?.trim()).toBe('🏢 Edificio (16 inmuebles) · Ver unidades');

    const link = shadow?.querySelector('a.ob-unit-pill-link');
    expect(link).not.toBeNull();
    expect(link?.getAttribute('href')).toBe('http://localhost:3000/map?refcat=9872023VH5797S0001WX&tab=dossier');
    expect(link?.getAttribute('target')).toBe('_blank');
  });

  it('should not render unit pill if unitsCount is 1 or less', () => {
    const singleUnitReport: PropertyAuditReport = {
      ...mockReport,
      property: {
        ...mockReport.property,
        building: {
          ...mockReport.property.building,
          unitsCount: 1,
        },
      },
    };

    const widget = new OpenBarrioWidget();
    widget.showReport(singleUnitReport, 'http://localhost:3000');

    const shadow = widget.getShadowRoot();
    expect(shadow?.querySelector('.ob-unit-pill')).toBeNull();
    expect(shadow?.querySelector('svg.ob-mini-radar')).not.toBeNull();
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
