import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  parseLocalizedRoute,
  getLocalizedPath,
  getHreflangAlternates,
} from '../src/utils/seo-routes';

describe('Multilingual SEO & Localized Routing Architecture', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('parseLocalizedRoute', () => {
    it('resolves Spanish default tool routes', () => {
      const res = parseLocalizedRoute('/comprobar-metros-catastro');
      expect(res.viewMode).toBe('tool-surface');
      expect(res.lang).toBe('es');
    });

    it('resolves English localized tool routes and sets lang to en', () => {
      const res = parseLocalizedRoute('/check-cadastral-surface');
      expect(res.viewMode).toBe('tool-surface');
      expect(res.lang).toBe('en');
    });

    it('resolves Catalan localized tool routes and sets lang to ca', () => {
      const res = parseLocalizedRoute('/comprovar-metres-cadastre');
      expect(res.viewMode).toBe('tool-surface');
      expect(res.lang).toBe('ca');
    });

    it('resolves Legal Rent Calculator across languages', () => {
      expect(parseLocalizedRoute('/calculadora-alquiler-legal').lang).toBe('es');
      expect(parseLocalizedRoute('/legal-rent-calculator').lang).toBe('en');
      expect(parseLocalizedRoute('/calculadora-lloguer-legal').lang).toBe('ca');
    });

    it('resolves Municipalities Directory across languages', () => {
      expect(parseLocalizedRoute('/municipios').lang).toBe('es');
      expect(parseLocalizedRoute('/municipalities').lang).toBe('en');
      expect(parseLocalizedRoute('/municipis').lang).toBe('ca');
    });

    it('resolves Municipality single view and extracts slug', () => {
      const es = parseLocalizedRoute('/municipio/valencia');
      expect(es.viewMode).toBe('municipality');
      expect(es.lang).toBe('es');
      expect(es.slug).toBe('valencia');

      const en = parseLocalizedRoute('/municipality/valencia');
      expect(en.viewMode).toBe('municipality');
      expect(en.lang).toBe('en');
      expect(en.slug).toBe('valencia');

      const ca = parseLocalizedRoute('/municipi/valencia');
      expect(ca.viewMode).toBe('municipality');
      expect(ca.lang).toBe('ca');
      expect(ca.slug).toBe('valencia');
    });

    it('resolves language prefix routing (/en/..., /ca/...)', () => {
      const enPrefix = parseLocalizedRoute('/en/comprobar-metros-catastro');
      expect(enPrefix.viewMode).toBe('tool-surface');
      expect(enPrefix.lang).toBe('en');

      const caPrefix = parseLocalizedRoute('/ca/fuentes-oficiales');
      expect(caPrefix.viewMode).toBe('transparency');
      expect(caPrefix.lang).toBe('ca');
    });
  });

  describe('getLocalizedPath', () => {
    it('generates accurate paths per language', () => {
      expect(getLocalizedPath('tool-surface', 'es')).toBe('/comprobar-metros-catastro');
      expect(getLocalizedPath('tool-surface', 'en')).toBe('/check-cadastral-surface');
      expect(getLocalizedPath('tool-surface', 'ca')).toBe('/comprovar-metres-cadastre');

      expect(getLocalizedPath('municipality', 'es', { slug: 'barcelona' })).toBe('/municipio/barcelona');
      expect(getLocalizedPath('municipality', 'en', { slug: 'barcelona' })).toBe('/municipality/barcelona');
      expect(getLocalizedPath('municipality', 'ca', { slug: 'barcelona' })).toBe('/municipi/barcelona');
    });

    it('appends embed parameter when requested', () => {
      expect(getLocalizedPath('tool-rent', 'en', { isEmbed: true })).toBe(
        '/legal-rent-calculator?embed=true'
      );
    });
  });

  describe('getHreflangAlternates', () => {
    it('generates canonical matrix with es, en, ca, gl, eu and x-default', () => {
      const alts = getHreflangAlternates('tool-surface');
      expect(alts).toHaveLength(6);

      const esAlt = alts.find((a) => a.lang === 'es');
      const enAlt = alts.find((a) => a.lang === 'en');
      const caAlt = alts.find((a) => a.lang === 'ca');
      const glAlt = alts.find((a) => a.lang === 'gl');
      const euAlt = alts.find((a) => a.lang === 'eu');
      const xDefault = alts.find((a) => a.lang === 'x-default');

      expect(esAlt?.url).toBe('https://openbarrio.org/comprobar-metros-catastro');
      expect(enAlt?.url).toBe('https://openbarrio.org/check-cadastral-surface');
      expect(caAlt?.url).toBe('https://openbarrio.org/comprovar-metres-cadastre');
      expect(glAlt?.url).toBe('https://openbarrio.org/comprobar-metros-catastro');
      expect(euAlt?.url).toBe('https://openbarrio.org/katastroko-metroak-egiaztatu');
      expect(xDefault?.url).toBe('https://openbarrio.org/comprobar-metros-catastro');
    });
  });
});
