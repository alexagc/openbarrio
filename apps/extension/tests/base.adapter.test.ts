import { describe, it, expect } from 'vitest';
import { JSDOM } from 'jsdom';
import { BasePortalAdapter } from '../src/content/extractors/base.js';
import { ExtractedPropertyData, PortalType } from '../src/content/extractors/types.js';

class TestPortalAdapter extends BasePortalAdapter {
  readonly portal: PortalType = 'idealista';

  canExtract(url: string): boolean {
    try {
      const parsed = new URL(url);
      return parsed.hostname === 'test-portal.com' || parsed.hostname.endsWith('.test-portal.com');
    } catch {
      return false;
    }
  }

  extract(doc: Document, url: string): ExtractedPropertyData | null {
    if (!this.canExtract(url)) return null;
    const data: ExtractedPropertyData = {
      portal: this.portal,
      url,
      title: doc.querySelector('h1')?.textContent?.trim(),
      cadastralReference: this.extractCadastralReference(doc),
      coordinates: this.extractCoordinatesFallback(doc),
    };
    this.extractFromJsonLd(doc, data);
    return data;
  }

  getMountTarget(doc: Document): Element | null {
    return doc.querySelector('#mount-point') || doc.body;
  }
}

describe('BasePortalAdapter Abstract Class & Utility Helpers', () => {
  const adapter = new TestPortalAdapter();

  describe('parsePrice', () => {
    it('parses formatted EUR string prices with dots, spaces and currency symbols', () => {
      expect(adapter.parsePrice('450.000 €')).toBe(450000);
      expect(adapter.parsePrice('1.250 €/mes')).toBe(1250);
      expect(adapter.parsePrice('850 000 €')).toBe(850000);
      expect(adapter.parsePrice('320000')).toBe(320000);
      expect(adapter.parsePrice(500000)).toBe(500000);
    });

    it('returns undefined for invalid, empty, or negative prices', () => {
      expect(adapter.parsePrice('')).toBeUndefined();
      expect(adapter.parsePrice(null)).toBeUndefined();
      expect(adapter.parsePrice(undefined)).toBeUndefined();
      expect(adapter.parsePrice('Consultar precio')).toBeUndefined();
      expect(adapter.parsePrice(-500)).toBeUndefined();
    });
  });

  describe('parseSurface', () => {
    it('parses square meter values in various Spanish formats', () => {
      expect(adapter.parseSurface('120 m²')).toBe(120);
      expect(adapter.parseSurface('85,5 m2')).toBe(86);
      expect(adapter.parseSurface('95 m² útiles')).toBe(95);
      expect(adapter.parseSurface(150)).toBe(150);
    });

    it('returns undefined when no surface number is found', () => {
      expect(adapter.parseSurface('')).toBeUndefined();
      expect(adapter.parseSurface('Sin metros')).toBeUndefined();
      expect(adapter.parseSurface(null)).toBeUndefined();
    });
  });

  describe('parseYear', () => {
    it('extracts 4-digit construction years', () => {
      expect(adapter.parseYear('Construido en 1985')).toBe(1985);
      expect(adapter.parseYear('Año 1990')).toBe(1990);
      expect(adapter.parseYear('Edificio de 1978')).toBe(1978);
      expect(adapter.parseYear('Antigüedad: 2005')).toBe(2005);
      expect(adapter.parseYear(1960)).toBe(1960);
    });

    it('returns undefined for out-of-range or missing years', () => {
      expect(adapter.parseYear('Año 1200')).toBeUndefined();
      expect(adapter.parseYear('3050')).toBeUndefined();
      expect(adapter.parseYear('Nueva construcción')).toBeUndefined();
    });
  });

  describe('extractCadastralReference', () => {
    it('extracts explicit and regex 20-character Cadastral References', () => {
      const html = `
        <div>
          <p>Espectacular vivienda reformada.</p>
          <p>Referencia catastral: 9872023VH5797S0001WX</p>
        </div>
      `;
      const dom = new JSDOM(html);
      expect(adapter.extractCadastralReference(dom.window.document)).toBe('9872023VH5797S0001WX');
    });

    it('extracts 14-character parcel references', () => {
      const html = `<div>Ref. Catastral: 9872023VH5797S</div>`;
      const dom = new JSDOM(html);
      expect(adapter.extractCadastralReference(dom.window.document)).toBe('9872023VH5797S');
    });
  });

  describe('extractCoordinatesFallback', () => {
    it('extracts coordinates from meta geo.position', () => {
      const html = `<meta name="geo.position" content="40.4168;-3.7038">`;
      const dom = new JSDOM(html);
      expect(adapter.extractCoordinatesFallback(dom.window.document)).toEqual({
        latitude: 40.4168,
        longitude: -3.7038,
      });
    });

    it('extracts coordinates from meta ICBM', () => {
      const html = `<meta name="ICBM" content="41.3851, 2.1734">`;
      const dom = new JSDOM(html);
      expect(adapter.extractCoordinatesFallback(dom.window.document)).toEqual({
        latitude: 41.3851,
        longitude: 2.1734,
      });
    });

    it('extracts coordinates from data attributes', () => {
      const html = `<div id="map" data-latitude="39.4699" data-longitude="-0.3763"></div>`;
      const dom = new JSDOM(html);
      expect(adapter.extractCoordinatesFallback(dom.window.document)).toEqual({
        latitude: 39.4699,
        longitude: -0.3763,
      });
    });
  });

  describe('getMountTarget', () => {
    it('returns custom mount target if present, otherwise body', () => {
      const domWithTarget = new JSDOM('<div id="mount-point"></div>');
      expect(adapter.getMountTarget(domWithTarget.window.document)?.id).toBe('mount-point');

      const domEmpty = new JSDOM('<div></div>');
      expect(adapter.getMountTarget(domEmpty.window.document)?.tagName.toLowerCase()).toBe('body');
    });
  });
});
