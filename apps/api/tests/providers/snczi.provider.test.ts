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

  describe('SNCZIProvider D1 Hierarchical Resolution (Subphase 17B)', () => {
    it('resolves flood risk from Cloudflare D1 by census section (cusec)', async () => {
      const mockDb: any = {
        prepare: (query: string) => ({
          bind: (param: string) => ({
            first: async () => {
              if (query.includes('WHERE cusec = ?') && param === '4625001001') {
                return {
                  flood_risk_level: 'HIGH',
                  return_period_years: 10,
                  is_in_preferential_flow_zone: 1,
                };
              }
              return null;
            },
          }),
        }),
      };

      const provider = new SNCZIProvider({ db: mockDb });
      const flood = await provider.getFloodRiskData(39.42, -0.41, '4625001001');

      expect(flood.level).toBe('HIGH');
      expect(flood.returnPeriodYears).toBe(10);
      expect(flood.isInPreferentialFlowZone).toBe(true);
    });

    it('falls back to D1 municipal aggregate when census tract has no specific record', async () => {
      const mockDb: any = {
        prepare: (query: string) => ({
          bind: (param: string) => ({
            first: async () => {
              if (query.includes('WHERE cusec = ?')) return null;
              if (query.includes('WHERE municipality_code = ? AND cusec IS NULL') && param === '30001') {
                return {
                  flood_risk_level: 'LOW',
                  return_period_years: 500,
                  is_in_preferential_flow_zone: 0,
                };
              }
              return null;
            },
          }),
        }),
      };

      const provider = new SNCZIProvider({ db: mockDb });
      const flood = await provider.getFloodRiskData(37.98, -1.13, '3000199999');

      expect(flood.level).toBe('LOW');
      expect(flood.returnPeriodYears).toBe(500);
      expect(flood.isInPreferentialFlowZone).toBe(false);
    });
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

    it('returns high flood hazard when querying with high-risk censusSectionCode', async () => {
      const flood = await mock.getFloodRiskData(39.42, -0.41, '4625001001');

      expect(flood.level).toBe('HIGH');
      expect(flood.isInPreferentialFlowZone).toBe(true);
    });
  });
});
