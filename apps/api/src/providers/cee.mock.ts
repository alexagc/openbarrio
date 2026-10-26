import {
  CadastralProperty,
  EnergyPerformanceCertificate,
} from '@openbarrio/core';
import { ICEEProvider } from './types.js';
import { CEEProvider } from './cee.provider.js';

export class MockCEEProvider implements ICEEProvider {
  private readonly fallbackProvider = new CEEProvider();
  private readonly registeredCertificates = new Map<string, EnergyPerformanceCertificate>();

  constructor() {
    this.seedMockCertificates();
  }

  private seedMockCertificates(): void {
    // Madrid Gran Vía 28 - High quality historic retrofit with official certificate
    this.registeredCertificates.set('9872023VH5797S0001WX', {
      ratingEmissions: 'B',
      ratingConsumption: 'C',
      co2Emissions: 14.5,
      primaryEnergyConsumption: 68.2,
      registrationNumber: 'MDR-2023-CEE-09412',
      validUntil: '2033-06-15',
      scope: 'building',
      isEstimated: false,
      annualEstimatedCostEur: 850,
    });

    // Barcelona Passeig de Gràcia 43 - Official CEE
    this.registeredCertificates.set('08019A002000050000AB', {
      ratingEmissions: 'C',
      ratingConsumption: 'C',
      co2Emissions: 21.3,
      primaryEnergyConsumption: 94.0,
      registrationNumber: 'CAT-ICAEN-2022-8819',
      validUntil: '2032-11-20',
      scope: 'building',
      isEstimated: false,
      annualEstimatedCostEur: 1120,
    });

    // Valencia Calle Colón 1
    this.registeredCertificates.set('4625001YJ2842E0001ZX', {
      ratingEmissions: 'B',
      ratingConsumption: 'B',
      co2Emissions: 11.2,
      primaryEnergyConsumption: 55.4,
      registrationNumber: 'GVA-IVACE-2024-4192',
      validUntil: '2034-03-10',
      scope: 'unit',
      isEstimated: false,
      annualEstimatedCostEur: 620,
    });
  }

  async getEnergyCertificate(
    property: CadastralProperty
  ): Promise<EnergyPerformanceCertificate> {
    const registered = this.registeredCertificates.get(property.cadastralReference);
    if (registered) {
      return registered;
    }

    // Default to the normative estimation engine
    return this.fallbackProvider.inferNormativeCertificate(property);
  }
}
