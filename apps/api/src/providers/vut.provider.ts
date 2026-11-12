import { VutEvaluationDTO, evaluateVutSaturation } from '@openbarrio/core';
import type { D1Database } from '../types/env.js';
import type { IVutProvider } from './types.js';

export class VutProvider implements IVutProvider {
  private db?: D1Database;

  constructor(db?: D1Database) {
    this.db = db;
  }

  setDatabase(db: D1Database): void {
    this.db = db;
  }

  async getVutEvaluation(censusSectionId: string): Promise<VutEvaluationDTO> {
    if (this.db) {
      try {
        const row = await this.db
          .prepare(
            'SELECT total_dwellings, vut_count, vut_beds, vut_ratio_pct FROM census_tract_vut WHERE census_section_id = ?'
          )
          .bind(censusSectionId)
          .first<{
            total_dwellings: number;
            vut_count: number;
            vut_beds: number;
            vut_ratio_pct: number;
          }>();

        if (row) {
          return evaluateVutSaturation(
            censusSectionId,
            row.total_dwellings,
            row.vut_count,
            row.vut_beds,
            false
          );
        }
      } catch {
        // Fall back to heuristic
      }
    }

    return this.resolveDeterministicFallback(censusSectionId);
  }

  private resolveDeterministicFallback(censusSectionId: string): VutEvaluationDTO {
    let hash = 0;
    for (let i = 0; i < censusSectionId.length; i++) {
      hash = (hash * 31 + censusSectionId.charCodeAt(i)) >>> 0;
    }
    const totalDwellings = 1000 + (hash % 600);
    const bucket = hash % 100;
    let vutCount = 0;
    if (bucket < 15) {
      vutCount = Math.round(totalDwellings * (0.085 + (hash % 60) / 1000));
    } else if (bucket < 40) {
      vutCount = Math.round(totalDwellings * (0.035 + (hash % 35) / 1000));
    } else {
      vutCount = Math.round(totalDwellings * (0.005 + (hash % 15) / 1000));
    }
    const vutBeds = vutCount * 4;
    return evaluateVutSaturation(censusSectionId, totalDwellings, vutCount, vutBeds, true);
  }
}

export class MockVutProvider implements IVutProvider {
  async getVutEvaluation(censusSectionId: string): Promise<VutEvaluationDTO> {
    if (censusSectionId === '2807901001' || censusSectionId.endsWith('01001')) {
      return evaluateVutSaturation(censusSectionId, 1200, 168, 672, false);
    }
    if (censusSectionId === '2807907001' || censusSectionId.endsWith('07001')) {
      return evaluateVutSaturation(censusSectionId, 1400, 70, 280, false);
    }
    return evaluateVutSaturation(censusSectionId, 1500, 15, 60, false);
  }
}
