import { Type, Static } from '@sinclair/typebox';

export const CadastralAddressSchema = Type.Object({
  street: Type.String(),
  number: Type.String(),
  postalCode: Type.String(),
  municipality: Type.String(),
  province: Type.String(),
  provinceCode: Type.Optional(Type.String({ description: '2-digit INE province code (e.g. "28", "08")' })),
  municipalityCode: Type.Optional(Type.String({ description: '1 to 3-digit INE municipality code (e.g. "079", "019")' })),
});

export const CadastralCoordinatesSchema = Type.Object({
  latitude: Type.Number(),
  longitude: Type.Number(),
  srs: Type.Literal('EPSG:4326'),
});

export const CadastralBuildingSchema = Type.Object({
  constructionYear: Type.Number(),
  builtSurfaceM2: Type.Number(),
  primaryUse: Type.String(),
  unitsCount: Type.Number(),
  hasCommercialGroundFloor: Type.Boolean(),
});

export const CadastralUnitSchema = Type.Object({
  cadastralReference: Type.String({
    description: 'Full 20-character Cadastral Reference of the individual unit',
  }),
  floor: Type.String({ description: 'Floor level (e.g. "03", "PB", "EN", "01")' }),
  door: Type.String({ description: 'Door indicator (e.g. "01", "B", "DR", "IZ")' }),
  staircase: Type.Optional(Type.String({ description: 'Staircase indicator (e.g. "1", "D")' })),
  block: Type.Optional(Type.String({ description: 'Building block indicator' })),
  use: Type.String({ description: 'Official usage category (e.g. "Residencial", "Comercial", "Almacen")' }),
  builtSurfaceM2: Type.Number({ description: 'Private constructed surface in square meters' }),
  participationCoefficient: Type.Optional(Type.Number({ description: 'Community participation percentage (%)' })),
});

export const CadastralUnitsResponseSchema = Type.Object({
  parcelCadastralReference: Type.String({ description: '14-character parcel Cadastral Reference' }),
  totalUnits: Type.Number({ description: 'Total units in the horizontal division' }),
  units: Type.Array(CadastralUnitSchema),
});

export const CadastralPropertySchema = Type.Object({
  cadastralReference: Type.String({
    description: 'Spanish Cadastral Reference (14-character parcel or 20-character property code)',
  }),
  address: CadastralAddressSchema,
  coordinates: CadastralCoordinatesSchema,
  building: CadastralBuildingSchema,
  unit: Type.Optional(CadastralUnitSchema),
});

export type CadastralUnit = Static<typeof CadastralUnitSchema>;
export type CadastralUnitsResponse = Static<typeof CadastralUnitsResponseSchema>;
export type CadastralAddress = Static<typeof CadastralAddressSchema>;
export type CadastralCoordinates = Static<typeof CadastralCoordinatesSchema>;
export type CadastralBuilding = Static<typeof CadastralBuildingSchema>;
export type CadastralProperty = Static<typeof CadastralPropertySchema>;

/**
 * Validates whether a given string is a valid Spanish Cadastral Reference (Referencia Catastral).
 *
 * Requirements:
 * - Strictly 14 characters (parcel level) or 20 characters (unit level) after removing spaces, dashes, dots.
 * - Must contain only alphanumeric characters (0-9, A-Z).
 * - Must contain BOTH numeric digits and alphabetic characters (never pure numbers or pure words).
 * - Must not start with or contain Spanish street type indicators or address keywords
 *   (e.g., 'calle', 'cl', 'c/', 'avenida', 'avda', 'paseo', 'plaza', 'carrer', 'via', 'numero', 'portal', 'bis', etc.)
 * - If input contains whitespace, it must not contain alphabetic words of 3+ letters without digits.
 */
export function isCadastralReference(value: string | null | undefined): boolean {
  if (!value) return false;
  const raw = value.trim();
  if (!raw) return false;

  // 1. Street prefixes and address indicators definitively identify an address
  const streetIndicatorRegex =
    /^(calle|cl|c\/|c\.|avenida|avda|av|paseo|pso|plaza|plza|pza|carrer|carretera|crta|via|vía|camino|ronda|bulevar|rambla|travesia|travesía|pasaje|poligono|polígono|urbanizacion|urbanización)\b/i;
  if (streetIndicatorRegex.test(raw)) {
    return false;
  }

  // Common address words that never appear in a cadastral reference
  const addressWordsRegex =
    /\b(calle|avenida|paseo|plaza|carrer|carretera|camino|madrid|barcelona|valencia|sevilla|zaragoza|malaga|málaga|bilbao|bis|duplicado|numero|número|num|nº|portal|escalera|planta|puerta)\b/i;
  if (addressWordsRegex.test(raw)) {
    return false;
  }

  // If query contains words of 3+ letters without digits and is not a single contiguous 14/20 string
  if (/\b[a-zA-ZáéíóúÁÉÍÓÚñÑçÇ]{3,}\b/.test(raw) && !/^[0-9A-Za-z]{14}$|^[0-9A-Za-z]{20}$/.test(raw)) {
    return false;
  }

  // 2. Normalize by removing internal whitespace, dashes, dots
  const clean = raw.replace(/[\s\-_.]/g, '').toUpperCase();

  // 3. Cadastral references are strictly 14 or 20 characters
  if (clean.length !== 14 && clean.length !== 20) {
    return false;
  }

  // 4. Must be strictly alphanumeric
  if (!/^[0-9A-Z]+$/.test(clean)) {
    return false;
  }

  // 5. Must contain at least one digit and at least one letter
  if (!/[0-9]/.test(clean) || !/[A-Z]/.test(clean)) {
    return false;
  }

  // 6. Spanish cadastral reference structural patterns:
  // Urban 14-char: 7 alphanumeric (parcel) + 7 alphanumeric (sheet)
  // Urban 20-char: 14 chars + 4 digits (unit) + 2 letters (control)
  // Rural 14-char: 5 digits (prov+mun) + 1 letter (sector) + 8 digits (poly+parcel)
  // Rural 20-char: 14 rural chars + 4 digits (subparcel) + 2 letters (control)
  const isUrban14 = /^[0-9A-Z]{7}[0-9A-Z]{7}$/.test(clean);
  const isUrban20 = /^[0-9A-Z]{7}[0-9A-Z]{7}[0-9]{4}[A-Z]{2}$/.test(clean);
  const isRural14 = /^\d{5}[A-Z]\d{8}$/.test(clean);
  const isRural20 = /^\d{5}[A-Z]\d{8}\d{4}[A-Z]{2}$/.test(clean);

  return isUrban14 || isUrban20 || isRural14 || isRural20;
}
