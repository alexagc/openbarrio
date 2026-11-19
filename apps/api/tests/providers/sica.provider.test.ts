import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { SICAProvider } from '../../src/providers/sica.provider.js';
import { MockSICAProvider } from '../../src/providers/sica.mock.js';

describe('MITECO SICA Provider', () => {
  const fixturePath = resolve(__dirname, '../fixtures/sica-noise.json');
  const fixtureJson = readFileSync(fixturePath, 'utf-8');

  it('parses SICA WMS JSON response correctly into LayerResult<NoiseData>', () => {
    const provider = new SICAProvider();
    const res = provider.parseSicaResponse(fixtureJson);

    expect(res.status).toBe('ok');
    expect(res.sourceName).toBe('MITECO SICA');
    expect(res.data?.dayEveningNightDecibels).toBe(64.2);
    expect(res.data?.category).toBe('MODERATE');
    expect(res.data?.predominantSource).toBe('ROAD_TRAFFIC');
  });

  it('returns out_of_coverage (NEVER 52 dB/QUIET) when response has empty features array', () => {
    const provider = new SICAProvider();
    const emptyResponse = JSON.stringify({ type: 'FeatureCollection', features: [] });
    const res = provider.parseSicaResponse(emptyResponse);

    expect(res.status).toBe('out_of_coverage');
    expect(res.reason).toBe('no_coverage');
    expect(res.data).toBeUndefined();
  });

  it('returns unavailable invalid_payload (NEVER 55 dB) on malformed/garbage/missing Lden responses', () => {
    const provider = new SICAProvider();

    const htmlErr = provider.parseSicaResponse('<html><body>502 Bad Gateway</body></html>');
    expect(htmlErr.status).toBe('unavailable');
    expect(htmlErr.reason).toBe('invalid_payload');
    expect(htmlErr.data).toBeUndefined();

    const missingLden = provider.parseSicaResponse(
      JSON.stringify({ type: 'FeatureCollection', features: [{ properties: { foo: 'bar' } }] })
    );
    expect(missingLden.status).toBe('unavailable');
    expect(missingLden.reason).toBe('invalid_payload');
    expect(missingLden.data).toBeUndefined();
  });

  describe('SICAProvider D1 Hierarchical Resolution (Subphase 17C)', () => {
    it('resolves acoustic noise from Cloudflare D1 by census section (cusec)', async () => {
      const mockDb: any = {
        prepare: (query: string) => ({
          bind: (param: string) => ({
            first: async () => {
              if (query.includes('WHERE cusec = ?') && param === '2807901001') {
                return {
                  day_evening_night_decibels: 68.5,
                  category: 'NOISY',
                  predominant_source: 'ROAD_TRAFFIC',
                };
              }
              return null;
            },
          }),
        }),
      };

      const provider = new SICAProvider({ db: mockDb });
      const res = await provider.getNoiseData(40.42, -3.70, '2807901001');

      expect(res.status).toBe('ok');
      expect(res.data?.dayEveningNightDecibels).toBe(68.5);
      expect(res.data?.category).toBe('NOISY');
      expect(res.data?.predominantSource).toBe('ROAD_TRAFFIC');
    });

    it('falls back to D1 municipal aggregate when census tract has no specific record', async () => {
      const mockDb: any = {
        prepare: (query: string) => ({
          bind: (param: string) => ({
            first: async () => {
              if (query.includes('WHERE cusec = ?')) return null;
              if (query.includes('WHERE municipality_code = ? AND cusec IS NULL') && param === '28079') {
                return {
                  day_evening_night_decibels: 58.0,
                  category: 'MODERATE',
                  predominant_source: 'ROAD_TRAFFIC',
                };
              }
              return null;
            },
          }),
        }),
      };

      const provider = new SICAProvider({ db: mockDb });
      const res = await provider.getNoiseData(40.45, -3.68, '2807999999');

      expect(res.status).toBe('ok');
      expect(res.data?.dayEveningNightDecibels).toBe(58.0);
      expect(res.data?.category).toBe('MODERATE');
      expect(res.data?.predominantSource).toBe('ROAD_TRAFFIC');
    });
  });

  describe('MockSICAProvider', () => {
    const mock = new MockSICAProvider();

    it('returns moderate road traffic noise for major avenues', async () => {
      const res = await mock.getNoiseData(40.42028, -3.70379);

      expect(res.status).toBe('ok');
      expect(res.data?.category).toBe('MODERATE');
      expect(res.data?.dayEveningNightDecibels).toBe(64);
      expect(res.data?.predominantSource).toBe('ROAD_TRAFFIC');
    });

    it('returns noisy airport soundscape near Barajas Airport', async () => {
      const res = await mock.getNoiseData(40.4900, -3.5700);

      expect(res.status).toBe('ok');
      expect(res.data?.category).toBe('NOISY');
      expect(res.data?.dayEveningNightDecibels).toBe(73);
      expect(res.data?.predominantSource).toBe('AIRPORT');
    });

    it('returns quiet baseline for residential locations in mock mode', async () => {
      const res = await mock.getNoiseData(40.4500, -3.6800);

      expect(res.status).toBe('ok');
      expect(res.data?.category).toBe('QUIET');
      expect(res.data?.dayEveningNightDecibels).toBe(49);
      expect(res.data?.predominantSource).toBe('NONE');
    });

    it('returns airport noise when queried with Prat airport censusSectionCode', async () => {
      const res = await mock.getNoiseData(41.30, 2.08, '0816901001');

      expect(res.status).toBe('ok');
      expect(res.data?.category).toBe('NOISY');
      expect(res.data?.predominantSource).toBe('AIRPORT');
    });
  });
});
