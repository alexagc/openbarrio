import { describe, it, expect } from 'vitest';
import {
  AirQualityProvider,
  MockAirQualityProvider,
} from '../../src/providers/air-quality.provider.js';

describe('Air Quality Provider (MITECO ICA)', () => {
  describe('AirQualityProvider', () => {
    const provider = new AirQualityProvider();

    it('resolves nearest monitoring station for Madrid Gran Vía', async () => {
      const aqi = await provider.getAirQuality(40.42028, -3.70379);

      expect(aqi).toBeDefined();
      expect(aqi?.stationName).toContain('Madrid');
      expect(aqi?.aqiIndex).toBeGreaterThan(0);
      expect(aqi?.category).toBe('GOOD');
      expect(aqi?.no2MicrogramsM3).toBeGreaterThan(0);
    });

    it('resolves nearest station for Barcelona Eixample', async () => {
      const aqi = await provider.getAirQuality(41.39167, 2.16472);

      expect(aqi).toBeDefined();
      expect(aqi?.stationName).toContain('Barcelona');
      expect(aqi?.category).toBe('FAIR');
    });

    it('returns undefined for invalid null coordinates (0, 0)', async () => {
      const aqi = await provider.getAirQuality(0, 0);
      expect(aqi).toBeUndefined();
    });
  });

  describe('MockAirQualityProvider', () => {
    const mock = new MockAirQualityProvider();

    it('returns deterministic air quality data', async () => {
      const aqi = await mock.getAirQuality(39.4699, -0.3735); // Valencia
      expect(aqi).toBeDefined();
      expect(aqi?.stationName).toContain('València');
      expect(aqi?.category).toBe('GOOD');
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

      const aqi = await mock.getAirQuality(40.0, -3.0);
      expect(aqi?.category).toBe('POOR');
      expect(aqi?.stationName).toBe('Custom Alert Station');
    });
  });
});
