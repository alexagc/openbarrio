import { CadastralProperty } from '@openbarrio/core';
import { ICatastroProvider } from './types.js';
import { CadastralNotFoundError } from '../errors/problem-details.js';

export class MockCatastroProvider implements ICatastroProvider {
  private readonly propertiesByRef: Map<string, CadastralProperty> = new Map();

  constructor() {
    this.seedDefaults();
  }

  private seedDefaults(): void {
    const madridProp: CadastralProperty = {
      cadastralReference: '9872023VH5797S0001WX',
      address: {
        street: 'Calle Gran Vía',
        number: '28',
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
        builtSurfaceM2: 31500,
        primaryUse: 'Comercial',
        unitsCount: 48,
        hasCommercialGroundFloor: true,
      },
    };

    const bcnProp: CadastralProperty = {
      cadastralReference: '08019A002000050000AB',
      address: {
        street: 'Passeig de Gràcia',
        number: '43',
        postalCode: '08007',
        municipality: 'Barcelona',
        province: 'Barcelona',
      },
      coordinates: {
        latitude: 41.39167,
        longitude: 2.16472,
        srs: 'EPSG:4326',
      },
      building: {
        constructionYear: 1904,
        builtSurfaceM2: 4300,
        primaryUse: 'Residencial',
        unitsCount: 12,
        hasCommercialGroundFloor: true,
      },
    };

    const valenciaProp: CadastralProperty = {
      cadastralReference: '4625001VK4722E0001AZ',
      address: {
        street: 'Carrer de Colón',
        number: '15',
        postalCode: '46004',
        municipality: 'València',
        province: 'València',
      },
      coordinates: {
        latitude: 39.4699,
        longitude: -0.3735,
        srs: 'EPSG:4326',
      },
      building: {
        constructionYear: 1986,
        builtSurfaceM2: 1850,
        primaryUse: 'Residencial',
        unitsCount: 22,
        hasCommercialGroundFloor: true,
      },
    };

    this.propertiesByRef.set(madridProp.cadastralReference, madridProp);
    this.propertiesByRef.set(bcnProp.cadastralReference, bcnProp);
    this.propertiesByRef.set(valenciaProp.cadastralReference, valenciaProp);
  }

  async getByCoordinates(latitude: number, longitude: number): Promise<CadastralProperty> {
    if (latitude === 0 && longitude === 0) {
      throw new CadastralNotFoundError(`Lat: ${latitude}, Lon: ${longitude}`);
    }

    // Proximity matching for mock cities - ONLY exact landmark coordinates (< 15 meters)
    if (Math.abs(latitude - 40.42028) < 0.00015 && Math.abs(longitude - -3.70379) < 0.00015) {
      const prop = this.propertiesByRef.get('9872023VH5797S0001WX')!;
      return {
        ...prop,
        coordinates: { latitude, longitude, srs: 'EPSG:4326' },
      };
    }

    if (Math.abs(latitude - 41.39167) < 0.00015 && Math.abs(longitude - 2.16472) < 0.00015) {
      const prop = this.propertiesByRef.get('08019A002000050000AB')!;
      return {
        ...prop,
        coordinates: { latitude, longitude, srs: 'EPSG:4326' },
      };
    }

    if (Math.abs(latitude - 39.4699) < 0.00015 && Math.abs(longitude - -0.3735) < 0.00015) {
      const prop = this.propertiesByRef.get('4625001VK4722E0001AZ')!;
      return {
        ...prop,
        coordinates: { latitude, longitude, srs: 'EPSG:4326' },
      };
    }

    // Deterministic generation for any Spanish coordinate
    const isCatalunya = latitude >= 40.5 && latitude <= 42.8 && longitude >= 0.2 && longitude <= 3.3;
    const isValenciana = latitude >= 37.8 && latitude <= 40.8 && longitude >= -1.5 && longitude <= 0.6;
    const isAndalucia = latitude >= 36.0 && latitude <= 38.7 && longitude >= -7.5 && longitude <= -1.7;

    let city = 'Madrid';
    let prov = 'Madrid';
    let cp = '28001';
    let streets = ['Calle Mayor', 'Calle Alcalá', 'Paseo de la Castellana', 'Calle Atocha', 'Calle Goya'];

    if (isCatalunya) {
      city = 'Barcelona';
      prov = 'Barcelona';
      cp = '08001';
      streets = ['Carrer Major', 'Rambla de Catalunya', 'Carrer d\'Aragó', 'Carrer de Balmes'];
    } else if (isValenciana) {
      city = 'València';
      prov = 'València';
      cp = '46001';
      streets = ['Carrer de la Pau', 'Avinguda del Port', 'Carrer de Sant Vicent'];
    } else if (isAndalucia) {
      city = 'Sevilla';
      prov = 'Sevilla';
      cp = '41001';
      streets = ['Calle San Fernando', 'Avenida de la Constitución', 'Calle Asunción'];
    }

    const hash = Math.abs(Math.round(latitude * 1000 + longitude * 1000));
    const year = 1960 + (hash % 60); // 1960 - 2020
    const surface = 65 + (hash % 120);
    const units = 1 + (hash % 30);
    const street = streets[hash % streets.length];
    const ref = `${cp.slice(0, 2)}079A${String(hash).padStart(8, '0')}0001WX`;

    return {
      cadastralReference: ref,
      address: {
        street,
        number: `${(hash % 90) + 1}`,
        postalCode: cp,
        municipality: city,
        province: prov,
      },
      coordinates: {
        latitude,
        longitude,
        srs: 'EPSG:4326',
      },
      building: {
        constructionYear: year,
        builtSurfaceM2: surface,
        primaryUse: 'Residencial',
        unitsCount: units,
        hasCommercialGroundFloor: hash % 2 === 0,
      },
    };
  }

  async getByCadastralReference(refcat: string): Promise<CadastralProperty> {
    const normalized = refcat.trim().toUpperCase();

    if (
      normalized.startsWith('000000') ||
      normalized.includes('NOTFOUND') ||
      normalized.length < 14
    ) {
      throw new CadastralNotFoundError(refcat);
    }

    const existing = this.propertiesByRef.get(normalized);
    if (existing) {
      return existing;
    }

    // Check prefix matches (14 chars parcel ref matching 20 chars property)
    for (const [key, value] of this.propertiesByRef.entries()) {
      if (normalized.startsWith(key.slice(0, 14)) || key.startsWith(normalized.slice(0, 14))) {
        return value;
      }
    }

    // Synthesize valid deterministic response for unknown test refcat
    let hash = 0;
    for (let i = 0; i < normalized.length; i++) {
      hash = (hash * 31 + normalized.charCodeAt(i)) & 0xffffff;
    }
    const year = 1970 + (hash % 50);

    return {
      cadastralReference: normalized,
      address: {
        street: 'Calle Mayor',
        number: `${(hash % 50) + 1}`,
        postalCode: '28013',
        municipality: 'Madrid',
        province: 'Madrid',
      },
      coordinates: {
        latitude: 40.415 + ((hash % 100) / 10000),
        longitude: -3.707 + ((hash % 100) / 10000),
        srs: 'EPSG:4326',
      },
      building: {
        constructionYear: year,
        builtSurfaceM2: 95 + (hash % 80),
        primaryUse: 'Residencial',
        unitsCount: 1 + (hash % 24),
        hasCommercialGroundFloor: hash % 3 === 0,
      },
    };
  }
}
