import { EnvironmentalData } from '@openbarrio/core';
import { IEnvironmentalProvider, ISICAProvider, ISNCZIProvider } from './types.js';
import { MockSICAProvider } from './sica.mock.js';
import { MockSNCZIProvider } from './snczi.mock.js';

export class MockEnvironmentalProvider implements IEnvironmentalProvider {
  private readonly sica: ISICAProvider;
  private readonly snczi: ISNCZIProvider;

  constructor(options?: { sica?: ISICAProvider; snczi?: ISNCZIProvider }) {
    this.sica = options?.sica || new MockSICAProvider();
    this.snczi = options?.snczi || new MockSNCZIProvider();
  }

  async getEnvironmentalData(latitude: number, longitude: number): Promise<EnvironmentalData> {
    const [noise, floodRisk] = await Promise.all([
      this.sica.getNoiseData(latitude, longitude),
      this.snczi.getFloodRiskData(latitude, longitude),
    ]);

    return {
      noise,
      floodRisk,
    };
  }
}
