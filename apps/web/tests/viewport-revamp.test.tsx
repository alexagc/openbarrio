import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CadastralBottomSheet } from '../src/components/CadastralBottomSheet';
import { GisWorkspaceView } from '../src/views/GisWorkspaceView';
import { ExtendedAuditReport } from '../src/services/api.client';

vi.mock('../src/components/map/MapView', () => ({
  MapView: (props: any) => (
    <div data-testid="mock-mapview" data-is-dragging={props.isDragging}>
      MapView Mock
    </div>
  ),
}));

describe('Phase 15C & 15D: Responsive Viewports (Mobile & Tablet Precision Revamp)', () => {
  beforeAll(() => {
    if (typeof window.PointerEvent === 'undefined') {
      class MockPointerEvent extends MouseEvent {
        pointerId: number;
        constructor(type: string, params: PointerEventInit = {}) {
          super(type, params);
          this.pointerId = params.pointerId ?? 0;
        }
      }
      window.PointerEvent = MockPointerEvent as unknown as typeof PointerEvent;
    }
    if (!Element.prototype.setPointerCapture) {
      Element.prototype.setPointerCapture = vi.fn();
    }
    if (!Element.prototype.releasePointerCapture) {
      Element.prototype.releasePointerCapture = vi.fn();
    }
  });

  const mockReport: ExtendedAuditReport = {
    id: '28900A001000120001XY-AUDIT',
    generatedAt: '2026-10-24T12:00:00.000Z',
    property: {
      cadastralReference: '28900A001000120001XY',
      address: {
        street: 'Calle de Alcalá',
        number: '42',
        postalCode: '28014',
        municipality: 'Madrid',
        province: 'Madrid',
      },
      coordinates: { latitude: 40.4182, longitude: -3.6989, srs: 'EPSG:4326' },
      building: {
        constructionYear: 1954,
        builtSurfaceM2: 102,
        primaryUse: 'Residencial',
        unitsCount: 24,
        hasCommercialGroundFloor: true,
      },
    },
    neighborhood: {
      censusSectionCode: '2807901004',
      averageNetHouseholdIncomeEur: 38500,
      percentileInMunicipality: 82,
    },
    environment: {
      noise: { dayEveningNightDecibels: 56 },
      floodRisk: { level: 'NONE' },
    },
    connectivity: {
      walkScore15Min: 95,
    },
    urbanPlanning: {
      isStressedHousingZone: true,
    },
    score: {
      overallScore: 82,
      subscores: {
        building: 78,
        connectivity: 95,
        environmental: 85,
        socioeconomic: 84,
        urbanPlanning: 90,
      },
      keyHighlights: ['ITE Favorable (2022)'],
      keyRisks: [],
    },
    rentalBenchmark: {
      officialRangeLowerEurM2: 13.5,
      officialRangeUpperEurM2: 17.8,
      estimatedMonthlyRentLowerEur: 920,
      estimatedMonthlyRentUpperEur: 1140,
      isStressedHousingZone: true,
    },
  };

  it('notifies onDraggingChange when pointer gestures occur on bottom sheet', () => {
    const onDraggingChange = vi.fn();
    render(
      <CadastralBottomSheet
        report={mockReport}
        snapPoint="peek"
        onSnapChange={vi.fn()}
        onDraggingChange={onDraggingChange}
      />
    );

    const dragArea = screen.getByTestId('bottom-sheet-drag-area');

    fireEvent.pointerDown(dragArea, { clientY: 200, pointerId: 1, button: 0 });
    expect(onDraggingChange).toHaveBeenCalledWith(true);

    fireEvent.pointerUp(dragArea, { clientY: 150, pointerId: 1 });
    expect(onDraggingChange).toHaveBeenCalledWith(false);
  });

  it('applies 80px / 45vh / 90vh magnetic snap height classes and safe area insets', () => {
    const { rerender } = render(
      <CadastralBottomSheet
        report={mockReport}
        snapPoint="peek"
        onSnapChange={vi.fn()}
      />
    );

    let region = screen.getByRole('region', { name: /Auditoría Catastral/i });
    expect(region.className).toContain('h-[80px]');
    expect(region.className).toContain('pb-[env(safe-area-inset-bottom)]');

    rerender(
      <CadastralBottomSheet
        report={mockReport}
        snapPoint="half"
        onSnapChange={vi.fn()}
      />
    );
    region = screen.getByRole('region', { name: /Auditoría Catastral/i });
    expect(region.className).toContain('h-[45vh]');

    rerender(
      <CadastralBottomSheet
        report={mockReport}
        snapPoint="full"
        onSnapChange={vi.fn()}
      />
    );
    region = screen.getByRole('region', { name: /Auditoría Catastral/i });
    expect(region.className).toContain('h-[90vh]');
  });

  it('renders tablet split separator with double-click reset and quick collapse buttons', () => {
    render(<GisWorkspaceView />);

    const separator = screen.getByRole('separator', { name: /Ajustar división del espacio de trabajo/i });
    expect(separator).toBeDefined();
    expect(separator.getAttribute('aria-valuenow')).toBe('52');

    // Double click resets to 50
    fireEvent.doubleClick(separator);
    expect(separator.getAttribute('aria-valuenow')).toBe('50');

    // Quick collapse left (35%)
    const collapseLeftBtn = screen.getByLabelText(/Colapsar panel izquierdo a 35%/i);
    fireEvent.click(collapseLeftBtn);
    expect(separator.getAttribute('aria-valuenow')).toBe('35');

    // Quick expand right (65%)
    const expandRightBtn = screen.getByLabelText(/Expandir panel izquierdo a 65%/i);
    fireEvent.click(expandRightBtn);
    expect(separator.getAttribute('aria-valuenow')).toBe('65');

    // Keyboard navigation
    fireEvent.keyDown(separator, { key: 'ArrowLeft' });
    expect(separator.getAttribute('aria-valuenow')).toBe('60');

    fireEvent.keyDown(separator, { key: ' ' });
    expect(separator.getAttribute('aria-valuenow')).toBe('50');
  });
});
