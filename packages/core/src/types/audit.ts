import { Type, Static, FormatRegistry } from '@sinclair/typebox';
import { CadastralPropertySchema } from './catastro.js';
import { CensusTractIncomeSchema } from './ine.js';
import { EnvironmentalDataSchema } from './environmental.js';
import { CivicConnectivityDataSchema } from './connectivity.js';
import { UrbanPlanningDataSchema } from './urban-planning.js';
import { BuildingCapExRiskSchema } from './capex.js';

if (!FormatRegistry.Has('uuid')) {
  FormatRegistry.Set('uuid', (value) => typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value));
}
if (!FormatRegistry.Has('date-time')) {
  FormatRegistry.Set('date-time', (value) => typeof value === 'string' && !isNaN(Date.parse(value)));
}

export const AuditSubscoresSchema = Type.Object({
  building: Type.Number({ minimum: 0, maximum: 100, description: 'Building antiquity, CTE era and structural specs (0-100)' }),
  connectivity: Type.Number({ minimum: 0, maximum: 100, description: '15-minute city walkability to health, school, transit, parks (0-100)' }),
  environmental: Type.Number({ minimum: 0, maximum: 100, description: 'Combined acoustic comfort, flood safety and air quality (0-100)' }),
  socioeconomic: Type.Number({ minimum: 0, maximum: 100, description: 'Census tract income and municipal standing (0-100)' }),
  urbanPlanning: Type.Number({ minimum: 0, maximum: 100, description: 'SIU land classification, legal zoning and rent cap status (0-100)' }),
});

export const AuditScoreBreakdownSchema = Type.Object({
  overallScore: Type.Number({ minimum: 0, maximum: 100, description: 'Weighted composite Barrio Score (0-100)' }),
  subscores: AuditSubscoresSchema,
  // Transitional backward-compatibility aliases:
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
  connectivity: Type.Optional(CivicConnectivityDataSchema),
  urbanPlanning: Type.Optional(UrbanPlanningDataSchema),
  score: AuditScoreBreakdownSchema,
  rentalBenchmark: Type.Optional(RentalBenchmarkSchema),
  capex: Type.Optional(BuildingCapExRiskSchema),
});

export type AuditSubscores = Static<typeof AuditSubscoresSchema>;
export type AuditScoreBreakdown = Static<typeof AuditScoreBreakdownSchema>;
export type RentalBenchmark = Static<typeof RentalBenchmarkSchema>;
export type PropertyAuditReport = Static<typeof PropertyAuditReportSchema>;
