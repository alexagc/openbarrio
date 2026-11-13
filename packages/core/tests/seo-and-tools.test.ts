import { describe, it, expect } from 'vitest';
import {
  slugifySpanishMunicipality,
  evaluateSurfaceDiscrepancy,
  calculateLegalRentCap,
  MunicipalitySummarySchema,
  MunicipalityDetailSchema,
} from '../src/index.js';
import { Value } from '@sinclair/typebox/value';

describe('Phase 21: SEO & Micro-Tools Core Logic', () => {
  describe('slugifySpanishMunicipality', () => {
    it('normalizes accents, diacritics, and special characters', () => {
      expect(slugifySpanishMunicipality('Madrid')).toBe('madrid');
      expect(slugifySpanishMunicipality('Castelló de la Plana')).toBe('castello-de-la-plana');
      expect(slugifySpanishMunicipality('Donostia / San Sebastián')).toBe('donostia-san-sebastian');
      expect(slugifySpanishMunicipality('Palma de Mallorca')).toBe('palma-de-mallorca');
      expect(slugifySpanishMunicipality('A Coruña')).toBe('a-coruna');
      expect(slugifySpanishMunicipality('Vitoria-Gasteiz')).toBe('vitoria-gasteiz');
    });
  });

  describe('evaluateSurfaceDiscrepancy', () => {
    it('flags discrepancies > 15% as significant with legal remedies', () => {
      const res = evaluateSurfaceDiscrepancy('28079A00100001', 80, 100, 300000);
      expect(res.divergenceM2).toBe(20);
      expect(res.discrepancyPct).toBe(25);
      expect(res.isSignificantDiscrepancy).toBe(true);
      expect(res.advertisedEurM2).toBe(3000);
      expect(res.estimatedOverpriceEur).toBe(60000);
      expect(res.legalRemedySummary).toContain('15%');
      expect(res.catastroDirectUrl).toContain('28079A00100001');
    });

    it('tolerates differences under 15%', () => {
      const res = evaluateSurfaceDiscrepancy('28079A00100001', 90, 95, 200000);
      expect(res.divergenceM2).toBe(5);
      expect(res.isSignificantDiscrepancy).toBe(false);
      expect(res.legalRemedySummary).toContain('inferior al 15%');
    });

    it('handles identical or smaller advertised surface', () => {
      const res = evaluateSurfaceDiscrepancy('28079A00100001', 100, 90, 200000);
      expect(res.divergenceM2).toBe(-10);
      expect(res.isSignificantDiscrepancy).toBe(false);
      expect(res.estimatedOverpriceEur).toBeUndefined();
    });
  });

  describe('calculateLegalRentCap', () => {
    it('computes free market when stressed market is false', () => {
      const res = calculateLegalRentCap({
        municipalityName: 'Toledo',
        isStressedMarket: false,
        surfaceM2: 70,
        isGrandTenant: false,
      });
      expect(res.clauseLegalType).toBe('LIBRE_MERCADO');
      expect(res.explanatoryNotes[0]).toContain('no está actualmente declarado');
    });

    it('enforces SERPAVI cap for gran tenedor in stressed market', () => {
      const res = calculateLegalRentCap({
        municipalityName: 'Barcelona',
        isStressedMarket: true,
        surfaceM2: 80,
        isGrandTenant: true,
        serpaviUpperEurM2: 15.0,
      });
      expect(res.clauseLegalType).toBe('TOPE_INDICE_SERPAVI');
      expect(res.legalMaxRentEur).toBe(1200);
      expect(res.monthlyBenchmarkRangeEur.upper).toBe(1200);
    });

    it('enforces previous contract cap for small landlord', () => {
      const res = calculateLegalRentCap({
        municipalityName: 'Barcelona',
        isStressedMarket: true,
        surfaceM2: 75,
        isGrandTenant: false,
        previousContractRentEur: 900,
        hasCeeImprovement: false,
      });
      expect(res.clauseLegalType).toBe('TOPE_CONTRATO_ANTERIOR');
      expect(res.legalMaxRentEur).toBe(927); // 900 * 1.03
    });
  });

  describe('DTO Schema Validation', () => {
    it('validates MunicipalitySummarySchema', () => {
      const valid = {
        code: '28079',
        name: 'Madrid',
        slug: 'madrid',
        provinceCode: '28',
        provinceName: 'Madrid',
        autonomousCommunity: 'Comunidad de Madrid',
        averageHouseholdIncomeEur: 42500,
        percentileNational: 85,
        isStressedMarket: false,
        radonZone: 'Zona I',
        totalCensusSections: 2400,
        estimatedBarrioScore: 82,
      };
      expect(Value.Check(MunicipalitySummarySchema, valid)).toBe(true);
    });

    it('validates MunicipalityDetailSchema', () => {
      const valid = {
        code: '08019',
        name: 'Barcelona',
        slug: 'barcelona',
        provinceCode: '08',
        provinceName: 'Barcelona',
        autonomousCommunity: 'Cataluña',
        averageHouseholdIncomeEur: 41200,
        medianHouseholdIncomeEur: 36500,
        averagePersonIncomeEur: 18900,
        percentileNational: 84,
        isStressedMarket: true,
        serpaviMedianEurM2: 13.5,
        serpaviRangeEurM2: { lower: 11.0, upper: 16.2 },
        radonZone: 'Zona 0',
        totalCensusSections: 1068,
        medianAge: 44.5,
        singlePersonHouseholdPct: 29.8,
        estimatedBarrioScore: 86,
        sampleProperties: [
          { refcat: '08019A00100001', address: 'Passeig de Gràcia 1', year: 1910, surfaceM2: 120 },
        ],
        itpGeneralRatePct: 10.0,
        updatedAt: '2026-11-12T00:00:00Z',
      };
      expect(Value.Check(MunicipalityDetailSchema, valid)).toBe(true);
    });
  });
});
