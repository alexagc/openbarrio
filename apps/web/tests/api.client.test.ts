import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { OpenBarrioApiClient, ApiError } from '../src/services/api.client';
import {
  generateMockReport,
  generateDeterministicAudit,
  generateDeterministicAuditFromRefcat,
} from './mocks/offline-simulator';

describe('OpenBarrioApiClient (Pure Transport Decoupled)', () => {
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
        subscores: {
          building: 70,
          connectivity: 95,
          environmental: 85,
          socioeconomic: 90,
          urbanPlanning: 88,
        },
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
      headers: { get: () => 'application/json' },
      json: async () => mockReport,
    } as unknown as Response);

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
    } as unknown as Response);

    await expect(client.auditByCadastralReference('00000000000000')).rejects.toThrow(ApiError);
  });

  it('throws ApiError when network is completely unreachable without synthetic data in production', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new TypeError('Failed to fetch'));

    await expect(client.auditByCoordinates(40.42028, -3.70379)).rejects.toThrow(ApiError);
  });

  it('normalizes multi-letter address queries and formats extension properly in searchAddress', async () => {
    const mockCartoData = [
      {
        address: 'CALLE SERRANO 44 B, Madrid',
        lat: 40.42687,
        lng: -3.68746,
        portalNumber: 44,
        extension: 'B',
        refCatastral: '1755501VK4715F',
      },
    ];

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => mockCartoData,
    } as unknown as Response);

    const results = await client.searchAddress('Calle Serrano 44-B');
    expect(results).toHaveLength(1);
    expect(results[0].label).toBe('CALLE SERRANO 44 B, Madrid');
    expect(results[0].refcat).toBe('1755501VK4715F');

    // Verify the query sent to CartoCiudad was spaced properly
    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining('q=Calle%20Serrano%2044%20B')
    );
  });

  it('correctly ranks exact portal candidate (Arroyo Bueno 2F) to top position over other towns or portals', async () => {
    const mockCartoData = [
      {
        address: 'ARROYO FUEN DEL CEPO 2, Barrio de Abajo (Albentosa)',
        tip_via: 'ARROYO',
        lat: 40.04776,
        lng: -0.75313,
        portalNumber: 2,
        extension: null,
        refCatastral: '1756501XK9315N',
      },
      {
        address: 'CALLE ARROYO BUENO 2 F, Madrid',
        tip_via: 'CALLE',
        lat: 40.34881,
        lng: -3.7045,
        portalNumber: 2,
        extension: 'F',
        refCatastral: '0269303VK4606G',
      },
      {
        address: 'CALLE ARROYO BUENO 2 I, Madrid',
        tip_via: 'CALLE',
        lat: 40.34877,
        lng: -3.70501,
        portalNumber: 2,
        extension: 'I',
        refCatastral: '0269303VK4606G',
      },
    ];

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => mockCartoData,
    } as unknown as Response);

    const results = await client.searchAddress('arroyo bueno 2F');
    expect(results.length).toBeGreaterThan(0);
    // Arroyo Bueno 2 F must be ranked #1
    expect(results[0].label).toBe('CALLE ARROYO BUENO 2 F, Madrid');
    expect(results[0].refcat).toBe('0269303VK4606G');
    expect(results[0].portal).toBe('F');
  });
});

describe('Offline Simulator (Dedicated Vitest Mock Engine)', () => {
  it('generateDeterministicAudit generates valid 5-pillar report', () => {
    const report = generateDeterministicAudit(40.42028, -3.70379);
    expect(report).toBeDefined();
    expect(report.isOfflineDemo).toBe(true);
    expect(report.property.address.municipality).toBe('Madrid');
    expect(report.score.overallScore).toBeGreaterThan(0);
    expect(report.score.overallScore).toBeLessThanOrEqual(100);
    expect(report.connectivity).toBeDefined();
    expect(report.connectivity?.walkScore15Min).toBeGreaterThan(0);
    expect(report.urbanPlanning).toBeDefined();
    expect(report.score.subscores).toBeDefined();
  });

  it('correctly marks Barcelona property as Stressed Housing Zone in simulator', () => {
    const report = generateDeterministicAuditFromRefcat('08019A002000050000AB');
    expect(report.isOfflineDemo).toBe(true);
    expect(report.property.address.municipality).toBe('Barcelona');
    expect(report.rentalBenchmark?.isStressedHousingZone).toBe(true);
    expect(report.urbanPlanning?.isStressedHousingZone).toBe(true);
  });

  it('generates deterministic coordinates and avoids Gran Vía snapping for arbitrary urban refcat', () => {
    const customRefcat = '1234567AB1234C0001XY';
    const report = generateDeterministicAuditFromRefcat(customRefcat);
    expect(report.isOfflineDemo).toBe(true);
    expect(report.property.cadastralReference).toBe(customRefcat);
    expect(report.property.address.street).not.toBe('Calle Gran Vía');
    expect(report.property.coordinates.latitude).not.toBe(40.42028);
    expect(report.property.coordinates.longitude).not.toBe(-3.70379);
    expect(report.connectivity).toBeDefined();
    expect(report.urbanPlanning).toBeDefined();
    expect(report.score.subscores.connectivity).toBeDefined();
  });

  it('generateMockReport generates complete 5-pillar dossier reports seamlessly', () => {
    const madridReport = generateMockReport('madrid');
    expect(madridReport.property.address.municipality).toBe('Madrid');
    expect(madridReport.connectivity).toBeDefined();
    expect(madridReport.urbanPlanning).toBeDefined();
    expect(madridReport.score.subscores.building).toBeGreaterThan(0);
    expect(madridReport.score.subscores.connectivity).toBeGreaterThan(0);
    expect(madridReport.score.subscores.environmental).toBeGreaterThan(0);
    expect(madridReport.score.subscores.socioeconomic).toBeGreaterThan(0);
    expect(madridReport.score.subscores.urbanPlanning).toBeGreaterThan(0);

    const bcnReport = generateMockReport('barcelona');
    expect(bcnReport.property.address.municipality).toBe('Barcelona');
    expect(bcnReport.rentalBenchmark?.isStressedHousingZone).toBe(true);
    expect(bcnReport.urbanPlanning?.isStressedHousingZone).toBe(true);
  });
});
