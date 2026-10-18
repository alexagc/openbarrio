import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { OpenBarrioApiClient, ApiError } from '../src/services/api.client';

describe('OpenBarrioApiClient', () => {
  let client: OpenBarrioApiClient;

  beforeEach(() => {
    client = new OpenBarrioApiClient('http://localhost:3000');
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches coordinates audit successfully when API responds 200', async () => {
    const mockReport = {
      id: 'test-audit-123',
      generatedAt: '2026-10-18T10:00:00.000Z',
      property: {
        cadastralReference: '9872023VH5797S0001WX',
        address: {
          street: 'Calle Gran Vía',
          number: '28',
          postalCode: '28013',
          municipality: 'Madrid',
          province: 'Madrid',
        },
        coordinates: { latitude: 40.42028, longitude: -3.70379, srs: 'EPSG:4326' },
        building: {
          constructionYear: 1924,
          builtSurfaceM2: 31500,
          primaryUse: 'Comercial',
          unitsCount: 48,
          hasCommercialGroundFloor: true,
        },
      },
      neighborhood: {
        censusSectionCode: '2807901001',
        averageNetHouseholdIncomeEur: 52000,
        averageNetPersonIncomeEur: 22600,
        percentileInMunicipality: 91,
        rankingInCity: { rank: 14, totalSections: 150 },
        demographics: { medianAge: 44, singlePersonHouseholdPercentage: 29 },
      },
      environment: {
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
      },
      score: {
        overallScore: 84,
        socioeconomicScore: 90,
        buildingHealthScore: 70,
        acousticComfortScore: 85,
        climateSafetyScore: 100,
        keyHighlights: ['High-income socioeconomic cluster'],
        keyRisks: [],
      },
      rentalBenchmark: {
        officialRangeLowerEurM2: 14.5,
        officialRangeUpperEurM2: 18.2,
        estimatedMonthlyRentLowerEur: 1300,
        estimatedMonthlyRentUpperEur: 1650,
        isStressedHousingZone: false,
      },
    };

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockReport,
    } as Response);

    const report = await client.auditByCoordinates(40.42028, -3.70379);
    expect(report.property.cadastralReference).toBe('9872023VH5797S0001WX');
    expect(report.score.overallScore).toBe(84);
  });

  it('throws ApiError with RFC 7807 problem details when API returns 404', async () => {
    const problemJson = {
      type: 'https://openbarrio.org/errors/cadastral-not-found',
      title: 'Cadastral Reference Not Found',
      status: 404,
      detail: 'Cadastral reference 00000000000000 was not found in Catastro OVC register.',
      instance: '/api/v1/audit/refcat/00000000000000',
    };

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      json: async () => problemJson,
    } as Response);

    await expect(client.auditByCadastralReference('00000000000000')).rejects.toThrow(ApiError);
  });

  it('falls back gracefully to deterministic audit generator when network fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new TypeError('Failed to fetch'));

    const report = await client.auditByCoordinates(40.42028, -3.70379);

    expect(report).toBeDefined();
    expect(report.isOfflineDemo).toBe(true);
    expect(report.property.address.municipality).toBe('Madrid');
    expect(report.score.overallScore).toBeGreaterThan(0);
    expect(report.score.overallScore).toBeLessThanOrEqual(100);
  });

  it('correctly marks Barcelona property as Stressed Housing Zone in fallback mode', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new TypeError('Failed to fetch'));

    const report = await client.auditByCadastralReference('08019A002000050000AB');

    expect(report.isOfflineDemo).toBe(true);
    expect(report.property.address.municipality).toBe('Barcelona');
    expect(report.rentalBenchmark?.isStressedHousingZone).toBe(true);
  });

  it('generates distinct coordinates and refcat when clicking other points without snapping to Gran Vía', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new TypeError('Failed to fetch'));

    const chamberiLat = 40.435;
    const chamberiLon = -3.69;
    const report = await client.auditByCoordinates(chamberiLat, chamberiLon);

    expect(report.isOfflineDemo).toBe(true);
    expect(report.property.coordinates.latitude).toBe(chamberiLat);
    expect(report.property.coordinates.longitude).toBe(chamberiLon);
    expect(report.property.cadastralReference).not.toBe('9872023VH5797S0001WX');
    expect(report.property.address.street).not.toBe('Calle Gran Vía');
  });

  it('generates deterministic coordinates and avoids Gran Vía snapping for arbitrary urban refcat', () => {
    const customRefcat = '1234567AB1234C0001XY';
    const report = client.generateDeterministicAuditFromRefcat(customRefcat);

    expect(report.isOfflineDemo).toBe(true);
    expect(report.property.cadastralReference).toBe(customRefcat);
    expect(report.property.address.street).not.toBe('Calle Gran Vía');
    expect(report.property.coordinates.latitude).not.toBe(40.42028);
    expect(report.property.coordinates.longitude).not.toBe(-3.70379);
  });
});

