import { Type, Static } from '@sinclair/typebox';

/**
 * Summary DTO for municipal listing and directory pages.
 */
export const MunicipalitySummarySchema = Type.Object({
  code: Type.String({ description: '5-digit official INE municipality code (e.g. 28079)' }),
  name: Type.String({ description: 'Official municipality name (e.g. Madrid)' }),
  slug: Type.String({ description: 'URL-friendly canonical slug (e.g. madrid)' }),
  provinceCode: Type.String({ description: '2-digit province code (e.g. 28)' }),
  provinceName: Type.String({ description: 'Official province name' }),
  autonomousCommunity: Type.String({ description: 'Autonomous Community name' }),
  averageHouseholdIncomeEur: Type.Number({ description: 'Average net household income in €/year (INE ADRH)' }),
  percentileNational: Type.Number({ description: 'National income percentile (0-100)' }),
  isStressedMarket: Type.Boolean({ description: 'Whether municipality is declared Zona Residencial Tensionada under Ley 12/2023' }),
  radonZone: Type.String({ description: 'CTE DB-HS 6 Radon risk zone: Zona 0, Zona I, Zona II' }),
  totalCensusSections: Type.Number({ description: 'Total number of census tracts' }),
  estimatedBarrioScore: Type.Number({ description: 'Estimated municipal aggregate BarrioScore (0-100)' }),
});

export type MunicipalitySummaryDTO = Static<typeof MunicipalitySummarySchema>;

/**
 * Detailed DTO for programmatic municipal landing pages (/municipio/:slug).
 */
export const MunicipalityDetailSchema = Type.Object({
  code: Type.String(),
  name: Type.String(),
  slug: Type.String(),
  provinceCode: Type.String(),
  provinceName: Type.String(),
  autonomousCommunity: Type.String(),
  averageHouseholdIncomeEur: Type.Number(),
  medianHouseholdIncomeEur: Type.Number(),
  averagePersonIncomeEur: Type.Number(),
  percentileNational: Type.Number(),
  isStressedMarket: Type.Boolean(),
  serpaviMedianEurM2: Type.Optional(Type.Number({ description: 'Median reference rent in €/m2 (MIVAU SERPAVI)' })),
  serpaviRangeEurM2: Type.Optional(
    Type.Object({
      lower: Type.Number(),
      upper: Type.Number(),
    })
  ),
  radonZone: Type.String(),
  totalCensusSections: Type.Number(),
  medianAge: Type.Number({ description: 'Median population age from INE demographics' }),
  singlePersonHouseholdPct: Type.Number({ description: 'Percentage of single-person households' }),
  estimatedBarrioScore: Type.Number(),
  sampleProperties: Type.Array(
    Type.Object({
      refcat: Type.String(),
      address: Type.String(),
      year: Type.Number(),
      surfaceM2: Type.Number(),
    })
  ),
  itpGeneralRatePct: Type.Number({ description: 'Autonomous Community ITP rate in %' }),
  updatedAt: Type.String({ description: 'ISO timestamp of data aggregation' }),
});

export type MunicipalityDetailDTO = Static<typeof MunicipalityDetailSchema>;

/**
 * Surface Discrepancy Check Tool DTO (/comprobar-metros-catastro).
 */
export const SurfaceDiscrepancyCheckSchema = Type.Object({
  cadastralReference: Type.String(),
  advertisedSurfaceM2: Type.Number(),
  cadastralSurfaceM2: Type.Number(),
  discrepancyPct: Type.Number({ description: 'Percentage discrepancy ((advertised - cadastral) / cadastral) * 100' }),
  divergenceM2: Type.Number({ description: 'Absolute difference in m2' }),
  isSignificantDiscrepancy: Type.Boolean({ description: 'True if discrepancy exceeds the 15% threshold under Spanish jurisprudence' }),
  advertisedPriceEur: Type.Optional(Type.Number()),
  advertisedEurM2: Type.Optional(Type.Number()),
  estimatedOverpriceEur: Type.Optional(Type.Number({ description: 'Estimated overpayment based on inflated m2' })),
  legalRemedySummary: Type.String({ description: 'Civic advice regarding subsanación catastral and hidden defects' }),
  catastroDirectUrl: Type.String({ description: 'Direct URL to Sede Electrónica del Catastro electronic certificate' }),
});

export type SurfaceDiscrepancyCheckDTO = Static<typeof SurfaceDiscrepancyCheckSchema>;

/**
 * Rent Legal Calculator DTO (/calculadora-alquiler-legal).
 */
export const RentLegalCheckSchema = Type.Object({
  municipalityName: Type.String(),
  isStressedMarket: Type.Boolean(),
  surfaceM2: Type.Number(),
  isGrandTenant: Type.Boolean({ description: 'Whether the landlord is a Gran Tenedor (>= 5 dwellings in stressed zone or >= 10 elsewhere)' }),
  previousContractRentEur: Type.Optional(Type.Number({ description: 'Rent in previous contract within the last 5 years' })),
  benchmarkEurM2: Type.Object({
    lower: Type.Number(),
    median: Type.Number(),
    upper: Type.Number(),
  }),
  monthlyBenchmarkRangeEur: Type.Object({
    lower: Type.Number(),
    median: Type.Number(),
    upper: Type.Number(),
  }),
  legalMaxRentEur: Type.Number({ description: 'Statutory maximum legal rent in €/month under Ley 12/2023' }),
  clauseLegalType: Type.String({ description: 'Statutory rule applied: TOPE_INDICE_SERPAVI | TOPE_CONTRATO_ANTERIOR | LIBRE_MERCADO' }),
  explanatoryNotes: Type.Array(Type.String()),
});

export type RentLegalCheckDTO = Static<typeof RentLegalCheckSchema>;

/**
 * Helper to slugify Spanish municipality names handling accents, ñ, slashes and articles.
 * e.g. "Donostia / San Sebastián" -> "donostia-san-sebastian"
 *      "Palma" -> "palma"
 *      "Castelló de la Plana" -> "castello-de-la-plana"
 */
export function slugifySpanishMunicipality(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/\//g, '-') // Replace slashes with dash
    .replace(/[^a-z0-9\s-]/g, '') // Remove punctuation
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with dash
    .replace(/-+/g, '-'); // Collapse multiple dashes
}

/**
 * Helper to compute surface discrepancy evaluation.
 */
export function evaluateSurfaceDiscrepancy(
  cadastralReference: string,
  cadastralSurfaceM2: number,
  advertisedSurfaceM2: number,
  advertisedPriceEur?: number
): SurfaceDiscrepancyCheckDTO {
  const divergenceM2 = Math.round((advertisedSurfaceM2 - cadastralSurfaceM2) * 100) / 100;
  const discrepancyPct =
    cadastralSurfaceM2 > 0
      ? Math.round(((advertisedSurfaceM2 - cadastralSurfaceM2) / cadastralSurfaceM2) * 1000) / 10
      : 0;
  const isSignificantDiscrepancy = Math.abs(discrepancyPct) > 15;

  let advertisedEurM2: number | undefined;
  let estimatedOverpriceEur: number | undefined;

  if (advertisedPriceEur && advertisedPriceEur > 0 && advertisedSurfaceM2 > 0) {
    advertisedEurM2 = Math.round(advertisedPriceEur / advertisedSurfaceM2);
    if (divergenceM2 > 0) {
      estimatedOverpriceEur = Math.round(divergenceM2 * advertisedEurM2);
    }
  }

  let legalRemedySummary = '';
  if (isSignificantDiscrepancy && divergenceM2 > 0) {
    legalRemedySummary =
      'La discrepancia supera el umbral del 15%. La jurisprudencia civil española (Tribunal Supremo, art. 1469 y ss. Código Civil) ampara la rescisión del contrato o la rebaja proporcional del precio de compraventa por defecto de cabida o vicios ocultos.';
  } else if (divergenceM2 > 0) {
    legalRemedySummary =
      'Diferencia moderada (inferior al 15%), habitual por inclusión de zonas comunes o cerramientos. Verifique la división horizontal oficial en el Catastro.';
  } else {
    legalRemedySummary =
      'La superficie anunciada coincide o es inferior a la superficie construida catastral oficial. No se detecta sobreprecio por exceso de cabida.';
  }

  const catastroDirectUrl = `https://www1.sedecatastro.gob.es/CYCBienInmueble/OVCConCiud.aspx?RefC=${encodeURIComponent(
    cadastralReference
  )}`;

  return {
    cadastralReference,
    advertisedSurfaceM2,
    cadastralSurfaceM2,
    discrepancyPct,
    divergenceM2,
    isSignificantDiscrepancy,
    advertisedPriceEur,
    advertisedEurM2,
    estimatedOverpriceEur,
    legalRemedySummary,
    catastroDirectUrl,
  };
}

/**
 * Helper to compute legal rent cap under Ley 12/2023 (SERPAVI).
 */
export function calculateLegalRentCap(options: {
  municipalityName: string;
  isStressedMarket: boolean;
  surfaceM2: number;
  isGrandTenant: boolean;
  previousContractRentEur?: number;
  serpaviLowerEurM2?: number;
  serpaviMedianEurM2?: number;
  serpaviUpperEurM2?: number;
  hasCeeImprovement?: boolean;
}): RentLegalCheckDTO {
  const {
    municipalityName,
    isStressedMarket,
    surfaceM2,
    isGrandTenant,
    previousContractRentEur,
    hasCeeImprovement = false,
  } = options;

  // Default SERPAVI rates if unpopulated
  const lowerEurM2 = options.serpaviLowerEurM2 || (isStressedMarket ? 8.5 : 7.0);
  const medianEurM2 = options.serpaviMedianEurM2 || (isStressedMarket ? 11.2 : 9.0);
  const upperEurM2 = options.serpaviUpperEurM2 || (isStressedMarket ? 13.8 : 11.5);

  const monthlyRange = {
    lower: Math.round(lowerEurM2 * surfaceM2),
    median: Math.round(medianEurM2 * surfaceM2),
    upper: Math.round(upperEurM2 * surfaceM2),
  };

  const notes: string[] = [];
  let legalMaxRentEur = monthlyRange.upper;
  let clauseLegalType = 'LIBRE_MERCADO';

  if (!isStressedMarket) {
    clauseLegalType = 'LIBRE_MERCADO';
    notes.push(
      `El municipio de ${municipalityName} no está actualmente declarado como Zona Residencial Tensionada. Rige el principio de libre pacto de renta conforme a la LAU (Ley 29/1994).`
    );
  } else {
    notes.push(
      `Municipio declarado Zona Residencial Tensionada conforme a la Ley Estatal 12/2023 por el Derecho a la Vivienda.`
    );

    if (isGrandTenant) {
      clauseLegalType = 'TOPE_INDICE_SERPAVI';
      legalMaxRentEur = monthlyRange.upper;
      if (previousContractRentEur && previousContractRentEur < legalMaxRentEur) {
        legalMaxRentEur = previousContractRentEur;
        notes.push(
          'Al ser Gran Tenedor, la renta no puede exceder el límite superior del Índice SERPAVI ni la renta del contrato anterior (la menor de ambas).'
        );
      } else {
        notes.push(
          `Al ser Gran Tenedor, la renta está estrictamente topada por el límite superior del Índice Oficial SERPAVI (${monthlyRange.upper} €/mes).`
        );
      }
    } else {
      // Pequeño tenedor
      if (previousContractRentEur && previousContractRentEur > 0) {
        clauseLegalType = 'TOPE_CONTRATO_ANTERIOR';
        const allowedUpliftPct = hasCeeImprovement ? 0.1 : 0.03; // 10% max if certified energy improvement, 3% standard IGC cap
        legalMaxRentEur = Math.round(previousContractRentEur * (1 + allowedUpliftPct));
        notes.push(
          `Pequeño propietario: La nueva renta está limitada a la del último contrato vigente (${previousContractRentEur} €) más la actualización legal máxima aplicable.`
        );
      } else {
        clauseLegalType = 'TOPE_INDICE_SERPAVI';
        legalMaxRentEur = monthlyRange.upper;
        notes.push(
          `Vivienda sin contrato previo en los últimos 5 años en zona tensionada: Se aplica como tope máximo el rango superior del Índice SERPAVI.`
        );
      }
    }
  }

  return {
    municipalityName,
    isStressedMarket,
    surfaceM2,
    isGrandTenant,
    previousContractRentEur,
    benchmarkEurM2: {
      lower: lowerEurM2,
      median: medianEurM2,
      upper: upperEurM2,
    },
    monthlyBenchmarkRangeEur: monthlyRange,
    legalMaxRentEur,
    clauseLegalType,
    explanatoryNotes: notes,
  };
}
