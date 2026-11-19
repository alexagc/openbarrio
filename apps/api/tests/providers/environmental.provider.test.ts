import { describe, it, expect } from 'vitest';
import { EnvironmentalProvider } from '../../src/providers/environmental.provider.js';
import { MockEnvironmentalProvider } from '../../src/providers/environmental.mock.js';
import { MockSICAProvider } from '../../src/providers/sica.mock.js';
import { MockSNCZIProvider } from '../../src/providers/snczi.mock.js';
import { MockAirQualityProvider } from '../../src/providers/air-quality.provider.js';
import { layerUnavailable } from '@openbarrio/core';

describe('Composite Environmental Provider', () => {
  it('combines SICA noise, SNCZI flood, and air quality data in parallel with LayerResult metadata', async () => {
    const sicaMock = new MockSICAProvider();
    const sncziMock = new MockSNCZIProvider();
    const airMock = new MockAirQualityProvider();
    const provider = new EnvironmentalProvider({
      sica: sicaMock,
      snczi: sncziMock,
      airQuality: airMock,
    });

    const env = await provider.getEnvironmentalData(40.42028, -3.70379);

    expect(env.layers.sica.status).toBe('ok');
    expect(env.data.noise?.dayEveningNightDecibels).toBe(64);
    expect(env.data.noise?.category).toBe('MODERATE');
    expect(env.data.noise?.predominantSource).toBe('ROAD_TRAFFIC');

    expect(env.layers.snczi.status).toBe('ok');
    expect(env.data.floodRisk?.level).toBe('NONE');
    expect(env.data.floodRisk?.returnPeriodYears).toBeNull();
    expect(env.data.floodRisk?.isInPreferentialFlowZone).toBe(false);

    expect(env.layers.airQuality.status).toBe('ok');
    expect(env.data.airQuality?.category).toBe('GOOD');
  });

  it('preserves healthy sub-layers and omits failed ones without fabricating defaults', async () => {
    const sicaMock = new MockSICAProvider();
    sicaMock.setNoiseOverride('40.4203,-3.7038', layerUnavailable('MITECO SICA', 'timeout'));
    const sncziMock = new MockSNCZIProvider();
    const provider = new EnvironmentalProvider({ sica: sicaMock, snczi: sncziMock });

    const env = await provider.getEnvironmentalData(40.42028, -3.70379);

    expect(env.layers.sica.status).toBe('unavailable');
    expect(env.layers.sica.reason).toBe('timeout');
    expect(env.data.noise).toBeUndefined();
    expect(env.layers.snczi.status).toBe('ok');
    expect(env.data.floodRisk?.level).toBe('NONE');
  });

  it('passes censusSectionCode through to sub-providers for pre-calculated resolution', async () => {
    const sicaMock = new MockSICAProvider();
    const sncziMock = new MockSNCZIProvider();
    const provider = new EnvironmentalProvider({
      sica: sicaMock,
      snczi: sncziMock,
    });

    const env = await provider.getEnvironmentalData(39.42, -0.41, '4625001001');

    expect(env.data.floodRisk?.level).toBe('HIGH');
    expect(env.data.floodRisk?.returnPeriodYears).toBe(10);
    expect(env.data.floodRisk?.isInPreferentialFlowZone).toBe(true);
  });

  it('works seamlessly with MockEnvironmentalProvider', async () => {
    const mock = new MockEnvironmentalProvider();
    const env = await mock.getEnvironmentalData(40.395, -3.705);

    expect(env.data.floodRisk?.level).toBe('HIGH');
    expect(env.data.floodRisk?.returnPeriodYears).toBe(10);
    expect(env.data.floodRisk?.isInPreferentialFlowZone).toBe(true);
  });
});
