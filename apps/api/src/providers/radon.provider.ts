import { RadonEvaluationDTO, evaluateRadonRisk, RadonMunicipalZone } from '@openbarrio/core';
import type { D1Database } from '../types/env.js';

export interface IRadonProvider {
  getRadonEvaluation(
    municipalityCode: string,
    provinceCode?: string,
    floorLevel?: number,
    unitsCount?: number
  ): Promise<RadonEvaluationDTO>;
}

export class RadonProvider implements IRadonProvider {
  constructor(private readonly db?: D1Database) {}

  async getRadonEvaluation(
    municipalityCode: string,
    provinceCode?: string,
    floorLevel?: number,
    unitsCount?: number
  ): Promise<RadonEvaluationDTO> {
    let zone: RadonMunicipalZone = 'Zona 0';

    if (this.db) {
      try {
        const row = await this.db
          .prepare('SELECT zone FROM cte_radon_municipalities WHERE municipality_code = ?')
          .bind(municipalityCode)
          .first<{ zone: string }>();

        if (row?.zone) {
          zone = row.zone as RadonMunicipalZone;
        } else {
          zone = this.resolveFallbackProvinceZone(provinceCode);
        }
      } catch {
        zone = this.resolveFallbackProvinceZone(provinceCode);
      }
    } else {
      zone = this.resolveFallbackProvinceZone(provinceCode);
    }

    return evaluateRadonRisk(zone, floorLevel, unitsCount);
  }

  private resolveFallbackProvinceZone(provinceCode?: string): RadonMunicipalZone {
    if (!provinceCode) return 'Zona 0';
    const prov = provinceCode.padStart(2, '0');
    // Galicia and high granitic bedrock areas
    if (['32', '36', '15', '10'].includes(prov)) return 'Zona II';
    // Central system / granitic transition areas
    if (['28', '37', '05', '40', '45', '27'].includes(prov)) return 'Zona I';
    return 'Zona 0';
  }
}

export class MockRadonProvider implements IRadonProvider {
  async getRadonEvaluation(
    municipalityCode: string,
    provinceCode?: string,
    floorLevel?: number,
    unitsCount?: number
  ): Promise<RadonEvaluationDTO> {
    let zone: RadonMunicipalZone = 'Zona 0';
    if (municipalityCode === '28079' || provinceCode === '28') {
      zone = 'Zona I';
    } else if (['32', '36', '15', '10'].includes(provinceCode || '')) {
      zone = 'Zona II';
    }
    return evaluateRadonRisk(zone, floorLevel, unitsCount);
  }
}
