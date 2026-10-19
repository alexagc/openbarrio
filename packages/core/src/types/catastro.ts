import { Type, Static } from '@sinclair/typebox';

export const CadastralAddressSchema = Type.Object({
  street: Type.String(),
  number: Type.String(),
  postalCode: Type.String(),
  municipality: Type.String(),
  province: Type.String(),
  provinceCode: Type.Optional(Type.String({ description: '2-digit INE province code (e.g. "28", "08")' })),
  municipalityCode: Type.Optional(Type.String({ description: '1 to 3-digit INE municipality code (e.g. "079", "019")' })),
});

export const CadastralCoordinatesSchema = Type.Object({
  latitude: Type.Number(),
  longitude: Type.Number(),
  srs: Type.Literal('EPSG:4326'),
});

export const CadastralBuildingSchema = Type.Object({
  constructionYear: Type.Number(),
  builtSurfaceM2: Type.Number(),
  primaryUse: Type.String(),
  unitsCount: Type.Number(),
  hasCommercialGroundFloor: Type.Boolean(),
});

export const CadastralPropertySchema = Type.Object({
  cadastralReference: Type.String({
    description: 'Spanish Cadastral Reference (14-character parcel or 20-character property code)',
  }),
  address: CadastralAddressSchema,
  coordinates: CadastralCoordinatesSchema,
  building: CadastralBuildingSchema,
});

export type CadastralAddress = Static<typeof CadastralAddressSchema>;
export type CadastralCoordinates = Static<typeof CadastralCoordinatesSchema>;
export type CadastralBuilding = Static<typeof CadastralBuildingSchema>;
export type CadastralProperty = Static<typeof CadastralPropertySchema>;
