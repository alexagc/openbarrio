import {
  CadastralProperty,
  LayerResult,
  RentalBenchmark,
  layerOk,
  layerOutOfCoverage,
} from '@openbarrio/core';
import { ISERPAVIProvider } from './types.js';
import { SERPAVI_SOURCE_NAME } from './serpavi.provider.js';

export class MockSERPAVIProvider implements ISERPAVIProvider {
  private customOverrides: Map<string, RentalBenchmark> = new Map();

  async getRentalBenchmark(
    cadastralProperty: CadastralProperty,
    censusSectionCode?: string
  ): Promise<LayerResult<RentalBenchmark>> {
    if (cadastralProperty.typology && cadastralProperty.typology !== 'RESIDENTIAL') {
      return layerOutOfCoverage(SERPAVI_SOURCE_NAME, { reason: 'not_applicable' });
    }

    const refcat = cadastralProperty.cadastralReference;
    if (this.customOverrides.has(refcat)) {
      return layerOk(SERPAVI_SOURCE_NAME, this.customOverrides.get(refcat)!);
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

    return layerOk(SERPAVI_SOURCE_NAME, {
      officialRangeLowerEurM2: baseLower,
      officialRangeUpperEurM2: baseUpper,
      estimatedMonthlyRentLowerEur: monthlyLower,
      estimatedMonthlyRentUpperEur: monthlyUpper,
      isStressedHousingZone: isStressed,
    });
  }

  setBenchmarkOverride(refcat: string, benchmark: RentalBenchmark): void {
    this.customOverrides.set(refcat, benchmark);
  }
}
