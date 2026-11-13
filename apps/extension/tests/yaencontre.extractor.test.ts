import { describe, it, expect } from 'vitest';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { YaEncontreAdapter } from '../src/content/extractors/yaencontre.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('YaEncontreAdapter', () => {
  const adapter = new YaEncontreAdapter();
  const fixturePath = path.resolve(__dirname, 'fixtures/yaencontre.html');
  const fixtureHtml = fs.readFileSync(fixturePath, 'utf-8');

  it('identifies YaEncontre listing URLs correctly', () => {
    expect(adapter.canExtract('https://www.yaencontre.com/venta/piso/sevilla/inmueble-123456')).toBe(true);
    expect(adapter.canExtract('https://www.yaencontre.com/alquiler/estudio/madrid/inmueble-999')).toBe(true);
    expect(adapter.canExtract('https://www.yaencontre.com/noticias/')).toBe(false);
    expect(adapter.canExtract('https://www.idealista.com/inmueble/101234567/')).toBe(false);
  });

  it('extracts property details from YaEncontre fixture', () => {
    const dom = new JSDOM(fixtureHtml, {
      url: 'https://www.yaencontre.com/venta/piso/sevilla/inmueble-123456',
    });
    const data = adapter.extract(dom.window.document, dom.window.location.href);

    expect(data).not.toBeNull();
    expect(data?.portal).toBe('yaencontre');
    expect(data?.title).toBe('Piso en venta en Calle Asunción, 22');
    expect(data?.priceEur).toBe(315000);
    expect(data?.builtSurfaceM2).toBe(105);
    expect(data?.coordinates).toEqual({
      latitude: 37.3754,
      longitude: -5.9995,
    });
    expect(data?.address).toBe('Calle Asunción, 22');
    expect(data?.municipality).toBe('Sevilla');
    expect(data?.cadastralReference).toBe('4567890DF4567E0001KL');
    expect(data?.constructionYear).toBe(1982);
    expect(data?.isRental).toBe(false);
  });

  it('detects rental status when URL path starts with /alquiler/', () => {
    const rentalHtml = `
      <!DOCTYPE html>
      <html><body><h1 class="title">Ático en alquiler</h1><span class="details-header-price">850 €</span></body></html>
    `;
    const dom = new JSDOM(rentalHtml, {
      url: 'https://www.yaencontre.com/alquiler/piso/sevilla/123',
    });
    const data = adapter.extract(dom.window.document, dom.window.location.href);
    expect(data?.isRental).toBe(true);
    expect(data?.priceEur).toBe(850);
  });

  it('locates mount target in document', () => {
    const dom = new JSDOM(fixtureHtml, {
      url: 'https://www.yaencontre.com/venta/piso/sevilla/inmueble-123456',
    });
    const target = adapter.getMountTarget(dom.window.document);
    expect(target).not.toBeNull();
  });
});
