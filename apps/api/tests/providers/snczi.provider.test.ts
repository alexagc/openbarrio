import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { SNCZIProvider } from '../../src/providers/snczi.provider.js';
import { MockSNCZIProvider } from '../../src/providers/snczi.mock.js';

describe('MITECO SNCZI Provider', () => {
  const fixturePath = resolve(__dirname, '../fixtures/snczi-flood.json');
  const fixtureJson = readFileSync(fixturePath, 'utf-8');

  it('parses SNCZI WMS JSON response correctly into LayerResult<FloodRiskData>', () => {
    const provider = new SNCZIProvider();
    const res = provider.parseSncziResponse(fixtureJson);

    expect(res.status).toBe('ok');
    expect(res.sourceName).toBe('MITECO SNCZI');
    expect(res.data?.level).toBe('MEDIUM');
    expect(res.data?.returnPeriodYears).toBe(100);
    expect(res.data?.isInPreferentialFlowZone).toBe(true);
  });

  it('returns NONE for valid empty mainland GeoJSON FeatureCollection', () => {
    const provider = new SNCZIProvider();
    const emptyResponse = JSON.stringify({ type: 'FeatureCollection', features: [] });
    const res = provider.parseSncziResponse(emptyResponse);

    expect(res.status).toBe('ok');
    expect(res.data?.level).toBe('NONE');
    expect(res.data?.returnPeriodYears).toBeNull();
    expect(res.data?.isInPreferentialFlowZone).toBe(false);
  });

  it('returns unavailable invalid_payload (NEVER NONE) for garbage, HTML, empty, or ServiceExceptionReport', () => {
    const provider = new SNCZIProvider();

    for (const payload of [
      '',
      '<html><body>Error</body></html>',
      '<ServiceExceptionReport><ServiceException>Fail</ServiceException></ServiceExceptionReport>',
      '{"error":"bad"}',
      'not-json-not-gml',
    ]) {
      const res = provider.parseSncziResponse(payload);
      expect(res.status).toBe('unavailable');
      expect(res.reason).toBe('invalid_payload');
      expect(res.data).toBeUndefined();
    }
  });

  it('returns out_of_coverage (NEVER NONE) for Canary Islands jurisdiction', async () => {
    const provider = new SNCZIProvider();
    const res = await provider.getFloodRiskData(28.1235, -15.4362, '3501601001');

    expect(res.status).toBe('out_of_coverage');
    expect(res.reason).toBe('no_coverage');
    expect(res.data).toBeUndefined();
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
      const res = await provider.getFloodRiskData(39.42, -0.41, '4625001001');

      expect(res.status).toBe('ok');
      expect(res.data?.level).toBe('HIGH');
      expect(res.data?.returnPeriodYears).toBe(10);
      expect(res.data?.isInPreferentialFlowZone).toBe(true);
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
      const res = await provider.getFloodRiskData(37.98, -1.13, '3000199999');

      expect(res.status).toBe('ok');
      expect(res.data?.level).toBe('LOW');
      expect(res.data?.returnPeriodYears).toBe(500);
      expect(res.data?.isInPreferentialFlowZone).toBe(false);
    });
  });

  describe('MockSNCZIProvider', () => {
    const mock = new MockSNCZIProvider();

    it('returns high flood hazard and preferential flow zone for riverbed coordinates', async () => {
      const res = await mock.getFloodRiskData(40.395, -3.705);

      expect(res.status).toBe('ok');
      expect(res.data?.level).toBe('HIGH');
      expect(res.data?.returnPeriodYears).toBe(10);
      expect(res.data?.isInPreferentialFlowZone).toBe(true);
    });

    it('returns NONE flood risk for safe elevated urban coordinates', async () => {
      const res = await mock.getFloodRiskData(40.42028, -3.70379);

      expect(res.status).toBe('ok');
      expect(res.data?.level).toBe('NONE');
      expect(res.data?.returnPeriodYears).toBeNull();
      expect(res.data?.isInPreferentialFlowZone).toBe(false);
    });

    it('returns high flood hazard when querying with high-risk censusSectionCode', async () => {
      const res = await mock.getFloodRiskData(39.42, -0.41, '4625001001');

      expect(res.status).toBe('ok');
      expect(res.data?.level).toBe('HIGH');
      expect(res.data?.isInPreferentialFlowZone).toBe(true);
    });
  });
});
