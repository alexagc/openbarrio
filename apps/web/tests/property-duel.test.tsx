import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PropertyDuelModal } from '../src/components/comparator/PropertyDuelModal';
import { BuildingCapExCard, deriveBuildingCapEx } from '../src/components/dossier/BuildingCapExCard';
import { apiClient } from '../src/services/api.client';
import { PropertyAuditReport } from '@openbarrio/core';

describe('Property Duel & Dual Radar Comparator (Phase 12C)', () => {
  let reportA: PropertyAuditReport;
  let reportB: PropertyAuditReport;

  beforeEach(() => {
    window.history.replaceState({}, '', '/map?refcat=28900A010000420003DW');

    // Mock deterministic reports
    reportA = apiClient.generateDeterministicAudit(40.4241, -3.7012, {
      cadastralReference: '28900A010000420003DW',
      address: {
        street: 'Calle Fuencarral',
        number: '42',
        postalCode: '28004',
        municipality: 'Madrid',
        province: 'Madrid',
      },
      building: {
        constructionYear: 1984,
        builtSurfaceM2: 88,
        primaryUse: 'Residencial',
        unitsCount: 12,
        hasCommercialGroundFloor: false,
      },
    });

    reportB = apiClient.generateDeterministicAudit(40.42023, -3.70197, {
      cadastralReference: '9872023VH5797S0012AZ',
      address: {
        street: 'Calle Gran Vía',
        number: '28',
        postalCode: '28013',
        municipality: 'Madrid',
        province: 'Madrid',
      },
      building: {
        constructionYear: 1968,
        builtSurfaceM2: 112,
        primaryUse: 'Residencial',
        unitsCount: 24,
        hasCommercialGroundFloor: false,
      },
    });
  });

  afterEach(() => {
    window.history.replaceState({}, '', '/');
    vi.restoreAllMocks();
  });

  it('renders property duel modal with header, institutional badges, and verdict badge', () => {
    render(
      <PropertyDuelModal
        reportA={reportA}
        reportB={reportB}
        isOpen={true}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByTestId('property-duel-modal')).toBeDefined();
    expect(screen.getByText(/Duelo Inmobiliario 1 vs 1/i)).toBeDefined();
    expect(screen.getByText(/Sede Electrónica OVC Validada/i)).toBeDefined();
    expect(screen.getByText(/EPSG:25830 · ETRS89/i)).toBeDefined();

    const verdict = screen.getByTestId('global-verdict-badge');
    expect(verdict).toBeDefined();
    expect(verdict.textContent).toMatch(/ventaja global ponderada|Paridad global/i);
  });

  it('synchronizes URL query parameters with ?refcat=...&vs=... and cleans up on close', () => {
    const pushStateSpy = vi.spyOn(window.history, 'pushState');
    const replaceStateSpy = vi.spyOn(window.history, 'replaceState');

    const { unmount } = render(
      <PropertyDuelModal
        reportA={reportA}
        reportB={reportB}
        isOpen={true}
        onClose={vi.fn()}
      />
    );

    // Verify pushState was called with refcat & vs params
    expect(pushStateSpy).toHaveBeenCalled();
    const lastPushCall = pushStateSpy.mock.calls[pushStateSpy.mock.calls.length - 1];
    expect(lastPushCall[2]).toContain('refcat=28900A010000420003DW');
    expect(lastPushCall[2]).toContain('vs=9872023VH5797S0012AZ');

    // Unmount modal to trigger cleanup
    unmount();
    expect(replaceStateSpy).toHaveBeenCalled();
  });

  it('closes cleanly on Close button click and on [Escape] key press', () => {
    const handleClose = vi.fn();
    render(
      <PropertyDuelModal
        reportA={reportA}
        reportB={reportB}
        isOpen={true}
        onClose={handleClose}
      />
    );

    // 1. Close button click
    const closeBtn = screen.getByTestId('duel-close-btn');
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);

    // 2. Escape key press
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(2);
  });

  it('renders side-by-side Bento candidate cards for Inmueble A and Inmueble B', () => {
    render(
      <PropertyDuelModal
        reportA={reportA}
        reportB={reportB}
        isOpen={true}
        onClose={vi.fn()}
      />
    );

    // Card A
    const cardA = screen.getByTestId('candidate-card-a');
    expect(cardA).toBeDefined();
    expect(cardA.textContent).toContain('Calle Fuencarral 42');
    expect(cardA.textContent).toContain('28900A010000420003DW');
    expect(cardA.textContent).toContain(String(reportA.property.building.constructionYear));
    expect(cardA.textContent).toContain(`${reportA.property.building.builtSurfaceM2} m²`);

    // Card B
    const cardB = screen.getByTestId('candidate-card-b');
    expect(cardB).toBeDefined();
    expect(cardB.textContent).toContain('Calle Gran Vía 28');
    expect(cardB.textContent).toContain('9872023VH5797S0012AZ');
    expect(cardB.textContent).toContain(String(reportB.property.building.constructionYear));
    expect(cardB.textContent).toContain(`${reportB.property.building.builtSurfaceM2} m²`);
  });

  it('renders differential matrix table with all vectors, calculated deltas and winners', () => {
    render(
      <PropertyDuelModal
        reportA={reportA}
        reportB={reportB}
        isOpen={true}
        onClose={vi.fn()}
      />
    );

    const table = screen.getByTestId('differential-matrix-table');
    expect(table).toBeDefined();

    // Check all analytical vectors
    expect(screen.getByText(/Conectividad & Caminabilidad \(15 min\)/i)).toBeDefined();
    expect(screen.getByText(/Socioeconomía & Renta Media INE/i)).toBeDefined();
    expect(screen.getByText(/Nivel Acústico & Calidad Ambiental/i)).toBeDefined();
    expect(screen.getByText(/CapEx Edificatorio & Riesgo Derramas/i)).toBeDefined();
    expect(screen.getByText(/Antigüedad & Año de Construcción/i)).toBeDefined();

    // Check winner badges
    const winnerBadges = screen.getAllByText(/Ganador:/i);
    expect(winnerBadges.length).toBeGreaterThanOrEqual(5);
  });

  it('renders technical arbitrage summary callout', () => {
    render(
      <PropertyDuelModal
        reportA={reportA}
        reportB={reportB}
        isOpen={true}
        onClose={vi.fn()}
      />
    );

    const callout = screen.getByTestId('arbitrage-summary-callout');
    expect(callout).toBeDefined();
    expect(callout.textContent).toContain('Resumen de Arbitraje Técnico:');
  });

  it('allows switching Candidate B via presets or custom reference', () => {
    const handleSelectB = vi.fn();
    render(
      <PropertyDuelModal
        reportA={reportA}
        reportB={reportB}
        isOpen={true}
        onClose={vi.fn()}
        onSelectCandidateB={handleSelectB}
      />
    );

    // Click "Cambiar Inmueble B"
    const changeBtn = screen.getByTestId('change-candidate-btn');
    fireEvent.click(changeBtn);

    const overlay = screen.getByTestId('candidate-selector-overlay');
    expect(overlay).toBeDefined();

    // Click on Barcelona preset
    const barcelonaPresetBtn = screen.getByText(/Passeig de Gràcia 43/i);
    fireEvent.click(barcelonaPresetBtn);

    expect(handleSelectB).toHaveBeenCalled();
  });

  it('renders BuildingCapExCard with ITE status, derramas risk gauge, and formatted metrics', () => {
    render(
      <BuildingCapExCard
        report={reportA}
      />
    );

    expect(screen.getByTestId('building-capex-card')).toBeDefined();
    expect(screen.getByTestId('ite-status-badge')).toBeDefined();
    expect(screen.getByTestId('derramas-risk-gauge')).toBeDefined();
    expect(screen.getByTestId('reserve-fund-deficit')).toBeDefined();
    expect(screen.getByTestId('monthly-fee-impact')).toBeDefined();
  });

  it('derives building capex risk metrics accurately based on building age', () => {
    // New building (<20 years)
    const newBuilding = deriveBuildingCapEx(2018);
    expect(newBuilding.iteStatus).toBe('exempt');
    expect(newBuilding.estimatedReserveFundDeficitPct).toBe(0);
    expect(newBuilding.capexRiskScore).toBeGreaterThanOrEqual(90);

    // Old building (>50 years)
    const oldBuilding = deriveBuildingCapEx(1965);
    expect(oldBuilding.iteStatus).toBe('mandatory_in_progress');
    expect(oldBuilding.estimatedReserveFundDeficitPct).toBeGreaterThan(30);
    expect(oldBuilding.renovationPriorities.length).toBeGreaterThan(0);
  });
});
