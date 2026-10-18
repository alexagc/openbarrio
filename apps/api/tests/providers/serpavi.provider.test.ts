import { describe, it, expect } from 'vitest';
import { SERPAVIProvider } from '../../src/providers/serpavi.provider.js';
import { MockSERPAVIProvider } from '../../src/providers/serpavi.mock.js';
import { CadastralProperty } from '@openbarrio/core';

describe('MIVAU SERPAVI Provider', () => {
  const mockMadridProperty: CadastralProperty = {
    cadastralReference: '9872023VH5797S0001WX',
    address: {
      street: 'Gran Vía',
      number: '32',
      postalCode: '28013',
      municipality: 'Madrid',
      province: 'Madrid',
    },
    coordinates: {
      latitude: 40.42028,
      longitude: -3.70379,
      srs: 'EPSG:4326',
    },
    building: {
      constructionYear: 1924,
      builtSurfaceM2: 104,
      primaryUse: 'Residencial',
      unitsCount: 24,
      hasCommercialGroundFloor: true,
    },
  };

  const mockBarcelonaProperty: CadastralProperty = {
    cadastralReference: '080191234567890001AB',
    address: {
      street: 'Passeig de Gràcia',
      number: '45',
      postalCode: '08007',
      municipality: 'Barcelona',
      province: 'Barcelona',
    },
    coordinates: {
      latitude: 41.391,
      longitude: 2.165,
      srs: 'EPSG:4326',
    },
    building: {
      constructionYear: 2012,
      builtSurfaceM2: 90,
      primaryUse: 'Residencial',
      unitsCount: 18,
      hasCommercialGroundFloor: true,
    },
  };

  describe('SERPAVIProvider Algorithm', () => {
    const provider = new SERPAVIProvider();

    it('correctly identifies Barcelona as a declared Stressed Housing Market Zone', async () => {
      const benchmark = await provider.getRentalBenchmark(mockBarcelonaProperty, '0801901001');

      expect(benchmark.isStressedHousingZone).toBe(true);
      expect(benchmark.officialRangeLowerEurM2).toBeGreaterThan(15.0);
      expect(benchmark.officialRangeUpperEurM2).toBeGreaterThan(benchmark.officialRangeLowerEurM2);
      expect(benchmark.estimatedMonthlyRentLowerEur).toBeGreaterThan(1200);
    });

    it('identifies Madrid property as non-declared stressed zone and calculates rates', async () => {
      const benchmark = await provider.getRentalBenchmark(mockMadridProperty, '2807901001');

      expect(benchmark.isStressedHousingZone).toBe(false);
      expect(benchmark.officialRangeLowerEurM2).toBeGreaterThan(12.0);
      expect(benchmark.officialRangeUpperEurM2).toBeGreaterThan(benchmark.officialRangeLowerEurM2);
      expect(benchmark.estimatedMonthlyRentLowerEur).toBeGreaterThan(1000);
      expect(benchmark.estimatedMonthlyRentUpperEur).toBeGreaterThan(benchmark.estimatedMonthlyRentLowerEur);
    });
  });

  describe('MockSERPAVIProvider', () => {
    const mock = new MockSERPAVIProvider();

    it('returns deterministic benchmark for Madrid property', async () => {
      const benchmark = await mock.getRentalBenchmark(mockMadridProperty);

      expect(benchmark.isStressedHousingZone).toBe(false);
      expect(benchmark.officialRangeLowerEurM2).toBe(14.5);
      expect(benchmark.officialRangeUpperEurM2).toBe(18.2);
      expect(benchmark.estimatedMonthlyRentLowerEur).toBe(Math.round(14.5 * 104));
      expect(benchmark.estimatedMonthlyRentUpperEur).toBe(Math.round(18.2 * 104));
    });

    it('returns stressed zone true for Barcelona property', async () => {
      const benchmark = await mock.getRentalBenchmark(mockBarcelonaProperty);

      expect(benchmark.isStressedHousingZone).toBe(true);
      expect(benchmark.officialRangeLowerEurM2).toBe(15.2);
    });
  });
});
