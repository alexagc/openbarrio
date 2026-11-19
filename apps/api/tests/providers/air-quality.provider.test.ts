import { describe, it, expect } from 'vitest';
import {
  AirQualityProvider,
  MockAirQualityProvider,
} from '../../src/providers/air-quality.provider.js';

describe('Air Quality Provider (MITECO ICA)', () => {
  describe('AirQualityProvider', () => {
    const provider = new AirQualityProvider();

    it('resolves nearest monitoring station for Madrid Gran Vía', async () => {
      const res = await provider.getAirQuality(40.42028, -3.70379);

      expect(res.status).toBe('ok');
      expect(res.data?.stationName).toContain('Madrid');
      expect(res.data?.aqiIndex).toBeGreaterThan(0);
      expect(res.data?.category).toBe('GOOD');
      expect(res.data?.no2MicrogramsM3).toBeGreaterThan(0);
    });

    it('resolves nearest station for Barcelona Eixample', async () => {
      const res = await provider.getAirQuality(41.39167, 2.16472);

      expect(res.status).toBe('ok');
      expect(res.data?.stationName).toContain('Barcelona');
      expect(res.data?.category).toBe('FAIR');
    });

    it('returns out_of_coverage (NEVER fabricated regional hash sensor) when outside station range or (0, 0)', async () => {
      const zero = await provider.getAirQuality(0, 0);
      expect(zero.status).toBe('out_of_coverage');
      expect(zero.data).toBeUndefined();

      const farAway = await provider.getAirQuality(28.12, -15.43);
      expect(farAway.status).toBe('out_of_coverage');
      expect(farAway.data).toBeUndefined();
    });
  });

  describe('MockAirQualityProvider', () => {
    const mock = new MockAirQualityProvider();

    it('returns deterministic air quality data', async () => {
      const res = await mock.getAirQuality(39.4699, -0.3735);
      expect(res.status).toBe('ok');
      expect(res.data?.stationName).toContain('València');
      expect(res.data?.category).toBe('GOOD');
    });

    it('supports custom override by coordinate key', async () => {
      mock.setOverride('40.0000,-3.0000', {
        aqiIndex: 120,
        category: 'POOR',
        stationName: 'Custom Alert Station',
        no2MicrogramsM3: 95,
        pm25MicrogramsM3: 45,
        pm10MicrogramsM3: 75,
      });

      const res = await mock.getAirQuality(40.0, -3.0);
      expect(res.status).toBe('ok');
      expect(res.data?.category).toBe('POOR');
      expect(res.data?.stationName).toBe('Custom Alert Station');
    });
  });
});
