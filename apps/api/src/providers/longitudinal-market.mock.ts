import {
  CadastralProperty,
  NeighborhoodTrends,
} from '@openbarrio/core';
import { ILongitudinalMarketProvider } from './types.js';
import { LongitudinalMarketProvider } from './longitudinal-market.provider.js';

export class MockLongitudinalMarketProvider implements ILongitudinalMarketProvider {
  private readonly fallback = new LongitudinalMarketProvider();

  async getMarketTrends(
    property: CadastralProperty,
    censusSectionCode: string,
    currentIncome?: number
  ): Promise<NeighborhoodTrends> {
    return this.fallback.getMarketTrends(property, censusSectionCode, currentIncome);
  }
}
