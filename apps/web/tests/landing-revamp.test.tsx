import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { InteractiveSandboxSection } from '../src/components/landing/InteractiveSandboxSection';
import { DataTransparencyMatrix } from '../src/components/landing/DataTransparencyMatrix';
import { HorizontalDivisionShowcase } from '../src/components/landing/HorizontalDivisionShowcase';

describe('Landing Revamp Components (Fase 15A)', () => {
  describe('InteractiveSandboxSection', () => {
    it('renders presets and updates metrics on click', () => {
      const handleSelect = vi.fn();
      render(<InteractiveSandboxSection onSelectPreset={handleSelect} />);

      expect(screen.getByText(/LABORATORIO CATASTRAL EN VIVO/i)).toBeTruthy();
      expect(screen.getByText('Madrid Sol')).toBeTruthy();
      expect(screen.getByText('Barcelona Eixample')).toBeTruthy();
      expect(screen.getByText('Valencia Ruzafa')).toBeTruthy();

      // Click Barcelona preset
      fireEvent.click(screen.getByText('Barcelona Eixample'));
      expect(screen.getByText('Barcelona / Eixample Dret')).toBeTruthy();
      expect(screen.getByText(/Caminabilidad excepcional/i)).toBeTruthy();

      // Test solar slider change
      const slider = screen.getByLabelText(/Simulación Solar/i);
      fireEvent.change(slider, { target: { value: '18' } });
      expect(screen.getByText(/18:00/)).toBeTruthy();

      // Test isochrone buttons
      fireEvent.click(screen.getByText("15m (Ciudad 15')"));
      expect(screen.getByText("15m (Ciudad 15')")).toBeTruthy();

      // Test CEE grade click
      fireEvent.click(screen.getByText('A'));
      expect(screen.getByText(/\+0 €/i)).toBeTruthy();

      // Test Auditar en Visor GIS
      const auditBtn = screen.getByRole('button', { name: /Auditar en Visor GIS/i });
      fireEvent.click(auditBtn);
      expect(handleSelect).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'barcelona',
          refcat: '0227802DF3802E',
        })
      );
    });
  });

  describe('DataTransparencyMatrix', () => {
    it('renders all 5 public administration sources', () => {
      render(<DataTransparencyMatrix />);

      expect(screen.getByText(/Datos Públicos Abiertos & Protocolos de Interconexión/i)).toBeTruthy();
      expect(screen.getByText('Sede Electrónica del Catastro (OVC)')).toBeTruthy();
      expect(screen.getByText('Instituto Nacional de Estadística (INE)')).toBeTruthy();
      expect(screen.getByText('MITECO (Agua y Biodiversidad)')).toBeTruthy();
      expect(screen.getByText('MITECO (Calidad Ambiental)')).toBeTruthy();
      expect(screen.getByText('MIVAU (Vivienda y Agenda Urbana)')).toBeTruthy();
      expect(screen.getAllByText(/En línea \(200 OK\)/i).length).toBe(5);
    });
  });

  describe('HorizontalDivisionShowcase', () => {
    it('renders the 4 units and invokes audit callback', () => {
      const handleAuditUnit = vi.fn();
      render(<HorizontalDivisionShowcase onAuditUnit={handleAuditUnit} />);

      expect(screen.getByText(/Desglose de División Horizontal Catastral/i)).toBeTruthy();
      expect(screen.getByText(/100.00% Coeficiente Total/i)).toBeTruthy();
      expect(screen.getByText('Planta 1ª — Pta. A')).toBeTruthy();
      expect(screen.getByText('Planta 4ª — Ático')).toBeTruthy();
      expect(screen.getByText('PB — Local 1')).toBeTruthy();

      // Click Ver Ficha on first unit
      const fichaButtons = screen.getAllByRole('button', { name: /Ver Ficha/i });
      fireEvent.click(fichaButtons[0]);
      expect(handleAuditUnit).toHaveBeenCalledWith('28900A001000120001AZ', expect.stringContaining('Alcalá 42'));
    });
  });
});
