import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { SICAProvider } from '../../src/providers/sica.provider.js';
import { MockSICAProvider } from '../../src/providers/sica.mock.js';

describe('MITECO SICA Provider', () => {
  const fixturePath = resolve(__dirname, '../fixtures/sica-noise.json');
  const fixtureJson = readFileSync(fixturePath, 'utf-8');

  it('parses SICA WMS JSON response correctly into NoiseData', () => {
    const provider = new SICAProvider();
    const noise = provider.parseSicaResponse(fixtureJson);

    expect(noise.dayEveningNightDecibels).toBe(64.2);
    expect(noise.category).toBe('MODERATE');
    expect(noise.predominantSource).toBe('ROAD_TRAFFIC');
  });

  it('falls back to quiet baseline when response has no features', () => {
    const provider = new SICAProvider();
    const emptyResponse = JSON.stringify({ type: 'FeatureCollection', features: [] });
    const noise = provider.parseSicaResponse(emptyResponse);

    expect(noise.dayEveningNightDecibels).toBe(52);
    expect(noise.category).toBe('QUIET');
    expect(noise.predominantSource).toBe('NONE');
  });

  describe('MockSICAProvider', () => {
    const mock = new MockSICAProvider();

    it('returns moderate road traffic noise for major avenues', async () => {
      // Madrid Gran Vía (40.420, -3.703)
      const noise = await mock.getNoiseData(40.42028, -3.70379);

      expect(noise.category).toBe('MODERATE');
      expect(noise.dayEveningNightDecibels).toBe(64);
      expect(noise.predominantSource).toBe('ROAD_TRAFFIC');
    });

    it('returns noisy airport soundscape near Barajas Airport', async () => {
      const noise = await mock.getNoiseData(40.4900, -3.5700);

      expect(noise.category).toBe('NOISY');
      expect(noise.dayEveningNightDecibels).toBe(73);
      expect(noise.predominantSource).toBe('AIRPORT');
    });

    it('returns quiet baseline for residential locations', async () => {
      const noise = await mock.getNoiseData(40.4500, -3.6800);

      expect(noise.category).toBe('QUIET');
      expect(noise.dayEveningNightDecibels).toBe(49);
      expect(noise.predominantSource).toBe('NONE');
    });
  });
});
