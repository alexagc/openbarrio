import { describe, it, expect } from 'vitest';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { IdealistaExtractor } from '../src/content/extractors/idealista.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('IdealistaExtractor', () => {
  const extractor = new IdealistaExtractor();
  const fixturePath = path.resolve(__dirname, 'fixtures/idealista-property.html');
  const fixtureHtml = fs.readFileSync(fixturePath, 'utf-8');

  it('should identify Idealista property listing URLs', () => {
    expect(extractor.canExtract('https://www.idealista.com/inmueble/101234567/')).toBe(true);
    expect(extractor.canExtract('https://www.idealista.com/inmueble/99887766/?xtmc=1_1')).toBe(true);
    expect(extractor.canExtract('https://www.idealista.com/venta-viviendas/madrid/')).toBe(false);
    expect(extractor.canExtract('https://www.fotocasa.es/es/comprar/vivienda/123/')).toBe(false);
  });

  it('should extract structured data and coordinates from JSON-LD fixture', () => {
    const dom = new JSDOM(fixtureHtml, { url: 'https://www.idealista.com/inmueble/101234567/' });
    const data = extractor.extract(dom.window.document, dom.window.location.href);

    expect(data).not.toBeNull();
    expect(data?.portal).toBe('idealista');
    expect(data?.title).toBe('Piso en venta en Calle de Serrano, 45');
    expect(data?.coordinates).toEqual({
      latitude: 40.4285,
      longitude: -3.6872,
    });
    expect(data?.address).toBe('Calle de Serrano, 45');
    expect(data?.municipality).toBe('Madrid');
    expect(data?.builtSurfaceM2).toBe(120);
    expect(data?.priceEur).toBe(850000);
  });

  it('should extract Cadastral Reference from description text', () => {
    const dom = new JSDOM(fixtureHtml, { url: 'https://www.idealista.com/inmueble/101234567/' });
    const data = extractor.extract(dom.window.document, dom.window.location.href);

    expect(data?.cadastralReference).toBe('9872023VH5797S0001WX');
  });

  it('should extract year of construction from features list', () => {
    const dom = new JSDOM(fixtureHtml, { url: 'https://www.idealista.com/inmueble/101234567/' });
    const data = extractor.extract(dom.window.document, dom.window.location.href);

    expect(data?.constructionYear).toBe(1978);
  });

  it('should fall back to DOM meta tags if JSON-LD is missing', () => {
    const minimalHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="geo.position" content="40.4168;-3.7038">
      </head>
      <body>
        <h1 class="property-title">Ático en Malasaña</h1>
        <div class="info-features">
          <span>75 m²</span>
          <span>Construido en 1990</span>
        </div>
      </body>
      </html>
    `;
    const dom = new JSDOM(minimalHtml, { url: 'https://www.idealista.com/inmueble/55443322/' });
    const data = extractor.extract(dom.window.document, dom.window.location.href);

    expect(data?.coordinates).toEqual({
      latitude: 40.4168,
      longitude: -3.7038,
    });
    expect(data?.builtSurfaceM2).toBe(75);
    expect(data?.constructionYear).toBe(1990);
  });
});
