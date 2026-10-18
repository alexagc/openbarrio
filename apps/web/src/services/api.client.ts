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
      if (err instanceof ApiError && err.status !== 404) {
        throw err;
      }

      // If backend is unreachable or returns 404 for coords (e.g. clicked on street/sidewalk):
      // Try official Spanish CartoCiudad reverse geocoder to snap to nearest building & refcat
      try {
        const reverseUrl = `https://www.cartociudad.es/geocoder/api/geocoder/reverseGeocode?lat=${encodeURIComponent(
          lat
        )}&lon=${encodeURIComponent(lon)}`;
        const revRes = await fetch(reverseUrl);
        if (revRes.ok) {
          const revData = await revRes.json();
          if (revData && revData.address) {
            const streetType = revData.tip_via ? `${revData.tip_via} ` : '';
            const streetName = `${streetType}${revData.address}`.trim();
            const portalNumber = revData.portalNumber ? String(revData.portalNumber) : '1';
            const postalCode = revData.postalCode || '28001';
            const municipality = revData.muni || revData.poblacion || 'Madrid';
            const province = revData.province || municipality;
            const refcat = revData.refCatastral || undefined;

            return this.generateDeterministicAudit(lat, lon, {
              cadastralReference: refcat,
              address: {
                street: streetName,
                number: portalNumber,
                postalCode,
                municipality,
                province,
              },
            });
          }
        }
      } catch {
        // Reverse geocoding failed or offline, fall through to deterministic generator
      }

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
   * Generates a deterministic audit report when API is offline or previewing.
   */
  public generateDeterministicAudit(
    lat: number,
    lon: number,
    overrides?: Partial<CadastralProperty>
  ): ExtendedAuditReport {
    // Check specific landmark presets within ~300m
    const isGranVia = Math.abs(lat - 40.42028) < 0.003 && Math.abs(lon - -3.70379) < 0.003;
    const isGracia = Math.abs(lat - 41.39167) < 0.003 && Math.abs(lon - 2.16472) < 0.003;
    const isColon = Math.abs(lat - 39.4699) < 0.003 && Math.abs(lon - -0.3735) < 0.003;
    const isSierpes = Math.abs(lat - 37.3908) < 0.003 && Math.abs(lon - -5.9942) < 0.003;

    // Geographic regions in Spain
    const isMadridRegion = lat >= 40.0 && lat <= 41.2 && lon >= -4.5 && lon <= -3.0;
    const isCatalunya = lat >= 40.5 && lat <= 42.8 && lon >= 0.2 && lon <= 3.3;
    const isValenciana = lat >= 37.8 && lat <= 40.8 && lon >= -1.5 && lon <= 0.6;
    const isAndalucia = lat >= 36.0 && lat <= 38.7 && lon >= -7.5 && lon <= -1.7;

    let city = 'Madrid';
    let province = 'Madrid';
    let postalPrefix = '28';

    if (isCatalunya) {
      city = 'Barcelona';
      province = 'Barcelona';
      postalPrefix = '08';
    } else if (isValenciana) {
      city = 'València';
      province = 'València';
      postalPrefix = '46';
    } else if (isAndalucia) {
      city = 'Sevilla';
      province = 'Sevilla';
      postalPrefix = '41';
    } else if (!isMadridRegion) {
      city = 'Toledo';
      province = 'Toledo';
      postalPrefix = '45';
    }

    const hash = Math.abs(Math.round(lat * 100000 + lon * 100000));
    let streetNum = String((hash % 85) + 1);
    let postalCode = `${postalPrefix}${String(100 + (hash % 899)).padStart(3, '0')}`;
    const streetNames = [
      'Calle Mayor',
      'Avenida de la Constitución',
      'Calle Real',
      'Paseo de la Alameda',
      'Carrer Nou',
      'Avenida de la Libertad',
      'Calle San Fernando',
      'Calle Cervantes',
      'Ronda de Poniente',
      'Calle de la Paz',
    ];
    let street = streetNames[hash % streetNames.length];
    let refcat = `${postalPrefix}${String(hash).slice(0, 7)}VK${String(hash).slice(0, 4)}A`;
    let year = 1950 + (hash % 70);
    let surface = 55 + (hash % 120);
    let units = 1 + (hash % 30);
    let income = 22000 + (hash % 28000);
    let percentile = 25 + (hash % 70);
    let isStressed = hash % 3 === 0;

    if (isGranVia) {
      city = 'Madrid';
      province = 'Madrid';
      street = 'Calle Gran Vía';
      streetNum = '28';
      postalCode = '28013';
      refcat = '9872023VH5797S0001WX';
      year = 1924;
      surface = 31500;
      units = 48;
      income = 52000;
      percentile = 91;
      isStressed = false;
    } else if (isGracia) {
      city = 'Barcelona';
      province = 'Barcelona';
      street = 'Passeig de Gràcia';
      streetNum = '43';
      postalCode = '08007';
      refcat = '08019A002000050000AB';
      year = 1904;
      surface = 4300;
      units = 12;
      income = 58500;
      percentile = 96;
      isStressed = true;
    } else if (isColon) {
      city = 'València';
      province = 'València';
      street = 'Carrer de Colón';
      streetNum = '15';
      postalCode = '46004';
      refcat = '4625001VK4722E0001AZ';
      year = 1986;
      surface = 1850;
      units = 22;
      income = 41200;
      percentile = 84;
      isStressed = false;
    } else if (isSierpes) {
      city = 'Sevilla';
      province = 'Sevilla';
      street = 'Calle Sierpes';
      streetNum = '22';
      postalCode = '41004';
      refcat = '4190001TG3449S0001AB';
      year = 1968;
      surface = 95;
      units = 8;
      income = 34500;
      percentile = 68;
      isStressed = false;
    }

    const finalAddress = {
      street: overrides?.address?.street || street,
      number: overrides?.address?.number || streetNum,
      postalCode: overrides?.address?.postalCode || postalCode,
      municipality: overrides?.address?.municipality || city,
      province: overrides?.address?.province || province,
    };

    const finalRefcat = overrides?.cadastralReference || refcat;

    const property: CadastralProperty = {
      cadastralReference: finalRefcat,
      address: finalAddress,
      coordinates: { latitude: lat, longitude: lon, srs: 'EPSG:4326' },
      building: {
        constructionYear: overrides?.building?.constructionYear || year,
        builtSurfaceM2: overrides?.building?.builtSurfaceM2 || surface,
        primaryUse: overrides?.building?.primaryUse || 'Residencial',
        unitsCount: overrides?.building?.unitsCount || units,
        hasCommercialGroundFloor: overrides?.building?.hasCommercialGroundFloor ?? (hash % 2 === 0),
      },
    };

    const neighborhood: CensusTractIncome = {
      censusSectionCode: `${finalAddress.postalCode.slice(0, 2)}00101001`,
      averageNetHouseholdIncomeEur: income,
      averageNetPersonIncomeEur: Math.round(income / 2.3),
      percentileInMunicipality: percentile,
      rankingInCity: { rank: Math.max(1, Math.round((100 - percentile) * 1.5)), totalSections: 150 },
      demographics: { medianAge: 44, singlePersonHouseholdPercentage: 29 },
    };

    const environment: EnvironmentalData = {
      noise: {
        dayEveningNightDecibels: 55 + (hash % 16),
        category: (hash % 16) > 10 ? 'HIGH' : 'MODERATE',
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

  public generateDeterministicAuditFromRefcat(refcat: string): ExtendedAuditReport {
    const clean = refcat.trim().toUpperCase();

    // Check known mock/sample presets first
    if (clean.startsWith('08019A00200005') || clean.startsWith('08019A02300045')) {
      return this.generateDeterministicAudit(41.39167, 2.16472, {
        cadastralReference: clean,
        address: {
          street: 'Passeig de Gràcia',
          number: '43',
          postalCode: '08007',
          municipality: 'Barcelona',
          province: 'Barcelona',
        },
      });
    }

    if (clean.startsWith('4625001VK4722E')) {
      return this.generateDeterministicAudit(39.4699, -0.3735, {
        cadastralReference: clean,
        address: {
          street: 'Carrer de Colón',
          number: '15',
          postalCode: '46004',
          municipality: 'València',
          province: 'València',
        },
      });
    }

    if (clean.startsWith('4190001TG3449S') || clean.startsWith('41091A00400012')) {
      return this.generateDeterministicAudit(37.3908, -5.9942, {
        cadastralReference: clean,
        address: {
          street: 'Calle Sierpes',
          number: '22',
          postalCode: '41004',
          municipality: 'Sevilla',
          province: 'Sevilla',
        },
      });
    }

    if (clean.startsWith('9872023VH5797S') || clean.startsWith('28900A01200034')) {
      return this.generateDeterministicAudit(40.42028, -3.70379, {
        cadastralReference: clean,
        address: {
          street: 'Calle Gran Vía',
          number: '28',
          postalCode: '28013',
          municipality: 'Madrid',
          province: 'Madrid',
        },
      });
    }

    // Inspect Spanish province code from first 2 chars
    const provCode = clean.slice(0, 2);
    if (provCode === '08') {
      return this.generateDeterministicAudit(41.3851, 2.1734, { cadastralReference: clean });
    }
    if (provCode === '46') {
      return this.generateDeterministicAudit(39.4699, -0.3735, { cadastralReference: clean });
    }
    if (provCode === '41') {
      return this.generateDeterministicAudit(37.3891, -5.9845, { cadastralReference: clean });
    }
    if (provCode === '29') {
      return this.generateDeterministicAudit(36.7213, -4.4214, { cadastralReference: clean });
    }
    if (provCode === '48') {
      return this.generateDeterministicAudit(43.263, -2.935, { cadastralReference: clean });
    }
    if (provCode === '50') {
      return this.generateDeterministicAudit(41.6561, -0.8773, { cadastralReference: clean });
    }

    return this.generateDeterministicAudit(40.42028, -3.70379, { cadastralReference: clean });
  }
}

export const apiClient = new OpenBarrioApiClient();

export interface RawAuditDataInput {
  query?: string;
  refcat: string;
  address: string;
  score?: number;
  yearBuilt?: number;
  surfaceM2?: number;
  cadastralUsage?: string;
  householdIncome?: number;
  incomePercentile?: number;
  noiseLden?: number;
  noiseLevel?: string;
  floodRisk?: string;
  rentMinM2?: number;
  rentMaxM2?: number;
  isStressedZone?: boolean;
  coordinates?: { lat: number; lon: number };
}

export function auditDataToReport(audit: RawAuditDataInput): ExtendedAuditReport {
  const coords = audit.coordinates || { lat: 40.42028, lon: -3.70379 };
  const addressParts = audit.address.split(',');
  const streetAndNumber = addressParts[0]?.trim() || audit.address;
  const matchNum = streetAndNumber.match(/\s+(\d+[A-Za-z]?)$/);
  const number = matchNum ? matchNum[1] : '1';
  const street = matchNum ? streetAndNumber.slice(0, matchNum.index).trim() : streetAndNumber;

  let postalCode = '28001';
  let municipality = 'Madrid';
  let province = 'Madrid';

  if (addressParts.length > 1) {
    const locPart = addressParts[1].trim();
    const pcMatch = locPart.match(/\b(\d{5})\b/);
    if (pcMatch) {
      postalCode = pcMatch[1];
    }
    const cleanCity = locPart.replace(/\b\d{5}\b/, '').replace(/\([^)]*\)/, '').trim();
    if (cleanCity) {
      municipality = cleanCity;
      province = cleanCity;
    }
  }

  const surface = audit.surfaceM2 || 90;
  const isStressed = audit.isStressedZone ?? false;
  const rentMin = audit.rentMinM2 || 12;
  const rentMax = audit.rentMaxM2 || 16;

  const property: CadastralProperty = {
    cadastralReference: audit.refcat,
    address: {
      street,
      number,
      postalCode,
      municipality,
      province,
    },
    coordinates: {
      latitude: coords.lat,
      longitude: coords.lon,
      srs: 'EPSG:4326',
    },
    building: {
      constructionYear: audit.yearBuilt || 1975,
      builtSurfaceM2: surface,
      primaryUse: audit.cadastralUsage || 'Residencial Colectivo',
      unitsCount: 1,
      hasCommercialGroundFloor: false,
    },
  };

  const neighborhood: CensusTractIncome = {
    censusSectionCode: `${postalCode.slice(0, 2)}00101001`,
    averageNetHouseholdIncomeEur: audit.householdIncome || 24000,
    averageNetPersonIncomeEur: Math.round((audit.householdIncome || 24000) / 2.3),
    percentileInMunicipality: audit.incomePercentile || 50,
    rankingInCity: { rank: 25, totalSections: 100 },
    demographics: { medianAge: 44, singlePersonHouseholdPercentage: 28 },
  };

  const environment: EnvironmentalData = {
    noise: {
      dayEveningNightDecibels: audit.noiseLden || 58,
      category: (audit.noiseLden || 58) > 65 ? 'HIGH' : 'MODERATE',
      predominantSource: 'ROAD_TRAFFIC',
    },
    floodRisk: {
      level: 'NONE',
      returnPeriodYears: null,
      isInPreferentialFlowZone: false,
    },
  };

  const rentalBenchmark: RentalBenchmark = {
    officialRangeLowerEurM2: rentMin,
    officialRangeUpperEurM2: rentMax,
    estimatedMonthlyRentLowerEur: Math.round(rentMin * Math.min(surface, 90)),
    estimatedMonthlyRentUpperEur: Math.round(rentMax * Math.min(surface, 90)),
    isStressedHousingZone: isStressed,
  };

  const score = calculateBarrioScore(property, neighborhood, environment, rentalBenchmark);
  if (audit.score !== undefined) {
    score.overallScore = audit.score;
  }

  return {
    id: 'modal-audit-' + Math.random().toString(36).substring(2, 9),
    generatedAt: new Date().toISOString(),
    property,
    neighborhood,
    environment,
    score,
    rentalBenchmark,
    isOfflineDemo: true,
  };
}
