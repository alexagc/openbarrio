import { Type, Static } from '@sinclair/typebox';

export const FiscalEstimateSchema = Type.Object({
  cadastralReference: Type.String({ description: 'Official cadastral reference' }),
  autonomousCommunity: Type.String({ description: 'Autonomous Community name' }),
  municipalityName: Type.String({ description: 'Municipality name' }),
  purchasePriceEur: Type.Number({ minimum: 0, description: 'Transaction purchase or advertised price in Euros' }),
  itpRatePct: Type.Number({ minimum: 0, maximum: 20, description: 'Applicable general ITP rate (Impuesto sobre Transmisiones Patrimoniales) in percentage' }),
  itpQuotaEur: Type.Number({ minimum: 0, description: 'Calculated ITP tax quota in Euros' }),
  estimatedCadastralValueEur: Type.Number({ minimum: 0, description: 'Estimated cadastral value based on surface and valuation modules' }),
  ibiRatePct: Type.Number({ minimum: 0, maximum: 5, description: 'Municipal urban property tax (IBI) rate in percentage' }),
  ibiEstimatedAnnualQuotaEur: Type.Number({ minimum: 0, description: 'Estimated annual municipal IBI tax quota in Euros' }),
  advertisedSurfaceM2: Type.Optional(Type.Number({ minimum: 0, description: 'Advertised surface area from real estate listing in m²' })),
  cadastralSurfaceM2: Type.Number({ minimum: 0, description: 'Official built surface area registered in Catastro in m²' }),
  surfaceDiscrepancyPct: Type.Optional(Type.Number({ description: 'Percentage difference between advertised and cadastral surface' })),
  surfaceAlert: Type.Optional(Type.String({ description: 'Discrepancy warning message if discrepancy exceeds 15%' })),
});

export type FiscalEstimateDTO = Static<typeof FiscalEstimateSchema>;

/**
 * Autonomous Community ITP general tax rates lookup by 2-digit province code.
 */
export const REGIONAL_ITP_RATES: Record<string, { community: string; ratePct: number }> = {
  // Comunidad de Madrid
  '28': { community: 'Comunidad de Madrid', ratePct: 6.0 },
  // Comunidad Foral de Navarra
  '31': { community: 'Comunidad Foral de Navarra', ratePct: 6.0 },
  // País Vasco / Euskadi
  '01': { community: 'País Vasco', ratePct: 4.0 },
  '20': { community: 'País Vasco', ratePct: 4.0 },
  '48': { community: 'País Vasco', ratePct: 4.0 },
  // Cataluña
  '08': { community: 'Cataluña', ratePct: 10.0 },
  '17': { community: 'Cataluña', ratePct: 10.0 },
  '25': { community: 'Cataluña', ratePct: 10.0 },
  '43': { community: 'Cataluña', ratePct: 10.0 },
  // Comunitat Valenciana
  '03': { community: 'Comunitat Valenciana', ratePct: 10.0 },
  '12': { community: 'Comunitat Valenciana', ratePct: 10.0 },
  '46': { community: 'Comunitat Valenciana', ratePct: 10.0 },
  // Galicia
  '15': { community: 'Galicia', ratePct: 9.0 },
  '27': { community: 'Galicia', ratePct: 9.0 },
  '32': { community: 'Galicia', ratePct: 9.0 },
  '36': { community: 'Galicia', ratePct: 9.0 },
  // Illes Balears
  '07': { community: 'Illes Balears', ratePct: 8.0 },
  // Andalucía
  '04': { community: 'Andalucía', ratePct: 7.0 },
  '11': { community: 'Andalucía', ratePct: 7.0 },
  '14': { community: 'Andalucía', ratePct: 7.0 },
  '18': { community: 'Andalucía', ratePct: 7.0 },
  '21': { community: 'Andalucía', ratePct: 7.0 },
  '23': { community: 'Andalucía', ratePct: 7.0 },
  '29': { community: 'Andalucía', ratePct: 7.0 },
  '41': { community: 'Andalucía', ratePct: 7.0 },
  // Principado de Asturias
  '33': { community: 'Principado de Asturias', ratePct: 8.0 },
  // Cantabria
  '39': { community: 'Cantabria', ratePct: 8.0 },
  // Aragón
  '22': { community: 'Aragón', ratePct: 8.0 },
  '44': { community: 'Aragón', ratePct: 8.0 },
  '50': { community: 'Aragón', ratePct: 8.0 },
  // Castilla y León
  '05': { community: 'Castilla y León', ratePct: 8.0 },
  '09': { community: 'Castilla y León', ratePct: 8.0 },
  '24': { community: 'Castilla y León', ratePct: 8.0 },
  '34': { community: 'Castilla y León', ratePct: 8.0 },
  '37': { community: 'Castilla y León', ratePct: 8.0 },
  '40': { community: 'Castilla y León', ratePct: 8.0 },
  '42': { community: 'Castilla y León', ratePct: 8.0 },
  '47': { community: 'Castilla y León', ratePct: 8.0 },
  '49': { community: 'Castilla y León', ratePct: 8.0 },
  // Castilla-La Mancha
  '02': { community: 'Castilla-La Mancha', ratePct: 9.0 },
  '13': { community: 'Castilla-La Mancha', ratePct: 9.0 },
  '16': { community: 'Castilla-La Mancha', ratePct: 9.0 },
  '19': { community: 'Castilla-La Mancha', ratePct: 9.0 },
  '45': { community: 'Castilla-La Mancha', ratePct: 9.0 },
  // Extremadura
  '06': { community: 'Extremadura', ratePct: 8.0 },
  '10': { community: 'Extremadura', ratePct: 8.0 },
  // Región de Murcia
  '30': { community: 'Región de Murcia', ratePct: 8.0 },
  // La Rioja
  '26': { community: 'La Rioja', ratePct: 7.0 },
  // Canarias
  '35': { community: 'Canarias', ratePct: 6.5 },
  '38': { community: 'Canarias', ratePct: 6.5 },
  // Ceuta & Melilla
  '51': { community: 'Ceuta', ratePct: 6.0 },
  '52': { community: 'Melilla', ratePct: 6.0 },
};

export interface CalculateFiscalOptions {
  cadastralReference: string;
  provinceCode?: string;
  municipalityName: string;
  purchasePriceEur: number;
  cadastralSurfaceM2: number;
  advertisedSurfaceM2?: number;
  constructionYear?: number;
  customIbiRatePct?: number;
}

/**
 * Calculates official regional ITP tax, estimated municipal IBI, and checks surface discrepancies.
 */
export function calculateFiscalEstimate(options: CalculateFiscalOptions): FiscalEstimateDTO {
  const {
    cadastralReference,
    provinceCode = '28',
    municipalityName,
    purchasePriceEur,
    cadastralSurfaceM2,
    advertisedSurfaceM2,
    customIbiRatePct,
  } = options;

  // 1. Regional ITP lookup
  const cleanProv = (provinceCode || cadastralReference.slice(0, 2)).padStart(2, '0');
  const regionalData = REGIONAL_ITP_RATES[cleanProv] || { community: 'España (Tipo General)', ratePct: 8.0 };
  const itpRatePct = regionalData.ratePct;
  const itpQuotaEur = Math.round(purchasePriceEur * (itpRatePct / 100));

  // 2. Municipal IBI estimation
  // Spanish urban properties have average IBI rates between 0.40% and 0.65% (Madrid 0.456%, Barcelona 0.66%, Valencia 0.723%)
  let ibiRatePct = customIbiRatePct ?? 0.50;
  if (!customIbiRatePct) {
    if (cleanProv === '28') ibiRatePct = 0.456;
    else if (cleanProv === '08') ibiRatePct = 0.660;
    else if (cleanProv === '46') ibiRatePct = 0.723;
    else if (cleanProv === '41') ibiRatePct = 0.675;
    else if (cleanProv === '48') ibiRatePct = 0.400;
  }

  // Estimated cadastral value is typically ~40% - 50% of market value in Spain, or ~800-1200€/m²
  const estimatedCadastralValueEur = purchasePriceEur > 0
    ? Math.round(purchasePriceEur * 0.45)
    : Math.round(Math.max(30000, cadastralSurfaceM2 * 850));

  const ibiEstimatedAnnualQuotaEur = Math.round(estimatedCadastralValueEur * (ibiRatePct / 100));

  // 3. Surface Discrepancy Check (Advertised vs Catastro)
  let surfaceDiscrepancyPct: number | undefined;
  let surfaceAlert: string | undefined;

  if (advertisedSurfaceM2 && advertisedSurfaceM2 > 0 && cadastralSurfaceM2 > 0) {
    const diff = advertisedSurfaceM2 - cadastralSurfaceM2;
    const pct = (diff / cadastralSurfaceM2) * 100;
    surfaceDiscrepancyPct = Number(pct.toFixed(1));

    if (pct > 15.0) {
      surfaceAlert = `⚠️ +${Math.round(pct)}% m² publicitados vs Catastro (${advertisedSurfaceM2} m² vs ${cadastralSurfaceM2} m²). Posible terraza cerrada sin legalizar o zonas comunes computadas como útiles.`;
    } else if (pct < -15.0) {
      surfaceAlert = `ℹ️ ${Math.round(pct)}% m² anunciados vs Catastro (${advertisedSurfaceM2} m² vs ${cadastralSurfaceM2} m²). El anuncio podría computar solo superficie útil privativa.`;
    }
  }

  return {
    cadastralReference,
    autonomousCommunity: regionalData.community,
    municipalityName,
    purchasePriceEur,
    itpRatePct,
    itpQuotaEur,
    estimatedCadastralValueEur,
    ibiRatePct,
    ibiEstimatedAnnualQuotaEur,
    advertisedSurfaceM2,
    cadastralSurfaceM2,
    surfaceDiscrepancyPct,
    surfaceAlert,
  };
}
