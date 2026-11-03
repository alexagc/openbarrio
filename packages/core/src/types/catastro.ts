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
  plotSurfaceM2: Type.Optional(Type.Number({ description: 'Ground parcel land surface in m² (superficie de suelo/parcela)' })),
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

export const PropertyTypologySchema = Type.Union([
  Type.Literal('RESIDENTIAL'),
  Type.Literal('VACANT_PLOT'),
  Type.Literal('INDUSTRIAL'),
  Type.Literal('RUSTIC'),
  Type.Literal('COMMERCIAL'),
  Type.Literal('EQUIPMENT'),
], { description: 'Authoritative property usage typology' });

export type PropertyTypology = Static<typeof PropertyTypologySchema>;

export const CadastralPropertySchema = Type.Object({
  cadastralReference: Type.String({
    description: 'Spanish Cadastral Reference (14-character parcel or 20-character property code)',
  }),
  address: CadastralAddressSchema,
  coordinates: CadastralCoordinatesSchema,
  building: CadastralBuildingSchema,
  unit: Type.Optional(CadastralUnitSchema),
  plotSurfaceM2: Type.Optional(Type.Number({ description: 'Total parcel land surface area in square meters (superficie de parcela/suelo)' })),
  typology: Type.Optional(PropertyTypologySchema),
  jurisdiction: Type.Optional(
    Type.Union([
      Type.Literal('dgc'),
      Type.Literal('bizkaia'),
      Type.Literal('gipuzkoa'),
      Type.Literal('araba'),
      Type.Literal('navarra'),
    ], { description: 'Cadastral jurisdiction: dgc (national), bizkaia, gipuzkoa, araba, navarra' })
  ),
  hasHorizontalDivision: Type.Optional(
    Type.Boolean({ description: 'Whether the parcel supports horizontal unit division' })
  ),
});

export type CadastralJurisdiction = 'dgc' | 'bizkaia' | 'gipuzkoa' | 'araba' | 'navarra';

export function detectCadastralJurisdiction(
  refcat?: string | null,
  coords?: { latitude: number; longitude: number }
): CadastralJurisdiction {
  if (coords) {
    const { latitude: lat, longitude: lon } = coords;
    // Bounding box heuristic for Spanish foral territories
    if (lat >= 41.90 && lat <= 43.35 && lon >= -2.55 && lon <= -0.70 && lon > -1.75) {
      return 'navarra';
    }
    if (lat >= 42.95 && lat <= 43.50 && lon >= -3.50 && lon <= -2.40) {
      return 'bizkaia';
    }
    if (lat >= 42.85 && lat <= 43.45 && lon >= -2.60 && lon <= -1.70) {
      return 'gipuzkoa';
    }
    if (lat >= 42.40 && lat <= 43.15 && lon >= -3.15 && lon <= -2.15) {
      return 'araba';
    }
  }

  if (refcat) {
    const clean = refcat.replace(/[\s\-_.]/g, '').toUpperCase();
    if (clean.startsWith('48') || clean.startsWith('A48') || clean.startsWith('BI')) return 'bizkaia';
    if (clean.startsWith('20') || clean.startsWith('SS') || clean.startsWith('GI')) return 'gipuzkoa';
    if (clean.startsWith('01') || clean.startsWith('VI') || clean.startsWith('AR')) return 'araba';
    if (clean.startsWith('31') || clean.startsWith('NA')) return 'navarra';
  }

  return 'dgc';
}

/**
 * Detects the authoritative property typology based on Catastro primaryUse,
 * constructionYear, unitsCount and cadastralReference structure.
 */
export function detectPropertyTypology(
  primaryUse?: string | null,
  constructionYear?: number | null,
  unitsCount?: number | null,
  cadastralReference?: string | null
): PropertyTypology {
  const use = (primaryUse || '').toUpperCase().trim();
  const ref = (cadastralReference || '').toUpperCase().trim();

  // 1. Explicit Residential use
  if (use.includes('RESIDENC') || use.includes('VIVIENDA')) {
    return 'RESIDENTIAL';
  }

  // 2. Rustic / Rural classification
  if (
    use.includes('RUSTIC') ||
    use.includes('RÚSTIC') ||
    use.includes('AGRARI') ||
    use.includes('AGRO') ||
    use.includes('FOREST') ||
    use.includes('GANADER') ||
    use.includes('RURAL') ||
    (/^\d{5}[A-Z]\d{8}/.test(ref) && !use)
  ) {
    return 'RUSTIC';
  }

  // 3. Industrial / Warehouse / Logistics / Factory
  if (
    use.includes('INDUSTRIAL') ||
    use.includes('ALMACEN') ||
    use.includes('ALMACÉN') ||
    use.includes('FABRICA') ||
    use.includes('FÁBRICA') ||
    use.includes('LOGISTIC') ||
    use.includes('LOGÍSTIC') ||
    use.includes('NAVE') ||
    use.includes('TALLER')
  ) {
    return 'INDUSTRIAL';
  }

  // 4. Commercial / Offices / Hospitality / Retail
  if (
    use.includes('COMERCIAL') ||
    use.includes('OFICINA') ||
    use.includes('HOSTELER') ||
    use.includes('HOTEL') ||
    use.includes('ESPECTACUL') ||
    use.includes('COMERCIO') ||
    use.includes('RESTAUR')
  ) {
    return 'COMMERCIAL';
  }

  // 5. Equipment / Dotational / Institutional / Healthcare / Education / Religious
  if (
    use.includes('EQUIPAMIENTO') ||
    use.includes('DOTACIONAL') ||
    use.includes('CULTURAL') ||
    use.includes('RELIGIOSO') ||
    use.includes('SANITARIO') ||
    use.includes('DOCENTE') ||
    use.includes('DEPORTIVO') ||
    use.includes('PUBLICO') ||
    use.includes('PÚBLICO') ||
    use.includes('ADMINISTRATIVO')
  ) {
    return 'EQUIPMENT';
  }

  // 6. Vacant Urban Plot (Solar / Suelo vacante / Parcela sin edificar)
  if (
    use.includes('SOLAR') ||
    use.includes('SUELO') ||
    use.includes('URBANO SIN EDIFICAR') ||
    use.includes('VACANTE') ||
    use.includes('PARCELA') ||
    ((constructionYear === 0 || constructionYear === null || constructionYear === undefined) &&
     (unitsCount === 0 || unitsCount === null || unitsCount === undefined))
  ) {
    return 'VACANT_PLOT';
  }

  // 7. Default: Residential
  return 'RESIDENTIAL';
}

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

  // 6. Spanish cadastral reference structural patterns (DGC and Foral):
  // Urban 14-char: 7 alphanumeric (parcel) + 7 alphanumeric (sheet)
  // Urban 20-char: 14 chars + 4 digits (unit) + 2 letters (control)
  // Rural 14-char: 5 digits (prov+mun) + 1 letter (sector) + 8 digits (poly+parcel)
  // Rural 20-char: 14 rural chars + 4 digits (subparcel) + 2 letters (control)
  // Foral (Euskadi & Navarra): province/regional prefixes (01, 20, 48, 31, A48, etc.)
  const isForal = /^(01|20|48|31|A48|BI|SS|GI|VI|AR|NA)[0-9A-Z]{8,18}$/.test(clean);
  const isUrban14 = /^[0-9A-Z]{7}[0-9A-Z]{7}$/.test(clean);
  const isUrban20 = /^[0-9A-Z]{7}[0-9A-Z]{7}[0-9]{4}[A-Z]{2}$/.test(clean);
  const isRural14 = /^\d{5}[A-Z]\d{8}$/.test(clean);
  const isRural20 = /^\d{5}[A-Z]\d{8}\d{4}[A-Z]{2}$/.test(clean);

  return isUrban14 || isUrban20 || isRural14 || isRural20 || isForal;
}

export const CadastralGeometrySchema = Type.Object({
  cadastralReference: Type.String(),
  type: Type.Union([Type.Literal('building'), Type.Literal('parcel'), Type.Literal('fallback')]),
  geometry: Type.Object({
    type: Type.Literal('Polygon'),
    coordinates: Type.Array(Type.Array(Type.Array(Type.Number()))),
  }),
  properties: Type.Object({
    name: Type.Optional(Type.String()),
    numberOfFloors: Type.Optional(Type.Number()),
    height: Type.Optional(Type.Number()),
    constructionYear: Type.Optional(Type.Number()),
    areaM2: Type.Optional(Type.Number()),
  }),
});

export type CadastralGeometry = Static<typeof CadastralGeometrySchema>;
