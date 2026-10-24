import { EnvironmentalData } from '@openbarrio/core';
import { IEnvironmentalProvider, ISICAProvider, ISNCZIProvider, IAirQualityProvider } from './types.js';
import { MockSICAProvider } from './sica.mock.js';
import { MockSNCZIProvider } from './snczi.mock.js';

export class MockEnvironmentalProvider implements IEnvironmentalProvider {
  readonly sica: ISICAProvider;
  readonly snczi: ISNCZIProvider;
  readonly airQuality?: IAirQualityProvider;

  constructor(options?: {
    sica?: ISICAProvider;
    snczi?: ISNCZIProvider;
    airQuality?: IAirQualityProvider;
  }) {
    this.sica = options?.sica || new MockSICAProvider();
    this.snczi = options?.snczi || new MockSNCZIProvider();
    this.airQuality = options?.airQuality;
  }

  async getEnvironmentalData(latitude: number, longitude: number): Promise<EnvironmentalData> {
    const [noise, floodRisk, airQuality] = await Promise.all([
      this.sica.getNoiseData(latitude, longitude),
      this.snczi.getFloodRiskData(latitude, longitude),
      this.airQuality
        ? this.airQuality.getAirQuality(latitude, longitude).catch(() => undefined)
        : Promise.resolve(undefined),
    ]);

    return {
      noise,
      floodRisk,
      ...(airQuality ? { airQuality } : {}),
    };
  }
}
