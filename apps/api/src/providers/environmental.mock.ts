import {
  EnvironmentalAggregateResult,
  IAirQualityProvider,
  IEnvironmentalProvider,
  ISICAProvider,
  ISNCZIProvider,
} from './types.js';
import { MockSICAProvider } from './sica.mock.js';
import { MockSNCZIProvider } from './snczi.mock.js';
import { aggregateEnvironmentalLayers } from './environmental.provider.js';

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

  async getEnvironmentalData(
    latitude: number,
    longitude: number,
    censusSectionCode?: string
  ): Promise<EnvironmentalAggregateResult> {
    return aggregateEnvironmentalLayers(
      this.sica,
      this.snczi,
      this.airQuality,
      latitude,
      longitude,
      censusSectionCode
    );
  }
}
