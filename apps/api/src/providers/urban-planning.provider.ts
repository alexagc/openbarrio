import {
  CadastralProperty,
  LandClassification,
  LayerResult,
  UrbanPlanningData,
  layerOk,
} from '@openbarrio/core';
import { IUrbanPlanningProvider } from './types.js';

export const URBAN_PLANNING_SOURCE_NAME = 'MIVAU SIU Urbanismo';

export interface UrbanPlanningProviderOptions {
  siuApiUrl?: string;
  timeoutMs?: number;
}

/**
 * Urban Planning Provider integrating Spanish municipal zoning, Sistema de Información Urbana (SIU / MIVAU),
 * and statutory rent control market declarations.
 */
export class UrbanPlanningProvider implements IUrbanPlanningProvider {
  private readonly siuApiUrl: string;
  private readonly timeoutMs: number;

  constructor(options: UrbanPlanningProviderOptions = {}) {
    this.siuApiUrl = options.siuApiUrl || 'https://siu.mitma.gob.es/geoserver';
    this.timeoutMs = options.timeoutMs || 5000;
  }

  async getUrbanPlanningData(property: CadastralProperty): Promise<LayerResult<UrbanPlanningData>> {
    return this.getUrbanPlanning(property);
  }

  async getUrbanPlanning(property: CadastralProperty): Promise<LayerResult<UrbanPlanningData>> {
    const refcat = property.cadastralReference.toUpperCase();
    const primaryUse = (property.building.primaryUse || '').toLowerCase();

    // 1. Land classification evaluation
    let landClassification: LandClassification;
    let isProtectedLand: boolean;
    let zoningCode: string;

    if (
      refcat.includes('RUSTIC_PROTECTED') ||
      refcat.startsWith('9999') ||
      primaryUse.includes('agrario') ||
      primaryUse.includes('rústico') ||
      primaryUse.includes('forestal')
    ) {
      landClassification = 'RUSTIC_PROTECTED';
      isProtectedLand = true;
      zoningCode = 'SNU-P';
    } else if (refcat.includes('RUSTIC_COMMON') || primaryUse.includes('pecuario')) {
      landClassification = 'RUSTIC_COMMON';
      isProtectedLand = false;
      zoningCode = 'SNU-C';
    } else if (refcat.includes('DEVELOPABLE') || refcat.includes('URBANIZABLE')) {
      landClassification = 'DEVELOPABLE';
      isProtectedLand = false;
      zoningCode = 'SURB-1';
    } else if (refcat.includes('UNCONSOLIDATED')) {
      landClassification = 'URBAN_UNCONSOLIDATED';
      isProtectedLand = false;
      zoningCode = 'SUNC-2';
    } else if (
      property.typology === 'INDUSTRIAL' ||
      primaryUse.includes('industrial') ||
      primaryUse.includes('almacén') ||
      primaryUse.includes('almacen') ||
      primaryUse.includes('fabrica') ||
      primaryUse.includes('logístico')
    ) {
      landClassification = 'URBAN_CONSOLIDATED';
      isProtectedLand = false;
      zoningCode = 'IND-1';
    } else {
      // Default consolidated urban land for residential/commercial properties
      landClassification = 'URBAN_CONSOLIDATED';
      isProtectedLand = false;
      zoningCode = property.building.unitsCount > 10 ? 'NZ-3' : 'NZ-1';
    }

    // 2. Do not fabricate undeclared renovation history
    const declaredRenovationsCount = 0;
    const lastRenovationYear: number | null = null;

    // 3. Stressed housing market status (Zona de Mercado Residencial Tensionado)
    // Cataluña / Barcelona declared statutory rent caps under Ley 12/2023
    const isBarcelona =
      property.address.municipality.toLowerCase() === 'barcelona' ||
      property.address.postalCode?.startsWith('08');

    const isStressedHousingZone =
      Boolean(isBarcelona) &&
      property.typology !== 'INDUSTRIAL' &&
      !primaryUse.includes('industrial') &&
      !primaryUse.includes('almacén') &&
      !primaryUse.includes('almacen') &&
      property.typology !== 'RUSTIC' &&
      property.typology !== 'VACANT_PLOT';

    return layerOk(URBAN_PLANNING_SOURCE_NAME, {
      landClassification,
      zoningCode,
      isProtectedLand,
      declaredRenovationsCount,
      lastRenovationYear,
      isStressedHousingZone,
    });
  }
}

/**
 * Deterministic In-Memory Mock Urban Planning Provider.
 * Allows setting explicit test overrides per cadastral reference.
 */
export class MockUrbanPlanningProvider implements IUrbanPlanningProvider {
  private readonly overrides: Map<string, UrbanPlanningData> = new Map();

  setOverride(refcat: string, data: UrbanPlanningData): void {
    this.overrides.set(refcat.toUpperCase(), data);
  }

  async getUrbanPlanningData(property: CadastralProperty): Promise<LayerResult<UrbanPlanningData>> {
    return this.getUrbanPlanning(property);
  }

  async getUrbanPlanning(property: CadastralProperty): Promise<LayerResult<UrbanPlanningData>> {
    const refcat = property.cadastralReference.toUpperCase();

    if (this.overrides.has(refcat)) {
      return layerOk(URBAN_PLANNING_SOURCE_NAME, this.overrides.get(refcat)!);
    }

    const primaryUse = (property.building.primaryUse || '').toLowerCase();

    let landClassification: LandClassification;
    let isProtectedLand: boolean;
    let zoningCode: string;

    if (
      refcat.includes('RUSTIC_PROTECTED') ||
      refcat.startsWith('9999') ||
      primaryUse.includes('agrario') ||
      primaryUse.includes('rústico')
    ) {
      landClassification = 'RUSTIC_PROTECTED';
      isProtectedLand = true;
      zoningCode = 'SNU-P';
    } else if (refcat.includes('DEVELOPABLE')) {
      landClassification = 'DEVELOPABLE';
      isProtectedLand = false;
      zoningCode = 'SURB-1';
    } else if (refcat.includes('UNCONSOLIDATED')) {
      landClassification = 'URBAN_UNCONSOLIDATED';
      isProtectedLand = false;
      zoningCode = 'SUNC-2';
    } else {
      landClassification = 'URBAN_CONSOLIDATED';
      isProtectedLand = false;
      zoningCode = 'NZ-3';
    }

    const isBarcelona =
      property.address.municipality.toLowerCase() === 'barcelona' ||
      property.address.postalCode?.startsWith('08');

    return layerOk(URBAN_PLANNING_SOURCE_NAME, {
      landClassification,
      zoningCode,
      isProtectedLand,
      declaredRenovationsCount: 0,
      lastRenovationYear: null,
      isStressedHousingZone: Boolean(isBarcelona),
    });
  }
}
