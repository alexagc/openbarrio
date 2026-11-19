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
      municipalityCode: '28079',
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
      municipalityCode: '08019',
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

  describe('SERPAVIProvider Zero-Fabrication Behavior', () => {
    const provider = new SERPAVIProvider();

    it('returns unavailable instead of fabricating rates when D1 database is not bound', async () => {
      const madridRes = await provider.getRentalBenchmark(mockMadridProperty, '2807901001');
      expect(madridRes.status).toBe('unavailable');
      expect(madridRes.data).toBeUndefined();
      expect(madridRes.reason).toBe('upstream_error');
    });

    it('returns out_of_coverage with not_applicable reason for non-residential property', async () => {
      const industrialProp: CadastralProperty = {
        ...mockMadridProperty,
        typology: 'INDUSTRIAL',
      };
      const res = await provider.getRentalBenchmark(industrialProp, '2807901001');
      expect(res.status).toBe('out_of_coverage');
      expect(res.reason).toBe('not_applicable');
      expect(res.data).toBeUndefined();
    });

    it('correctly identifies Catalonia declared stressed municipalities catalog', () => {
      expect(provider.isStressedZone('08019', '08')).toBe(true);
      expect(provider.isStressedZone('28079', '28')).toBe(false);
    });
  });

  describe('SERPAVIProvider D1 Hierarchical Resolution (Subphase 17A)', () => {
    it('resolves primary benchmark from D1 by census section (cusec)', async () => {
      const mockDb: any = {
        prepare: (query: string) => ({
          bind: (param: string) => ({
            first: async () => {
              if (query.includes('WHERE cusec = ?') && param === '0801901001') {
                return {
                  is_stressed_market: 1,
                  lower_bound_eur_m2: 17.5,
                  upper_bound_eur_m2: 22.4,
                };
              }
              return null;
            },
          }),
        }),
      };

      const provider = new SERPAVIProvider({ db: mockDb });
      const res = await provider.getRentalBenchmark(mockBarcelonaProperty, '0801901001');

      expect(res.status).toBe('ok');
      const benchmark = res.data!;
      expect(benchmark.isStressedHousingZone).toBe(true);
      expect(benchmark.officialRangeLowerEurM2).toBeGreaterThanOrEqual(17.5);
      expect(benchmark.officialRangeUpperEurM2).toBeGreaterThanOrEqual(22.4);
    });

    it('falls back to D1 municipal aggregate when census section has no data', async () => {
      const mockDb: any = {
        prepare: (query: string) => ({
          bind: (param: string) => ({
            first: async () => {
              if (query.includes('WHERE cusec = ?')) {
                return null;
              }
              if (query.includes('WHERE municipality_code = ? AND cusec IS NULL') && param === '28079') {
                return {
                  is_stressed_market: 0,
                  lower_bound_eur_m2: 14.2,
                  upper_bound_eur_m2: 18.5,
                };
              }
              return null;
            },
          }),
        }),
      };

      const provider = new SERPAVIProvider({ db: mockDb });
      const res = await provider.getRentalBenchmark(mockMadridProperty, '2807999999');

      expect(res.status).toBe('ok');
      const benchmark = res.data!;
      expect(benchmark.isStressedHousingZone).toBe(false);
      expect(benchmark.officialRangeLowerEurM2).toBeGreaterThan(13.0);
      expect(benchmark.officialRangeUpperEurM2).toBeGreaterThan(benchmark.officialRangeLowerEurM2);
    });

    it('returns out_of_coverage when D1 returns neither section nor municipal rows', async () => {
      const mockDb: any = {
        prepare: () => ({
          bind: () => ({
            first: async () => null,
          }),
        }),
      };

      const provider = new SERPAVIProvider({ db: mockDb });
      const res = await provider.getRentalBenchmark(mockMadridProperty, '2807999999');

      expect(res.status).toBe('out_of_coverage');
      expect(res.data).toBeUndefined();
    });

    it('returns unavailable when D1 throws an error', async () => {
      const mockDb: any = {
        prepare: () => {
          throw new Error('D1 Connection Timeout');
        },
      };

      const provider = new SERPAVIProvider({ db: mockDb });
      const res = await provider.getRentalBenchmark(mockBarcelonaProperty, '0801901001');

      expect(res.status).toBe('unavailable');
      expect(res.data).toBeUndefined();
    });
  });

  describe('MockSERPAVIProvider', () => {
    const mock = new MockSERPAVIProvider();

    it('returns deterministic benchmark for Madrid property', async () => {
      const res = await mock.getRentalBenchmark(mockMadridProperty);

      expect(res.status).toBe('ok');
      const benchmark = res.data!;
      expect(benchmark.isStressedHousingZone).toBe(false);
      expect(benchmark.officialRangeLowerEurM2).toBe(14.5);
      expect(benchmark.officialRangeUpperEurM2).toBe(18.2);
      expect(benchmark.estimatedMonthlyRentLowerEur).toBe(Math.round(14.5 * 104));
      expect(benchmark.estimatedMonthlyRentUpperEur).toBe(Math.round(18.2 * 104));
    });

    it('returns stressed zone true for Barcelona property', async () => {
      const res = await mock.getRentalBenchmark(mockBarcelonaProperty);

      expect(res.status).toBe('ok');
      expect(res.data?.isStressedHousingZone).toBe(true);
      expect(res.data?.officialRangeLowerEurM2).toBe(15.2);
    });
  });
});
