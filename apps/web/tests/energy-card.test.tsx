import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EnergyPerformanceCard } from '../src/components/dossier/EnergyPerformanceCard';
import { EnergyPerformanceCertificate } from '@openbarrio/core';

describe('EnergyPerformanceCard (Phase 13B)', () => {
  it('renders official regional energy certificate badge and telemetry', () => {
    const officialEnergy: EnergyPerformanceCertificate = {
      ratingEmissions: 'B',
      ratingConsumption: 'C',
      co2Emissions: 14.5,
      primaryEnergyConsumption: 68.2,
      registrationNumber: 'MDR-2023-CEE-09412',
      validUntil: '2033-06-15',
      scope: 'building',
      isEstimated: false,
      annualEstimatedCostEur: 850,
    };

    render(<EnergyPerformanceCard energy={officialEnergy} />);

    expect(screen.getByTestId('energy-performance-card')).toBeDefined();
    expect(screen.getByTestId('cee-official-badge')).toBeDefined();
    expect(screen.getByText('MDR-2023-CEE-09412', { exact: false })).toBeDefined();
    expect(screen.getByText('14.5')).toBeDefined();
    expect(screen.getByText('68.2')).toBeDefined();
  });

  it('renders estimated normative CTE badge when no official CEE exists', () => {
    const estimatedEnergy: EnergyPerformanceCertificate = {
      ratingEmissions: 'E',
      ratingConsumption: 'E',
      co2Emissions: 39.4,
      primaryEnergyConsumption: 192.0,
      scope: 'unit',
      isEstimated: true,
      estimationBasis: 'NBE-CT-79',
      annualEstimatedCostEur: 1100,
    };

    render(<EnergyPerformanceCard energy={estimatedEnergy} />);

    expect(screen.getByTestId('cee-estimated-badge')).toBeDefined();
    expect(screen.getByText('NBE-CT-79', { exact: false })).toBeDefined();
    expect(screen.getByText('Vivienda individual', { exact: false })).toBeDefined();
  });

  it('renders expired certificate warning banner and badge under RD 390/2021', () => {
    const expiredEnergy: EnergyPerformanceCertificate = {
      ratingEmissions: 'G',
      ratingConsumption: 'G',
      co2Emissions: 68.0,
      primaryEnergyConsumption: 310.0,
      registrationNumber: 'MAD-2015-CEE-00124',
      validUntil: '2020-05-10',
      scope: 'unit',
      isEstimated: false,
      isExpired: true,
      dataSource: 'Registro de la Comunidad de Madrid',
      annualEstimatedCostEur: 1800,
    };

    render(<EnergyPerformanceCard energy={expiredEnergy} />);

    expect(screen.getByTestId('cee-expired-badge')).toBeDefined();
    expect(screen.getByTestId('cee-expired-banner')).toBeDefined();
    expect(screen.getByText('Certificado de Eficiencia Energética Caducado (RD 390/2021)')).toBeDefined();
    expect(screen.getByText('MAD-2015-CEE-00124', { exact: false })).toBeDefined();
  });
});
