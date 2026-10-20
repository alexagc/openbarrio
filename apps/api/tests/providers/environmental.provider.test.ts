import { describe, it, expect } from 'vitest';
import { EnvironmentalProvider } from '../../src/providers/environmental.provider.js';
import { MockEnvironmentalProvider } from '../../src/providers/environmental.mock.js';
import { MockSICAProvider } from '../../src/providers/sica.mock.js';
import { MockSNCZIProvider } from '../../src/providers/snczi.mock.js';
import { MockAirQualityProvider } from '../../src/providers/air-quality.provider.js';

describe('Composite Environmental Provider', () => {
  it('combines SICA noise, SNCZI flood, and air quality data in parallel', async () => {
    const sicaMock = new MockSICAProvider();
    const sncziMock = new MockSNCZIProvider();
    const airMock = new MockAirQualityProvider();
    const provider = new EnvironmentalProvider({
      sica: sicaMock,
      snczi: sncziMock,
      airQuality: airMock,
    });

    // Madrid Gran Vía coordinates
    const env = await provider.getEnvironmentalData(40.42028, -3.70379);

    expect(env.noise.dayEveningNightDecibels).toBe(64);
    expect(env.noise.category).toBe('MODERATE');
    expect(env.noise.predominantSource).toBe('ROAD_TRAFFIC');

    expect(env.floodRisk.level).toBe('NONE');
    expect(env.floodRisk.returnPeriodYears).toBeNull();
    expect(env.floodRisk.isInPreferentialFlowZone).toBe(false);

    expect(env.airQuality).toBeDefined();
    expect(env.airQuality?.category).toBe('GOOD');
  });

  it('works seamlessly with MockEnvironmentalProvider', async () => {
    const mock = new MockEnvironmentalProvider();
    const env = await mock.getEnvironmentalData(40.395, -3.705); // riverbank

    expect(env.floodRisk.level).toBe('HIGH');
    expect(env.floodRisk.returnPeriodYears).toBe(10);
    expect(env.floodRisk.isInPreferentialFlowZone).toBe(true);
  });
});
