import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DualRadarChart } from '../src/components/dossier/DualRadarChart';

describe('DualRadarChart Component', () => {
  const mockSubscoresA = {
    connectivity: 92,
    building: 88,
    socioeconomic: 70,
    environmental: 90,
    urbanPlanning: 80,
  };

  const mockSubscoresB = {
    connectivity: 74,
    building: 52,
    socioeconomic: 88,
    environmental: 54,
    urbanPlanning: 85,
  };

  it('renders dual radar SVG with concentric pentagon rings, spokes, and 5 axes', () => {
    render(<DualRadarChart subscoresA={mockSubscoresA} subscoresB={mockSubscoresB} />);

    // Check SVG container
    const svg = screen.getByTestId('dual-radar-svg');
    expect(svg).toBeDefined();

    // Check concentric rings (20, 40, 60, 80, 100)
    expect(screen.getByTestId('radar-ring-20')).toBeDefined();
    expect(screen.getByTestId('radar-ring-40')).toBeDefined();
    expect(screen.getByTestId('radar-ring-60')).toBeDefined();
    expect(screen.getByTestId('radar-ring-80')).toBeDefined();
    expect(screen.getByTestId('radar-ring-100')).toBeDefined();

    // Check axis labels
    expect(screen.getByText(/Conectividad \(WalkScore\)/i)).toBeDefined();
    expect(screen.getByText(/Edificación/i)).toBeDefined();
    expect(screen.getByText(/Salud ITE & CapEx/i)).toBeDefined();
    expect(screen.getByText(/Socioeconomía/i)).toBeDefined();
    expect(screen.getByText(/Medioambiente/i)).toBeDefined();
    expect(screen.getByText(/Urbanismo/i)).toBeDefined();

    // Check vertex tags with numerical values
    expect(screen.getByText(/A: 92 \| B: 74/)).toBeDefined();
    expect(screen.getByText(/A: 88 \| B: 52/)).toBeDefined();
    expect(screen.getByText(/A: 70 \| B: 88/)).toBeDefined();
    expect(screen.getByText(/A: 90 \| B: 54/)).toBeDefined();
    expect(screen.getByText(/A: 80 \| B: 85/)).toBeDefined();
  });

  it('renders Property A in Cyan and Property B in Amber with glowing polygons', () => {
    render(<DualRadarChart subscoresA={mockSubscoresA} subscoresB={mockSubscoresB} />);

    const polyA = screen.getByTestId('radar-poly-a');
    expect(polyA.getAttribute('stroke')).toBe('#06b6d4');
    expect(polyA.getAttribute('fill')).toBe('url(#cyan-radial)');
    expect(polyA.getAttribute('filter')).toBe('url(#glow-cyan)');

    const polyB = screen.getByTestId('radar-poly-b');
    expect(polyB.getAttribute('stroke')).toBe('#f59e0b');
    expect(polyB.getAttribute('fill')).toBe('url(#amber-radial)');
    expect(polyB.getAttribute('stroke-dasharray')).toBe('6 3');
  });

  it('handles the 4 display modes: Both (default), Only A, Only B, and Net Diff', () => {
    render(<DualRadarChart subscoresA={mockSubscoresA} subscoresB={mockSubscoresB} />);

    const polyA = screen.getByTestId('radar-poly-a');
    const polyB = screen.getByTestId('radar-poly-b');

    // 1. Default mode: 'both' (both at opacity 1)
    expect(polyA.style.opacity).toBe('1');
    expect(polyB.style.opacity).toBe('1');

    // 2. Select 'Solo Inmueble A'
    fireEvent.click(screen.getByTestId('mode-a'));
    expect(polyA.style.opacity).toBe('1');
    expect(polyB.style.opacity).toBe('0.12');

    // 3. Select 'Solo Inmueble B'
    fireEvent.click(screen.getByTestId('mode-b'));
    expect(polyA.style.opacity).toBe('0.12');
    expect(polyB.style.opacity).toBe('1');

    // 4. Select 'Diferencial Neto'
    fireEvent.click(screen.getByTestId('mode-diff'));
    expect(polyA.style.opacity).toBe('0.85');
    expect(polyB.style.opacity).toBe('0.45');

    // 5. Back to 'Ambos Superpuestos'
    fireEvent.click(screen.getByTestId('mode-both'));
    expect(polyA.style.opacity).toBe('1');
    expect(polyB.style.opacity).toBe('1');
  });

  it('calls external onModeChange when controlled from parent', () => {
    const handleModeChange = vi.fn();
    render(
      <DualRadarChart
        subscoresA={mockSubscoresA}
        subscoresB={mockSubscoresB}
        mode="both"
        onModeChange={handleModeChange}
      />
    );

    fireEvent.click(screen.getByTestId('mode-a'));
    expect(handleModeChange).toHaveBeenCalledWith('a');

    fireEvent.click(screen.getByTestId('mode-diff'));
    expect(handleModeChange).toHaveBeenCalledWith('diff');
  });
});
