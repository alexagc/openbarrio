import {
  CadastralProperty,
  CadastralCoordinates,
  CadastralUnitsResponse,
  CadastralGeometry,
  detectCadastralJurisdiction,
} from '@openbarrio/core';
import { ICatastroProvider } from './types.js';

export interface CadastralRouterOptions {
  dgc: ICatastroProvider;
  navarra?: ICatastroProvider;
  euskadi?: ICatastroProvider;
}

export class CadastralRouterProvider implements ICatastroProvider {
  private readonly dgc: ICatastroProvider;
  private readonly navarra: ICatastroProvider;
  private readonly euskadi: ICatastroProvider;

  constructor(options: CadastralRouterOptions) {
    this.dgc = options.dgc;
    this.navarra = options.navarra || options.dgc;
    this.euskadi = options.euskadi || options.dgc;
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
    const provider = this.resolveProvider(undefined, { latitude, longitude });
    return provider.getByCoordinates(latitude, longitude);
  }

  async getByCadastralReference(
    refcat: string,
    fallbackCoords?: CadastralCoordinates,
    preferredPortal?: string
  ): Promise<CadastralProperty> {
    const provider = this.resolveProvider(
      refcat,
      fallbackCoords ? { latitude: fallbackCoords.latitude, longitude: fallbackCoords.longitude } : undefined
    );
    return provider.getByCadastralReference(refcat, fallbackCoords, preferredPortal);
  }

  async getUnitsByCadastralReference(refcat: string): Promise<CadastralUnitsResponse> {
    const provider = this.resolveProvider(refcat);
    return provider.getUnitsByCadastralReference(refcat);
  }

  async getGeometryByCadastralReference(refcat: string): Promise<CadastralGeometry> {
    const provider = this.resolveProvider(refcat);
    return provider.getGeometryByCadastralReference(refcat);
  }
}
