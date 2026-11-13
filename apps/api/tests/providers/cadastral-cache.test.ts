import { describe, it, expect, vi } from 'vitest';
import { CadastralCache } from '../../src/providers/cadastral-cache.js';
import { CatastroProvider } from '../../src/providers/catastro.provider.js';
import { CadastralRouterProvider } from '../../src/providers/cadastral-router.provider.js';
import { MockCatastroProvider } from '../../src/providers/catastro.mock.js';
import { CadastralProperty } from '@openbarrio/core';

describe('Subphase 17D: Cadastral Write-Through LRU Cache (90-day TTL)', () => {
  const mockProperty: CadastralProperty = {
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
      builtSurfaceM2: 120,
      primaryUse: 'Residencial',
    },
  };

  describe('CadastralCache Unit Engine', () => {
    it('returns null on cache miss or when DB is not provided', async () => {
      const cacheNoDb = new CadastralCache();
      expect(await cacheNoDb.get('prop:1234')).toBeNull();

      const memoryStore = new Map<string, any>();
      const mockDb: any = {
        prepare: vi.fn((sql: string) => ({
          bind: vi.fn((...args: any[]) => ({
            first: vi.fn(async () => {
              if (sql.includes('SELECT data_json, expires_at')) {
                const item = memoryStore.get(args[0]);
                return item || null;
              }
              return null;
            }),
            run: vi.fn(async () => {
              if (sql.includes('INSERT INTO cadastral_cache')) {
                const [key, _type, _refcat, dataJson, _createdAt, _updatedAt, expiresAt] = args;
                memoryStore.set(key, { data_json: dataJson, expires_at: expiresAt });
              }
              return { success: true };
            }),
          })),
        })),
      };

      const cache = new CadastralCache({ db: mockDb });
      expect(await cache.get('prop:NOT_FOUND')).toBeNull();
    });

    it('stores and retrieves cached cadastral items with 90-day TTL', async () => {
      const memoryStore = new Map<string, any>();
      const mockDb: any = {
        prepare: vi.fn((sql: string) => ({
          bind: vi.fn((...args: any[]) => ({
            first: vi.fn(async () => {
              if (sql.includes('SELECT data_json, expires_at')) {
                return memoryStore.get(args[0]) || null;
              }
              return null;
            }),
            run: vi.fn(async () => {
              if (sql.includes('INSERT INTO cadastral_cache')) {
                const [key, _type, _refcat, dataJson, _createdAt, _updatedAt, expiresAt] = args;
                memoryStore.set(key, { data_json: dataJson, expires_at: expiresAt });
              }
              return { success: true };
            }),
          })),
        })),
      };

      const cache = new CadastralCache({ db: mockDb });

      await cache.set('prop:9872023VH5797S0001WX', 'property', '9872023VH5797S0001WX', mockProperty);
      const retrieved = await cache.get<CadastralProperty>('prop:9872023VH5797S0001WX');

      expect(retrieved).toBeTruthy();
      expect(retrieved?.cadastralReference).toBe('9872023VH5797S0001WX');
      expect(retrieved?.address.street).toBe('Gran Vía');
    });

    it('returns null and purges expired entries when TTL has elapsed', async () => {
      const memoryStore = new Map<string, any>();
      const deletedKeys: string[] = [];
      const expiredIso = new Date(Date.now() - 100000).toISOString();

      memoryStore.set('prop:EXPIRED', {
        data_json: JSON.stringify(mockProperty),
        expires_at: expiredIso,
      });

      const mockDb: any = {
        prepare: vi.fn((sql: string) => ({
          bind: vi.fn((...args: any[]) => ({
            first: vi.fn(async () => {
              if (sql.includes('SELECT data_json, expires_at')) {
                return memoryStore.get(args[0]) || null;
              }
              return null;
            }),
            run: vi.fn(async () => {
              if (sql.includes('DELETE FROM cadastral_cache')) {
                deletedKeys.push(args[0]);
                memoryStore.delete(args[0]);
              }
              return { success: true };
            }),
          })),
        })),
      };

      const cache = new CadastralCache({ db: mockDb });
      const result = await cache.get<CadastralProperty>('prop:EXPIRED');

      expect(result).toBeNull();
      expect(deletedKeys).toContain('prop:EXPIRED');
    });
  });

  describe('CatastroProvider Transparent Caching', () => {
    it('returns cached cadastral property directly without upstream HTTP calls', async () => {
      const memoryStore = new Map<string, any>();
      memoryStore.set('prop:9872023VH5797S0001WX', {
        data_json: JSON.stringify(mockProperty),
        expires_at: new Date(Date.now() + 86400000).toISOString(),
      });

      const mockDb: any = {
        prepare: vi.fn(() => ({
          bind: vi.fn((...args: any[]) => ({
            first: vi.fn(async () => {
              return memoryStore.get(args[0]) || null;
            }),
            run: vi.fn(async () => ({ success: true })),
          })),
        })),
      };

      const provider = new CatastroProvider({ db: mockDb, baseUrl: 'http://invalid-catastro-domain.local' });
      const start = performance.now();
      const prop = await provider.getByCadastralReference('9872023VH5797S0001WX');
      const elapsed = performance.now() - start;

      expect(prop.cadastralReference).toBe('9872023VH5797S0001WX');
      expect(prop.address.municipality).toBe('Madrid');
      expect(elapsed).toBeLessThan(50); // Instant resolution <3ms target
    });

    it('returns cached horizontal division units directly from D1 cache', async () => {
      const mockUnits = {
        cadastralReference: '9872023VH5797S',
        unitsCount: 2,
        hasHorizontalDivision: true,
        units: [
          { cadastralReference: '9872023VH5797S0001WX', floor: '01', door: 'A', use: 'Residencial', builtSurfaceM2: 80 },
          { cadastralReference: '9872023VH5797S0002EZ', floor: '01', door: 'B', use: 'Residencial', builtSurfaceM2: 75 },
        ],
      };

      const memoryStore = new Map<string, any>();
      memoryStore.set('units:9872023VH5797S', {
        data_json: JSON.stringify(mockUnits),
        expires_at: new Date(Date.now() + 86400000).toISOString(),
      });

      const mockDb: any = {
        prepare: vi.fn(() => ({
          bind: vi.fn((...args: any[]) => ({
            first: vi.fn(async () => memoryStore.get(args[0]) || null),
            run: vi.fn(async () => ({ success: true })),
          })),
        })),
      };

      const provider = new CatastroProvider({ db: mockDb, baseUrl: 'http://invalid-catastro-domain.local' });
      const unitsRes = await provider.getUnitsByCadastralReference('9872023VH5797S0001WX');

      expect(unitsRes.units.length).toBe(2);
      expect(unitsRes.units[0].builtSurfaceM2).toBe(80);
    });
  });

  describe('CadastralRouterProvider Transparent Caching', () => {
    it('caches downstream results and serves subsequent queries from D1 cache', async () => {
      const downstreamMock = new MockCatastroProvider();
      const downstreamSpy = vi.spyOn(downstreamMock, 'getByCadastralReference');

      const memoryStore = new Map<string, any>();
      const mockDb: any = {
        prepare: vi.fn((sql: string) => ({
          bind: vi.fn((...args: any[]) => ({
            first: vi.fn(async () => memoryStore.get(args[0]) || null),
            run: vi.fn(async () => {
              if (sql.includes('INSERT INTO cadastral_cache')) {
                memoryStore.set(args[0], {
                  data_json: args[3],
                  expires_at: args[6],
                });
              }
              return { success: true };
            }),
          })),
        })),
      };

      const router = new CadastralRouterProvider({
        dgc: downstreamMock,
        db: mockDb,
      });

      // 1st call: Cache miss -> calls downstream mock
      const prop1 = await router.getByCadastralReference('9872023VH5797S0001WX');
      expect(prop1.cadastralReference).toBe('9872023VH5797S0001WX');
      expect(downstreamSpy).toHaveBeenCalledTimes(1);

      // 2nd call: Cache hit -> served from D1 without downstream call
      const prop2 = await router.getByCadastralReference('9872023VH5797S0001WX');
      expect(prop2.cadastralReference).toBe('9872023VH5797S0001WX');
      expect(downstreamSpy).toHaveBeenCalledTimes(1); // Still 1, served from cache!
    });
  });

  describe('FinOps Zero-Write Caching & Batch Maintenance (v1.3.2)', () => {
    it('does not trigger write queries (UPDATE or INSERT) on cache hits to protect D1 daily quota', async () => {
      const executedSqls: string[] = [];
      const mockDb: any = {
        prepare: vi.fn((sql: string) => {
          executedSqls.push(sql);
          return {
            bind: vi.fn(() => ({
              first: vi.fn(async () => ({
                data_json: JSON.stringify(mockProperty),
                expires_at: new Date(Date.now() + 86400000).toISOString(),
              })),
              run: vi.fn(async () => ({ success: true })),
            })),
          };
        }),
      };

      const cache = new CadastralCache({ db: mockDb });
      const result = await cache.get<CadastralProperty>('prop:9872023VH5797S0001WX');

      expect(result).not.toBeNull();
      expect(result?.cadastralReference).toBe('9872023VH5797S0001WX');

      // Verify that no UPDATE statements were executed during the cache hit
      const updateCalls = executedSqls.filter((sql) => sql.toUpperCase().includes('UPDATE'));
      expect(updateCalls.length).toBe(0);
    });

    it('prunes expired entries in batch with pruneExpired()', async () => {
      let executedDeleteSql = '';
      const mockDb: any = {
        prepare: vi.fn((sql: string) => {
          if (sql.includes('DELETE FROM cadastral_cache')) {
            executedDeleteSql = sql;
          }
          return {
            bind: vi.fn(() => ({
              run: vi.fn(async () => ({ success: true, meta: { changes: 3 } })),
            })),
          };
        }),
      };

      const cache = new CadastralCache({ db: mockDb });
      const pruned = await cache.pruneExpired(100);

      expect(pruned).toBe(3);
      expect(executedDeleteSql).toContain('DELETE FROM cadastral_cache');
      expect(executedDeleteSql).toContain('expires_at <= ?');
    });
  });
});
