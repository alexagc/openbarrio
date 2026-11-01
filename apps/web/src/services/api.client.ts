import {
  PropertyAuditReport,
  ProblemDetails,
  CadastralUnitsResponse,
  CadastralGeometry,
  SurroundingBuildingsResponse,
  CadastralProperty,
  CensusTractIncome,
  EnvironmentalData,
  RentalBenchmark,
  CivicConnectivityData,
  UrbanPlanningData,
  calculateBarrioScore,
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
  isLive?: boolean;
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
      constructionYear: typeof audit.yearBuilt === 'number' ? audit.yearBuilt : 0,
      builtSurfaceM2: surface,
      primaryUse: audit.cadastralUsage || 'Residencial Colectivo',
      unitsCount: 1,
      hasCommercialGroundFloor: false,
    },
  };

  const refHash = Math.abs(
    (audit.refcat || audit.address || '')
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0)
  );

  const neighborhood: CensusTractIncome = {
    censusSectionCode: `${postalCode.slice(0, 2)}001${String(1 + (refHash % 20)).padStart(2, '0')}${String(1 + (refHash % 50)).padStart(3, '0')}`,
    averageNetHouseholdIncomeEur: audit.householdIncome || 24000 + (refHash % 15000),
    averageNetPersonIncomeEur: Math.round((audit.householdIncome || 24000 + (refHash % 15000)) / 2.25),
    percentileInMunicipality: audit.incomePercentile || 25 + (refHash % 65),
    rankingInCity: { rank: Math.max(1, Math.round((100 - (audit.incomePercentile || 50)) * 1.5)), totalSections: 150 },
    demographics: {
      medianAge: 38 + (refHash % 16),
      singlePersonHouseholdPercentage: 20 + (refHash % 24),
    },
  };

  const isNoisyRoad = refHash % 3 === 0;
  const dba = audit.noiseLden || (isNoisyRoad ? 64 + (refHash % 7) : 49 + (refHash % 6));
  const environment: EnvironmentalData = {
    noise: {
      dayEveningNightDecibels: dba,
      category: dba >= 65 ? 'NOISY' : dba >= 55 ? 'MODERATE' : 'QUIET',
      predominantSource: dba >= 55 ? 'ROAD_TRAFFIC' : 'NONE',
    },
    floodRisk: {
      level: audit.floodRisk?.includes('Alto') ? 'HIGH' : audit.floodRisk?.includes('Medio') ? 'MEDIUM' : 'NONE',
      returnPeriodYears: null,
      isInPreferentialFlowZone: false,
    },
    airQuality: {
      aqiIndex: 30 + (refHash % 15),
      category: 'GOOD',
      stationName: `${municipality} Centro`,
      no2MicrogramsM3: 20,
      pm25MicrogramsM3: 8,
      pm10MicrogramsM3: 15,
    },
  };

  const offsetModalCoord = (distMeters: number, bearingDeg: number) => {
    const rad = (bearingDeg * Math.PI) / 180;
    const dKm = distMeters / 1000;
    const dLat = (dKm / 110.574) * Math.cos(rad);
    const dLon = (dKm / (111.32 * Math.cos((coords.lat * Math.PI) / 180))) * Math.sin(rad);
    return {
      latitude: Number((coords.lat + dLat).toFixed(6)),
      longitude: Number((coords.lon + dLon).toFixed(6)),
    };
  };

  const mHealthCoords = offsetModalCoord(380, 315);
  const mEduCoords = offsetModalCoord(410, 225);
  const mTransitCoords = offsetModalCoord(180, 45);
  const mParkCoords = offsetModalCoord(460, 135);

  const connectivity: CivicConnectivityData = {
    walkScore15Min: 85,
    facilitiesWithin15MinCount: 28,
    nearestHealthcare: {
      id: 'modal-cap',
      type: 'healthcare',
      subtype: 'primary_care',
      name: 'Centro de Salud (CAP)',
      distanceMeters: 380,
      walkTimeMinutes: 4.8,
      latitude: mHealthCoords.latitude,
      longitude: mHealthCoords.longitude,
    },
    nearestEducation: {
      id: 'modal-esc',
      type: 'education',
      subtype: 'school',
      name: 'Colegio Público / IES',
      distanceMeters: 410,
      walkTimeMinutes: 5.2,
      latitude: mEduCoords.latitude,
      longitude: mEduCoords.longitude,
    },
    nearestTransit: {
      id: 'modal-transit',
      type: 'transit',
      subtype: 'metro',
      name: 'Metro / Cercanías',
      distanceMeters: 180,
      walkTimeMinutes: 2.3,
      latitude: mTransitCoords.latitude,
      longitude: mTransitCoords.longitude,
    },
    nearestPark: {
      id: 'modal-park',
      type: 'park',
      subtype: 'urban_park',
      name: 'Parque Público / Zona Verde',
      distanceMeters: 460,
      walkTimeMinutes: 5.9,
      latitude: mParkCoords.latitude,
      longitude: mParkCoords.longitude,
    },
  };

  const urbanPlanning: UrbanPlanningData = {
    landClassification: 'URBAN_CONSOLIDATED',
    zoningCode: 'NZ-Residencial',
    isProtectedLand: false,
    declaredRenovationsCount: typeof audit.yearBuilt === 'number' && audit.yearBuilt > 0 && audit.yearBuilt < 1980 ? 2 : 0,
    lastRenovationYear: typeof audit.yearBuilt === 'number' && audit.yearBuilt > 0 && audit.yearBuilt < 1980 ? 2016 : null,
    isStressedHousingZone: isStressed,
  };

  const rentalBenchmark: RentalBenchmark = {
    officialRangeLowerEurM2: rentMin,
    officialRangeUpperEurM2: rentMax,
    estimatedMonthlyRentLowerEur: Math.round(rentMin * Math.min(surface, 90)),
    estimatedMonthlyRentUpperEur: Math.round(rentMax * Math.min(surface, 90)),
    isStressedHousingZone: isStressed,
  };

  const score = calculateBarrioScore(property, neighborhood, environment, rentalBenchmark, connectivity, urbanPlanning);
  if (audit.score !== undefined) {
    score.overallScore = audit.score;
  }

  return {
    id: 'modal-audit-' + Math.random().toString(36).substring(2, 9),
    generatedAt: new Date().toISOString(),
    property,
    neighborhood,
    environment,
    connectivity,
    urbanPlanning,
    score,
    rentalBenchmark,
    isOfflineDemo: audit.isLive ? false : true,
  };
}

/**
 * OpenBarrio pure typed HTTP API client with RFC 7807 (Problem Details) mapping.
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

      const contentType = response.headers?.get ? response.headers.get('content-type') || 'application/json' : 'application/json';
      if (!contentType.includes('application/json') && !contentType.includes('+json')) {
        throw new Error('API returned non-JSON response');
      }

      return await response.json();
    } catch (err) {
      if (err instanceof ApiError) {
        throw err;
      }
      throw new ApiError(0, err instanceof Error ? err.message : 'Network error');
    }
  }

  /**
   * Audits property by Spanish Cadastral Reference (14 or 20 characters).
   */
  async auditByCadastralReference(
    refcat: string,
    fallbackCoords?: { lat: number; lon: number },
    portal?: string
  ): Promise<ExtendedAuditReport> {
    const normalized = refcat.replace(/[\s\-_.]/g, '').toUpperCase();
    let url = `${this.baseUrl}/api/v1/audit/refcat/${encodeURIComponent(normalized)}`;
    const params = new URLSearchParams();
    if (fallbackCoords) {
      params.append('lat', String(fallbackCoords.lat));
      params.append('lon', String(fallbackCoords.lon));
    }
    if (portal) {
      params.append('portal', portal);
    }
    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

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
      throw new ApiError(0, err instanceof Error ? err.message : 'Network error');
    }
  }

  /**
   * Retrieves horizontal division cadastral units for a given cadastral reference.
   */
  async getCadastralUnits(refcat: string): Promise<CadastralUnitsResponse> {
    const cleanRef = refcat.replace(/[\s\-_.]/g, '').toUpperCase();
    const url = `${this.baseUrl}/api/v1/audit/refcat/${encodeURIComponent(cleanRef)}/units`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        await this.handleHttpError(response);
      }

      return await response.json();
    } catch (err) {
      if (err instanceof ApiError) {
        throw err;
      }
      throw new ApiError(0, err instanceof Error ? err.message : 'Network error');
    }
  }

  /**
   * Retrieves real 3D building/parcel geometry from Catastro WFS for a given cadastral reference.
   */
  async getCadastralGeometry(refcat: string): Promise<CadastralGeometry> {
    const cleanRef = refcat.replace(/[\s\-_.]/g, '').toUpperCase();
    const url = `${this.baseUrl}/api/v1/audit/refcat/${encodeURIComponent(cleanRef)}/geometry`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        await this.handleHttpError(response);
      }

      return await response.json();
    } catch (err) {
      if (err instanceof ApiError) {
        throw err;
      }
      throw new ApiError(0, err instanceof Error ? err.message : 'Network error');
    }
  }

  /**
   * Retrieves surrounding building geometries from Catastro WFS INSPIRE within a radius (default 150m).
   */
  async getSurroundingBuildings(
    lat: number,
    lon: number,
    radiusMeters = 150,
    refcat?: string
  ): Promise<SurroundingBuildingsResponse> {
    let url = `${this.baseUrl}/api/v1/audit/geometry/surroundings?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&radius=${encodeURIComponent(radiusMeters)}`;
    if (refcat) {
      url += `&refcat=${encodeURIComponent(refcat)}`;
    }

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        await this.handleHttpError(response);
      }

      return await response.json();
    } catch (err) {
      if (err instanceof ApiError) {
        throw err;
      }
      throw new ApiError(0, err instanceof Error ? err.message : 'Network error');
    }
  }

  /**
   * Searches for address suggestions using CartoCiudad (official IGN Spanish geocoder)
   * with fallback to OpenStreetMap Nominatim. Supports portal numbers with letters/suffixes.
   */
  async searchAddress(
    query: string
  ): Promise<Array<{ label: string; lat: number; lon: number; refcat?: string; portal?: string }>> {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 3) {
      return [];
    }

    // Normalize potential portal number + letter with hyphens, slashes, or without spaces
    // e.g. "44-B" -> "44 B", "44/B" -> "44 B", "25b" -> "25 B", "14bis" -> "14 bis", "2F" -> "2 F"
    const spacedQuery = trimmed
      .replace(/\b(\d+)\s*[-/]\s*([a-zA-Z]+)\b/g, '$1 $2')
      .replace(/\b(\d+)([a-zA-Z]+)\b/g, '$1 $2');

    const portalMatch = spacedQuery.match(/\b(\d+)\s+([a-zA-Z])\b/i);
    const targetPortalNum = portalMatch ? parseInt(portalMatch[1], 10) : undefined;
    const targetPortalExt = portalMatch ? portalMatch[2].toUpperCase() : undefined;

    const normalize = (s: string) =>
      s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

    const queryTokens = normalize(spacedQuery).split(/\s+/).filter(Boolean);
    const queryStreetPart = normalize(spacedQuery.replace(/\b\d+.*$/, '')).trim();

    // 1. Try official Spanish CartoCiudad (IGN) geocoder
    try {
      let cartoUrl = `https://www.cartociudad.es/geocoder/api/geocoder/candidates?q=${encodeURIComponent(
        spacedQuery
      )}&limit=15`;
      let cartoRes = await fetch(cartoUrl);
      let cartoData = cartoRes.ok ? await cartoRes.json() : null;

      if ((!Array.isArray(cartoData) || cartoData.length === 0) && spacedQuery !== trimmed) {
        cartoUrl = `https://www.cartociudad.es/geocoder/api/geocoder/candidates?q=${encodeURIComponent(
          trimmed
        )}&limit=15`;
        cartoRes = await fetch(cartoUrl);
        cartoData = cartoRes.ok ? await cartoRes.json() : null;
      }

      if (Array.isArray(cartoData) && cartoData.length > 0) {
        const valid = cartoData
          .filter((item: any) => item && item.address)
          .map((item: any) => {
            let label = item.address;
            const ext = item.extension ? String(item.extension).trim().toUpperCase() : undefined;
            if (ext && item.portalNumber) {
              const hasPortalWithExt = new RegExp(`\\b${item.portalNumber}\\s*${ext}\\b`, 'i').test(label);
              if (!hasPortalWithExt) {
                const portalRegex = new RegExp(`\\b(${item.portalNumber})\\b`, 'i');
                if (portalRegex.test(label)) {
                  label = label.replace(portalRegex, `$1 ${ext}`);
                } else {
                  label = `${label} ${ext}`;
                }
              }
            } else if (ext && !new RegExp(`\\b${ext}\\b`, 'i').test(label)) {
              label = `${label} ${ext}`;
            }

            // Calculate relevance score against search query
            const fullText = normalize(
              `${item.tip_via || ''} ${item.address || ''} ${label} ${item.muni || ''} ${item.poblacion || ''} ${item.province || ''}`
            );
            let score = 0;

            for (const token of queryTokens) {
              if (fullText.includes(token)) {
                score += 50;
              }
            }

            // Exact street sequence match (e.g. "arroyo bueno")
            if (queryStreetPart && queryStreetPart.length >= 3 && fullText.includes(queryStreetPart)) {
              score += 200;
            }

            // Portal number match
            if (targetPortalNum !== undefined && item.portalNumber === targetPortalNum) {
              score += 150;
            }

            // Portal letter / extension match
            if (targetPortalExt !== undefined) {
              if (ext === targetPortalExt) {
                score += 300;
              } else if (label.toUpperCase().includes(`${targetPortalNum} ${targetPortalExt}`)) {
                score += 250;
              }
            }

            return {
              label,
              lat: parseFloat(item.lat),
              lon: parseFloat(item.lng),
              refcat: item.refCatastral || undefined,
              portal: ext || undefined,
              _score: score,
            };
          });

        if (valid.length > 0) {
          valid.sort((a: any, b: any) => b._score - a._score);
          return valid.map(({ _score, ...rest }: any) => rest).slice(0, 8);
        }
      }
    } catch {
      // CartoCiudad failed, try OSM Nominatim fallback below
    }

    // 2. Fallback to OpenStreetMap Nominatim
    try {
      const osmUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        trimmed
      )}&format=json&countrycodes=es&limit=5`;
      const res = await fetch(osmUrl, {
        headers: {
          'Accept-Language': 'es,ca,gl,eu',
          'User-Agent': 'OpenBarrio-DueDiligence/1.0',
        },
      });
      if (!res.ok) return [];
      const data = await res.json();
      return (data || [])
        .map((item: any) => ({
          label: item.display_name,
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon),
        }))
        .slice(0, 6);
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
}

export const apiClient = new OpenBarrioApiClient();
