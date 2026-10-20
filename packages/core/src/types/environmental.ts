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

export const AirQualityCategorySchema = Type.Union([
  Type.Literal('GOOD'),
  Type.Literal('FAIR'),
  Type.Literal('MODERATE'),
  Type.Literal('POOR'),
  Type.Literal('VERY_POOR'),
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

export const AirQualityDataSchema = Type.Object({
  aqiIndex: Type.Number({ minimum: 0, maximum: 500, description: 'European Air Quality Index' }),
  category: AirQualityCategorySchema,
  stationName: Type.String({ description: 'Monitoring station name' }),
  no2MicrogramsM3: Type.Optional(Type.Number()),
  pm25MicrogramsM3: Type.Optional(Type.Number()),
  pm10MicrogramsM3: Type.Optional(Type.Number()),
});

export const EnvironmentalDataSchema = Type.Object({
  noise: NoiseDataSchema,
  floodRisk: FloodRiskDataSchema,
  airQuality: Type.Optional(AirQualityDataSchema),
});

export type NoiseLevelCategory = Static<typeof NoiseLevelCategorySchema>;
export type PredominantNoiseSource = Static<typeof PredominantNoiseSourceSchema>;
export type FloodRiskLevel = Static<typeof FloodRiskLevelSchema>;
export type AirQualityCategory = Static<typeof AirQualityCategorySchema>;
export type NoiseData = Static<typeof NoiseDataSchema>;
export type FloodRiskData = Static<typeof FloodRiskDataSchema>;
export type AirQualityData = Static<typeof AirQualityDataSchema>;
export type EnvironmentalData = Static<typeof EnvironmentalDataSchema>;
