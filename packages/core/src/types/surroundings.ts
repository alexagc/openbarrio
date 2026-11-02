import { Type, Static } from '@sinclair/typebox';

export const BuildingSurroundingParcelSchema = Type.Object({
  cadastralReference: Type.String({ description: 'Cadastral reference of the surrounding building/parcel' }),
  floors: Type.Number({ minimum: 0, description: 'Number of floors above ground' }),
  heightMeters: Type.Number({ minimum: 0, description: 'Estimated building height in meters (floors * 3.2m + 1m)' }),
  geometry: Type.Any({ description: 'GeoJSON Polygon or MultiPolygon footprint' }),
  distanceMeters: Type.Optional(Type.Number({ description: 'Distance in meters from target building center' })),
  primaryUse: Type.Optional(Type.String({ description: 'Cadastral primary use (Residencial, Comercial, etc.)' })),
});

export const BuildingSurroundingsSchema = Type.Object({
  targetRefcat: Type.String({ description: 'Cadastral reference of the audited target property' }),
  parcels: Type.Array(BuildingSurroundingParcelSchema, { description: 'Surrounding buildings forming the urban block context' }),
  boundingBox: Type.Optional(Type.Array(Type.Number(), { description: 'Bounding box [minX, minY, maxX, maxY]' })),
});

export type BuildingSurroundingParcel = Static<typeof BuildingSurroundingParcelSchema>;
export type BuildingSurroundingsDTO = Static<typeof BuildingSurroundingsSchema>;
