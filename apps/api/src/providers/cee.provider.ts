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
        const row = await this.db
          .prepare(
            `SELECT rating_emissions, rating_consumption, co2_emissions, primary_energy, registration_number, valid_until, scope
             FROM building_energy_certificates
             WHERE cadastral_reference = ?1`
          )
          .bind(refcat)
          .first<{
            rating_emissions: string;
            rating_consumption: string;
            co2_emissions?: number;
            primary_energy?: number;
            registration_number?: string;
            valid_until?: string;
            scope?: string;
          }>();

        if (row && row.rating_emissions) {
          const ratingEmissions = row.rating_emissions.toUpperCase() as EnergyRating;
          const ratingConsumption = (row.rating_consumption || row.rating_emissions).toUpperCase() as EnergyRating;
          const surface = property.building.builtSurfaceM2 || 90;
          const primaryEnergy = row.primary_energy || 120;
          const annualCost = Math.round(surface * primaryEnergy * 0.16);

          return {
            ratingEmissions,
            ratingConsumption,
            co2Emissions: row.co2_emissions,
            primaryEnergyConsumption: row.primary_energy,
            registrationNumber: row.registration_number || undefined,
            validUntil: row.valid_until || undefined,
            scope: (row.scope === 'unit' ? 'unit' : 'building'),
            isEstimated: false,
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
      estimationBasis: basis,
      annualEstimatedCostEur,
    };
  }
}
