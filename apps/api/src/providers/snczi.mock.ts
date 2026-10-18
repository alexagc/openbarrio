import { FloodRiskData } from '@openbarrio/core';
import { ISNCZIProvider } from './types.js';

export class MockSNCZIProvider implements ISNCZIProvider {
  private customOverrides: Map<string, FloodRiskData> = new Map();

  async getFloodRiskData(latitude: number, longitude: number): Promise<FloodRiskData> {
    const key = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
    if (this.customOverrides.has(key)) {
      return this.customOverrides.get(key)!;
    }

    // High flood hazard simulation: Direct riverbed/floodplain (e.g. Manzanares riverbank lat ~ 40.395, lon ~ -3.705)
    if (Math.abs(latitude - 40.395) < 0.003 && Math.abs(longitude - (-3.705)) < 0.003) {
      return {
        level: 'HIGH',
        returnPeriodYears: 10,
        isInPreferentialFlowZone: true,
      };
    }

    // Medium flood hazard simulation: T=100 safety margin
    if (Math.abs(latitude - 37.388) < 0.003 && Math.abs(longitude - (-5.995)) < 0.003) {
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

  setFloodRiskOverride(latitude: number, longitude: number, data: FloodRiskData): void {
    const key = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
    this.customOverrides.set(key, data);
  }
}
