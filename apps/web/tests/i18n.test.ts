import { describe, it, expect } from 'vitest';
import { es, en, ca, SUPPORTED_LANGUAGES } from '../src/i18n';

describe('i18n Architecture & Dictionaries', () => {
  it('should define supported languages with labels and short codes', () => {
    expect(SUPPORTED_LANGUAGES).toHaveLength(3);
    expect(SUPPORTED_LANGUAGES.map((l) => l.code)).toEqual(['es', 'en', 'ca']);
    expect(SUPPORTED_LANGUAGES.map((l) => l.shortLabel)).toEqual(['ES', 'EN', 'CA']);
  });

  function getKeys(obj: any, prefix = ''): string[] {
    let keys: string[] = [];
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      const fullPath = prefix ? `${prefix}.${key}` : key;
      if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
        keys = keys.concat(getKeys(val, fullPath));
      } else {
        keys.push(fullPath);
      }
    }
    return keys;
  }

  it('should have 100% key parity between Spanish and English dictionaries', () => {
    const esKeys = getKeys(es).sort();
    const enKeys = getKeys(en).sort();

    expect(enKeys).toEqual(esKeys);
  });

  it('should have 100% key parity between Spanish and Catalan dictionaries', () => {
    const esKeys = getKeys(es).sort();
    const caKeys = getKeys(ca).sort();

    expect(caKeys).toEqual(esKeys);
  });

  it('should not contain empty translation values in any dictionary', () => {
    const checkNoEmpty = (dict: any, name: string) => {
      const keys = getKeys(dict);
      for (const k of keys) {
        const parts = k.split('.');
        let cur = dict;
        for (const p of parts) cur = cur[p];
        expect(cur, `${name} has empty value at ${k}`).toBeTruthy();
      }
    };

    checkNoEmpty(es, 'es');
    checkNoEmpty(en, 'en');
    checkNoEmpty(ca, 'ca');
  });

  it('should correctly contain expected official public data agencies in all languages', () => {
    expect(es.pillars.catastro.agency).toContain('MINISTERIO DE HACIENDA');
    expect(en.pillars.catastro.agency).toContain('MINISTRY OF FINANCE');
    expect(ca.pillars.catastro.agency).toContain('MINISTERI D’HISENDA');

    expect(es.pillars.serpavi.agency).toContain('MINISTERIO DE VIVIENDA');
    expect(en.pillars.serpavi.agency).toContain('MINISTRY OF HOUSING');
    expect(ca.pillars.serpavi.agency).toContain('MINISTERI D’HABITATGE');
  });
});
