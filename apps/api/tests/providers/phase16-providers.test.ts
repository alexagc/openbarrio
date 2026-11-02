import { describe, it, expect } from 'vitest';
import { RadonProvider, MockRadonProvider } from '../../src/providers/radon.provider.js';
import { VutProvider, MockVutProvider } from '../../src/providers/vut.provider.js';

describe('Phase 16 Providers: Radon & VUT', () => {
  describe('RadonProvider & MockRadonProvider', () => {
    it('evaluates Madrid capital (28079) as Zona I', async () => {
      const mockRadon = new MockRadonProvider();
      const result = await mockRadon.getRadonEvaluation('28079', '28', 2, 10);
      expect(result.municipalityZone).toBe('Zona I');
      expect(result.riskLevel).toBe('negligible');
      expect(result.requiresMitigation).toBe(false);
    });

    it('evaluates ground floor in Galicia province (32 Ourense) as Zona II with mandatory mitigation', async () => {
      const mockRadon = new MockRadonProvider();
      const result = await mockRadon.getRadonEvaluation('32054', '32', 0, 8);
      expect(result.municipalityZone).toBe('Zona II');
      expect(result.riskLevel).toBe('high');
      expect(result.requiresMitigation).toBe(true);
    });

    it('fallback provider resolves geological zones when database is offline', async () => {
      const liveRadon = new RadonProvider(undefined);
      const resGalicia = await liveRadon.getRadonEvaluation('36038', '36', 0, 1);
      expect(resGalicia.municipalityZone).toBe('Zona II');
      expect(resGalicia.riskLevel).toBe('high');

      const resBarcelona = await liveRadon.getRadonEvaluation('08019', '08', 3, 20);
      expect(resBarcelona.municipalityZone).toBe('Zona 0');
      expect(resBarcelona.riskLevel).toBe('negligible');
    });
  });

  describe('VutProvider & MockVutProvider', () => {
    it('evaluates tourist hotspot census section with critical saturation', async () => {
      const mockVut = new MockVutProvider();
      const result = await mockVut.getVutEvaluation('2807901001');
      expect(result.vutRatioPct).toBeGreaterThanOrEqual(8.0);
      expect(result.saturationRisk).toBe('critical');
      expect(result.penaltyApplied).toBeGreaterThanOrEqual(15);
    });

    it('evaluates standard residential section with low saturation', async () => {
      const mockVut = new MockVutProvider();
      const result = await mockVut.getVutEvaluation('2807917001');
      expect(result.vutRatioPct).toBeLessThan(3.0);
      expect(result.saturationRisk).toBe('low');
      expect(result.penaltyApplied).toBe(0);
    });

    it('fallback provider calculates deterministic realistic saturation without database', async () => {
      const liveVut = new VutProvider(undefined);
      const res = await liveVut.getVutEvaluation('2807904001');
      expect(res.censusSectionId).toBe('2807904001');
      expect(res.totalDwellings).toBeGreaterThan(0);
      expect(res.vutRatioPct).toBeGreaterThanOrEqual(0);
    });
  });
});
