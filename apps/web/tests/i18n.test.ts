import { describe, it, expect } from 'vitest';
import { es, en, ca, gl, eu, SUPPORTED_LANGUAGES } from '../src/i18n';

describe('i18n Architecture & Dictionaries', () => {
  it('should define supported languages with labels and short codes', () => {
    expect(SUPPORTED_LANGUAGES).toHaveLength(5);
    expect(SUPPORTED_LANGUAGES.map((l) => l.code)).toEqual(['es', 'en', 'ca', 'gl', 'eu']);
    expect(SUPPORTED_LANGUAGES.map((l) => l.shortLabel)).toEqual(['ES', 'EN', 'CA', 'GL', 'EU']);
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

  it('should have 100% key parity across all 5 languages (es, en, ca, gl, eu)', () => {
    const esKeys = getKeys(es).sort();
    expect(getKeys(en).sort()).toEqual(esKeys);
    expect(getKeys(ca).sort()).toEqual(esKeys);
    expect(getKeys(gl).sort()).toEqual(esKeys);
    expect(getKeys(eu).sort()).toEqual(esKeys);
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
    checkNoEmpty(gl, 'gl');
    checkNoEmpty(eu, 'eu');
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
