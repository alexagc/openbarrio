import { Type, Static } from '@sinclair/typebox';

export type RadonMunicipalZone = 'Zona 0' | 'Zona I' | 'Zona II';
export type RadonRiskLevel = 'negligible' | 'moderate' | 'high';

export const RadonEvaluationSchema = Type.Object({
  municipalityZone: Type.Union([
    Type.Literal('Zona 0'),
    Type.Literal('Zona I'),
    Type.Literal('Zona II'),
  ], { description: 'CTE DB-HS 6 radon hazard zone for the municipality' }),
  requiresMitigation: Type.Boolean({
    description: 'Whether CTE DB-HS 6 prescribes mandatory radon protection barriers for this specific dwelling/floor',
  }),
  riskLevel: Type.Union([
    Type.Literal('negligible'),
    Type.Literal('moderate'),
    Type.Literal('high'),
  ], { description: 'Contextual risk level based on municipal zone and building floor elevation' }),
  contextualReason: Type.String({
    description: 'Expert technical commentary according to Spanish Building Technical Code (CTE DB-HS 6)',
  }),
  floorLevel: Type.Optional(Type.Number({ description: 'Floor elevation (0 = Ground floor, < 0 = Basement, >= 1 = Upper floors)' })),
  isGroundContact: Type.Optional(Type.Boolean({ description: 'Whether the dwelling is directly in contact with the ground or basement slab' })),
  regulatoryReference: Type.Optional(Type.String({ description: 'Statutory regulation citation (Real Decreto 732/2019 - CTE DB-HS 6)' })),
});

export type RadonEvaluationDTO = Static<typeof RadonEvaluationSchema>;

/**
 * Contextual Radon Evaluation Engine based on CTE DB-HS 6 (Apéndice B).
 * Assesses radon exposure according to municipal zone, building typology, and floor elevation.
 */
export function evaluateRadonRisk(
  zone: RadonMunicipalZone,
  floorLevel?: number,
  unitsCount?: number
): RadonEvaluationDTO {
  // Determine if dwelling is in contact with the ground:
  // - Single-family homes (unitsCount <= 1) are always in contact with ground
  // - In multi-unit buildings, ground floor (<= 0), basement, or semi-basement are in contact
  const isGroundContact = unitsCount !== undefined && unitsCount <= 1
    ? true
    : floorLevel !== undefined
    ? floorLevel <= 0
    : true; // conservative default if floor is unknown

  let requiresMitigation = false;
  let riskLevel: RadonRiskLevel = 'negligible';
  let contextualReason = '';

  if (zone === 'Zona 0') {
    requiresMitigation = false;
    riskLevel = 'negligible';
    contextualReason = 'Municipio clasificado en Zona 0 (exposición a gas radón baja/despreciable). Sin exigencias específicas de mitigación según CTE DB-HS 6.';
  } else if (zone === 'Zona I') {
    if (isGroundContact) {
      requiresMitigation = true;
      riskLevel = 'moderate';
      contextualReason = 'Inmueble en contacto con el terreno en Zona I (riesgo moderado, 300-600 Bq/m³). Exigencia de barrera de protección anti-radón bajo solera según CTE DB-HS 6.';
    } else {
      requiresMitigation = false;
      riskLevel = 'negligible';
      contextualReason = `Municipio clasificado en Zona I, pero riesgo interior mitigado por cota de altura (Planta ${floorLevel ?? 1}).`;
    }
  } else if (zone === 'Zona II') {
    if (isGroundContact) {
      requiresMitigation = true;
      riskLevel = 'high';
      contextualReason = 'Inmueble en contacto con el terreno en Zona II (riesgo elevado, >600 Bq/m³). Exigencia de barrera anti-radón y espacio de contención ventilado o despresurización de terreno según CTE DB-HS 6.';
    } else {
      requiresMitigation = false;
      riskLevel = 'negligible';
      contextualReason = `Municipio clasificado en Zona II, pero riesgo interior mitigado por cota de altura (Planta ${floorLevel ?? 1}).`;
    }
  }

  return {
    municipalityZone: zone,
    requiresMitigation,
    riskLevel,
    contextualReason,
    floorLevel,
    isGroundContact,
    regulatoryReference: 'CTE DB-HS 6 (RD 732/2019, Apéndice B)',
  };
}
