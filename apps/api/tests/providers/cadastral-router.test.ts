import { describe, it, expect } from 'vitest';
import { CadastralRouterProvider } from '../../src/providers/cadastral-router.provider.js';
import { MockCatastroProvider } from '../../src/providers/catastro.mock.js';
import { NavarraCatastroProvider } from '../../src/providers/navarra.provider.js';
import { EuskadiCatastroProvider } from '../../src/providers/euskadi.provider.js';

describe('CadastralRouterProvider & Foral Connectors', () => {
  const dgc = new MockCatastroProvider();
  const navarra = new NavarraCatastroProvider();
  const euskadi = new EuskadiCatastroProvider();

  const router = new CadastralRouterProvider({
    dgc,
    navarra,
    euskadi,
  });

  describe('Coordinate Routing', () => {
    it('routes Bilbao GPS coordinates to Euskadi provider', async () => {
      // Bilbao: 43.2630, -2.9350
      const prop = await router.getByCoordinates(43.2630, -2.9350);
      expect(prop.jurisdiction).toBe('bizkaia');
      expect(prop.address.municipality).toContain('Bilbao');
      expect(prop.hasHorizontalDivision).toBe(false);
      expect(prop.units).toEqual([]);
    });

    it('routes Pamplona GPS coordinates to Navarra provider', async () => {
      // Pamplona: 42.8169, -1.6432
      const prop = await router.getByCoordinates(42.8169, -1.6432);
      expect(prop.jurisdiction).toBe('navarra');
      expect(prop.address.municipality).toContain('Pamplona');
      expect(prop.hasHorizontalDivision).toBe(false);
    });

    it('routes Madrid coordinates to standard DGC provider', async () => {
      // Madrid Gran Vía: 40.42028, -3.70379
      const prop = await router.getByCoordinates(40.42028, -3.70379);
      expect(prop.address.municipality).toBe('Madrid');
    });
  });

  describe('Cadastral Reference Routing', () => {
    it('routes Bizkaia reference to Euskadi provider', async () => {
      const prop = await router.getByCadastralReference('48020A00100010');
      expect(prop.jurisdiction).toBe('bizkaia');
    });

    it('routes Navarra reference to Navarra provider', async () => {
      const prop = await router.getByCadastralReference('312010000100010000AA');
      expect(prop.jurisdiction).toBe('navarra');
    });

    it('routes DGC reference to DGC provider', async () => {
      const prop = await router.getByCadastralReference('9872023VH5797S0001WX');
      expect(prop.address.municipality).toBe('Madrid');
    });
  });

  describe('Graceful Degradation for Foral Units & WFS Geometry', () => {
    it('returns empty units list and hasHorizontalDivision false for foral units queries', async () => {
      const units = await router.getUnitsByCadastralReference('312010000100010000AA');
      expect(units.totalUnits).toBe(1);
      expect(units.units).toEqual([]);
    });

    it('returns valid geometry polygon for foral references', async () => {
      const geom = await router.getGeometryByCadastralReference('48020A00100010');
      expect(geom.type).toBe('building');
      expect(geom.geometry.coordinates[0].length).toBeGreaterThanOrEqual(4);
    });
  });
});
