import { NoiseData } from '@openbarrio/core';
import { ISICAProvider } from './types.js';

export class MockSICAProvider implements ISICAProvider {
  private customOverrides: Map<string, NoiseData> = new Map();

  async getNoiseData(latitude: number, longitude: number): Promise<NoiseData> {
    const key = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
    if (this.customOverrides.has(key)) {
      return this.customOverrides.get(key)!;
    }

    // High noise: Near Madrid Barajas Airport (lat ~ 40.49, lon ~ -3.57)
    if (Math.abs(latitude - 40.49) < 0.03 && Math.abs(longitude - (-3.57)) < 0.03) {
      return {
        dayEveningNightDecibels: 73,
        category: 'NOISY',
        predominantSource: 'AIRPORT',
      };
    }

    // High noise: Near Atocha rail junction (lat ~ 40.406, lon ~ -3.690)
    if (Math.abs(latitude - 40.406) < 0.01 && Math.abs(longitude - (-3.690)) < 0.01) {
      return {
        dayEveningNightDecibels: 69,
        category: 'NOISY',
        predominantSource: 'RAILWAY',
      };
    }

    // Moderate noise: Major urban avenue (e.g. Madrid Gran Vía or Barcelona Diagonal)
    const isMajorAvenue =
      Math.abs(latitude - 40.420) < 0.008 || Math.abs(latitude - 41.391) < 0.008;

    if (isMajorAvenue) {
      return {
        dayEveningNightDecibels: 64,
        category: 'MODERATE',
        predominantSource: 'ROAD_TRAFFIC',
      };
    }

    // Default quiet residential neighborhood
    return {
      dayEveningNightDecibels: 49,
      category: 'QUIET',
      predominantSource: 'NONE',
    };
  }

  setNoiseOverride(latitude: number, longitude: number, data: NoiseData): void {
    const key = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
    this.customOverrides.set(key, data);
  }
}
