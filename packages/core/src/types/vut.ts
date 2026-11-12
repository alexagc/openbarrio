import { Type, Static } from '@sinclair/typebox';

export type VutSaturationRisk = 'low' | 'moderate' | 'critical';

export const VutEvaluationSchema = Type.Object({
  censusSectionId: Type.String({ description: 'Official 10-digit INE census section code' }),
  totalDwellings: Type.Number({ minimum: 0, description: 'Total residential dwellings in the census section' }),
  vutCount: Type.Number({ minimum: 0, description: 'Official count of registered tourist dwellings (INE VUT)' }),
  vutBeds: Type.Number({ minimum: 0, description: 'Total tourist accommodation capacity (bed places)' }),
  vutRatioPct: Type.Number({ minimum: 0, maximum: 100, description: 'Percentage of tourist apartments over total dwellings' }),
  saturationRisk: Type.Union([
    Type.Literal('low'),
    Type.Literal('moderate'),
    Type.Literal('critical'),
  ], { description: 'Civic coexistence and tourism saturation risk classification' }),
  penaltyApplied: Type.Number({ minimum: 0, maximum: 30, description: 'Penalty points subtracted from Urban Planning civic score' }),
  description: Type.String({ description: 'Technical civic commentary on neighborhood coexistence impact and rent pressure' }),
  isEstimated: Type.Optional(Type.Boolean({ description: 'Indicates whether the VUT metric is derived from statistical estimation rather than official registry' })),
  source: Type.Optional(Type.String({ description: 'Source dataset attribution' })),
});

export type VutEvaluationDTO = Static<typeof VutEvaluationSchema>;

/**
 * Evaluates INE Tourist Housing (VUT) saturation and calculates the civic score penalty.
 */
export function evaluateVutSaturation(
  censusSectionId: string,
  totalDwellings: number,
  vutCount: number,
  vutBeds: number,
  isEstimated: boolean = false
): VutEvaluationDTO {
  const safeTotal = Math.max(1, totalDwellings);
  const ratio = (vutCount / safeTotal) * 100;
  const vutRatioPct = Number(ratio.toFixed(2));

  let saturationRisk: VutSaturationRisk;
  let penaltyApplied = 0;
  let description = '';

  if (vutRatioPct < 3.0) {
    saturationRisk = 'low';
    penaltyApplied = 0;
    description = `Baja presión de vivienda turística (${vutRatioPct}% del parque residencial). Convivencia vecinal y rotación de inquilinos dentro de parámetros habituales.`;
  } else if (vutRatioPct < 8.0) {
    saturationRisk = 'moderate';
    penaltyApplied = Math.round(5 + ((vutRatioPct - 3) / 5) * 5); // 5 to 10 points
    description = `Presión moderada de pisos turísticos (${vutRatioPct}% de las viviendas, ${vutCount} VUTs registradas). Riesgo leve de ruidos en zonas comunes y tensión en oferta de alquiler residencial.`;
  } else {
    saturationRisk = 'critical';
    penaltyApplied = Math.min(25, Math.round(15 + Math.min(10, ((vutRatioPct - 8) / 7) * 10))); // 15 to 25 points
    description = `Alerta crítica por saturación de pisos turísticos (${vutRatioPct}% de las viviendas, ${vutCount} VUTs registradas). Elevado riesgo de expulsión residencial, afección acústica continuada y conflictividad en comunidades de propietarios.`;
  }

  return {
    censusSectionId,
    totalDwellings,
    vutCount,
    vutBeds,
    vutRatioPct,
    saturationRisk,
    penaltyApplied,
    description,
    isEstimated,
    source: isEstimated
      ? 'Estimación Heurística Territorial (Sección sin datos INE)'
      : 'INE - Medición del número de viviendas de uso turístico en España (Oficial)',
  };
}
