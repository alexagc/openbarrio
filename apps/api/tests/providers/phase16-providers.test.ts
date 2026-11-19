import { describe, it, expect } from 'vitest';
import { RadonProvider, MockRadonProvider } from '../../src/providers/radon.provider.js';
import { VutProvider, MockVutProvider } from '../../src/providers/vut.provider.js';

describe('Phase 16 Providers: Radon & VUT', () => {
  describe('RadonProvider & MockRadonProvider', () => {
    it('evaluates Madrid capital (28079) as Zona I in mock mode', async () => {
      const mockRadon = new MockRadonProvider();
      const res = await mockRadon.getRadonEvaluation('28079', '28', 2, 10);
      expect(res.status).toBe('ok');
      expect(res.data?.municipalityZone).toBe('Zona I');
      expect(res.data?.riskLevel).toBe('negligible');
      expect(res.data?.requiresMitigation).toBe(false);
    });

    it('evaluates ground floor in Galicia province (32 Ourense) as Zona II with mandatory mitigation', async () => {
      const mockRadon = new MockRadonProvider();
      const res = await mockRadon.getRadonEvaluation('32054', '32', 0, 8);
      expect(res.status).toBe('ok');
      expect(res.data?.municipalityZone).toBe('Zona II');
      expect(res.data?.riskLevel).toBe('high');
      expect(res.data?.requiresMitigation).toBe(true);
    });

    it('returns unavailable when D1 database is unbound and resolves Zona 0 on clean DB miss', async () => {
      const offlineRadon = new RadonProvider(undefined);
      const offlineRes = await offlineRadon.getRadonEvaluation('36038', '36', 0, 1);
      expect(offlineRes.status).toBe('unavailable');
      expect(offlineRes.data).toBeUndefined();

      const mockDb: any = {
        prepare: () => ({
          bind: (muniCode: string) => ({
            first: async () => (muniCode === '36038' ? { zone: 'Zona II' } : null),
          }),
        }),
      };

      const d1Radon = new RadonProvider(mockDb);
      const resGalicia = await d1Radon.getRadonEvaluation('36038', '36', 0, 1);
      expect(resGalicia.status).toBe('ok');
      expect(resGalicia.data?.municipalityZone).toBe('Zona II');
      expect(resGalicia.data?.riskLevel).toBe('high');

      const resBarcelona = await d1Radon.getRadonEvaluation('08019', '08', 3, 20);
      expect(resBarcelona.status).toBe('ok');
      expect(resBarcelona.data?.municipalityZone).toBe('Zona 0');
      expect(resBarcelona.data?.riskLevel).toBe('negligible');
    });
  });

  describe('VutProvider & MockVutProvider', () => {
    it('evaluates tourist hotspot census section with critical saturation', async () => {
      const mockVut = new MockVutProvider();
      const res = await mockVut.getVutEvaluation('2807901001');
      expect(res.status).toBe('ok');
      const result = res.data!;
      expect(result.vutRatioPct).toBeGreaterThanOrEqual(8.0);
      expect(result.saturationRisk).toBe('critical');
      expect(result.penaltyApplied).toBeGreaterThanOrEqual(15);
      expect(result.isEstimated).toBe(false);
    });

    it('evaluates standard residential section with low saturation', async () => {
      const mockVut = new MockVutProvider();
      const res = await mockVut.getVutEvaluation('2807917001');
      expect(res.status).toBe('ok');
      const result = res.data!;
      expect(result.vutRatioPct).toBeLessThan(3.0);
      expect(result.saturationRisk).toBe('low');
      expect(result.penaltyApplied).toBe(0);
      expect(result.isEstimated).toBe(false);
    });

    it('returns unavailable instead of fabricating hash fallback when database is offline and live lookup disabled', async () => {
      const liveVut = new VutProvider(undefined, { enableLiveLookup: false });
      const res = await liveVut.getVutEvaluation('2807904001');
      expect(res.status).toBe('unavailable');
      expect(res.data).toBeUndefined();
    });

    it('returns out_of_coverage when D1 is bound and tract has no VUT record with live lookup disabled', async () => {
      const mockDb: any = {
        prepare: () => ({
          bind: () => ({
            first: async () => null,
          }),
        }),
      };
      const dbVut = new VutProvider(mockDb, { enableLiveLookup: false });
      const res = await dbVut.getVutEvaluation('2807904001');
      expect(res.status).toBe('out_of_coverage');
      expect(res.data).toBeUndefined();
    });
  });
});
