import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CartographicLegendsHud, ActiveLayersState } from '../src/components/CartographicLegendsHud';

describe('CartographicLegendsHud Component', () => {
  const defaultInactiveLayers: ActiveLayersState = {
    cadastre: true, // base layer, not thematic
    noise: false,
    flood: false,
    income: false,
    isochrones: false,
  };

  it('renders nothing when no thematic layers are active', () => {
    const { container } = render(<CartographicLegendsHud activeLayers={defaultInactiveLayers} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders legend when income layer is active', () => {
    render(<CartographicLegendsHud activeLayers={{ ...defaultInactiveLayers, income: true }} />);

    expect(screen.getByText('Leyenda Cartográfica')).toBeDefined();
    expect(screen.getByText('Renta Neta Hogar (INE ADRH)')).toBeDefined();
    expect(screen.getByText(/< 20k/)).toBeDefined();
    expect(screen.getByText(/> 45k/)).toBeDefined();
  });

  it('renders legend when noise layer is active with dBA thresholds', () => {
    render(<CartographicLegendsHud activeLayers={{ ...defaultInactiveLayers, noise: true }} />);

    expect(screen.getByText('Ruido Ambiental (MITECO SICA)')).toBeDefined();
    expect(screen.getByText(/< 55 dB/)).toBeDefined();
    expect(screen.getByText(/> 75 dB/)).toBeDefined();
  });

  it('renders legend when flood risk layer is active with T=10, T=100, T=500', () => {
    render(<CartographicLegendsHud activeLayers={{ ...defaultInactiveLayers, flood: true }} />);

    expect(screen.getByText('Inundabilidad (MITECO SNCZI)')).toBeDefined();
    expect(screen.getByText(/Alta \(T=10\)/)).toBeDefined();
    expect(screen.getByText(/Media \(T=100\)/)).toBeDefined();
    expect(screen.getByText(/Baja \(T=500\)/)).toBeDefined();
  });

  it('renders legend when walking isochrones layer is active with 5, 10, 15 min circles', () => {
    render(<CartographicLegendsHud activeLayers={{ ...defaultInactiveLayers, isochrones: true }} />);

    expect(screen.getByText('Isocronas Peatonales')).toBeDefined();
    expect(screen.getByText('5 min a pie (400 m)')).toBeDefined();
    expect(screen.getByText('10 min a pie (800 m)')).toBeDefined();
    expect(screen.getByText('15 min a pie (1.200 m)')).toBeDefined();
  });

  it('toggles collapse state when header toggle button is clicked', () => {
    render(<CartographicLegendsHud activeLayers={{ ...defaultInactiveLayers, isochrones: true }} />);

    const toggleButton = screen.getByLabelText('Colapsar leyendas');
    expect(screen.getByText('5 min a pie (400 m)')).toBeDefined();

    // Click collapse
    fireEvent.click(toggleButton);
    expect(screen.queryByText('5 min a pie (400 m)')).toBeNull();

    // Click expand
    const expandButton = screen.getByLabelText('Expandir leyendas');
    fireEvent.click(expandButton);
    expect(screen.getByText('5 min a pie (400 m)')).toBeDefined();
  });
});
