import { FloodRiskData } from '@openbarrio/core';
import { ISNCZIProvider } from './types.js';

export class MockSNCZIProvider implements ISNCZIProvider {
  private customOverrides: Map<string, FloodRiskData> = new Map();

  async getFloodRiskData(
    latitude: number,
    longitude: number,
    censusSectionCode?: string
  ): Promise<FloodRiskData> {
    const key = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
    if (this.customOverrides.has(key)) {
      return this.customOverrides.get(key)!;
    }
    if (censusSectionCode && this.customOverrides.has(censusSectionCode)) {
      return this.customOverrides.get(censusSectionCode)!;
    }

    // High flood hazard simulation: Direct riverbed/floodplain (e.g. Manzanares riverbank lat ~ 40.395, lon ~ -3.705 or Valencia 46250)
    if (
      (Math.abs(latitude - 40.395) < 0.003 && Math.abs(longitude - (-3.705)) < 0.003) ||
      censusSectionCode?.startsWith('46250')
    ) {
      return {
        level: 'HIGH',
        returnPeriodYears: 10,
        isInPreferentialFlowZone: true,
      };
    }

    // Medium flood hazard simulation: T=100 safety margin
    if (
      (Math.abs(latitude - 37.388) < 0.003 && Math.abs(longitude - (-5.995)) < 0.003) ||
      censusSectionCode?.startsWith('30001')
    ) {
      return {
        level: 'MEDIUM',
        returnPeriodYears: 100,
        isInPreferentialFlowZone: false,
      };
    }

    // Default safe elevated terrain
    return {
      level: 'NONE',
      returnPeriodYears: null,
      isInPreferentialFlowZone: false,
    };
  }

  setFloodRiskOverride(
    latitudeOrCode: number | string,
    longitudeOrData?: number | FloodRiskData,
    data?: FloodRiskData
  ): void {
    if (typeof latitudeOrCode === 'string') {
      this.customOverrides.set(latitudeOrCode, longitudeOrData as FloodRiskData);
    } else {
      const key = `${latitudeOrCode.toFixed(4)},${(longitudeOrData as number).toFixed(4)}`;
      this.customOverrides.set(key, data!);
    }
  }
}
