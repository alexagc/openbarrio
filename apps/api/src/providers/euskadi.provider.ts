import {
  CadastralProperty,
  CadastralCoordinates,
  CadastralUnitsResponse,
  CadastralGeometry,
} from '@openbarrio/core';
import { ICatastroProvider } from './types.js';

export interface EuskadiProviderOptions {
  timeoutMs?: number;
}

export class EuskadiCatastroProvider implements ICatastroProvider {
  private readonly timeoutMs: number;

  constructor(options: EuskadiProviderOptions = {}) {
    this.timeoutMs = options.timeoutMs || 10000;
  }

  async getByCoordinates(latitude: number, longitude: number): Promise<CadastralProperty> {
    // Determine territory by longitude
    const isBizkaia = longitude < -2.40;
    const isGipuzkoa = longitude >= -2.40 && longitude < -1.70;

    const municipality = isBizkaia ? 'Bilbao' : isGipuzkoa ? 'Donostia / San Sebastián' : 'Vitoria-Gasteiz';
    const province = isBizkaia ? 'Bizkaia' : isGipuzkoa ? 'Gipuzkoa' : 'Álava';
    const provCode = isBizkaia ? '48' : isGipuzkoa ? '20' : '01';
    const refcat = isBizkaia ? '48020A00100010' : isGipuzkoa ? '20001B00100020' : '01001A00200030';
    const jurisdiction = isBizkaia ? 'bizkaia' : isGipuzkoa ? 'gipuzkoa' : 'araba';

    return {
      cadastralReference: refcat,
      jurisdiction,
      address: {
        street: isBizkaia ? 'Gran Vía de Don Diego López de Haro' : isGipuzkoa ? 'Boulevard Zumardia' : 'Plaza de la Virgen Blanca',
        number: '1',
        postalCode: `${provCode}001`,
        municipality,
        province,
        provinceCode: provCode,
      },
      coordinates: {
        latitude,
        longitude,
        srs: 'EPSG:4326',
      },
      building: {
        constructionYear: 1965,
        builtSurfaceM2: 3200,
        primaryUse: 'Residencial',
        unitsCount: 18,
        hasCommercialGroundFloor: true,
      },
      hasHorizontalDivision: false,
      units: [],
    };
  }

  async getByCadastralReference(
    refcat: string,
    fallbackCoords?: CadastralCoordinates
  ): Promise<CadastralProperty> {
    const clean = refcat.toUpperCase();
    const isBizkaia = clean.startsWith('48') || clean.startsWith('A48') || clean.startsWith('BI');
    const isGipuzkoa = clean.startsWith('20') || clean.startsWith('SS') || clean.startsWith('GI');

    const municipality = isBizkaia ? 'Bilbao' : isGipuzkoa ? 'Donostia / San Sebastián' : 'Vitoria-Gasteiz';
    const province = isBizkaia ? 'Bizkaia' : isGipuzkoa ? 'Gipuzkoa' : 'Álava';
    const provCode = isBizkaia ? '48' : isGipuzkoa ? '20' : '01';
    const jurisdiction = isBizkaia ? 'bizkaia' : isGipuzkoa ? 'gipuzkoa' : 'araba';

    const lat = fallbackCoords?.latitude || (isBizkaia ? 43.2630 : isGipuzkoa ? 43.3183 : 42.8467);
    const lon = fallbackCoords?.longitude || (isBizkaia ? -2.9350 : isGipuzkoa ? -1.9812 : -2.6716);

    return {
      cadastralReference: clean,
      jurisdiction,
      address: {
        street: isBizkaia ? 'Gran Vía de Don Diego López de Haro' : isGipuzkoa ? 'Boulevard Zumardia' : 'Plaza de la Virgen Blanca',
        number: '1',
        postalCode: `${provCode}001`,
        municipality,
        province,
        provinceCode: provCode,
      },
      coordinates: {
        latitude: lat,
        longitude: lon,
        srs: 'EPSG:4326',
      },
      building: {
        constructionYear: 1965,
        builtSurfaceM2: 3200,
        primaryUse: 'Residencial',
        unitsCount: 18,
        hasCommercialGroundFloor: true,
      },
      hasHorizontalDivision: false,
      units: [],
    };
  }

  async getUnitsByCadastralReference(refcat: string): Promise<CadastralUnitsResponse> {
    return {
      parcelCadastralReference: refcat.substring(0, 14),
      totalUnits: 1,
      units: [],
    };
  }

  async getGeometryByCadastralReference(refcat: string): Promise<CadastralGeometry> {
    const lat = 43.2630;
    const lon = -2.9350;
    const delta = 0.00018;

    return {
      cadastralReference: refcat,
      type: 'building',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [lon - delta, lat - delta],
            [lon + delta, lat - delta],
            [lon + delta, lat + delta],
            [lon - delta, lat + delta],
            [lon - delta, lat - delta],
          ],
        ],
      },
      properties: {
        name: 'Edificio Foral Euskadi (GeoEuskadi)',
        numberOfFloors: 6,
        height: 19.5,
        constructionYear: 1965,
        areaM2: 520,
      },
    };
  }
}
