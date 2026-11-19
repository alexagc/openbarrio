import {
  AirQualityData,
  EnvironmentalData,
  FloodRiskData,
  NoiseData,
  isLayerUsable,
  layerOutOfCoverage,
  layerUnavailable,
} from '@openbarrio/core';
import {
  EnvironmentalAggregateResult,
  IAirQualityProvider,
  IEnvironmentalProvider,
  ISICAProvider,
  ISNCZIProvider,
} from './types.js';
import { SICAProvider, SICA_SOURCE_NAME } from './sica.provider.js';
import { SNCZIProvider, SNCZI_SOURCE_NAME } from './snczi.provider.js';
import { AIR_QUALITY_SOURCE_NAME } from './air-quality.provider.js';

export async function aggregateEnvironmentalLayers(
  sica: ISICAProvider,
  snczi: ISNCZIProvider,
  airQuality: IAirQualityProvider | undefined,
  latitude: number,
  longitude: number,
  censusSectionCode?: string,
  waitUntil?: (promise: Promise<unknown>) => void
): Promise<EnvironmentalAggregateResult> {
  const [sicaResult, sncziResult, airQualityResult] = await Promise.all([
    sica
      .getNoiseData(latitude, longitude, censusSectionCode, waitUntil)
      .catch(() => layerUnavailable<NoiseData>(SICA_SOURCE_NAME, 'upstream_error')),
    snczi
      .getFloodRiskData(latitude, longitude, censusSectionCode, waitUntil)
      .catch(() => layerUnavailable<FloodRiskData>(SNCZI_SOURCE_NAME, 'upstream_error')),
    airQuality
      ? airQuality
          .getAirQualityData(latitude, longitude)
          .catch(() => layerUnavailable<AirQualityData>(AIR_QUALITY_SOURCE_NAME, 'upstream_error'))
      : Promise.resolve(layerOutOfCoverage<AirQualityData>(AIR_QUALITY_SOURCE_NAME)),
  ]);

  const data: EnvironmentalData = {};
  if (isLayerUsable(sicaResult.status) && sicaResult.data) {
    data.noise = sicaResult.data;
  }
  if (isLayerUsable(sncziResult.status) && sncziResult.data) {
    data.floodRisk = sncziResult.data;
  }
  if (isLayerUsable(airQualityResult.status) && airQualityResult.data) {
    data.airQuality = airQualityResult.data;
  }

  return {
    data,
    layers: {
      sica: sicaResult,
      snczi: sncziResult,
      airQuality: airQualityResult,
    },
  };
}

/**
 * Composite Environmental Provider aggregating MITECO SICA (noise), MITECO SNCZI (flood hazard),
 * and MITECO ICA (air quality) with explicit per-layer status metadata.
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
    censusSectionCode?: string,
    waitUntil?: (promise: Promise<unknown>) => void
  ): Promise<EnvironmentalAggregateResult> {
    return aggregateEnvironmentalLayers(
      this.sica,
      this.snczi,
      this.airQuality,
      latitude,
      longitude,
      censusSectionCode,
      waitUntil
    );
  }
}
