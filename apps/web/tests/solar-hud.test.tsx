import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SolarSimulationHud } from '../src/components/map/SolarSimulationHud';

describe('SolarSimulationHud Component (Stitch Glassmorphic HUD)', () => {
  it('renders correctly with title, live sun coordinates, and telemetry pills', () => {
    render(
      <SolarSimulationHud
        lat={40.42028}
        lon={-3.70379}
        facadeAzimuthDeg={198}
        roofAreaM2={200}
        initialSeason="summer"
        initialTimeMinutes={870} // 14:30
      />
    );

    // Title and status
    expect(screen.getByText('SIMULADOR SOLAR & SOMBRAS')).toBeTruthy();
    expect(screen.getByText(/Cálculo Astronómico Algorítmico/i)).toBeTruthy();

    // Telemetry pills in footer
    expect(screen.getByText(/Orientación Fachada/i)).toBeTruthy();
    expect(screen.getByText(/SUR-SUROESTE \(198°\)/i)).toBeTruthy();
    expect(screen.getByText(/Insolación Directa/i)).toBeTruthy();
    expect(screen.getByText(/Confort Lumínico/i)).toBeTruthy();
    expect(screen.getByText(/Potencial Fotovoltaico/i)).toBeTruthy();
    expect(screen.getByText(/46.8 MWh \/ año/i)).toBeTruthy();
  });

  it('allows changing season preset between Invierno, Equinoccio, and Verano', () => {
    const onSolarChangeMock = vi.fn();
    render(
      <SolarSimulationHud
        lat={40.42028}
        lon={-3.70379}
        onSolarChange={onSolarChangeMock}
      />
    );

    const winterBtn = screen.getByText('Invierno (21 Dic)');
    const equinoxBtn = screen.getByText('Equinoccio (21 Mar)');
    const summerBtn = screen.getByText('Verano (21 Jun)');

    expect(winterBtn).toBeTruthy();
    expect(equinoxBtn).toBeTruthy();
    expect(summerBtn).toBeTruthy();

    // Switch to winter
    fireEvent.click(winterBtn);
    expect(onSolarChangeMock).toHaveBeenCalledWith(
      expect.objectContaining({ season: 'winter' })
    );

    // Switch to equinox
    fireEvent.click(equinoxBtn);
    expect(onSolarChangeMock).toHaveBeenCalledWith(
      expect.objectContaining({ season: 'equinox' })
    );
  });

  it('allows scrubbing the timeline slider', () => {
    const onSolarChangeMock = vi.fn();
    render(
      <SolarSimulationHud
        lat={40.42028}
        lon={-3.70379}
        onSolarChange={onSolarChangeMock}
      />
    );

    const slider = screen.getByLabelText(/Control temporal solar/i);
    expect(slider).toBeTruthy();

    // Scrub slider to 12:00 (720 minutes)
    fireEvent.change(slider, { target: { value: '720' } });

    expect(onSolarChangeMock).toHaveBeenCalledWith(
      expect.objectContaining({ timeMinutes: 720 })
    );
    expect(screen.getByText(/12:00/)).toBeTruthy();
  });

  it('toggles play and pause animation', () => {
    render(<SolarSimulationHud lat={40.42028} lon={-3.70379} />);

    const playBtn = screen.getByRole('button', { name: /Reproducir simulación solar/i });
    expect(playBtn).toBeTruthy();

    // Click to play
    fireEvent.click(playBtn);
    expect(screen.getByRole('button', { name: /Pausar simulación solar/i })).toBeTruthy();

    // Click to pause
    const pauseBtn = screen.getByRole('button', { name: /Pausar simulación solar/i });
    fireEvent.click(pauseBtn);
    expect(screen.getByRole('button', { name: /Reproducir simulación solar/i })).toBeTruthy();
  });

  it('allows collapsing and expanding the HUD body', () => {
    render(<SolarSimulationHud lat={40.42028} lon={-3.70379} />);

    const toggleBtn = screen.getByLabelText(/Minimizar HUD Solar/i);
    expect(screen.getByText(/Orientación Fachada/i)).toBeTruthy();

    // Collapse
    fireEvent.click(toggleBtn);
    expect(screen.queryByText(/Orientación Fachada/i)).toBeNull();

    // Expand
    const expandBtn = screen.getByLabelText(/Expandir HUD Solar/i);
    fireEvent.click(expandBtn);
    expect(screen.getByText(/Orientación Fachada/i)).toBeTruthy();
  });

  it('invokes onClose when close button is clicked', () => {
    const onCloseMock = vi.fn();
    render(<SolarSimulationHud onClose={onCloseMock} />);

    const closeBtn = screen.getByLabelText(/Cerrar Simulador Solar/i);
    fireEvent.click(closeBtn);
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
