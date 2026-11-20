import { Type, Static, FormatRegistry } from '@sinclair/typebox';
import { CadastralPropertySchema, PropertyTypologySchema } from './catastro.js';
import { CensusTractIncomeSchema } from './ine.js';
import { EnvironmentalDataSchema } from './environmental.js';
import { CivicConnectivityDataSchema, PedestrianIsochronesSchema } from './connectivity.js';
import { UrbanPlanningDataSchema } from './urban-planning.js';
import { BuildingCapExRiskSchema } from './capex.js';
import { EnergyPerformanceCertificateSchema } from './energy.js';
import { NeighborhoodTrendsSchema } from './market.js';
import { RadonEvaluationSchema } from './radon.js';
import { VutEvaluationSchema } from './vut.js';
import { FiscalEstimateSchema } from './fiscal.js';
import { BuildingSurroundingsSchema } from './surroundings.js';
import { SubstandardHousingAlertSchema } from './substandard-housing.js';
import { BuildingInspectionSchema } from './building-inspection.js';
import { SeismicHazardSchema } from './seismic.js';
import { TransitAccessibilitySchema } from './transit.js';
import { LayerStatusInfoSchema } from './data-status.js';
import {
  AuditCoverageSchema,
  PillarAvailabilitySchema,
  PillarTrafficLightsSchema,
  ScoreConfidenceSchema,
  TrafficLightStateSchema,
} from '../scoring/traffic-light.js';

if (!FormatRegistry.Has('uuid')) {
  FormatRegistry.Set('uuid', (value) => typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value));
}
if (!FormatRegistry.Has('date-time')) {
  FormatRegistry.Set('date-time', (value) => typeof value === 'string' && !isNaN(Date.parse(value)));
}

export const ScoringWeightsSchema = Type.Object({
  connectivity: Type.Number({ minimum: 0, maximum: 1 }),
  building: Type.Number({ minimum: 0, maximum: 1 }),
  socioeconomic: Type.Number({ minimum: 0, maximum: 1 }),
  environmental: Type.Number({ minimum: 0, maximum: 1 }),
  urbanPlanning: Type.Number({ minimum: 0, maximum: 1 }),
});

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
  trafficLight: Type.Optional(TrafficLightStateSchema),
  pillarTrafficLights: Type.Optional(PillarTrafficLightsSchema),
  pillarAvailability: Type.Optional(PillarAvailabilitySchema),
  coverage: Type.Optional(AuditCoverageSchema),
  scoreConfidence: Type.Optional(ScoreConfidenceSchema),
  methodologyVersion: Type.Optional(Type.String()),
  weightsUsed: Type.Optional(ScoringWeightsSchema),
  substandardHousing: Type.Optional(SubstandardHousingAlertSchema),
  buildingInspection: Type.Optional(BuildingInspectionSchema),
  seismicHazard: Type.Optional(SeismicHazardSchema),
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
  typology: Type.Optional(PropertyTypologySchema),
  neighborhood: Type.Optional(CensusTractIncomeSchema),
  environment: EnvironmentalDataSchema,
  connectivity: Type.Optional(CivicConnectivityDataSchema),
  urbanPlanning: Type.Optional(UrbanPlanningDataSchema),
  score: AuditScoreBreakdownSchema,
  layers: Type.Optional(Type.Record(Type.String(), LayerStatusInfoSchema)),
  coverage: Type.Optional(AuditCoverageSchema),
  rentalBenchmark: Type.Optional(RentalBenchmarkSchema),
  capex: Type.Optional(BuildingCapExRiskSchema),
  energy: Type.Optional(EnergyPerformanceCertificateSchema),
  marketTrends: Type.Optional(NeighborhoodTrendsSchema),
  radon: Type.Optional(RadonEvaluationSchema),
  vut: Type.Optional(VutEvaluationSchema),
  fiscal: Type.Optional(FiscalEstimateSchema),
  surroundings: Type.Optional(BuildingSurroundingsSchema),
  substandardHousing: Type.Optional(SubstandardHousingAlertSchema),
  buildingInspection: Type.Optional(BuildingInspectionSchema),
  seismicHazard: Type.Optional(SeismicHazardSchema),
  pedestrianIsochrones: Type.Optional(PedestrianIsochronesSchema),
  transit: Type.Optional(TransitAccessibilitySchema),
});

export type AuditSubscores = Static<typeof AuditSubscoresSchema>;
export type AuditScoreBreakdown = Static<typeof AuditScoreBreakdownSchema>;
export type RentalBenchmark = Static<typeof RentalBenchmarkSchema>;
export type SubstandardHousing = Static<typeof SubstandardHousingAlertSchema>;
export type PropertyAuditReport = Static<typeof PropertyAuditReportSchema>;
