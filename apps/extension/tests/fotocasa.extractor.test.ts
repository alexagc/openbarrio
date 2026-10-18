import { describe, it, expect } from 'vitest';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { FotocasaExtractor } from '../src/content/extractors/fotocasa.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('FotocasaExtractor', () => {
  const extractor = new FotocasaExtractor();
  const fixturePath = path.resolve(__dirname, 'fixtures/fotocasa-property.html');
  const fixtureHtml = fs.readFileSync(fixturePath, 'utf-8');

  it('should identify Fotocasa property listing URLs', () => {
    expect(extractor.canExtract('https://www.fotocasa.es/es/comprar/vivienda/barcelona/1892345/d')).toBe(true);
    expect(extractor.canExtract('https://www.fotocasa.es/es/alquiler/vivienda/madrid/998877/d')).toBe(true);
    expect(extractor.canExtract('https://www.fotocasa.es/es/comprar/viviendas/madrid-capital/todas-las-zonas/l')).toBe(false);
    expect(extractor.canExtract('https://www.idealista.com/inmueble/101234567/')).toBe(false);
  });

  it('should extract structured coordinates and property details from fixture', () => {
    const dom = new JSDOM(fixtureHtml, {
      url: 'https://www.fotocasa.es/es/comprar/vivienda/barcelona/1892345/d',
    });
    const data = extractor.extract(dom.window.document, dom.window.location.href);

    expect(data).not.toBeNull();
    expect(data?.portal).toBe('fotocasa');
    expect(data?.coordinates).toEqual({
      latitude: 41.3912,
      longitude: 2.1584,
    });
    expect(data?.builtSurfaceM2).toBe(85);
    expect(data?.priceEur).toBe(420000);
    expect(data?.address).toBe('Carrer de Balmes, 120');
    expect(data?.municipality).toBe('Barcelona');
  });

  it('should extract Cadastral Reference from description text', () => {
    const dom = new JSDOM(fixtureHtml, {
      url: 'https://www.fotocasa.es/es/comprar/vivienda/barcelona/1892345/d',
    });
    const data = extractor.extract(dom.window.document, dom.window.location.href);

    expect(data?.cadastralReference).toBe('1234567DF1234E0001FG');
  });

  it('should extract construction year from NextData or features', () => {
    const dom = new JSDOM(fixtureHtml, {
      url: 'https://www.fotocasa.es/es/comprar/vivienda/barcelona/1892345/d',
    });
    const data = extractor.extract(dom.window.document, dom.window.location.href);

    expect(data?.constructionYear).toBe(1965);
  });

  it('should extract data from __NEXT_DATA__ when JSON-LD is absent', () => {
    const nextOnlyHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <script id="__NEXT_DATA__" type="application/json">
        {
          "props": {
            "pageProps": {
              "initialProperty": {
                "coordinates": { "latitude": 39.4699, "longitude": -0.3763 },
                "address": { "ubication": "Calle Colón, Valencia", "municipality": "Valencia" },
                "buildingYear": 2008,
                "features": [{ "id": "surface", "value": 110 }]
              }
            }
          }
        }
        </script>
      </head>
      <body>
        <h1>Piso en Valencia</h1>
      </body>
      </html>
    `;
    const dom = new JSDOM(nextOnlyHtml, {
      url: 'https://www.fotocasa.es/es/comprar/vivienda/valencia/123/d',
    });
    const data = extractor.extract(dom.window.document, dom.window.location.href);

    expect(data?.coordinates).toEqual({
      latitude: 39.4699,
      longitude: -0.3763,
    });
    expect(data?.address).toBe('Calle Colón, Valencia');
    expect(data?.constructionYear).toBe(2008);
    expect(data?.builtSurfaceM2).toBe(110);
  });
});
