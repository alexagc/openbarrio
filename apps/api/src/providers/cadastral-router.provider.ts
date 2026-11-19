import {
  CadastralProperty,
  CadastralCoordinates,
  CadastralUnitsResponse,
  CadastralGeometry,
  BuildingSurroundingsDTO,
  LayerResult,
  detectCadastralJurisdiction,
  layerOk,
  layerStale,
} from '@openbarrio/core';
import type { D1Database } from '../types/env.js';
import { ICatastroProvider } from './types.js';
import { CadastralCache } from './cadastral-cache.js';
import { CATASTRO_SOURCE_NAME } from './catastro.provider.js';
import { mapErrorToLayerReason } from '../resilience/index.js';

export interface CadastralRouterOptions {
  dgc: ICatastroProvider;
  navarra?: ICatastroProvider;
  euskadi?: ICatastroProvider;
  db?: D1Database;
  ttlSeconds?: number;
  now?: () => Date;
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
    this.cache = new CadastralCache({
      db: options.db,
      ttlSeconds: options.ttlSeconds,
      now: options.now,
    });
  }

  setDatabase(db: D1Database): void {
    this.cache.setDatabase(db);
    if (this.dgc && typeof (this.dgc as any).setDatabase === 'function') {
      (this.dgc as any).setDatabase(db);
    }
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

  private async resolvePropertyWithCache(
    cacheKey: string,
    cacheType: 'coordinates' | 'property',
    fetcher: () => Promise<LayerResult<CadastralProperty>>
  ): Promise<LayerResult<CadastralProperty>> {
    const meta = await this.cache.getWithMeta<CadastralProperty>(cacheKey);
    if (meta?.isFresh) {
      return layerOk(
        CATASTRO_SOURCE_NAME,
        meta.data,
        meta.fetchedAt ? { verifiedAt: meta.fetchedAt } : {}
      );
    }

    try {
      const liveRes = await fetcher();
      const prop = liveRes.data!;
      if (!prop.jurisdiction) {
        prop.jurisdiction = 'dgc';
      }
      if (liveRes.status === 'ok') {
        await this.cache.set(cacheKey, cacheType, prop.cadastralReference, prop);
      }
      return liveRes;
    } catch (err) {
      if (meta?.isUsableStale) {
        return layerStale(CATASTRO_SOURCE_NAME, meta.data, {
          verifiedAt: meta.fetchedAt ?? meta.expiresAt,
          reason: mapErrorToLayerReason(err),
          staleDays: meta.ageDays,
        });
      }
      throw err;
    }
  }

  async getByCoordinates(latitude: number, longitude: number): Promise<CadastralProperty> {
    const res = await this.getByCoordinatesWithStatus(latitude, longitude);
    return res.data!;
  }

  async getByCoordinatesWithStatus(
    latitude: number,
    longitude: number
  ): Promise<LayerResult<CadastralProperty>> {
    const cacheKey = `coords:${latitude.toFixed(5)},${longitude.toFixed(5)}`;
    const provider = this.resolveProvider(undefined, { latitude, longitude });

    return this.resolvePropertyWithCache(cacheKey, 'coordinates', async () => {
      if (provider.getByCoordinatesWithStatus) {
        return provider.getByCoordinatesWithStatus(latitude, longitude);
      }
      return layerOk(CATASTRO_SOURCE_NAME, await provider.getByCoordinates(latitude, longitude));
    });
  }

  async getByCadastralReference(
    refcat: string,
    fallbackCoords?: CadastralCoordinates,
    preferredPortal?: string
  ): Promise<CadastralProperty> {
    const res = await this.getByCadastralReferenceWithStatus(refcat, fallbackCoords, preferredPortal);
    return res.data!;
  }

  async getByCadastralReferenceWithStatus(
    refcat: string,
    fallbackCoords?: CadastralCoordinates,
    preferredPortal?: string
  ): Promise<LayerResult<CadastralProperty>> {
    const cleanRef = refcat.replace(/[\s\-_.]/g, '').toUpperCase();
    const cacheKey = `prop:${cleanRef}${preferredPortal ? `:${preferredPortal}` : ''}`;
    const provider = this.resolveProvider(
      refcat,
      fallbackCoords ? { latitude: fallbackCoords.latitude, longitude: fallbackCoords.longitude } : undefined
    );

    return this.resolvePropertyWithCache(cacheKey, 'property', async () => {
      if (provider.getByCadastralReferenceWithStatus) {
        return provider.getByCadastralReferenceWithStatus(refcat, fallbackCoords, preferredPortal);
      }
      return layerOk(
        CATASTRO_SOURCE_NAME,
        await provider.getByCadastralReference(refcat, fallbackCoords, preferredPortal)
      );
    });
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
