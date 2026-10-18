export interface CadastralProperty {
  cadastralReference: string;
  address: {
    street: string;
    number: string;
    postalCode: string;
    municipality: string;
    province: string;
  };
  coordinates: {
    latitude: number;
    longitude: number;
    srs: 'EPSG:4326';
  };
  building: {
    constructionYear: number;
    builtSurfaceM2: number;
    primaryUse: string;
    unitsCount: number;
    hasCommercialGroundFloor: boolean;
  };
}
