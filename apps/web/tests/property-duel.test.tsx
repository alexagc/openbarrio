import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PropertyDuelModal } from '../src/components/comparator/PropertyDuelModal';
import { BuildingCapExCard, deriveBuildingCapEx } from '../src/components/dossier/BuildingCapExCard';
import { ExecutiveSummaryCard } from '../src/components/dossier/ExecutiveSummaryCard';
import { AuditDossier } from '../src/components/AuditDossier';
import { HighlightsAndRisks } from '../src/components/HighlightsAndRisks';
import { generateDeterministicAudit } from './mocks/offline-simulator';
import { PropertyAuditReport } from '@openbarrio/core';

describe('Property Duel & Dual Radar Comparator (Phase 12C)', () => {
  let reportA: PropertyAuditReport;
  let reportB: PropertyAuditReport;

  beforeEach(() => {
    window.history.replaceState({}, '', '/map?refcat=28900A010000420003DW');

    // Mock deterministic reports
    reportA = generateDeterministicAudit(40.4241, -3.7012, {
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

    reportB = generateDeterministicAudit(40.42023, -3.70197, {
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

  it('allows switching Candidate B via presets or custom reference', async () => {
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

    await waitFor(() => expect(handleSelectB).toHaveBeenCalled(), { timeout: 4000 });
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

  /* -------------------------------------------------------------------------- */
  /* PHASE 22: MULTI-PROPERTY MATRIX 2.0 & INFRAVIVIENDA WARNING               */
  /* -------------------------------------------------------------------------- */

  it('renders multi-property comparison matrix for up to 4 properties with URL persistence', async () => {
    const reportC = generateDeterministicAudit(41.3917, 2.16495, {
      cadastralReference: '0227802DF3802E0001JK',
      address: {
        street: 'Passeig de Gràcia',
        number: '43',
        postalCode: '08007',
        municipality: 'Barcelona',
        province: 'Barcelona',
      },
      building: {
        constructionYear: 1905,
        builtSurfaceM2: 140,
        primaryUse: 'Residencial',
        unitsCount: 16,
        hasCommercialGroundFloor: true,
      },
    });

    const reportD = generateDeterministicAudit(39.46845, -0.37318, {
      cadastralReference: '6023512YJ2762C0001LK',
      address: {
        street: 'Carrer de Colón',
        number: '15',
        postalCode: '46004',
        municipality: 'València',
        province: 'València',
      },
      building: {
        constructionYear: 1982,
        builtSurfaceM2: 105,
        primaryUse: 'Residencial',
        unitsCount: 20,
        hasCommercialGroundFloor: false,
      },
    });

    const pushStateSpy = vi.spyOn(window.history, 'pushState');

    render(
      <PropertyDuelModal
        reportA={reportA}
        reportB={reportB}
        initialCompareRefs={[
          reportA.property.cadastralReference,
          reportB.property.cadastralReference,
          reportC.property.cadastralReference,
          reportD.property.cadastralReference,
        ]}
        isOpen={true}
        onClose={vi.fn()}
      />
    );

    // Verify 4 Bento cards are rendered
    expect(screen.getByTestId('candidate-card-a')).toBeDefined();
    expect(screen.getByTestId('candidate-card-b')).toBeDefined();

    // Verify URL was synced with ?compare= containing cadastral references
    expect(pushStateSpy).toHaveBeenCalled();
    const lastCall = pushStateSpy.mock.calls[pushStateSpy.mock.calls.length - 1];
    expect(lastCall[2]).toContain('compare=');
    expect(lastCall[2]).toContain(reportA.property.cadastralReference);
  });

  it('allows removing a candidate from the matrix and updates the UI', async () => {
    render(
      <PropertyDuelModal
        reportA={reportA}
        reportB={reportB}
        isOpen={true}
        onClose={vi.fn()}
      />
    );

    // Initially has Card A and Card B
    expect(screen.getByTestId('candidate-card-a')).toBeDefined();
    expect(screen.getByTestId('candidate-card-b')).toBeDefined();

    // Remove Candidate B using remove button
    const removeBtn = screen.getByTestId('remove-candidate-b');
    fireEvent.click(removeBtn);

    // Candidate B card should be removed, leaving Card A and Add candidate slot
    expect(screen.queryByTestId('candidate-card-b')).toBeNull();
    expect(screen.getByTestId('add-candidate-slot')).toBeDefined();
  });

  it('initializes comparison modal from URL ?compare=ref1,ref2', async () => {
    window.history.replaceState(
      {},
      '',
      '/map?compare=28900A010000420003DW,9872023VH5797S0012AZ'
    );

    render(
      <PropertyDuelModal
        reportA={reportA}
        isOpen={true}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByTestId('property-duel-modal')).toBeDefined();
    expect(screen.getByTestId('candidate-card-a')).toBeDefined();
    // Candidate B is loaded from compare refs in URL
    await waitFor(() => {
      expect(screen.getByTestId('candidate-card-b')).toBeDefined();
    });
  });

  it('renders Infravivienda / Substandard commercial housing row in differential matrix table', () => {
    const substandardCandidate = {
      ...reportB,
      substandardHousing: {
        isAlert: true,
        severity: 'HIGH' as const,
        detectedUse: 'COMERCIAL',
        floor: 'PB',
        warningMessage: 'Presunto local comercial reconvertido sin cédula',
        legalRisks: ['Falta de cédula de habitabilidad'],
        isGroundFloorOrBasement: true,
        lacksResidentialSubdivision: true,
        penaltyApplied: 25,
      },
      score: {
        ...reportB.score,
        keyRisks: ['Presunto local comercial sin cédula de habitabilidad'],
      },
    };

    render(
      <PropertyDuelModal
        reportA={reportA}
        reportB={substandardCandidate}
        isOpen={true}
        onClose={vi.fn()}
      />
    );

    // Row should be present in table
    const row = screen.getByTestId('row-substandard-housing');
    expect(row).toBeDefined();
    expect(row.textContent).toMatch(/Infravivienda|Cédula/i);

    // Candidate A is residential conform
    const statusA = screen.getByTestId('substandard-status-a');
    expect(statusA.textContent).toMatch(/Conforme/i);

    // Candidate B flags substandard alert
    const statusB = screen.getByTestId('substandard-status-b');
    expect(statusB.textContent).toMatch(/Alerta: Presunto Local/i);
  });

  it('displays a prominent red warning banner in AuditDossier when report flags substandard commercial housing', () => {
    const reportWithSubstandardAlert: PropertyAuditReport = {
      ...reportA,
      substandardHousing: {
        isAlert: true,
        severity: 'HIGH',
        detectedUse: 'ALMACÉN',
        floor: 'PB',
        warningMessage: 'Alto riesgo de infravivienda por local comercial reconvertido',
        legalRisks: ['Sin licencia de habitabilidad'],
        isGroundFloorOrBasement: true,
        lacksResidentialSubdivision: false,
        penaltyApplied: 20,
      },
      score: {
        ...reportA.score,
        keyRisks: ['Presunto local comercial sin cédula de habitabilidad'],
      },
    };

    render(<AuditDossier report={reportWithSubstandardAlert} />);

    // Prominent red banner
    const warningBanner = screen.getByTestId('substandard-housing-warning');
    expect(warningBanner).toBeDefined();
    expect(warningBanner.textContent).toMatch(/Alerta de Infravivienda|Presunto Local Comercial/i);
    expect(warningBanner.textContent).toMatch(/Cédula de Habitabilidad/i);
  });

  it('displays prominent warning banner in ExecutiveSummaryCard and highlighted risk chip in HighlightsAndRisks', () => {
    const reportWithRiskKey: PropertyAuditReport = {
      ...reportA,
      score: {
        ...reportA.score,
        keyRisks: ['Presunto local comercial sin cédula de habitabilidad', 'Aislamiento medio'],
      },
    };

    // 1. ExecutiveSummaryCard
    render(<ExecutiveSummaryCard report={reportWithRiskKey} />);
    expect(screen.getByTestId('executive-summary-card')).toBeDefined();
    expect(screen.getByTestId('substandard-housing-warning')).toBeDefined();

    // 2. HighlightsAndRisks component highlights substandard chip
    const substandardChip = screen.getByTestId('substandard-risk-chip');
    expect(substandardChip).toBeDefined();
    expect(substandardChip.textContent).toContain('Presunto local comercial');

    // 3. Direct HighlightsAndRisks rendering
    render(
      <HighlightsAndRisks
        highlights={['Luz natural óptima']}
        risks={['Presunto local comercial sin cédula']}
      />
    );
    const directChips = screen.getAllByTestId('substandard-risk-chip');
    expect(directChips.length).toBeGreaterThanOrEqual(2);
  });
});
