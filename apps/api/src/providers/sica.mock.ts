import { LayerResult, NoiseData, layerOk } from '@openbarrio/core';
import { ISICAProvider } from './types.js';

export class MockSICAProvider implements ISICAProvider {
  private customOverrides: Map<string, LayerResult<NoiseData>> = new Map();

  async getNoiseData(
    latitude: number,
    longitude: number,
    censusSectionCode?: string
  ): Promise<LayerResult<NoiseData>> {
    const key = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
    if (this.customOverrides.has(key)) {
      return this.customOverrides.get(key)!;
    }
    if (censusSectionCode && this.customOverrides.has(censusSectionCode)) {
      return this.customOverrides.get(censusSectionCode)!;
    }

    // High noise: Near Madrid Barajas Airport (lat ~ 40.49, lon ~ -3.57) or Prat (08169)
    if (
      (Math.abs(latitude - 40.49) < 0.03 && Math.abs(longitude - (-3.57)) < 0.03) ||
      censusSectionCode?.startsWith('08169')
    ) {
      return layerOk('MITECO SICA', {
        dayEveningNightDecibels: 73,
        category: 'NOISY',
        predominantSource: 'AIRPORT',
      });
    }

    // High noise: Near Atocha rail junction (lat ~ 40.406, lon ~ -3.690)
    if (Math.abs(latitude - 40.406) < 0.01 && Math.abs(longitude - (-3.690)) < 0.01) {
      return layerOk('MITECO SICA', {
        dayEveningNightDecibels: 69,
        category: 'NOISY',
        predominantSource: 'RAILWAY',
      });
    }

    // Moderate noise: Major urban avenue (e.g. Madrid Gran Vía or Barcelona Diagonal)
    const isMajorAvenue =
      Math.abs(latitude - 40.420) < 0.008 ||
      Math.abs(latitude - 41.391) < 0.008 ||
      censusSectionCode === '2807901001' ||
      censusSectionCode === '0801901001';

    if (isMajorAvenue) {
      return layerOk('MITECO SICA', {
        dayEveningNightDecibels: 64,
        category: 'MODERATE',
        predominantSource: 'ROAD_TRAFFIC',
      });
    }

    // Default quiet residential neighborhood in mock
    return layerOk('MITECO SICA', {
      dayEveningNightDecibels: 49,
      category: 'QUIET',
      predominantSource: 'NONE',
    });
  }

  setNoiseOverride(
    latitudeOrCode: number | string,
    longitudeOrData?: number | NoiseData | LayerResult<NoiseData>,
    data?: NoiseData | LayerResult<NoiseData>
  ): void {
    const wrap = (val: NoiseData | LayerResult<NoiseData>): LayerResult<NoiseData> =>
      'status' in val ? val : layerOk('MITECO SICA', val);

    if (typeof latitudeOrCode === 'string') {
      this.customOverrides.set(latitudeOrCode, wrap(longitudeOrData as NoiseData | LayerResult<NoiseData>));
    } else {
      const key = `${latitudeOrCode.toFixed(4)},${(longitudeOrData as number).toFixed(4)}`;
      this.customOverrides.set(key, wrap(data!));
    }
  }
}
