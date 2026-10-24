import { CadastralProperty, RentalBenchmark } from '@openbarrio/core';
import { ISERPAVIProvider } from './types.js';

export class MockSERPAVIProvider implements ISERPAVIProvider {
  private customOverrides: Map<string, RentalBenchmark> = new Map();

  async getRentalBenchmark(
    cadastralProperty: CadastralProperty,
    censusSectionCode?: string
  ): Promise<RentalBenchmark> {
    const refcat = cadastralProperty.cadastralReference;
    if (this.customOverrides.has(refcat)) {
      return this.customOverrides.get(refcat)!;
    }

    const surface =
      cadastralProperty.unit?.builtSurfaceM2 ||
      cadastralProperty.building.builtSurfaceM2 ||
      85;
    const isBarcelona = Boolean(
      cadastralProperty.address.municipality.toLowerCase() === 'barcelona' ||
      cadastralProperty.address.postalCode?.startsWith('08') ||
      censusSectionCode?.startsWith('08019')
    );

    const isStressed = isBarcelona;

    const baseLower = isBarcelona ? 15.2 : 14.5;
    const baseUpper = isBarcelona ? 19.8 : 18.2;

    const monthlyLower = Math.round(baseLower * surface);
    const monthlyUpper = Math.round(baseUpper * surface);

    return {
      officialRangeLowerEurM2: baseLower,
      officialRangeUpperEurM2: baseUpper,
      estimatedMonthlyRentLowerEur: monthlyLower,
      estimatedMonthlyRentUpperEur: monthlyUpper,
      isStressedHousingZone: isStressed,
    };
  }

  setBenchmarkOverride(refcat: string, benchmark: RentalBenchmark): void {
    this.customOverrides.set(refcat, benchmark);
  }
}
