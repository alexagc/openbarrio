import { EnvironmentalData } from '@openbarrio/core';
import { IEnvironmentalProvider } from './types.js';

export class MockEnvironmentalProvider implements IEnvironmentalProvider {
  async getEnvironmentalData(latitude: number, longitude: number): Promise<EnvironmentalData> {
    // Generate realistic acoustic and flood figures
    // If coordinates are in downtown Madrid / Barcelona Gran Vía, moderate urban soundscape
    const isMajorAvenue = Math.abs(latitude - 40.420) < 0.005 || Math.abs(latitude - 41.391) < 0.005;

    const noiseDecibels = isMajorAvenue ? 64 : 53;
    const noiseCategory = isMajorAvenue ? 'MODERATE' : 'QUIET';

    return {
      noise: {
        dayEveningNightDecibels: noiseDecibels,
        category: noiseCategory,
        predominantSource: 'ROAD_TRAFFIC',
      },
      floodRisk: {
        level: 'NONE',
        returnPeriodYears: null,
        isInPreferentialFlowZone: false,
      },
    };
  }
}
