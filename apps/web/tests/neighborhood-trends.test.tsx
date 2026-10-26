import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NeighborhoodTrendsCard } from '../src/components/dossier/NeighborhoodTrendsCard';
import { NeighborhoodTrends } from '@openbarrio/core';

describe('NeighborhoodTrendsCard (Phase 13C)', () => {
  const mockTrends: NeighborhoodTrends = {
    censusSectionId: '2807901001',
    provinceName: 'Madrid',
    autonomousCommunity: 'Comunidad de Madrid',
    timeSeries: [
      { period: '2018', housingPriceIndex: 116.8, householdIncome: 34500 },
      { period: '2019', housingPriceIndex: 122.8, householdIncome: 36000 },
      { period: '2020', housingPriceIndex: 125.4, householdIncome: 36600 },
      { period: '2021', housingPriceIndex: 133.4, householdIncome: 38600 },
      { period: '2022', housingPriceIndex: 143.3, householdIncome: 41200 },
    ],
    summary: {
      fiveYearIncomeGrowthPct: 19.4,
      fiveYearPriceIndexGrowthPct: 22.7,
      gentrificationIndicator: 'moderate',
    },
  };

  it('renders trends card with SVG sparkline, growth chips, and metric toggles', () => {
    render(<NeighborhoodTrendsCard trends={mockTrends} />);

    expect(screen.getByTestId('neighborhood-trends-card')).toBeDefined();
    expect(screen.getByText('+19.4%')).toBeDefined();
    expect(screen.getByText('+22.7%')).toBeDefined();
    expect(screen.getByText('Crecimiento Sostenido', { exact: false })).toBeDefined();

    // Toggle metric to IPV
    const ipvBtn = screen.getByText('IPV Precios');
    fireEvent.click(ipvBtn);

    // Toggle time window to 3A
    const windowBtn = screen.getByText('3A');
    fireEvent.click(windowBtn);
  });
});
