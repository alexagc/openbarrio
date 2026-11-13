import {
  CadastralProperty,
  CadastralCoordinates,
  CadastralUnitsResponse,
  CadastralGeometry,
  CensusTractIncome,
  EnvironmentalData,
  NoiseData,
  FloodRiskData,
  RentalBenchmark,
  CivicConnectivityData,
  UrbanPlanningData,
  AirQualityData,
  EnergyPerformanceCertificate,
  NeighborhoodTrends,
  BuildingSurroundingsDTO,
  RadonEvaluationDTO,
  VutEvaluationDTO,
  MunicipalitySummaryDTO,
  MunicipalityDetailDTO,
} from '@openbarrio/core';

export interface ICatastroProvider {
  /**
   * Look up cadastral property and reference by geographic coordinates (WGS84).
   */
  getByCoordinates(latitude: number, longitude: number): Promise<CadastralProperty>;

  /**
   * Look up cadastral property details by 14- or 20-character cadastral reference (RC).
   */
  getByCadastralReference(
    refcat: string,
    fallbackCoords?: CadastralCoordinates,
    preferredPortal?: string
  ): Promise<CadastralProperty>;

  /**
   * Look up horizontal division units for a given 14- or 20-character cadastral reference.
   */
  getUnitsByCadastralReference(refcat: string): Promise<CadastralUnitsResponse>;

  /**
   * Look up real building or parcel geometry (WFS INSPIRE) for a given cadastral reference.
   */
  getGeometryByCadastralReference(refcat: string): Promise<CadastralGeometry>;

  /**
   * Look up surrounding buildings/parcels for 3D urban context and solar simulation.
   */
  getSurroundingsByCadastralReference(refcat: string): Promise<BuildingSurroundingsDTO>;
  getSurroundingsByBbox?(bbox: [number, number, number, number]): Promise<BuildingSurroundingsDTO>;
}

export interface IINEProvider {
  /**
   * Retrieve income distribution (ADRH) for a given 10-character census tract code.
   */
  getIncomeByCensusSection(censusSectionCode: string): Promise<CensusTractIncome>;

  /**
   * Resolve coordinates and municipality to a 10-character census tract code.
   */
  resolveCensusSection(
    latitude: number,
    longitude: number,
    provinceCode?: string,
    municipalityCode?: string
  ): Promise<string>;
}

export interface ISICAProvider {
  /**
   * Retrieve strategic acoustic noise map data (Lden) for geographic coordinates or pre-calculated census tract.
   */
  getNoiseData(latitude: number, longitude: number, censusSectionCode?: string): Promise<NoiseData>;
}

export interface ISNCZIProvider {
  /**
   * Retrieve flood hazard cartography and return period risk for geographic coordinates or pre-calculated census tract.
   */
  getFloodRiskData(latitude: number, longitude: number, censusSectionCode?: string): Promise<FloodRiskData>;
}

export interface ISERPAVIProvider {
  /**
   * Calculate reference rental price benchmark range (€/m² and €/month)
   * based on cadastral property characteristics and official stressed housing zone status.
   */
  getRentalBenchmark(
    property: CadastralProperty,
    censusSectionCode?: string
  ): Promise<RentalBenchmark>;
}

export interface ICivicConnectivityProvider {
  /**
   * Calculate 15-minute civic connectivity and proximity indicators to essential public services.
   */
  getConnectivityData(
    latitude: number,
    longitude: number,
    context?: { municipality?: string; street?: string }
  ): Promise<CivicConnectivityData>;
  getConnectivityByCoordinates?(
    latitude: number,
    longitude: number,
    context?: { municipality?: string; street?: string }
  ): Promise<CivicConnectivityData>;
}

export interface IUrbanPlanningProvider {
  /**
   * Retrieve official SIU land classification and planning ordinances for a property.
   */
  getUrbanPlanningData(property: CadastralProperty): Promise<UrbanPlanningData>;
  getUrbanPlanning?(property: CadastralProperty): Promise<UrbanPlanningData>;
}

export interface IAirQualityProvider {
  /**
   * Retrieve official MITECO European Air Quality Index (AQI) and pollutants for coordinates.
   */
  getAirQualityData(latitude: number, longitude: number): Promise<AirQualityData | undefined>;
  getAirQuality?(latitude: number, longitude: number): Promise<AirQualityData | undefined>;
}

export interface IEnvironmentalProvider {
  readonly sica: ISICAProvider;
  readonly snczi: ISNCZIProvider;
  readonly airQuality?: IAirQualityProvider;

  /**
   * Aggregates environmental indicators (acoustic noise, fluvial flood risk, air quality).
   */
  getEnvironmentalData(latitude: number, longitude: number, censusSectionCode?: string): Promise<EnvironmentalData>;
}

export interface ICEEProvider {
  /**
   * Look up official Energy Performance Certificate (CEE) or compute normative thermal CTE fallback.
   */
  getEnergyCertificate(property: CadastralProperty): Promise<EnergyPerformanceCertificate>;
}

export interface ILongitudinalMarketProvider {
  /**
   * Retrieve historical housing price index (INE IPV) and income evolution (INE ADRH) for census tract.
   */
  getMarketTrends(
    property: CadastralProperty,
    censusSectionCode: string,
    currentIncome?: number
  ): Promise<NeighborhoodTrends>;
}

export interface IRadonProvider {
  /**
   * Evaluate CTE DB-HS 6 radon municipal hazard zone and dwelling mitigation requirements.
   */
  getRadonEvaluation(
    municipalityCode: string,
    provinceCode?: string,
    floorLevel?: number,
    unitsCount?: number
  ): Promise<RadonEvaluationDTO>;
}

export interface IVutProvider {
  /**
   * Evaluate INE tourist dwelling saturation and calculate civic coexistence impact.
   */
  getVutEvaluation(
    censusSectionId: string,
    coords?: { latitude: number; longitude: number }
  ): Promise<VutEvaluationDTO>;
}

export interface IMunicipalityProvider {
  /**
   * List or search Spanish municipalities with aggregated income, radon and rental status.
   */
  listMunicipalities(params?: {
    query?: string;
    province?: string;
    page?: number;
    limit?: number;
  }): Promise<{ items: MunicipalitySummaryDTO[]; total: number; page: number; limit: number }>;

  /**
   * Retrieve rich municipal profile and aggregated civic intelligence by canonical slug or 5-digit INE code.
   */
  getBySlugOrCode(slugOrCode: string): Promise<MunicipalityDetailDTO>;
}
