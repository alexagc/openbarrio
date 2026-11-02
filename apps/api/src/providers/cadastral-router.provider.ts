import {
  CadastralProperty,
  CadastralCoordinates,
  CadastralUnitsResponse,
  CadastralGeometry,
  BuildingSurroundingsDTO,
  detectCadastralJurisdiction,
} from '@openbarrio/core';
import type { D1Database } from '../types/env.js';
import { ICatastroProvider } from './types.js';
import { CadastralCache } from './cadastral-cache.js';

export interface CadastralRouterOptions {
  dgc: ICatastroProvider;
  navarra?: ICatastroProvider;
  euskadi?: ICatastroProvider;
  db?: D1Database;
  ttlSeconds?: number;
}

export class CadastralRouterProvider implements ICatastroProvider {
  private readonly dgc: ICatastroProvider;
  private readonly navarra: ICatastroProvider;
  private readonly euskadi: ICatastroProvider;
  private readonly cache: CadastralCache;

  constructor(options: CadastralRouterOptions) {
    this.dgc = options.dgc;
    this.navarra = options.navarra || options.dgc;
    this.euskadi = options.euskadi || options.dgc;
    this.cache = new CadastralCache({ db: options.db, ttlSeconds: options.ttlSeconds });
  }

  private resolveProvider(
    refcat?: string | null,
    coords?: { latitude: number; longitude: number }
  ): ICatastroProvider {
    const jurisdiction = detectCadastralJurisdiction(refcat, coords);
    if (jurisdiction === 'navarra') {
      return this.navarra;
    }
    if (['bizkaia', 'gipuzkoa', 'araba'].includes(jurisdiction)) {
      return this.euskadi;
    }
    return this.dgc;
  }

  async getByCoordinates(latitude: number, longitude: number): Promise<CadastralProperty> {
    const cacheKey = `coords:${latitude.toFixed(5)},${longitude.toFixed(5)}`;
    const cached = await this.cache.get<CadastralProperty>(cacheKey);
    if (cached) {
      return cached;
    }

    const provider = this.resolveProvider(undefined, { latitude, longitude });
    const result = await provider.getByCoordinates(latitude, longitude);
    await this.cache.set(cacheKey, 'coordinates', result.cadastralReference, result);
    return result;
  }

  async getByCadastralReference(
    refcat: string,
    fallbackCoords?: CadastralCoordinates,
    preferredPortal?: string
  ): Promise<CadastralProperty> {
    const cleanRef = refcat.replace(/[\s\-_.]/g, '').toUpperCase();
    const cacheKey = `prop:${cleanRef}${preferredPortal ? `:${preferredPortal}` : ''}`;
    const cached = await this.cache.get<CadastralProperty>(cacheKey);
    if (cached) {
      return cached;
    }

    const provider = this.resolveProvider(
      refcat,
      fallbackCoords ? { latitude: fallbackCoords.latitude, longitude: fallbackCoords.longitude } : undefined
    );
    const result = await provider.getByCadastralReference(refcat, fallbackCoords, preferredPortal);
    await this.cache.set(cacheKey, 'property', cleanRef, result);
    return result;
  }

  async getUnitsByCadastralReference(refcat: string): Promise<CadastralUnitsResponse> {
    const cleanRef = refcat.replace(/[\s\-_.]/g, '').toUpperCase();
    const parcelRef = cleanRef.slice(0, 14);
    const cacheKey = `units:${parcelRef}`;
    const cached = await this.cache.get<CadastralUnitsResponse>(cacheKey);
    if (cached) {
      return cached;
    }

    const provider = this.resolveProvider(refcat);
    const result = await provider.getUnitsByCadastralReference(refcat);
    await this.cache.set(cacheKey, 'units', parcelRef, result);
    return result;
  }

  async getGeometryByCadastralReference(refcat: string): Promise<CadastralGeometry> {
    const cleanRef = refcat.replace(/[\s\-_.]/g, '').toUpperCase();
    const parcelRef = cleanRef.slice(0, 14);
    const cacheKey = `geom:${parcelRef}`;
    const cached = await this.cache.get<CadastralGeometry>(cacheKey);
    if (cached) {
      return cached;
    }

    const provider = this.resolveProvider(refcat);
    const result = await provider.getGeometryByCadastralReference(refcat);
    await this.cache.set(cacheKey, 'geometry', parcelRef, result);
    return result;
  }

  async getSurroundingsByCadastralReference(refcat: string): Promise<BuildingSurroundingsDTO> {
    const cleanRef = refcat.replace(/[\s\-_.]/g, '').toUpperCase();
    const parcelRef = cleanRef.substring(0, 14);
    const cacheKey = `surroundings:${parcelRef}`;
    const cached = await this.cache.get<BuildingSurroundingsDTO>(cacheKey);
    if (cached) {
      return cached;
    }

    const provider = this.resolveProvider(refcat);
    const result = await provider.getSurroundingsByCadastralReference(refcat);
    await this.cache.set(cacheKey, 'surroundings', parcelRef, result);
    return result;
  }

  async getSurroundingsByBbox(bbox: [number, number, number, number]) {
    const centerLat = (bbox[1] + bbox[3]) / 2;
    const centerLon = (bbox[0] + bbox[2]) / 2;
    const provider = this.resolveProvider(undefined, { latitude: centerLat, longitude: centerLon });
    if (provider.getSurroundingsByBbox) {
      return provider.getSurroundingsByBbox(bbox);
    }
    return provider.getSurroundingsByCadastralReference('BBOX');
  }
}
