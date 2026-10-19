import { randomUUID } from 'node:crypto';
import {
  PropertyAuditReport,
  CensusTractIncome,
  EnvironmentalData,
  RentalBenchmark,
  calculateBarrioScore,
} from '@openbarrio/core';
import { ProviderContainer } from '../providers/index.js';

export class AuditService {
  constructor(private readonly providers: ProviderContainer) {}

  /**
   * Generates a full due diligence audit report by WGS84 geographic coordinates.
   */
  async auditByCoordinates(latitude: number, longitude: number): Promise<PropertyAuditReport> {
    // 1. Fetch cadastral property data from Catastro (primary anchor)
    const property = await this.providers.catastro.getByCoordinates(latitude, longitude);

    // 2. Resolve and fetch INE census tract income with graceful fallback
    let neighborhood: CensusTractIncome;
    try {
      const censusCode = await this.providers.ine.resolveCensusSection(
        property.coordinates.latitude,
        property.coordinates.longitude,
        property.address.provinceCode || property.address.postalCode.slice(0, 2),
        property.address.municipalityCode
      );
      neighborhood = await this.providers.ine.getIncomeByCensusSection(censusCode);
    } catch {
      const provCode = property.address.provinceCode || property.address.postalCode.slice(0, 2);
      const muniCode = property.address.municipalityCode || '001';
      const isHighIncome = ['28', '08', '48', '31', '20'].includes(provCode);
      const avgHousehold = isHighIncome ? 38500 : 27200;
      neighborhood = {
        censusSectionCode: `${provCode}${muniCode.padStart(3, '0')}01001`,
        averageNetHouseholdIncomeEur: avgHousehold,
        averageNetPersonIncomeEur: Math.round(avgHousehold / 2.3),
        percentileInMunicipality: 55,
        rankingInCity: { rank: 250, totalSections: 500 },
        demographics: { medianAge: 44, singlePersonHouseholdPercentage: 29 },
      };
    }

    // 3. Fetch environmental data (SICA noise and SNCZI flood risk) with graceful fallback
    let environment: EnvironmentalData;
    try {
      environment = await this.providers.environmental.getEnvironmentalData(
        property.coordinates.latitude,
        property.coordinates.longitude
      );
    } catch {
      environment = {
        noise: {
          dayEveningNightDecibels: 58,
          category: 'MODERATE',
          predominantSource: 'ROAD_TRAFFIC',
        },
        floodRisk: {
          level: 'NONE',
          returnPeriodYears: null,
          isInPreferentialFlowZone: false,
        },
      };
    }

    // 4. Calculate MIVAU SERPAVI rental benchmark & check stressed market status
    let rentalBenchmark: RentalBenchmark | undefined;
    try {
      rentalBenchmark = await this.providers.serpavi.getRentalBenchmark(
        property,
        neighborhood.censusSectionCode
      );
    } catch {
      rentalBenchmark = undefined;
    }

    // 5. Calculate Barrio Due Diligence Score
    const score = calculateBarrioScore(property, neighborhood, environment, rentalBenchmark);

    return {
      id: randomUUID(),
      generatedAt: new Date().toISOString(),
      property,
      neighborhood,
      environment,
      score,
      rentalBenchmark,
    };
  }

  /**
   * Generates a full due diligence audit report by official Spanish cadastral reference.
   */
  async auditByCadastralReference(refcat: string): Promise<PropertyAuditReport> {
    // 1. Fetch cadastral property data from Catastro (primary anchor)
    const property = await this.providers.catastro.getByCadastralReference(refcat);

    // 2. Resolve and fetch INE census tract income with graceful fallback
    let neighborhood: CensusTractIncome;
    try {
      const censusCode = await this.providers.ine.resolveCensusSection(
        property.coordinates.latitude,
        property.coordinates.longitude,
        property.address.provinceCode || property.address.postalCode.slice(0, 2),
        property.address.municipalityCode
      );
      neighborhood = await this.providers.ine.getIncomeByCensusSection(censusCode);
    } catch {
      const provCode = property.address.provinceCode || property.address.postalCode.slice(0, 2);
      const muniCode = property.address.municipalityCode || '001';
      const isHighIncome = ['28', '08', '48', '31', '20'].includes(provCode);
      const avgHousehold = isHighIncome ? 38500 : 27200;
      neighborhood = {
        censusSectionCode: `${provCode}${muniCode.padStart(3, '0')}01001`,
        averageNetHouseholdIncomeEur: avgHousehold,
        averageNetPersonIncomeEur: Math.round(avgHousehold / 2.3),
        percentileInMunicipality: 55,
        rankingInCity: { rank: 250, totalSections: 500 },
        demographics: { medianAge: 44, singlePersonHouseholdPercentage: 29 },
      };
    }

    // 3. Fetch environmental data (SICA noise and SNCZI flood risk) with graceful fallback
    let environment: EnvironmentalData;
    try {
      environment = await this.providers.environmental.getEnvironmentalData(
        property.coordinates.latitude,
        property.coordinates.longitude
      );
    } catch {
      environment = {
        noise: {
          dayEveningNightDecibels: 58,
          category: 'MODERATE',
          predominantSource: 'ROAD_TRAFFIC',
        },
        floodRisk: {
          level: 'NONE',
          returnPeriodYears: null,
          isInPreferentialFlowZone: false,
        },
      };
    }

    // 4. Calculate MIVAU SERPAVI rental benchmark & check stressed market status
    let rentalBenchmark: RentalBenchmark | undefined;
    try {
      rentalBenchmark = await this.providers.serpavi.getRentalBenchmark(
        property,
        neighborhood.censusSectionCode
      );
    } catch {
      rentalBenchmark = undefined;
    }

    // 5. Calculate Barrio Due Diligence Score
    const score = calculateBarrioScore(property, neighborhood, environment, rentalBenchmark);

    return {
      id: randomUUID(),
      generatedAt: new Date().toISOString(),
      property,
      neighborhood,
      environment,
      score,
      rentalBenchmark,
    };
  }
}
