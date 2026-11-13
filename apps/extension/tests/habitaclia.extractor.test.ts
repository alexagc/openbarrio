import { describe, it, expect } from 'vitest';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { HabitacliaAdapter } from '../src/content/extractors/habitaclia.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('HabitacliaAdapter', () => {
  const adapter = new HabitacliaAdapter();
  const fixturePath = path.resolve(__dirname, 'fixtures/habitaclia.html');
  const fixtureHtml = fs.readFileSync(fixturePath, 'utf-8');

  it('identifies Habitaclia listing URLs correctly', () => {
    expect(adapter.canExtract('https://www.habitaclia.com/comprar-piso-en-barcelona-i123456.htm')).toBe(true);
    expect(adapter.canExtract('https://www.habitaclia.com/alquiler-vivienda-madrid.htm')).toBe(true);
    expect(adapter.canExtract('https://www.habitaclia.com/inmueble-456789.htm')).toBe(true);
    expect(adapter.canExtract('https://www.habitaclia.com/comprar/pisos/')).toBe(true);
    expect(adapter.canExtract('https://www.idealista.com/inmueble/101234567/')).toBe(false);
    expect(adapter.canExtract('https://example.com/comprar-piso')).toBe(false);
  });

  it('extracts property details from Habitaclia fixture', () => {
    const dom = new JSDOM(fixtureHtml, {
      url: 'https://www.habitaclia.com/comprar-piso-en-barcelona-i123456.htm',
    });
    const data = adapter.extract(dom.window.document, dom.window.location.href);

    expect(data).not.toBeNull();
    expect(data?.portal).toBe('habitaclia');
    expect(data?.title).toBe('Piso en venta en Rambla de Catalunya, 60');
    expect(data?.priceEur).toBe(530000);
    expect(data?.builtSurfaceM2).toBe(95);
    expect(data?.coordinates).toEqual({
      latitude: 41.3888,
      longitude: 2.1645,
    });
    expect(data?.address).toBe('Rambla de Catalunya, 60');
    expect(data?.municipality).toBe('Barcelona');
    expect(data?.cadastralReference).toBe('2345678DF2345E0001GH');
    expect(data?.constructionYear).toBe(1950);
    expect(data?.isRental).toBe(false);
  });

  it('detects rental status when URL includes alquiler', () => {
    const rentalHtml = `
      <!DOCTYPE html>
      <html><body><h1 class="summary-title">Piso en alquiler</h1><span class="price">1.500 €</span></body></html>
    `;
    const dom = new JSDOM(rentalHtml, {
      url: 'https://www.habitaclia.com/alquiler-piso-en-barcelona.htm',
    });
    const data = adapter.extract(dom.window.document, dom.window.location.href);
    expect(data?.isRental).toBe(true);
    expect(data?.priceEur).toBe(1500);
  });

  it('locates mount target in document', () => {
    const dom = new JSDOM(fixtureHtml, {
      url: 'https://www.habitaclia.com/comprar-piso-en-barcelona-i123456.htm',
    });
    const target = adapter.getMountTarget(dom.window.document);
    expect(target).not.toBeNull();
  });
});
