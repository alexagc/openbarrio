import { randomUUID } from 'node:crypto';
import { PropertyAuditReport, calculateBarrioScore } from '@openbarrio/core';
import { ProviderContainer } from '../providers/index.js';

export class AuditService {
  constructor(private readonly providers: ProviderContainer) {}

  /**
   * Generates a full due diligence audit report by WGS84 geographic coordinates.
   */
  async auditByCoordinates(latitude: number, longitude: number): Promise<PropertyAuditReport> {
    // 1. Fetch cadastral property data from Catastro
    const property = await this.providers.catastro.getByCoordinates(latitude, longitude);

    // 2. Resolve and fetch INE census tract income
    const censusCode = await this.providers.ine.resolveCensusSection(
      property.coordinates.latitude,
      property.coordinates.longitude,
      property.address.postalCode.slice(0, 2)
    );
    const neighborhood = await this.providers.ine.getIncomeByCensusSection(censusCode);

    // 3. Fetch environmental data
    const environment = await this.providers.environmental.getEnvironmentalData(
      property.coordinates.latitude,
      property.coordinates.longitude
    );

    // 4. Calculate Barrio Due Diligence Score
    const score = calculateBarrioScore(property, neighborhood, environment);

    return {
      id: randomUUID(),
      generatedAt: new Date().toISOString(),
      property,
      neighborhood,
      environment,
      score,
    };
  }

  /**
   * Generates a full due diligence audit report by official Spanish cadastral reference.
   */
  async auditByCadastralReference(refcat: string): Promise<PropertyAuditReport> {
    // 1. Fetch cadastral property data from Catastro
    const property = await this.providers.catastro.getByCadastralReference(refcat);

    // 2. Resolve and fetch INE census tract income
    const censusCode = await this.providers.ine.resolveCensusSection(
      property.coordinates.latitude,
      property.coordinates.longitude,
      property.address.postalCode.slice(0, 2)
    );
    const neighborhood = await this.providers.ine.getIncomeByCensusSection(censusCode);

    // 3. Fetch environmental data
    const environment = await this.providers.environmental.getEnvironmentalData(
      property.coordinates.latitude,
      property.coordinates.longitude
    );

    // 4. Calculate Barrio Due Diligence Score
    const score = calculateBarrioScore(property, neighborhood, environment);

    return {
      id: randomUUID(),
      generatedAt: new Date().toISOString(),
      property,
      neighborhood,
      environment,
      score,
    };
  }
}
