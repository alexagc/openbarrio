import { describe, it, expect } from 'vitest';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PisosComAdapter } from '../src/content/extractors/pisos.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('PisosComAdapter', () => {
  const adapter = new PisosComAdapter();
  const fixturePath = path.resolve(__dirname, 'fixtures/pisos.html');
  const fixtureHtml = fs.readFileSync(fixturePath, 'utf-8');

  it('identifies Pisos.com listing URLs correctly', () => {
    expect(adapter.canExtract('https://www.pisos.com/comprar/piso-valencia-123456/')).toBe(true);
    expect(adapter.canExtract('https://www.pisos.com/alquilar/piso-madrid-7890/')).toBe(true);
    expect(adapter.canExtract('https://www.pisos.com/noticias/')).toBe(false);
    expect(adapter.canExtract('https://www.idealista.com/inmueble/101234567/')).toBe(false);
  });

  it('extracts property details from Pisos.com fixture', () => {
    const dom = new JSDOM(fixtureHtml, {
      url: 'https://www.pisos.com/comprar/piso-valencia-123456/',
    });
    const data = adapter.extract(dom.window.document, dom.window.location.href);

    expect(data).not.toBeNull();
    expect(data?.portal).toBe('pisos');
    expect(data?.title).toBe('Piso en venta en Gran Vía del Marqués del Turia, 15');
    expect(data?.priceEur).toBe(390000);
    expect(data?.builtSurfaceM2).toBe(115);
    expect(data?.coordinates).toEqual({
      latitude: 39.4673,
      longitude: -0.3682,
    });
    expect(data?.address).toBe('Gran Vía del Marqués del Turia, 15');
    expect(data?.municipality).toBe('Valencia');
    expect(data?.cadastralReference).toBe('3456789DF3456E0001IJ');
    expect(data?.constructionYear).toBe(1968);
    expect(data?.isRental).toBe(false);
  });

  it('detects rental status when URL path starts with /alquilar/', () => {
    const rentalHtml = `
      <!DOCTYPE html>
      <html><body><h1 class="main-info__title">Piso en alquiler</h1><div class="price__value">900 €/mes</div></body></html>
    `;
    const dom = new JSDOM(rentalHtml, {
      url: 'https://www.pisos.com/alquilar/piso-valencia-999/',
    });
    const data = adapter.extract(dom.window.document, dom.window.location.href);
    expect(data?.isRental).toBe(true);
    expect(data?.priceEur).toBe(900);
  });

  it('locates mount target in document', () => {
    const dom = new JSDOM(fixtureHtml, {
      url: 'https://www.pisos.com/comprar/piso-valencia-123456/',
    });
    const target = adapter.getMountTarget(dom.window.document);
    expect(target).not.toBeNull();
  });
});
