import {
  PropertyAuditReport,
  ProblemDetails,
  calculateBarrioScore,
  CadastralProperty,
  CensusTractIncome,
  EnvironmentalData,
  RentalBenchmark,
} from '@openbarrio/core';

export class ApiError extends Error {
  public status: number;
  public problem?: ProblemDetails;

  constructor(status: number, message: string, problem?: ProblemDetails) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.problem = problem;
  }
}

// Configurable base URL for API requests
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export interface ExtendedAuditReport extends PropertyAuditReport {
  isOfflineDemo?: boolean;
}

/**
 * OpenBarrio typed API client with RFC 7807 problem handling
 * and offline/preview fallback generator.
 */
export class OpenBarrioApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  /**
   * Audits property by geographical coordinates (EPSG:4326).
   */
  async auditByCoordinates(lat: number, lon: number): Promise<ExtendedAuditReport> {
    const url = `${this.baseUrl}/api/v1/audit/coords?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        await this.handleHttpError(response);
      }

      return await response.json();
    } catch (err) {
      if (err instanceof ApiError) {
        throw err;
      }
      // If network fails (e.g. backend offline in dev), fall back to deterministic local audit
      console.warn('API backend unreachable. Falling back to local deterministic audit generator.', err);
      return this.generateDeterministicAudit(lat, lon);
    }
  }

  /**
   * Audits property by Spanish Cadastral Reference (14 or 20 characters).
   */
  async auditByCadastralReference(refcat: string): Promise<ExtendedAuditReport> {
    const normalized = refcat.trim().toUpperCase();
    const url = `${this.baseUrl}/api/v1/audit/refcat/${encodeURIComponent(normalized)}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        await this.handleHttpError(response);
      }

      return await response.json();
    } catch (err) {
      if (err instanceof ApiError) {
        throw err;
      }
      console.warn('API backend unreachable. Falling back to local deterministic audit generator.', err);
      return this.generateDeterministicAuditFromRefcat(normalized);
    }
  }

  /**
   * Searches for address suggestions using CartoCiudad (official IGN Spanish geocoder)
   * with fallback to OpenStreetMap Nominatim.
   */
  async searchAddress(
    query: string
  ): Promise<Array<{ label: string; lat: number; lon: number; refcat?: string }>> {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 3) {
      return [];
    }

    // 1. Try official Spanish CartoCiudad (IGN) geocoder
    try {
      const cartoUrl = `https://www.cartociudad.es/geocoder/api/geocoder/candidates?q=${encodeURIComponent(
        trimmed
      )}&limit=6`;
      const cartoRes = await fetch(cartoUrl);
      if (cartoRes.ok) {
        const cartoData = await cartoRes.json();
        if (Array.isArray(cartoData) && cartoData.length > 0) {
          const valid = cartoData
            .filter((item: any) => item && item.address)
            .map((item: any) => ({
              label: item.address,
              lat: typeof item.lat === 'number' && item.lat !== 0 ? item.lat : undefined,
              lon: typeof item.lng === 'number' && item.lng !== 0 ? item.lng : undefined,
              refcat: item.refCatastral || undefined,
            }));

          const withCoords = valid.filter(
            (v: any): v is { label: string; lat: number; lon: number; refcat?: string } =>
              typeof v.lat === 'number' && typeof v.lon === 'number'
          );
          if (withCoords.length > 0) {
            return withCoords;
          }
        }
      }
    } catch {
      // CartoCiudad failed or network issue, fallback to Nominatim
    }

    // 2. Fallback to OpenStreetMap Nominatim
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        trimmed
      )}&countrycodes=es&format=json&limit=6&addressdetails=1`;
      const res = await fetch(url);
      if (!res.ok) return [];
      const data = await res.json();
      return (data || []).map((item: any) => ({
        label: item.display_name,
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
      }));
    } catch {
      return [];
    }
  }

  private async handleHttpError(response: Response): Promise<never> {
    let problem: ProblemDetails | undefined;
    let message = `API request failed with status ${response.status} (${response.statusText})`;

    try {
      const errorJson = await response.json();
      if (errorJson && errorJson.title) {
        problem = errorJson as ProblemDetails;
        message = problem.detail || problem.title;
      }
    } catch {
      // Body not JSON
    }

    throw new ApiError(response.status, message, problem);
  }

  /**
   * Generates a deterministic audit report when API is offline.
   */
  private generateDeterministicAudit(lat: number, lon: number): ExtendedAuditReport {
    const isMadrid = Math.abs(lat - 40.42) < 0.3 && Math.abs(lon - -3.70) < 0.3;
    const isBarcelona = Math.abs(lat - 41.39) < 0.3 && Math.abs(lon - 2.16) < 0.3;
    const isValencia = Math.abs(lat - 39.47) < 0.3 && Math.abs(lon - -0.37) < 0.3;

    let city = 'Madrid';
    let province = 'Madrid';
    let street = 'Calle Gran Vía';
    let number = '28';
    let postalCode = '28013';
    let refcat = '9872023VH5797S0001WX';
    let year = 1924;
    let surface = 31500;
    let units = 48;
    let income = 52000;
    let percentile = 91;
    let isStressed = false;

    if (isBarcelona) {
      city = 'Barcelona';
      province = 'Barcelona';
      street = 'Passeig de Gràcia';
      number = '43';
      postalCode = '08007';
      refcat = '08019A002000050000AB';
      year = 1904;
      surface = 4300;
      units = 12;
      income = 58500;
      percentile = 96;
      isStressed = true;
    } else if (isValencia) {
      city = 'València';
      province = 'València';
      street = 'Carrer de Colón';
      number = '15';
      postalCode = '46004';
      refcat = '4625001VK4722E0001AZ';
      year = 1986;
      surface = 1850;
      units = 22;
      income = 41200;
      percentile = 84;
      isStressed = false;
    } else if (!isMadrid) {
      // Deterministic hash based on coordinates
      const hash = Math.abs(Math.round(lat * 1000 + lon * 1000));
      year = 1965 + (hash % 50);
      surface = 80 + (hash % 110);
      units = 1 + (hash % 25);
      income = 28000 + (hash % 26000);
      percentile = 15 + (hash % 75);
      street = 'Avenida Principal';
      number = String((hash % 80) + 1);
      postalCode = '28001';
      refcat = `28079A${String(hash).padStart(8, '0')}0001WX`;
      isStressed = hash % 5 === 0;
    }

    const property: CadastralProperty = {
      cadastralReference: refcat,
      address: { street, number, postalCode, municipality: city, province },
      coordinates: { latitude: lat, longitude: lon, srs: 'EPSG:4326' },
      building: {
        constructionYear: year,
        builtSurfaceM2: surface,
        primaryUse: 'Residencial',
        unitsCount: units,
        hasCommercialGroundFloor: true,
      },
    };

    const neighborhood: CensusTractIncome = {
      censusSectionCode: `${postalCode.slice(0, 2)}00101001`,
      averageNetHouseholdIncomeEur: income,
      averageNetPersonIncomeEur: Math.round(income / 2.3),
      percentileInMunicipality: percentile,
      rankingInCity: { rank: Math.max(1, Math.round((100 - percentile) * 1.5)), totalSections: 150 },
      demographics: { medianAge: 44, singlePersonHouseholdPercentage: 29 },
    };

    const environment: EnvironmentalData = {
      noise: {
        dayEveningNightDecibels: 61,
        category: 'MODERATE',
        predominantSource: 'ROAD_TRAFFIC',
      },
      floodRisk: {
        level: 'NONE',
        returnPeriodYears: null,
        isInPreferentialFlowZone: false,
      },
    };

    const rentalBenchmark: RentalBenchmark = {
      officialRangeLowerEurM2: isStressed ? 16.5 : 13.8,
      officialRangeUpperEurM2: isStressed ? 21.0 : 17.5,
      estimatedMonthlyRentLowerEur: Math.round((isStressed ? 16.5 : 13.8) * Math.min(surface, 90)),
      estimatedMonthlyRentUpperEur: Math.round((isStressed ? 21.0 : 17.5) * Math.min(surface, 90)),
      isStressedHousingZone: isStressed,
    };

    const score = calculateBarrioScore(property, neighborhood, environment, rentalBenchmark);

    return {
      id: 'demo-audit-' + Math.random().toString(36).substring(2, 9),
      generatedAt: new Date().toISOString(),
      property,
      neighborhood,
      environment,
      score,
      rentalBenchmark,
      isOfflineDemo: true,
    };
  }

  private generateDeterministicAuditFromRefcat(refcat: string): ExtendedAuditReport {
    // If standard mock refcat
    if (refcat.startsWith('08019A002000050000AB') || refcat.startsWith('08019A00200005')) {
      return this.generateDeterministicAudit(41.39167, 2.16472);
    }
    if (refcat.startsWith('4625001VK4722E0001AZ') || refcat.startsWith('4625001VK4722E')) {
      return this.generateDeterministicAudit(39.4699, -0.3735);
    }
    return this.generateDeterministicAudit(40.42028, -3.70379);
  }
}

export const apiClient = new OpenBarrioApiClient();
