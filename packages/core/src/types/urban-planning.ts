import { Type, Static } from '@sinclair/typebox';

export const LandClassificationSchema = Type.Union([
  Type.Literal('URBAN_CONSOLIDATED'),
  Type.Literal('URBAN_UNCONSOLIDATED'),
  Type.Literal('DEVELOPABLE'),
  Type.Literal('RUSTIC_PROTECTED'),
  Type.Literal('RUSTIC_COMMON'),
  Type.Literal('UNKNOWN'),
]);

export const UrbanPlanningDataSchema = Type.Object({
  landClassification: LandClassificationSchema,
  zoningCode: Type.Optional(Type.String({ description: 'Municipal zoning code e.g. NZ-3, RU-1' })),
  isProtectedLand: Type.Boolean({ description: 'Flagged if parcel intersects environmental or cultural protection' }),
  declaredRenovationsCount: Type.Number({ minimum: 0, description: 'Official alterations recorded in Catastro DNPHP' }),
  lastRenovationYear: Type.Union([Type.Number(), Type.Null()], { description: 'Year of last major structural renovation' }),
  isStressedHousingZone: Type.Boolean({ description: 'Declared stressed housing market subject to statutory rent caps' }),
});

export type LandClassification = Static<typeof LandClassificationSchema>;
export type UrbanPlanningData = Static<typeof UrbanPlanningDataSchema>;
