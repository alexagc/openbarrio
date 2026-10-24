import { describe, it, expect } from 'vitest';
import { Value } from '@sinclair/typebox/value';
import {
  isCadastralReference,
  CadastralUnitSchema,
  CadastralUnitsResponseSchema,
} from '../src/types/catastro.js';

describe('isCadastralReference Validation Engine', () => {
  describe('Valid Spanish Cadastral References', () => {
    it('should validate official urban 14-character parcel references', () => {
      expect(isCadastralReference('0549711VK4704H')).toBe(true);
      expect(isCadastralReference('9872023VH5797S')).toBe(true);
      expect(isCadastralReference('1755501VK4715F')).toBe(true);
      expect(isCadastralReference('0227802DF3802E')).toBe(true);
    });

    it('should validate official urban 20-character unit references', () => {
      expect(isCadastralReference('9872023VH5797S0001WX')).toBe(true);
      expect(isCadastralReference('0549711VK4704H0001IJ')).toBe(true);
      expect(isCadastralReference('1755501VK4715F0001EQ')).toBe(true);
    });

    it('should validate official rural 14-character and 20-character references', () => {
      // 28 prov + 900 mun + A sector + 012 poly + 00034 parcel
      expect(isCadastralReference('28900A01200034')).toBe(true);
      expect(isCadastralReference('28900A012000340001XY')).toBe(true);
    });

    it('should tolerate formatting spaces, dashes and lower case', () => {
      expect(isCadastralReference('9872023 vh5797s 0001 wx')).toBe(true);
      expect(isCadastralReference('0549711-VK4704H')).toBe(true);
      expect(isCadastralReference('9872023.VH5797S.0001.WX')).toBe(true);
    });
  });

  describe('Invalid Strings & Street Addresses (Multi-Letter & Common Addresses)', () => {
    it('should strictly reject street addresses with letters (e.g. 44 B, 25 B, 14 bis)', () => {
      // These strings have alphanumeric length between 14 and 20 when spaces are removed,
      // but are street addresses and must NEVER be detected as RefCats.
      expect(isCadastralReference('Calle Serrano 44 B')).toBe(false);
      expect(isCadastralReference('Calle Alcalá 25 B')).toBe(false);
      expect(isCadastralReference('Gran Vía 28 B Madrid')).toBe(false);
      expect(isCadastralReference('Carrer Balmes 12 B')).toBe(false);
      expect(isCadastralReference('Calle Mayor 14 bis')).toBe(false);
      expect(isCadastralReference('Paseo Gràcia 43 B')).toBe(false);
      expect(isCadastralReference('Avda América 10 B')).toBe(false);
      expect(isCadastralReference('Serrano 44 B Madrid')).toBe(false);
      expect(isCadastralReference('San Jerónimo 12 B')).toBe(false);
    });

    it('should reject pure numbers or pure letters without alphanumeric mix', () => {
      expect(isCadastralReference('12345678901234')).toBe(false);
      expect(isCadastralReference('12345678901234567890')).toBe(false);
      expect(isCadastralReference('ABCDEFGHIJKLMN')).toBe(false);
      expect(isCadastralReference('ABCDEFGHIJKLMN01234567890')).toBe(false);
    });

    it('should reject strings that are neither 14 nor 20 characters', () => {
      expect(isCadastralReference('0549711VK4704')).toBe(false); // 13 chars
      expect(isCadastralReference('0549711VK4704H1')).toBe(false); // 15 chars
      expect(isCadastralReference('9872023VH5797S0001W')).toBe(false); // 19 chars
      expect(isCadastralReference('9872023VH5797S0001WXY')).toBe(false); // 21 chars
    });

    it('should safely reject null, undefined and empty strings', () => {
      expect(isCadastralReference(null)).toBe(false);
      expect(isCadastralReference(undefined)).toBe(false);
      expect(isCadastralReference('')).toBe(false);
      expect(isCadastralReference('   ')).toBe(false);
    });
  });

  describe('Horizontal Division CadastralUnit Schemas', () => {
    it('validates a correct CadastralUnit object', () => {
      const validUnit = {
        cadastralReference: '2890001VK4729A0001XY',
        floor: '03',
        door: 'B',
        staircase: '1',
        block: '1',
        use: 'Residencial',
        builtSurfaceM2: 84,
        participationCoefficient: 2.45,
      };

      expect(Value.Check(CadastralUnitSchema, validUnit)).toBe(true);
    });

    it('validates a complete CadastralUnitsResponse object', () => {
      const validResponse = {
        parcelCadastralReference: '2890001VK4729A',
        totalUnits: 1,
        units: [
          {
            cadastralReference: '2890001VK4729A0001XY',
            floor: 'PB',
            door: '01',
            use: 'Comercial',
            builtSurfaceM2: 120,
            participationCoefficient: 5.0,
          },
        ],
      };

      expect(Value.Check(CadastralUnitsResponseSchema, validResponse)).toBe(true);
    });

    it('rejects CadastralUnitsResponse with missing required fields', () => {
      const invalidResponse = {
        parcelCadastralReference: '2890001VK4729A',
        // missing totalUnits
        units: [],
      };

      expect(Value.Check(CadastralUnitsResponseSchema, invalidResponse)).toBe(false);
    });
  });
});
