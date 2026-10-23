import { describe, it, expect } from 'vitest';
import {
  UrbanPlanningProvider,
  MockUrbanPlanningProvider,
} from '../../src/providers/urban-planning.provider.js';
import { CadastralProperty } from '@openbarrio/core';

describe('Urban Planning Provider', () => {
  const urbanMadrid: CadastralProperty = {
    cadastralReference: '9872023VH5797S0001WX',
    address: {
      street: 'Calle Gran Vía',
      number: '28',
      postalCode: '28013',
      municipality: 'Madrid',
      province: 'Madrid',
    },
    coordinates: { latitude: 40.42028, longitude: -3.70379, srs: 'EPSG:4326' },
    building: {
      constructionYear: 1924,
      builtSurfaceM2: 31500,
      primaryUse: 'Comercial',
      unitsCount: 48,
      hasCommercialGroundFloor: true,
    },
  };

  const bcnProperty: CadastralProperty = {
    cadastralReference: '08019A002000050000AB',
    address: {
      street: 'Passeig de Gràcia',
      number: '43',
      postalCode: '08007',
      municipality: 'Barcelona',
      province: 'Barcelona',
    },
    coordinates: { latitude: 41.39167, longitude: 2.16472, srs: 'EPSG:4326' },
    building: {
      constructionYear: 1904,
      builtSurfaceM2: 4300,
      primaryUse: 'Residencial',
      unitsCount: 12,
      hasCommercialGroundFloor: true,
    },
  };

  const rusticProperty: CadastralProperty = {
    cadastralReference: '9999001VK4722E0001AZ',
    address: {
      street: 'Diseminado Rústico',
      number: '1',
      postalCode: '46000',
      municipality: 'Valencia',
      province: 'Valencia',
    },
    coordinates: { latitude: 39.4, longitude: -0.4, srs: 'EPSG:4326' },
    building: {
      constructionYear: 0,
      builtSurfaceM2: 0,
      primaryUse: 'Agrario / Forestal',
      unitsCount: 0,
      hasCommercialGroundFloor: false,
    },
  };

  describe('UrbanPlanningProvider', () => {
    const provider = new UrbanPlanningProvider();

    it('classifies urban property as URBAN_CONSOLIDATED and non-stressed in Madrid', async () => {
      const data = await provider.getUrbanPlanning(urbanMadrid);

      expect(data.landClassification).toBe('URBAN_CONSOLIDATED');
      expect(data.isProtectedLand).toBe(false);
      expect(data.isStressedHousingZone).toBe(false);
      expect(data.declaredRenovationsCount).toBe(1);
      expect(data.lastRenovationYear).toBeGreaterThanOrEqual(1964);
    });

    it('identifies Barcelona property as declared Stressed Housing Zone (Ley 12/2023)', async () => {
      const data = await provider.getUrbanPlanning(bcnProperty);

      expect(data.landClassification).toBe('URBAN_CONSOLIDATED');
      expect(data.isStressedHousingZone).toBe(true);
    });

    it('classifies agricultural land as RUSTIC_PROTECTED with environmental protection', async () => {
      const data = await provider.getUrbanPlanning(rusticProperty);

      expect(data.landClassification).toBe('RUSTIC_PROTECTED');
      expect(data.isProtectedLand).toBe(true);
      expect(data.zoningCode).toBe('SNU-P');
    });
  });

  describe('MockUrbanPlanningProvider', () => {
    const mock = new MockUrbanPlanningProvider();

    it('allows custom override per cadastral reference', async () => {
      mock.setOverride('CUSTOM_TEST_RC_01', {
        landClassification: 'DEVELOPABLE',
        zoningCode: 'SURB-NEW',
        isProtectedLand: false,
        declaredRenovationsCount: 3,
        lastRenovationYear: 2021,
        isStressedHousingZone: true,
      });

      const prop: CadastralProperty = {
        ...urbanMadrid,
        cadastralReference: 'CUSTOM_TEST_RC_01',
      };

      const data = await mock.getUrbanPlanning(prop);
      expect(data.landClassification).toBe('DEVELOPABLE');
      expect(data.lastRenovationYear).toBe(2021);
      expect(data.declaredRenovationsCount).toBe(3);
    });
  });
});
