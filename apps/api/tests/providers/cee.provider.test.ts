import { describe, it, expect } from 'vitest';
import { CEEProvider } from '../../src/providers/cee.provider.js';
import { MockCEEProvider } from '../../src/providers/cee.mock.js';
import { CadastralProperty } from '@openbarrio/core';

describe('CEEProvider & Normative Fallback Engine', () => {
  const provider = new CEEProvider();
  const mockProvider = new MockCEEProvider();

  const createMockProperty = (year: number, surface = 100): CadastralProperty => ({
    cadastralReference: '12345678901234',
    address: {
      street: 'Gran Vía',
      number: '1',
      postalCode: '28013',
      municipality: 'Madrid',
      province: 'Madrid',
    },
    coordinates: {
      latitude: 40.42,
      longitude: -3.7,
      srs: 'EPSG:4326',
    },
    building: {
      constructionYear: year,
      builtSurfaceM2: surface,
      primaryUse: 'Residencial',
      unitsCount: 10,
      hasCommercialGroundFloor: false,
    },
  });

  describe('Normative CTE/NBE Fallback Inference', () => {
    it('infers Class A for buildings built under CTE 2019 nZEB (2020+)', async () => {
      const prop = createMockProperty(2022);
      const cee = await provider.getEnergyCertificate(prop);

      expect(cee.isEstimated).toBe(true);
      expect(cee.ratingEmissions).toBe('A');
      expect(cee.ratingConsumption).toBe('A');
      expect(cee.estimationBasis).toContain('CTE DB-HE 2019');
      expect(cee.co2Emissions).toBeLessThan(10);
      expect(cee.annualEstimatedCostEur).toBeGreaterThan(0);
    });

    it('infers Class D for buildings built under initial CTE 2006 (2007-2019)', async () => {
      const prop = createMockProperty(2012);
      const cee = await provider.getEnergyCertificate(prop);

      expect(cee.isEstimated).toBe(true);
      expect(cee.ratingEmissions).toBe('D');
      expect(cee.ratingConsumption).toBe('D');
      expect(cee.estimationBasis).toContain('CTE DB-HE 2006');
    });

    it('infers Class E for buildings built under NBE-CT-79 (1980-2006)', async () => {
      const prop = createMockProperty(1990);
      const cee = await provider.getEnergyCertificate(prop);

      expect(cee.isEstimated).toBe(true);
      expect(cee.ratingEmissions).toBe('E');
      expect(cee.ratingConsumption).toBe('E');
      expect(cee.estimationBasis).toContain('NBE-CT-79');
    });

    it('infers Class G for pre-1980 uninsulated buildings', async () => {
      const prop = createMockProperty(1965);
      const cee = await provider.getEnergyCertificate(prop);

      expect(cee.isEstimated).toBe(true);
      expect(cee.ratingEmissions).toBe('G');
      expect(cee.ratingConsumption).toBe('G');
      expect(cee.estimationBasis).toContain('Pre-1979');
      expect(cee.co2Emissions).toBeGreaterThan(50);
    });
  });

  describe('Mock Registered Certificates', () => {
    it('retrieves official registered certificate for seeded Madrid landmark', async () => {
      const prop = createMockProperty(1924);
      prop.cadastralReference = '9872023VH5797S0001WX';

      const cee = await mockProvider.getEnergyCertificate(prop);
      expect(cee.isEstimated).toBe(false);
      expect(cee.ratingEmissions).toBe('B');
      expect(cee.registrationNumber).toBe('MDR-2023-CEE-09412');
      expect(cee.validUntil).toBeDefined();
    });

    it('hierarchically resolves unit 20-character reference to building 14-character certificate', async () => {
      const prop = createMockProperty(1924);
      prop.cadastralReference = '9872023VH5797S0002AB'; // Exactly 20-char unit in building 9872023VH5797S

      const cee = await mockProvider.getEnergyCertificate(prop);
      expect(cee.isEstimated).toBe(false);
      expect(cee.ratingEmissions).toBe('B');
      expect(cee.registrationNumber).toBe('MDR-2023-CEE-09412');
    });

    it('detects expired certificate under RD 390/2021', async () => {
      const prop = createMockProperty(1975);
      prop.cadastralReference = '2807901VK4720E0001EX';

      const cee = await mockProvider.getEnergyCertificate(prop);
      expect(cee.isEstimated).toBe(false);
      expect(cee.isExpired).toBe(true);
      expect(cee.ratingEmissions).toBe('G');
    });
  });

  describe('D1 Database CEEProvider Queries', () => {
    it('executes hierarchical query on D1 and parses expiration and dataSource', async () => {
      const mockD1: any = {
        prepare: (_query: string) => ({
          bind: (..._args: any[]) => ({
            first: async () => ({
              rating_emissions: 'C',
              rating_consumption: 'B',
              co2_emissions: 18.5,
              primary_energy: 85.0,
              registration_number: 'CAT-ICAEN-2023-00918',
              valid_until: '2033-01-01',
              scope: 'building',
              cadastral_reference: '08019A00200005',
            }),
          }),
        }),
      };

      const d1Provider = new CEEProvider({ db: mockD1 });
      const prop = createMockProperty(2005);
      prop.cadastralReference = '08019A002000050001AB'; // 20-char unit

      const result = await d1Provider.getEnergyCertificate(prop);
      expect(result.isEstimated).toBe(false);
      expect(result.ratingEmissions).toBe('C');
      expect(result.ratingConsumption).toBe('B');
      expect(result.isExpired).toBe(false);
      expect(result.dataSource).toBe('ICAEN (Generalitat de Catalunya)');
    });
  });
});
