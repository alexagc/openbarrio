import { Type, Static } from '@sinclair/typebox';

export const CivicFacilityTypeSchema = Type.Union([
  Type.Literal('healthcare'),
  Type.Literal('education'),
  Type.Literal('transit'),
  Type.Literal('park'),
]);

export const CivicFacilitySchema = Type.Object({
  id: Type.String(),
  type: CivicFacilityTypeSchema,
  subtype: Type.String({ description: 'Specific category: primary_care, hospital, school, metro, train, bus, urban_park' }),
  name: Type.String(),
  distanceMeters: Type.Number({ minimum: 0, description: 'Geodesic distance from parcel centroid' }),
  walkTimeMinutes: Type.Number({ minimum: 0, description: 'Estimated walk time based on 4.5 km/h walking speed' }),
  latitude: Type.Optional(Type.Number({ description: 'WGS84 latitude coordinate' })),
  longitude: Type.Optional(Type.Number({ description: 'WGS84 longitude coordinate' })),
});

export const CivicConnectivityDataSchema = Type.Object({
  walkScore15Min: Type.Number({ minimum: 0, maximum: 100, description: 'Aggregated 15-minute walkability score' }),
  nearestHealthcare: Type.Optional(CivicFacilitySchema),
  nearestEducation: Type.Optional(CivicFacilitySchema),
  nearestTransit: Type.Optional(CivicFacilitySchema),
  nearestPark: Type.Optional(CivicFacilitySchema),
  facilitiesWithin15MinCount: Type.Number({ minimum: 0 }),
  nearbyFacilities: Type.Optional(Type.Array(CivicFacilitySchema)),
});

export type CivicFacilityType = Static<typeof CivicFacilityTypeSchema>;
export type CivicFacility = Static<typeof CivicFacilitySchema>;
export type CivicConnectivityData = Static<typeof CivicConnectivityDataSchema>;
