import { describe, it, expect, vi } from 'vitest';
import {
  getScoreStyle,
  formatNoiseLabel,
  formatFloodRiskLabel,
  buildWebDossierUrl,
} from '../src/shared/utils.js';
import { DEFAULT_CONFIG, PRODUCTION_CONFIG } from '../src/shared/config.js';
import { handleExtensionMessage } from '../src/background.js';

describe('Shared Utilities and Messaging', () => {
  describe('getScoreStyle', () => {
    it('should assign green style for scores >= 70', () => {
      const high = getScoreStyle(85);
      expect(high.level).toBe('green');
      expect(high.score).toBe(85);
      expect(high.color).toBe('#16a34a');
      expect(high.badgeLabel).toBe('Favorable');

      const boundary = getScoreStyle(70);
      expect(boundary.level).toBe('green');
    });

    it('should assign amber style for scores between 50 and 69', () => {
      const medium = getScoreStyle(62);
      expect(medium.level).toBe('amber');
      expect(medium.score).toBe(62);
      expect(medium.color).toBe('#d97706');
      expect(medium.badgeLabel).toBe('Moderado');

      const boundary = getScoreStyle(50);
      expect(boundary.level).toBe('amber');
    });

    it('should assign red style for scores < 50', () => {
      const low = getScoreStyle(35);
      expect(low.level).toBe('red');
      expect(low.score).toBe(35);
      expect(low.color).toBe('#dc2626');
      expect(low.badgeLabel).toBe('Atención');
    });

    it('should clamp scores outside 0-100 range', () => {
      expect(getScoreStyle(-10).score).toBe(0);
      expect(getScoreStyle(150).score).toBe(100);
    });
  });

  describe('formatNoiseLabel', () => {
    it('should format decibel level with Spanish category description', () => {
      expect(formatNoiseLabel('QUIET', 48)).toBe('48 dBA · Silencioso');
      expect(formatNoiseLabel('MODERATE', 56.4)).toBe('56 dBA · Moderado');
      expect(formatNoiseLabel('NOISY', 68)).toBe('68 dBA · Ruidoso');
      expect(formatNoiseLabel('VERY_NOISY', 78)).toBe('78 dBA · Muy ruidoso');
    });
  });

  describe('formatFloodRiskLabel', () => {
    it('should return safety level or preferential flow alert', () => {
      expect(formatFloodRiskLabel('NONE', false)).toBe('Sin riesgo');
      expect(formatFloodRiskLabel('LOW', false)).toBe('Riesgo bajo (T=500)');
      expect(formatFloodRiskLabel('MEDIUM', false)).toBe('Riesgo medio (T=100)');
      expect(formatFloodRiskLabel('HIGH', false)).toBe('Riesgo alto (T=10)');
      expect(formatFloodRiskLabel('MEDIUM', true)).toBe('Flujo Preferente (Alerta)');
    });
  });

  describe('buildWebDossierUrl', () => {
    it('should build dossier link using Cadastral Reference when available', () => {
      const url = buildWebDossierUrl('http://localhost:3000/', '9872023VH5797S0001WX');
      expect(url).toBe('http://localhost:3000/audit?refcat=9872023VH5797S0001WX');
    });

    it('should build dossier link using coordinates when refcat is absent', () => {
      const url = buildWebDossierUrl('https://openbarrio.org', undefined, {
        latitude: 40.4168,
        longitude: -3.7038,
      });
      expect(url).toBe('https://openbarrio.org/audit?lat=40.4168&lon=-3.7038');
    });
  });

  describe('Default and Production Configs', () => {
    it('should have correct default URLs', () => {
      expect(DEFAULT_CONFIG.apiUrl).toBe('http://localhost:3001');
      expect(DEFAULT_CONFIG.webUrl).toBe('http://localhost:3000');
      expect(PRODUCTION_CONFIG.apiUrl).toBe('https://openbarrio-api.workers.dev');
      expect(PRODUCTION_CONFIG.webUrl).toBe('https://openbarrio-web.pages.dev');
    });
  });

  describe('handleExtensionMessage', () => {
    it('should handle GET_CONFIG request', async () => {
      const res = await handleExtensionMessage({ type: 'GET_CONFIG' });
      expect(res.success).toBe(true);
      expect(res.data).toEqual(DEFAULT_CONFIG);
    });

    it('should handle SET_CONFIG request and return updated values', async () => {
      const res = await handleExtensionMessage({
        type: 'SET_CONFIG',
        payload: { apiUrl: 'http://custom-api:8080' },
      });
      expect(res.success).toBe(true);
      expect((res.data as any).apiUrl).toBe('http://custom-api:8080');
    });
  });
});
