import {
  CadastralProperty,
  CensusTractIncome,
  EnvironmentalData,
  NoiseData,
  FloodRiskData,
  RentalBenchmark,
  CivicConnectivityData,
  UrbanPlanningData,
  AirQualityData,
} from '@openbarrio/core';

export interface ICatastroProvider {
  /**
   * Look up cadastral property and reference by geographic coordinates (WGS84).
   */
  getByCoordinates(latitude: number, longitude: number): Promise<CadastralProperty>;

  /**
   * Look up cadastral property details by 14- or 20-character cadastral reference (RC).
   */
  getByCadastralReference(refcat: string): Promise<CadastralProperty>;
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
   * Retrieve strategic acoustic noise map data (Lden) for geographic coordinates.
   */
  getNoiseData(latitude: number, longitude: number): Promise<NoiseData>;
}

export interface ISNCZIProvider {
  /**
   * Retrieve official flood risk cartography and return period hazard levels for coordinates.
   */
  getFloodRiskData(latitude: number, longitude: number): Promise<FloodRiskData>;
}

export interface ISERPAVIProvider {
  /**
   * Calculate official reference rental price range (€/m2 and €/month)
   * and determine whether property is in a declared stressed housing zone (Zona Tensionada).
   */
  getRentalBenchmark(
    cadastralProperty: CadastralProperty,
    censusSectionCode?: string
  ): Promise<RentalBenchmark>;
}

export interface IEnvironmentalProvider {
  /**
   * Retrieve acoustic noise, flood hazard, and air quality data for geographic coordinates.
   */
  getEnvironmentalData(latitude: number, longitude: number): Promise<EnvironmentalData>;
}

export interface ICivicConnectivityProvider {
  /**
   * Retrieve 15-minute city walkability, proximity to amenities (health, education, transit, parks),
   * and overall walk score.
   */
  getConnectivityByCoordinates(latitude: number, longitude: number): Promise<CivicConnectivityData>;
}

export interface IUrbanPlanningProvider {
  /**
   * Retrieve urban planning data, land classification, zoning codes, and renovation history.
   */
  getUrbanPlanning(property: CadastralProperty): Promise<UrbanPlanningData>;
}

export interface IAirQualityProvider {
  /**
   * Retrieve official European Air Quality Index (AQI) and pollutant concentrations from nearest station.
   */
  getAirQuality(latitude: number, longitude: number): Promise<AirQualityData | undefined>;
}
