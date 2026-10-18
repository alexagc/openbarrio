import { Type, Static } from '@sinclair/typebox';
import { CadastralPropertySchema } from './catastro.js';
import { CensusTractIncomeSchema } from './ine.js';
import { EnvironmentalDataSchema } from './environmental.js';

export const AuditScoreBreakdownSchema = Type.Object({
  overallScore: Type.Number({ minimum: 0, maximum: 100, description: 'Weighted composite Barrio Score (0-100)' }),
  socioeconomicScore: Type.Number({ minimum: 0, maximum: 100, description: 'Socioeconomic standing score (0-100)' }),
  buildingHealthScore: Type.Number({ minimum: 0, maximum: 100, description: 'Building age, construction regulations and physical health (0-100)' }),
  acousticComfortScore: Type.Number({ minimum: 0, maximum: 100, description: 'Acoustic comfort rating (0-100)' }),
  climateSafetyScore: Type.Number({ minimum: 0, maximum: 100, description: 'Flood and climate safety rating (0-100)' }),
  keyHighlights: Type.Array(Type.String(), { description: 'Positive attributes and strengths identified in public registers' }),
  keyRisks: Type.Array(Type.String(), { description: 'Due diligence alerts, potential renovation requirements, or environmental risks' }),
});

export const RentalBenchmarkSchema = Type.Object({
  officialRangeLowerEurM2: Type.Number(),
  officialRangeUpperEurM2: Type.Number(),
  estimatedMonthlyRentLowerEur: Type.Number(),
  estimatedMonthlyRentUpperEur: Type.Number(),
  isStressedHousingZone: Type.Boolean(),
});

export const PropertyAuditReportSchema = Type.Object({
  id: Type.String({ format: 'uuid', description: 'Unique audit report identifier' }),
  generatedAt: Type.String({ format: 'date-time', description: 'ISO 8601 generation timestamp' }),
  property: CadastralPropertySchema,
  neighborhood: CensusTractIncomeSchema,
  environment: EnvironmentalDataSchema,
  score: AuditScoreBreakdownSchema,
  rentalBenchmark: Type.Optional(RentalBenchmarkSchema),
});

export type AuditScoreBreakdown = Static<typeof AuditScoreBreakdownSchema>;
export type RentalBenchmark = Static<typeof RentalBenchmarkSchema>;
export type PropertyAuditReport = Static<typeof PropertyAuditReportSchema>;
