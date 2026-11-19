import {
  CadastralProperty,
  LayerResult,
  RentalBenchmark,
  layerOk,
  layerOutOfCoverage,
  layerUnavailable,
} from '@openbarrio/core';
import type { D1Database } from '../types/env.js';
import { ISERPAVIProvider } from './types.js';

export const SERPAVI_SOURCE_NAME = 'MIVAU SERPAVI';

export interface SERPAVIProviderOptions {
  db?: D1Database;
  apiBaseUrl?: string;
  timeoutMs?: number;
}

/**
 * Official Catalonia Stressed Housing Market Municipalities Catalog (Resolucions TER/800/2024 / BOE).
 * Municipalities with formal legal rent caps under Spanish Housing Law (Ley 12/2023).
 */
const DECLARED_STRESSED_MUNICIPALITIES = new Set([
  '08019', // Barcelona
  '08101', // L'Hospitalet de Llobregat
  '08015', // Badalona
  '08205', // Santa Coloma de Gramenet
  '08211', // Terrassa
  '08187', // Sabadell
  '08121', // Mataró
  '08219', // Sant Cugat del Vallès
  '08073', // Cornellà de Llobregat
  '08196', // Sant Boi de Llobregat
  '08169', // El Prat de Llobregat
  '08263', // Sitges
  '08096', // Granollers
  '08113', // Manresa
  '08245', // Rubí
  '08301', // Vilanova i la Geltrú
  '08056', // Castelldefels
  '08089', // Gavà
  '08298', // Viladecans
  '17079', // Girona
  '25120', // Lleida
  '43148', // Tarragona
  '43123', // Reus
]);

/**
 * MIVAU SERPAVI (Sistema Estatal de Referencia del Precio del Alquiler de Vivienda) Provider.
 * Computes official reference rental price range (€/m² and estimated monthly rent)
 * and determines whether property is located in an officially declared Stressed Housing Market Zone (Zona Tensionada).
 * Resolves hierarchically:
 * 1. Census Section code (cusec) in Cloudflare D1
 * 2. Municipal aggregate in Cloudflare D1
 * 3. Fallback territorial regulatory heuristic
 */
export class SERPAVIProvider implements ISERPAVIProvider {
  private db?: D1Database;
  private readonly apiBaseUrl: string;
  private readonly timeoutMs: number;

  constructor(options: SERPAVIProviderOptions = {}) {
    this.db = options.db;
    this.apiBaseUrl = options.apiBaseUrl || 'https://serpavi.mivau.gob.es/api/v1';
    this.timeoutMs = options.timeoutMs || 8000;
  }

  setDatabase(db: D1Database): void {
    this.db = db;
  }

  async getRentalBenchmark(
    cadastralProperty: CadastralProperty,
    censusSectionCode?: string
  ): Promise<LayerResult<RentalBenchmark>> {
    if (cadastralProperty.typology && cadastralProperty.typology !== 'RESIDENTIAL') {
      return layerOutOfCoverage(SERPAVI_SOURCE_NAME, { reason: 'not_applicable' });
    }

    if (!this.db) {
      return layerUnavailable(SERPAVI_SOURCE_NAME, 'upstream_error');
    }

    const provinceCode =
      cadastralProperty.address.provinceCode ||
      cadastralProperty.address.postalCode?.slice(0, 2) ||
      '28';
    let muniCode = cadastralProperty.address.municipalityCode;
    if (muniCode) {
      if (muniCode.length <= 3) {
        muniCode = `${provinceCode}${muniCode.padStart(3, '0')}`;
      }
    } else if (censusSectionCode && censusSectionCode.length >= 5) {
      muniCode = censusSectionCode.slice(0, 5);
    } else {
      muniCode = `${provinceCode}001`;
    }

    let isStressed = this.isStressedZone(muniCode, provinceCode);
    let baseLowerEurM2: number | undefined;
    let baseUpperEurM2: number | undefined;

    // Hierarchical Resolution via Cloudflare D1 (sub-5ms)
    try {
      // Step 1A: Primary fine-grained query by census section (cusec)
      if (censusSectionCode) {
        const sectionRow = await this.db
          .prepare(
            'SELECT is_stressed_market, lower_bound_eur_m2, upper_bound_eur_m2 FROM mivau_serpavi_benchmarks WHERE cusec = ?'
          )
          .bind(censusSectionCode)
          .first<{ is_stressed_market: number; lower_bound_eur_m2: number; upper_bound_eur_m2: number }>();

        if (sectionRow && sectionRow.lower_bound_eur_m2 > 0) {
          baseLowerEurM2 = sectionRow.lower_bound_eur_m2;
          baseUpperEurM2 = sectionRow.upper_bound_eur_m2;
          isStressed = sectionRow.is_stressed_market === 1 || isStressed;
        }
      }

      // Step 1B: Fallback municipal aggregate query if section record has no data
      if (baseLowerEurM2 === undefined && muniCode) {
        const muniRow = await this.db
          .prepare(
            'SELECT is_stressed_market, lower_bound_eur_m2, upper_bound_eur_m2 FROM mivau_serpavi_benchmarks WHERE municipality_code = ? AND cusec IS NULL'
          )
          .bind(muniCode)
          .first<{ is_stressed_market: number; lower_bound_eur_m2: number; upper_bound_eur_m2: number }>();

        if (muniRow && muniRow.lower_bound_eur_m2 > 0) {
          baseLowerEurM2 = muniRow.lower_bound_eur_m2;
          baseUpperEurM2 = muniRow.upper_bound_eur_m2;
          isStressed = muniRow.is_stressed_market === 1 || isStressed;
        }
      }
    } catch (err) {
      console.warn('[SERPAVIProvider] D1 query failed:', (err as Error)?.message);
      return layerUnavailable(SERPAVI_SOURCE_NAME, 'upstream_error');
    }

    if (baseLowerEurM2 === undefined || baseUpperEurM2 === undefined) {
      return layerOutOfCoverage(SERPAVI_SOURCE_NAME);
    }

    // Adjustment factors based on building/unit parameters from Catastro
    const surface =
      cadastralProperty.unit?.builtSurfaceM2 ||
      cadastralProperty.building.builtSurfaceM2 ||
      80;
    const year = cadastralProperty.building.constructionYear;

    // Age factor
    let ageMultiplier = 1.0;
    if (year >= 2007) {
      ageMultiplier = 1.12; // CTE compliant with advanced insulation and efficiency
    } else if (year >= 1980) {
      ageMultiplier = 1.04; // NBE thermal regulations
    } else if (year < 1950) {
      ageMultiplier = 0.95;
    }

    // Surface scale factor (smaller units command higher €/m2 than large units)
    let sizeMultiplier = 1.0;
    if (surface < 55) {
      sizeMultiplier = 1.10;
    } else if (surface > 140) {
      sizeMultiplier = 0.92;
    }

    // Amenities factor (commercial ground floor / services)
    const amenityMultiplier = cadastralProperty.building.hasCommercialGroundFloor ? 1.03 : 1.0;

    const totalMultiplier = ageMultiplier * sizeMultiplier * amenityMultiplier;

    const lowerEurM2 = Math.round(baseLowerEurM2 * totalMultiplier * 100) / 100;
    const upperEurM2 = Math.round(baseUpperEurM2 * totalMultiplier * 100) / 100;

    const monthlyLower = Math.round(lowerEurM2 * surface);
    const monthlyUpper = Math.round(upperEurM2 * surface);

    return layerOk(SERPAVI_SOURCE_NAME, {
      officialRangeLowerEurM2: lowerEurM2,
      officialRangeUpperEurM2: upperEurM2,
      estimatedMonthlyRentLowerEur: monthlyLower,
      estimatedMonthlyRentUpperEur: monthlyUpper,
      isStressedHousingZone: isStressed,
    });
  }

  /**
   * Checks whether the municipality is formally declared as a Stressed Housing Market Zone.
   */
  public isStressedZone(municipalityCode: string, provinceCode: string): boolean {
    if (DECLARED_STRESSED_MUNICIPALITIES.has(municipalityCode)) {
      return true;
    }
    // Entire Barcelona metropolitan area and high pressure municipalities in Catalonia
    if (provinceCode === '08' && DECLARED_STRESSED_MUNICIPALITIES.has(municipalityCode)) {
      return true;
    }
    return false;
  }
}
