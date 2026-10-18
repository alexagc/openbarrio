import { Type, Static } from '@sinclair/typebox';

export const NoiseLevelCategorySchema = Type.Union([
  Type.Literal('QUIET'),
  Type.Literal('MODERATE'),
  Type.Literal('NOISY'),
  Type.Literal('VERY_NOISY'),
]);

export const PredominantNoiseSourceSchema = Type.Union([
  Type.Literal('ROAD_TRAFFIC'),
  Type.Literal('RAILWAY'),
  Type.Literal('AIRPORT'),
  Type.Literal('INDUSTRIAL'),
  Type.Literal('NONE'),
]);

export const FloodRiskLevelSchema = Type.Union([
  Type.Literal('NONE'),
  Type.Literal('LOW'),
  Type.Literal('MEDIUM'),
  Type.Literal('HIGH'),
]);

export const NoiseDataSchema = Type.Object({
  dayEveningNightDecibels: Type.Number({ description: 'Lden dB(A)' }),
  category: NoiseLevelCategorySchema,
  predominantSource: PredominantNoiseSourceSchema,
});

export const FloodRiskDataSchema = Type.Object({
  level: FloodRiskLevelSchema,
  returnPeriodYears: Type.Union([Type.Number(), Type.Null()]),
  isInPreferentialFlowZone: Type.Boolean(),
});

export const EnvironmentalDataSchema = Type.Object({
  noise: NoiseDataSchema,
  floodRisk: FloodRiskDataSchema,
});

export type NoiseLevelCategory = Static<typeof NoiseLevelCategorySchema>;
export type PredominantNoiseSource = Static<typeof PredominantNoiseSourceSchema>;
export type FloodRiskLevel = Static<typeof FloodRiskLevelSchema>;
export type NoiseData = Static<typeof NoiseDataSchema>;
export type FloodRiskData = Static<typeof FloodRiskDataSchema>;
export type EnvironmentalData = Static<typeof EnvironmentalDataSchema>;
