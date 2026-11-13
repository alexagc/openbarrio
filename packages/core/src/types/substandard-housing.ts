import { Type, Static } from '@sinclair/typebox';
import { CadastralProperty } from './catastro.js';

export const SubstandardHousingSeveritySchema = Type.Union([
  Type.Literal('HIGH'),
  Type.Literal('NONE'),
], { description: 'Severity level of substandard commercial-to-residential housing / infravivienda risk' });

export type SubstandardHousingSeverity = Static<typeof SubstandardHousingSeveritySchema>;

export const SubstandardHousingAlertSchema = Type.Object({
  severity: SubstandardHousingSeveritySchema,
  isAlert: Type.Optional(Type.Boolean({ description: 'Boolean flag indicating whether substandard housing alert is active' })),
  detectedUse: Type.String({ description: 'Official cadastral use recorded in register (e.g. COMERCIAL, ALMACÉN, INDUSTRIAL, OFICINAS)' }),
  floor: Type.Union([Type.String(), Type.Null()], { description: 'Floor level of the cadastral unit (e.g. PB, 00, SS, BAJO)' }),
  warningMessage: Type.String({ description: 'Detailed warning message explaining the risk of commercial-to-residential fraud and infravivienda' }),
  legalRisks: Type.Array(Type.String(), { description: 'List of specific administrative, civil, and municipal sanctions and hazards' }),
  isGroundFloorOrBasement: Type.Boolean({ description: 'Whether the unit is situated on ground level, basement or semi-basement' }),
  lacksResidentialSubdivision: Type.Boolean({ description: 'Whether the unit lacks formal residential horizontal property subdivision' }),
  penaltyApplied: Type.Number({ minimum: 0, maximum: 25, description: 'Score penalty applied to building health and urban planning scores' }),
});

export type SubstandardHousingAlert = Static<typeof SubstandardHousingAlertSchema>;
export type CommercialHousingAlert = SubstandardHousingAlert;
export type InfraviviendaRisk = SubstandardHousingAlert;

export const CommercialHousingAlertSchema = SubstandardHousingAlertSchema;
export const InfraviviendaRiskSchema = SubstandardHousingAlertSchema;

/**
 * Common abbreviations and tokens representing ground floor, basement or semi-basement levels
 * in Spanish cadastral registers (Catastro).
 */
const GROUND_OR_BASEMENT_TOKENS = new Set([
  '0',
  '00',
  'PB',
  'BJ',
  'B',
  'BJA',
  'BAJO',
  'BAJA',
  'PLBAJA',
  'PLANTABAJA',
  'EN',
  'ENT',
  'ENTRE',
  'ENTRESUELO',
  'ENTRESOL',
  'SS',
  'SS1',
  'SS2',
  'SS3',
  'S1',
  'S2',
  'S3',
  'ST',
  'SOT',
  'SOTANO',
  'SEMISOTANO',
  'SEMISOT',
  '-1',
  '-2',
  '-3',
  '-01',
  '-02',
]);

/**
 * Evaluates whether a floor designation corresponds to ground floor, basement, or semi-basement.
 */
export function isGroundOrBasementFloor(floor?: string | null): boolean {
  if (!floor) return false;
  const raw = floor.trim();
  if (!raw) return false;

  const normalized = raw
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[\s._/\\-]/g, '');

  if (GROUND_OR_BASEMENT_TOKENS.has(normalized)) {
    return true;
  }

  const num = Number(raw);
  if (!isNaN(num) && Number.isInteger(num) && num <= 0) {
    return true;
  }

  if (/^(PB|BJ|BAJO|BAJA|PLANTA?BAJA|EN|ENT|ENTRESUELO)/i.test(normalized)) {
    return true;
  }
  if (/^(SS|S[0-9]|SOT|SOTANO|SEMISOTANO|ST|SUB)/i.test(normalized)) {
    return true;
  }

  return false;
}

/**
 * Evaluates whether an official usage designation is non-residential.
 */
export function isNonResidentialCadastralUse(use?: string | null): boolean {
  if (!use) return false;
  const normalized = use
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .trim();

  // Residential uses are valid housing
  if (normalized.includes('RESIDENC') || normalized.includes('VIVIENDA')) {
    return false;
  }

  const nonResidentialKeywords = [
    'COMERC',     // COMERCIAL, COMERCIO
    'ALMACEN',    // ALMACÉN, ALMACEN
    'INDUSTRI',   // INDUSTRIAL, INDUSTRIA
    'OFICIN',     // OFICINAS, OFICINA
    'APARC',      // APARCAMIENTO
    'GARAJ',      // GARAJE
    'ESTACION',   // ESTACIONAMIENTO
    'TRASTER',    // TRASTERO
    'LOCAL',      // LOCAL, LOCAL COMERCIAL
    'NAVE',       // NAVE INDUSTRIAL
    'HOSTEL',     // HOSTELERÍA, HOTEL
    'HOTEL',
    'RESTAUR',    // RESTAURACIÓN
    'ESPECTAC',   // ESPECTÁCULOS
    'RELIGIOS',   // RELIGIOSO
    'AGRARI',     // AGRARIO
    'AGRICOL',    // AGRÍCOLA
    'GANADER',    // GANADERO
  ];

  return nonResidentialKeywords.some((keyword) => normalized.includes(keyword));
}

/**
 * Checks if the property explicitly lacks horizontal division for residential subdivision.
 */
export function lacksResidentialSubdivision(property: CadastralProperty): boolean {
  if (property.hasHorizontalDivision === false) {
    return true;
  }
  return false;
}

/**
 * Heuristic detector for substandard housing and illegal commercial-to-residential fraud (Infravivienda).
 * Identifies commercial spaces, warehouses, or offices situated at ground floor / basement levels
 * or lacking official residential subdivision that are marketed or occupied as dwellings.
 */
export function detectSubstandardHousingAlert(property: CadastralProperty): SubstandardHousingAlert {
  if (property.typology === 'VACANT_PLOT' || property.typology === 'RUSTIC') {
    return {
      severity: 'NONE',
      isAlert: false,
      detectedUse: property.typology,
      floor: null,
      warningMessage: 'Property is classified as vacant plot or rustic land; substandard commercial housing heuristics do not apply.',
      legalRisks: [],
      isGroundFloorOrBasement: false,
      lacksResidentialSubdivision: false,
      penaltyApplied: 0,
    };
  }

  // 1. Detect cadastral usage
  const rawUse = property.unit?.use ?? property.building?.primaryUse ?? '';
  const isNonResidential = isNonResidentialCadastralUse(rawUse);

  // 2. Detect floor level
  const floor = property.unit?.floor ?? null;
  const isGroundOrBasement = isGroundOrBasementFloor(floor);

  // 3. Detect lack of residential subdivision
  const lacksSubdivision = lacksResidentialSubdivision(property);

  const isSubstandardAlert = isNonResidential && (isGroundOrBasement || lacksSubdivision);
  const detectedUse = rawUse ? rawUse.trim() : (property.typology ?? 'UNKNOWN');

  if (isSubstandardAlert) {
    const floorLabel = floor ? `floor '${floor}'` : 'ground/basement level';
    const subdivisionNotice = lacksSubdivision ? ' and lacks official residential horizontal property subdivision' : '';

    return {
      severity: 'HIGH',
      isAlert: true,
      detectedUse,
      floor,
      warningMessage: `High risk of substandard housing / illegal commercial-to-residential fraud (Infravivienda): property is officially registered with non-residential cadastral use '${detectedUse}' at ${floorLabel}${subdivisionNotice}.`,
      legalRisks: [
        'Lack of Cédula de Habitabilidad / Licencia de Primera Ocupación: Property cannot legally be occupied, advertised, or leased as a residential dwelling.',
        'Inability to register in Municipal Census (Padrón Municipal): Inhabitants face official registration denial for failing to satisfy municipal residential habitat criteria.',
        'Municipal disciplinary sanction: Urban planning enforcement risks fines up to €600,000, eviction, and mandatory restoration orders to original commercial use.',
        'Utility contract limitations: Domestic electricity, gas, and water residential contracts may be blocked or revoked without an authorized residential certificate.',
        'Mortgage financing penalties: Spanish banks typically cap mortgage financing for commercial units at 50-60% LTV, refusing standard residential mortgage conditions.',
      ],
      isGroundFloorOrBasement: isGroundOrBasement,
      lacksResidentialSubdivision: lacksSubdivision,
      penaltyApplied: 25,
    };
  }

  return {
    severity: 'NONE',
    isAlert: false,
    detectedUse: detectedUse || 'RESIDENCIAL',
    floor,
    warningMessage: 'No commercial-to-residential substandard housing alert detected: property conforms to registered residential usage standards.',
    legalRisks: [],
    isGroundFloorOrBasement: isGroundOrBasement,
    lacksResidentialSubdivision: lacksSubdivision,
    penaltyApplied: 0,
  };
}
