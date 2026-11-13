import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ReactNode } from 'react';
import { SurfaceCheckerToolView } from '../src/views/tools/SurfaceCheckerToolView';
import { RentLegalCalculatorToolView } from '../src/views/tools/RentLegalCalculatorToolView';
import { ItpIbiSimulatorToolView } from '../src/views/tools/ItpIbiSimulatorToolView';
import { LanguageProvider } from '../src/i18n';

function renderWithProviders(ui: ReactNode) {
  return render(<LanguageProvider>{ui}</LanguageProvider>);
}

describe('Phase 21: Civic Micro-Tools UI Components', () => {
  describe('SurfaceCheckerToolView (/comprobar-metros-catastro)', () => {
    it('renders heading, inputs, and calculates surface discrepancy', () => {
      renderWithProviders(<SurfaceCheckerToolView isEmbed={false} />);

      expect(screen.getByText(/Comprobador de Metros/i)).toBeTruthy();
      expect(screen.getByText(/Referencia Catastral/i)).toBeTruthy();

      // Check default discrepancy with initial values (85 cad vs 105 adv = +20 m2, >15%)
      expect(screen.getByText(/\+20 m²/i)).toBeTruthy();
      expect(screen.getByText(/Discrepancia Crítica >15%/i)).toBeTruthy();
    });

    it('updates calculation when selecting real case presets', () => {
      renderWithProviders(<SurfaceCheckerToolView isEmbed={false} />);

      const presetBtn = screen.getByText(/Ruzafa \(Exacto 100%\)/i);
      fireEvent.click(presetBtn);

      // In Ruzafa 110 cad vs 110 adv = 0 m2 divergence, tolerance normal
      expect(screen.getByText(/0 m²/i)).toBeTruthy();
      expect(screen.getByText(/Tolerancia Normal/i)).toBeTruthy();
    });

    it('renders cleanly in embed mode without header banner', () => {
      renderWithProviders(<SurfaceCheckerToolView isEmbed={true} />);
      expect(screen.queryByText(/Micro-Herramienta Cívica Gratuita/i)).toBeNull();
      expect(screen.getByText(/1. Parámetros del Inmueble/i)).toBeTruthy();
    });
  });

  describe('RentLegalCalculatorToolView (/calculadora-alquiler-legal)', () => {
    it('renders legal rent calculator and statutory ceiling', () => {
      renderWithProviders(<RentLegalCalculatorToolView isEmbed={false} />);

      expect(screen.getByText(/Calculadora de Alquiler Legal/i)).toBeTruthy();
      expect(screen.getByText(/Tope Legal Máximo de Renta/i)).toBeTruthy();
      expect(screen.getAllByText(/Zona Tensionada/i).length).toBeGreaterThan(0);
    });

    it('switches between Gran Tenedor and Pequeño Propietario presets', () => {
      renderWithProviders(<RentLegalCalculatorToolView isEmbed={false} />);

      const presetBtn = screen.getByText(/Mercado Libre \(Madrid\)/i);
      fireEvent.click(presetBtn);

      expect(screen.getAllByText(/Mercado Libre/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/LIBRE_MERCADO/i)).toBeTruthy();
    });
  });

  describe('ItpIbiSimulatorToolView (/simulador-itp-ibi)', () => {
    it('renders ITP and IBI breakdown for transaction', () => {
      renderWithProviders(<ItpIbiSimulatorToolView isEmbed={false} />);

      expect(screen.getByText(/Simulador Fiscal: ITP, IBI y Gastos/i)).toBeTruthy();
      expect(screen.getByText(/Coste Total de la Operación/i)).toBeTruthy();
      expect(screen.getByText(/IBI Municipal Anual Estimado/i)).toBeTruthy();
    });

    it('adapts ITP rate when selecting reduced brackets (young, large family)', () => {
      renderWithProviders(<ItpIbiSimulatorToolView isEmbed={false} />);

      // Default Madrid 6%
      expect(screen.getByText(/ITP: 6%/i)).toBeTruthy();

      const youngBtn = screen.getByText(/Joven <35 años/i);
      fireEvent.click(youngBtn);

      // Concession rate 4%
      expect(screen.getByText(/ITP: 4%/i)).toBeTruthy();
    });
  });
});
