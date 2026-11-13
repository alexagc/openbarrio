import { describe, it, expect } from 'vitest';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  BasePortalAdapter,
  IdealistaAdapter,
  FotocasaAdapter,
  HabitacliaAdapter,
  PisosAdapter,
  YaencontreAdapter,
  EXTRACTORS,
  findExtractorForUrl,
  PortalType,
  ExtractedPropertyData,
} from '../src/content/extractors/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface PortalTestCase {
  portal: PortalType;
  adapter: BasePortalAdapter;
  fixtureName: string;
  testUrl: string;
  expected: {
    title: string;
    priceEur: number;
    builtSurfaceM2: number;
    latitude: number;
    longitude: number;
    cadastralReference: string;
    constructionYear: number;
    municipality: string;
  };
}

describe('Synthetic DOM Monitoring Suite - Spanish Real Estate Portals', () => {
  const PORTAL_TEST_CASES: PortalTestCase[] = [
    {
      portal: 'idealista',
      adapter: new IdealistaAdapter(),
      fixtureName: 'idealista.html',
      testUrl: 'https://www.idealista.com/inmueble/101234567/',
      expected: {
        title: 'Piso en venta en Calle de Serrano, 45',
        priceEur: 850000,
        builtSurfaceM2: 120,
        latitude: 40.4285,
        longitude: -3.6872,
        cadastralReference: '9872023VH5797S0001WX',
        constructionYear: 1978,
        municipality: 'Madrid',
      },
    },
    {
      portal: 'fotocasa',
      adapter: new FotocasaAdapter(),
      fixtureName: 'fotocasa.html',
      testUrl: 'https://www.fotocasa.es/es/comprar/vivienda/barcelona/1892345/d',
      expected: {
        title: 'Piso de 85 m² en venta en Carrer de Balmes, Barcelona',
        priceEur: 420000,
        builtSurfaceM2: 85,
        latitude: 41.3912,
        longitude: 2.1584,
        cadastralReference: '1234567DF1234E0001FG',
        constructionYear: 1965,
        municipality: 'Barcelona',
      },
    },
    {
      portal: 'habitaclia',
      adapter: new HabitacliaAdapter(),
      fixtureName: 'habitaclia.html',
      testUrl: 'https://www.habitaclia.com/comprar-piso-en-barcelona-i123456.htm',
      expected: {
        title: 'Piso en venta en Rambla de Catalunya, 60',
        priceEur: 530000,
        builtSurfaceM2: 95,
        latitude: 41.3888,
        longitude: 2.1645,
        cadastralReference: '2345678DF2345E0001GH',
        constructionYear: 1950,
        municipality: 'Barcelona',
      },
    },
    {
      portal: 'pisos',
      adapter: new PisosAdapter(),
      fixtureName: 'pisos.html',
      testUrl: 'https://www.pisos.com/comprar/piso-valencia-123456/',
      expected: {
        title: 'Piso en venta en Gran Vía del Marqués del Turia, 15',
        priceEur: 390000,
        builtSurfaceM2: 115,
        latitude: 39.4673,
        longitude: -0.3682,
        cadastralReference: '3456789DF3456E0001IJ',
        constructionYear: 1968,
        municipality: 'Valencia',
      },
    },
    {
      portal: 'yaencontre',
      adapter: new YaencontreAdapter(),
      fixtureName: 'yaencontre.html',
      testUrl: 'https://www.yaencontre.com/venta/piso/sevilla/inmueble-123456',
      expected: {
        title: 'Piso en venta en Calle Asunción, 22',
        priceEur: 315000,
        builtSurfaceM2: 105,
        latitude: 37.3754,
        longitude: -5.9995,
        cadastralReference: '4567890DF4567E0001KL',
        constructionYear: 1982,
        municipality: 'Sevilla',
      },
    },
  ];

  describe('Portal Extraction Accuracy (100% Target)', () => {
    for (const testCase of PORTAL_TEST_CASES) {
      describe(`Portal: [${testCase.portal.toUpperCase()}]`, () => {
        const fixturePath = path.resolve(__dirname, 'fixtures', testCase.fixtureName);
        const html = fs.readFileSync(fixturePath, 'utf-8');

        it('should correctly match canonical portal URL', () => {
          expect(testCase.adapter.canExtract(testCase.testUrl)).toBe(true);
        });

        it('should extract 100% accurate property metrics from DOM snapshot', () => {
          const dom = new JSDOM(html, { url: testCase.testUrl });
          const data = testCase.adapter.extract(dom.window.document, testCase.testUrl);

          expect(data).not.toBeNull();
          expect(data?.portal).toBe(testCase.portal);

          // 1. Title verification
          expect(data?.title).toBe(testCase.expected.title);

          // 2. Price verification
          expect(data?.priceEur).toBe(testCase.expected.priceEur);

          // 3. Surface m² verification
          expect(data?.builtSurfaceM2).toBe(testCase.expected.builtSurfaceM2);

          // 4. Coordinates verification (delta 0.0001)
          expect(data?.coordinates).toBeDefined();
          expect(data?.coordinates?.latitude).toBeCloseTo(testCase.expected.latitude, 3);
          expect(data?.coordinates?.longitude).toBeCloseTo(testCase.expected.longitude, 3);

          // 5. Cadastral reference verification
          expect(data?.cadastralReference).toBe(testCase.expected.cadastralReference);

          // 6. Construction year
          expect(data?.constructionYear).toBe(testCase.expected.constructionYear);

          // 7. Diagnostic validation assert
          const validation = testCase.adapter.validate(data);
          expect(validation.isValid).toBe(true);
          expect(validation.missingFields).toHaveLength(0);
          expect(validation.errorMessages).toHaveLength(0);
        });
      });
    }
  });

  describe('Registry and Router Factory', () => {
    it('should register all 5 major portals in EXTRACTORS pool', () => {
      expect(EXTRACTORS).toHaveLength(5);
      const portals = EXTRACTORS.map((e) => e.portal);
      expect(portals).toContain('idealista');
      expect(portals).toContain('fotocasa');
      expect(portals).toContain('habitaclia');
      expect(portals).toContain('pisos');
      expect(portals).toContain('yaencontre');
    });

    it('should route URLs to the proper BasePortalAdapter subclass', () => {
      expect(findExtractorForUrl('https://www.idealista.com/inmueble/123/')?.portal).toBe('idealista');
      expect(findExtractorForUrl('https://www.fotocasa.es/es/comprar/vivienda/madrid/123/d')?.portal).toBe('fotocasa');
      expect(findExtractorForUrl('https://www.habitaclia.com/comprar-piso-en-madrid-123.htm')?.portal).toBe('habitaclia');
      expect(findExtractorForUrl('https://www.pisos.com/comprar/piso-madrid-123/')?.portal).toBe('pisos');
      expect(findExtractorForUrl('https://www.yaencontre.com/venta/piso/madrid/inmueble-123')?.portal).toBe('yaencontre');
      expect(findExtractorForUrl('https://example.com/property/123')).toBeNull();
    });
  });

  describe('Synthetic Regression & Anomaly Diagnostic Alerts', () => {
    const adapter = new IdealistaAdapter();

    it('should emit diagnostic error when property title is missing', () => {
      const corruptedData: ExtractedPropertyData = {
        portal: 'idealista',
        url: 'https://www.idealista.com/inmueble/101234567/',
        priceEur: 500000,
        builtSurfaceM2: 100,
        cadastralReference: '9872023VH5797S0001WX',
      };

      const result = adapter.validate(corruptedData);
      expect(result.isValid).toBe(false);
      expect(result.missingFields).toContain('title');
      expect(result.errorMessages.some((msg) => msg.includes('Property title missing'))).toBe(true);
    });

    it('should emit diagnostic error when price is zero or missing', () => {
      const corruptedData: ExtractedPropertyData = {
        portal: 'idealista',
        url: 'https://www.idealista.com/inmueble/101234567/',
        title: 'Ático céntrico',
        builtSurfaceM2: 80,
        cadastralReference: '9872023VH5797S0001WX',
      };

      const result = adapter.validate(corruptedData);
      expect(result.isValid).toBe(false);
      expect(result.missingFields).toContain('priceEur');
      expect(result.errorMessages.some((msg) => msg.includes('price missing or invalid'))).toBe(true);
    });

    it('should emit diagnostic error when surface m² is missing', () => {
      const corruptedData: ExtractedPropertyData = {
        portal: 'idealista',
        url: 'https://www.idealista.com/inmueble/101234567/',
        title: 'Ático céntrico',
        priceEur: 450000,
        cadastralReference: '9872023VH5797S0001WX',
      };

      const result = adapter.validate(corruptedData);
      expect(result.isValid).toBe(false);
      expect(result.missingFields).toContain('builtSurfaceM2');
      expect(result.errorMessages.some((msg) => msg.includes('Built surface (m²) missing'))).toBe(true);
    });

    it('should emit diagnostic error when both coordinates and cadastral reference are missing', () => {
      const corruptedData: ExtractedPropertyData = {
        portal: 'idealista',
        url: 'https://www.idealista.com/inmueble/101234567/',
        title: 'Ático céntrico',
        priceEur: 450000,
        builtSurfaceM2: 80,
      };

      const result = adapter.validate(corruptedData);
      expect(result.isValid).toBe(false);
      expect(result.missingFields).toContain('coordinates/cadastralReference');
      expect(result.errorMessages.some((msg) => msg.includes('Geolocation missing'))).toBe(true);
    });

    it('should report critical extraction failure when document extraction yields null', () => {
      const result = adapter.validate(null);
      expect(result.isValid).toBe(false);
      expect(result.errorMessages[0]).toContain('Critical extraction failure');
    });

    it('should generate portal health audit summary report', () => {
      const healthReport: Record<PortalType, { status: 'HEALTHY' | 'DEGRADED'; accuracyPercent: number }> = {
        idealista: { status: 'HEALTHY', accuracyPercent: 100 },
        fotocasa: { status: 'HEALTHY', accuracyPercent: 100 },
        habitaclia: { status: 'HEALTHY', accuracyPercent: 100 },
        pisos: { status: 'HEALTHY', accuracyPercent: 100 },
        yaencontre: { status: 'HEALTHY', accuracyPercent: 100 },
      };

      for (const testCase of PORTAL_TEST_CASES) {
        const fixturePath = path.resolve(__dirname, 'fixtures', testCase.fixtureName);
        const html = fs.readFileSync(fixturePath, 'utf-8');
        const dom = new JSDOM(html, { url: testCase.testUrl });
        const data = testCase.adapter.extract(dom.window.document, testCase.testUrl);
        const validation = testCase.adapter.validate(data);

        if (!validation.isValid) {
          healthReport[testCase.portal].status = 'DEGRADED';
          healthReport[testCase.portal].accuracyPercent = 0;
        }
      }

      for (const portal of Object.keys(healthReport) as PortalType[]) {
        expect(healthReport[portal].status).toBe('HEALTHY');
        expect(healthReport[portal].accuracyPercent).toBe(100);
      }
    });
  });
});
