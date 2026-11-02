import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RadonCard } from '../src/components/dossier/RadonCard';
import { VutSaturationCard } from '../src/components/dossier/VutSaturationCard';
import { FiscalSimulatorCard } from '../src/components/dossier/FiscalSimulatorCard';
import {
  evaluateRadonRisk,
  evaluateVutSaturation,
  calculateFiscalEstimate,
  CadastralProperty,
} from '@openbarrio/core';

describe('Phase 16 Due Diligence UI Cards', () => {
  const mockProperty: CadastralProperty = {
    cadastralReference: '2807901VK4720F0001AB',
    address: {
      street: 'Gran Vía',
      number: '28',
      postalCode: '28013',
      municipality: 'Madrid',
      province: 'Madrid',
      provinceCode: '28',
    },
    coordinates: { latitude: 40.42028, longitude: -3.70379, srs: 'EPSG:4326' },
    building: {
      constructionYear: 1980,
      builtSurfaceM2: 100,
      primaryUse: 'Residencial',
      unitsCount: 12,
      hasCommercialGroundFloor: true,
    },
    unit: {
      cadastralReference: '2807901VK4720F0001AB',
      floor: '02',
      door: 'A',
      use: 'Residencial',
      builtSurfaceM2: 85,
    },
  };

  describe('RadonCard Component', () => {
    it('renders CTE DB-HS 6 radon seal for Zona I with floor elevation mitigation', () => {
      const radon = evaluateRadonRisk('Zona I', 2, 12);
      render(
        <RadonCard
          radon={radon}
          municipality="Madrid"
          floor="02"
        />
      );

      expect(screen.getByTestId('radon-card')).toBeDefined();
      expect(screen.getByText(/Zona I · CTE DB-HS 6/i)).toBeDefined();
      expect(screen.getByText('Planta 02')).toBeDefined();
      expect(screen.getByText('Sin prescripción')).toBeDefined();
      expect(screen.getByText('Despreciable')).toBeDefined();
      expect(screen.getByText(/mitigado por cota de altura/i)).toBeDefined();
    });

    it('renders high risk warning when dwelling is on ground floor in Zona II', () => {
      const radon = evaluateRadonRisk('Zona II', 0, 1);
      render(
        <RadonCard
          radon={radon}
          municipality="Collado Villalba"
          floor="00"
        />
      );

      expect(screen.getByText(/Zona II · CTE DB-HS 6/i)).toBeDefined();
      expect(screen.getByText('Barrera obligatoria')).toBeDefined();
      expect(screen.getByText('Elevado')).toBeDefined();
      expect(screen.getByText(/Inmueble en contacto con el terreno en Zona II/i)).toBeDefined();
    });
  });

  describe('VutSaturationCard Component', () => {
    it('renders critical saturation badge and description when VUT ratio >= 8%', () => {
      const vut = evaluateVutSaturation('2807901001', 1200, 144, 576);
      render(<VutSaturationCard vut={vut} />);

      expect(screen.getByTestId('vut-saturation-card')).toBeDefined();
      expect(screen.getByText('12.0%')).toBeDefined();
      expect(screen.getByText('144 viviendas')).toBeDefined();
      expect(screen.getByText('576 plazas')).toBeDefined();
      expect(screen.getByText('Saturación Crítica')).toBeDefined();
      expect(screen.getByText(/Alerta crítica por saturación de pisos turísticos/i)).toBeDefined();
    });

    it('renders low saturation badge when VUT ratio < 3%', () => {
      const vut = evaluateVutSaturation('2807917001', 1500, 15, 60);
      render(<VutSaturationCard vut={vut} />);

      expect(screen.getByText('1.0%')).toBeDefined();
      expect(screen.getByText('Baja Saturación')).toBeDefined();
    });
  });

  describe('FiscalSimulatorCard Component', () => {
    it('renders fiscal simulator and recalculates ITP when slider price changes', () => {
      const fiscal = calculateFiscalEstimate({
        cadastralReference: mockProperty.cadastralReference,
        provinceCode: '28',
        municipalityName: 'Madrid',
        purchasePriceEur: 300000,
        cadastralSurfaceM2: 85,
      });

      render(<FiscalSimulatorCard property={mockProperty} fiscal={fiscal} />);

      expect(screen.getByTestId('fiscal-simulator-card')).toBeDefined();
      expect(screen.getByText('Comunidad de Madrid')).toBeDefined();
      expect(screen.getByText('6.0%')).toBeDefined();
      expect(screen.getByText('Superficie Computable IBI')).toBeDefined();
      expect(screen.getByText('85 m²')).toBeDefined();

      const slider = screen.getByLabelText(/Precio Estimado de Compraventa/i) || screen.getByRole('slider');
      fireEvent.change(slider, { target: { value: '400000' } });

      expect(screen.getByText('€24.000')).toBeDefined();
    });

    it('displays surface discrepancy alert when deep-linked with advertised m2 > 15%', () => {
      const fiscal = calculateFiscalEstimate({
        cadastralReference: mockProperty.cadastralReference,
        provinceCode: '28',
        municipalityName: 'Madrid',
        purchasePriceEur: 300000,
        cadastralSurfaceM2: 85,
        advertisedSurfaceM2: 115,
      });

      render(<FiscalSimulatorCard property={mockProperty} fiscal={fiscal} />);

      expect(screen.getByTestId('surface-discrepancy-alert')).toBeDefined();
      expect(screen.getByText(/Posible terraza cerrada sin legalizar/i)).toBeDefined();
    });
  });
});
