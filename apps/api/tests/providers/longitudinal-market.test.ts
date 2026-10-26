import { describe, it, expect } from 'vitest';
import { LongitudinalMarketProvider } from '../../src/providers/longitudinal-market.provider.js';
import { CadastralProperty } from '@openbarrio/core';

describe('LongitudinalMarketProvider', () => {
  const provider = new LongitudinalMarketProvider();

  const mockProperty: CadastralProperty = {
    cadastralReference: '9872023VH5797S0001WX',
    address: {
      street: 'Gran Vía',
      number: '28',
      postalCode: '28013',
      municipality: 'Madrid',
      province: 'Madrid',
    },
    coordinates: {
      latitude: 40.42028,
      longitude: -3.70379,
      srs: 'EPSG:4326',
    },
    building: {
      constructionYear: 1924,
      builtSurfaceM2: 120,
      primaryUse: 'Residencial',
      unitsCount: 16,
      hasCommercialGroundFloor: true,
    },
  };

  it('generates multi-year time series for property and census section', async () => {
    const trends = await provider.getMarketTrends(mockProperty, '2807901001');

    expect(trends.censusSectionId).toBe('2807901001');
    expect(trends.provinceName).toBe('Madrid');
    expect(trends.autonomousCommunity).toBe('Comunidad de Madrid');
    expect(trends.timeSeries.length).toBeGreaterThanOrEqual(5);

    // Verify time series data points have period and indices
    const point = trends.timeSeries[0];
    expect(point.period).toBeDefined();
    expect(point.housingPriceIndex).toBeGreaterThan(100);
    expect(point.householdIncome).toBeGreaterThan(20000);

    // Verify summary growth metrics
    expect(trends.summary.fiveYearIncomeGrowthPct).toBeGreaterThan(0);
    expect(trends.summary.fiveYearPriceIndexGrowthPct).toBeGreaterThan(0);
    expect(['high', 'moderate', 'stable', 'cooling']).toContain(trends.summary.gentrificationIndicator);
  });
});
