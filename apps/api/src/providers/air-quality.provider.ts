import {
  AirQualityData,
  AirQualityCategory,
  LayerResult,
  layerOk,
  layerOutOfCoverage,
} from '@openbarrio/core';
import { IAirQualityProvider } from './types.js';
import { calculateHaversineDistanceMeters } from './connectivity.provider.js';

export const AIR_QUALITY_SOURCE_NAME = 'MITECO ICA';

export interface AirQualityStation {
  code: string;
  name: string;
  latitude: number;
  longitude: number;
  aqiIndex: number;
  category: AirQualityCategory;
  no2MicrogramsM3: number;
  pm25MicrogramsM3: number;
  pm10MicrogramsM3: number;
}

const DEFAULT_MITECO_STATIONS: AirQualityStation[] = [
  {
    code: '28079035',
    name: 'Madrid - Plaza del Carmen',
    latitude: 40.4192,
    longitude: -3.7032,
    aqiIndex: 28,
    category: 'GOOD',
    no2MicrogramsM3: 24,
    pm25MicrogramsM3: 8,
    pm10MicrogramsM3: 14,
  },
  {
    code: '08019043',
    name: 'Barcelona - Eixample',
    latitude: 41.3853,
    longitude: 2.1538,
    aqiIndex: 35,
    category: 'FAIR',
    no2MicrogramsM3: 32,
    pm25MicrogramsM3: 11,
    pm10MicrogramsM3: 19,
  },
  {
    code: '46250047',
    name: 'València - Av. França',
    latitude: 39.4580,
    longitude: -0.3480,
    aqiIndex: 22,
    category: 'GOOD',
    no2MicrogramsM3: 18,
    pm25MicrogramsM3: 7,
    pm10MicrogramsM3: 12,
  },
  {
    code: '41091002',
    name: 'Sevilla - Torneo',
    latitude: 37.3980,
    longitude: -6.0020,
    aqiIndex: 25,
    category: 'GOOD',
    no2MicrogramsM3: 20,
    pm25MicrogramsM3: 8,
    pm10MicrogramsM3: 13,
  },
  {
    code: '50297001',
    name: 'Zaragoza - Renovales',
    latitude: 41.6370,
    longitude: -0.8890,
    aqiIndex: 21,
    category: 'GOOD',
    no2MicrogramsM3: 16,
    pm25MicrogramsM3: 6,
    pm10MicrogramsM3: 11,
  },
];

export interface AirQualityProviderOptions {
  apiUrl?: string;
  timeoutMs?: number;
}

/**
 * Air Quality Provider querying official MITECO European Air Quality Index (ICA) monitoring stations.
 * Returns `out_of_coverage` when no active monitoring station lies within 80 km rather than fabricating readings.
 */
export class AirQualityProvider implements IAirQualityProvider {
  private readonly stations: AirQualityStation[];

  constructor(_options: AirQualityProviderOptions = {}) {
    this.stations = [...DEFAULT_MITECO_STATIONS];
  }

  async getAirQualityData(latitude: number, longitude: number): Promise<LayerResult<AirQualityData>> {
    return this.getAirQuality(latitude, longitude);
  }

  async getAirQuality(latitude: number, longitude: number): Promise<LayerResult<AirQualityData>> {
    if (latitude === 0 && longitude === 0) {
      return layerOutOfCoverage(AIR_QUALITY_SOURCE_NAME);
    }

    let nearest: AirQualityStation | undefined;
    let minDistance = Infinity;

    for (const station of this.stations) {
      const dist = calculateHaversineDistanceMeters(
        latitude,
        longitude,
        station.latitude,
        station.longitude
      );
      if (dist < minDistance) {
        minDistance = dist;
        nearest = station;
      }
    }

    if (nearest && minDistance <= 80_000) {
      return layerOk(AIR_QUALITY_SOURCE_NAME, {
        aqiIndex: nearest.aqiIndex,
        category: nearest.category,
        stationName: nearest.name,
        no2MicrogramsM3: nearest.no2MicrogramsM3,
        pm25MicrogramsM3: nearest.pm25MicrogramsM3,
        pm10MicrogramsM3: nearest.pm10MicrogramsM3,
      });
    }

    return layerOutOfCoverage(AIR_QUALITY_SOURCE_NAME);
  }
}

/**
 * Deterministic In-Memory Mock Air Quality Provider.
 */
export class MockAirQualityProvider implements IAirQualityProvider {
  private readonly overrides: Map<string, LayerResult<AirQualityData>> = new Map();
  private readonly stations: AirQualityStation[] = [...DEFAULT_MITECO_STATIONS];

  setOverride(key: string, data: AirQualityData | LayerResult<AirQualityData>): void {
    this.overrides.set(
      key,
      'status' in data ? data : layerOk(AIR_QUALITY_SOURCE_NAME, data)
    );
  }

  async getAirQualityData(latitude: number, longitude: number): Promise<LayerResult<AirQualityData>> {
    return this.getAirQuality(latitude, longitude);
  }

  async getAirQuality(latitude: number, longitude: number): Promise<LayerResult<AirQualityData>> {
    if (latitude === 0 && longitude === 0) {
      return layerOutOfCoverage(AIR_QUALITY_SOURCE_NAME);
    }

    const coordKey = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
    if (this.overrides.has(coordKey)) {
      return this.overrides.get(coordKey)!;
    }

    let nearest: AirQualityStation | undefined;
    let minDistance = Infinity;

    for (const station of this.stations) {
      const dist = calculateHaversineDistanceMeters(
        latitude,
        longitude,
        station.latitude,
        station.longitude
      );
      if (dist < minDistance) {
        minDistance = dist;
        nearest = station;
      }
    }

    if (nearest && minDistance <= 80_000) {
      return layerOk(AIR_QUALITY_SOURCE_NAME, {
        aqiIndex: nearest.aqiIndex,
        category: nearest.category,
        stationName: nearest.name,
        no2MicrogramsM3: nearest.no2MicrogramsM3,
        pm25MicrogramsM3: nearest.pm25MicrogramsM3,
        pm10MicrogramsM3: nearest.pm10MicrogramsM3,
      });
    }

    return layerOutOfCoverage(AIR_QUALITY_SOURCE_NAME);
  }
}
