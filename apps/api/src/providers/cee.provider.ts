import {
  CadastralProperty,
  EnergyPerformanceCertificate,
  EnergyRating,
} from '@openbarrio/core';
import { ICEEProvider } from './types.js';
import { D1Database } from '../types/env.js';

export interface CEEProviderOptions {
  db?: D1Database;
}

export class CEEProvider implements ICEEProvider {
  private readonly db?: D1Database;

  constructor(options: CEEProviderOptions = {}) {
    this.db = options.db;
  }

  async getEnergyCertificate(
    property: CadastralProperty
  ): Promise<EnergyPerformanceCertificate> {
    const refcat = property.cadastralReference;

    // 1. Check official regional registry in Cloudflare D1
    if (this.db) {
      try {
        let sql = `SELECT rating_emissions, rating_consumption, co2_emissions, primary_energy, registration_number, valid_until, scope, cadastral_reference
                   FROM building_energy_certificates
                   WHERE cadastral_reference = ?1
                   LIMIT 1`;
        const params: any[] = [refcat];

        if (refcat.length === 20) {
          // Dwelling/Unit refcat: prioritize exact 20-char unit match, fallback to 14-char building/parcel
          sql = `SELECT rating_emissions, rating_consumption, co2_emissions, primary_energy, registration_number, valid_until, scope, cadastral_reference
                 FROM building_energy_certificates
                 WHERE cadastral_reference = ?1 OR cadastral_reference = SUBSTR(?1, 1, 14)
                 ORDER BY LENGTH(cadastral_reference) DESC
                 LIMIT 1`;
        } else if (refcat.length === 14) {
          // Building/Parcel refcat: check exact 14-char match, fallback to any registered unit under this parcel
          sql = `SELECT rating_emissions, rating_consumption, co2_emissions, primary_energy, registration_number, valid_until, scope, cadastral_reference
                 FROM building_energy_certificates
                 WHERE cadastral_reference = ?1 OR cadastral_reference LIKE ?1 || '%'
                 ORDER BY LENGTH(cadastral_reference) ASC
                 LIMIT 1`;
        }

        const stmt = this.db.prepare(sql);
        const row = await stmt
          .bind(...params)
          .first<{
            rating_emissions: string;
            rating_consumption: string;
            co2_emissions?: number;
            primary_energy?: number;
            registration_number?: string;
            valid_until?: string;
            scope?: string;
            cadastral_reference?: string;
          }>();

        if (row && row.rating_emissions) {
          const ratingEmissions = row.rating_emissions.toUpperCase() as EnergyRating;
          const ratingConsumption = (row.rating_consumption || row.rating_emissions).toUpperCase() as EnergyRating;
          const surface = property.building.builtSurfaceM2 || 90;
          const primaryEnergy = row.primary_energy || 120;
          const annualCost = Math.round(surface * primaryEnergy * 0.16);

          // Calculate legal expiration under RD 390/2021
          let isExpired = false;
          if (row.valid_until) {
            const expTime = new Date(row.valid_until).getTime();
            if (!isNaN(expTime)) {
              isExpired = expTime < Date.now();
            }
          }

          // Deduce Regional Registry DataSource
          const regNum = row.registration_number || '';
          let dataSource = 'Registro Oficial Autonómico';
          if (regNum.startsWith('CAT-') || /ICAEN/i.test(regNum)) {
            dataSource = 'ICAEN (Generalitat de Catalunya)';
          } else if (regNum.startsWith('CEE/') || /EUS/i.test(regNum)) {
            dataSource = 'Registro del País Vasco (EEE)';
          } else if (/^(10\/|30\/|45\/|MAD-)/i.test(regNum)) {
            dataSource = 'Registro de la Comunidad de Madrid';
          } else if (regNum.startsWith('NAV-')) {
            dataSource = 'Registro de Navarra';
          } else if (regNum.startsWith('GVA-')) {
            dataSource = 'Dades Obertes Comunitat Valenciana';
          }

          const matchedRefcat = row.cadastral_reference || refcat;
          const scope = row.scope === 'unit' || matchedRefcat.length === 20 ? 'unit' : 'building';

          return {
            ratingEmissions,
            ratingConsumption,
            co2Emissions: row.co2_emissions,
            primaryEnergyConsumption: row.primary_energy,
            registrationNumber: row.registration_number || undefined,
            validUntil: row.valid_until || undefined,
            scope,
            isEstimated: false,
            isExpired,
            dataSource,
            annualEstimatedCostEur: annualCost,
          };
        }
      } catch {
        // Fallback silently to normative estimation engine
      }
    }

    // 2. Normative Estimation Engine (CTE / NBE-CT-79 based on construction antiquity)
    return this.inferNormativeCertificate(property);
  }

  /**
   * Infers energy performance based on construction regulations era.
   */
  public inferNormativeCertificate(
    property: CadastralProperty
  ): EnergyPerformanceCertificate {
    const year = property.building.constructionYear || 1980;
    const surface = property.building.builtSurfaceM2 || 90;

    let ratingEmissions: EnergyRating;
    let ratingConsumption: EnergyRating;
    let co2Emissions: number;
    let primaryEnergy: number;
    let basis: string;

    if (year >= 2020) {
      // CTE DB-HE 2019 nZEB standard (Nearly Zero Energy Buildings)
      ratingEmissions = 'A';
      ratingConsumption = 'A';
      co2Emissions = 6.8;
      primaryEnergy = 32.5;
      basis = 'CTE DB-HE 2019 nZEB';
    } else if (year >= 2007) {
      // First CTE RD 314/2006 framework
      ratingEmissions = 'D';
      ratingConsumption = 'D';
      co2Emissions = 24.1;
      primaryEnergy = 118.0;
      basis = 'CTE DB-HE 2006';
    } else if (year >= 1980) {
      // Post NBE-CT-79 first basic insulation requirements
      ratingEmissions = 'E';
      ratingConsumption = 'E';
      co2Emissions = 39.4;
      primaryEnergy = 192.0;
      basis = 'NBE-CT-79';
    } else {
      // Prior to 1980 (uninsulated building envelope)
      ratingEmissions = 'G';
      ratingConsumption = 'G';
      co2Emissions = 59.8;
      primaryEnergy = 295.0;
      basis = 'Pre-1979 Uninsulated';
    }

    const annualEstimatedCostEur = Math.round(surface * primaryEnergy * 0.16);

    return {
      ratingEmissions,
      ratingConsumption,
      co2Emissions,
      primaryEnergyConsumption: primaryEnergy,
      scope: property.unit ? 'unit' : 'building',
      isEstimated: true,
      isExpired: false,
      dataSource: 'Estimación Normativa (CTE / NBE-CT-79)',
      estimationBasis: basis,
      annualEstimatedCostEur,
    };
  }
}
