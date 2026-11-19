import {
  LayerResult,
  RadonEvaluationDTO,
  RadonMunicipalZone,
  evaluateRadonRisk,
  layerOk,
  layerUnavailable,
} from '@openbarrio/core';
import type { D1Database } from '../types/env.js';
import type { IRadonProvider } from './types.js';

export const RADON_SOURCE_NAME = 'CTE DB-HS 6 Radón';

export class RadonProvider implements IRadonProvider {
  private db?: D1Database;

  constructor(db?: D1Database) {
    this.db = db;
  }

  setDatabase(db: D1Database): void {
    this.db = db;
  }

  async getRadonEvaluation(
    municipalityCode: string,
    _provinceCode?: string,
    floorLevel?: number,
    unitsCount?: number
  ): Promise<LayerResult<RadonEvaluationDTO>> {
    if (!this.db) {
      return layerUnavailable(RADON_SOURCE_NAME, 'upstream_error');
    }

    try {
      const row = await this.db
        .prepare('SELECT zone FROM cte_radon_municipalities WHERE municipality_code = ?')
        .bind(municipalityCode)
        .first<{ zone: string }>();

      // Per CTE DB-HS 6 Appendix B, municipalities absent from the official Zona I/II table are Zona 0.
      const zone: RadonMunicipalZone = row?.zone ? (row.zone as RadonMunicipalZone) : 'Zona 0';
      return layerOk(RADON_SOURCE_NAME, evaluateRadonRisk(zone, floorLevel, unitsCount));
    } catch (err) {
      console.warn('[RadonProvider] D1 query failed:', (err as Error)?.message);
      return layerUnavailable(RADON_SOURCE_NAME, 'upstream_error');
    }
  }
}

export class MockRadonProvider implements IRadonProvider {
  async getRadonEvaluation(
    municipalityCode: string,
    provinceCode?: string,
    floorLevel?: number,
    unitsCount?: number
  ): Promise<LayerResult<RadonEvaluationDTO>> {
    let zone: RadonMunicipalZone;
    if (municipalityCode === '28079' || provinceCode === '28') {
      zone = 'Zona I';
    } else if (['32', '36', '15', '10'].includes(provinceCode || '')) {
      zone = 'Zona II';
    } else {
      zone = 'Zona 0';
    }
    return layerOk(RADON_SOURCE_NAME, evaluateRadonRisk(zone, floorLevel, unitsCount));
  }
}
