import { EnvironmentalData } from '@openbarrio/core';
import { IEnvironmentalProvider, ISICAProvider, ISNCZIProvider, IAirQualityProvider } from './types.js';
import { SICAProvider } from './sica.provider.js';
import { SNCZIProvider } from './snczi.provider.js';

/**
 * Composite Environmental Provider aggregating MITECO SICA (noise), MITECO SNCZI (flood hazard),
 * and MITECO ICA (air quality).
 */
export class EnvironmentalProvider implements IEnvironmentalProvider {
  readonly sica: ISICAProvider;
  readonly snczi: ISNCZIProvider;
  readonly airQuality?: IAirQualityProvider;

  constructor(options?: {
    sica?: ISICAProvider;
    snczi?: ISNCZIProvider;
    airQuality?: IAirQualityProvider;
  }) {
    this.sica = options?.sica || new SICAProvider();
    this.snczi = options?.snczi || new SNCZIProvider();
    this.airQuality = options?.airQuality;
  }

  async getEnvironmentalData(
    latitude: number,
    longitude: number,
    censusSectionCode?: string
  ): Promise<EnvironmentalData> {
    const [noise, floodRisk, airQuality] = await Promise.all([
      this.sica.getNoiseData(latitude, longitude, censusSectionCode),
      this.snczi.getFloodRiskData(latitude, longitude, censusSectionCode),
      this.airQuality
        ? this.airQuality.getAirQualityData(latitude, longitude).catch(() => undefined)
        : Promise.resolve(undefined),
    ]);

    return {
      noise,
      floodRisk,
      ...(airQuality ? { airQuality } : {}),
    };
  }
}
