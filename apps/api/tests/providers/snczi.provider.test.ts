import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { SNCZIProvider } from '../../src/providers/snczi.provider.js';
import { MockSNCZIProvider } from '../../src/providers/snczi.mock.js';

describe('MITECO SNCZI Provider', () => {
  const fixturePath = resolve(__dirname, '../fixtures/snczi-flood.json');
  const fixtureJson = readFileSync(fixturePath, 'utf-8');

  it('parses SNCZI WMS JSON response correctly into FloodRiskData', () => {
    const provider = new SNCZIProvider();
    const flood = provider.parseSncziResponse(fixtureJson);

    expect(flood.level).toBe('MEDIUM');
    expect(flood.returnPeriodYears).toBe(100);
    expect(flood.isInPreferentialFlowZone).toBe(true);
  });

  it('returns NONE for empty flood features', () => {
    const provider = new SNCZIProvider();
    const emptyResponse = JSON.stringify({ type: 'FeatureCollection', features: [] });
    const flood = provider.parseSncziResponse(emptyResponse);

    expect(flood.level).toBe('NONE');
    expect(flood.returnPeriodYears).toBeNull();
    expect(flood.isInPreferentialFlowZone).toBe(false);
  });

  describe('MockSNCZIProvider', () => {
    const mock = new MockSNCZIProvider();

    it('returns high flood hazard and preferential flow zone for riverbed coordinates', async () => {
      // Manzanares riverbank test coordinates
      const flood = await mock.getFloodRiskData(40.395, -3.705);

      expect(flood.level).toBe('HIGH');
      expect(flood.returnPeriodYears).toBe(10);
      expect(flood.isInPreferentialFlowZone).toBe(true);
    });

    it('returns NONE flood risk for safe elevated urban coordinates', async () => {
      // Madrid Gran Vía test coordinates
      const flood = await mock.getFloodRiskData(40.42028, -3.70379);

      expect(flood.level).toBe('NONE');
      expect(flood.returnPeriodYears).toBeNull();
      expect(flood.isInPreferentialFlowZone).toBe(false);
    });
  });
});
