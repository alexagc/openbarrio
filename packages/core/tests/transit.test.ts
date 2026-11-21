import { describe, it, expect } from 'vitest';
import { Value } from '@sinclair/typebox/value';
import {
  ALL_LAYER_KEYS,
  TransitAccessibilitySchema,
  calculateBarrioScore,
  calculateTransitAccessibility,
  computeGtfsPeakHeadwayMinutes,
  parseGtfsStopsCsv,
  parseGtfsTimeToSeconds,
  type CadastralProperty,
} from '../src/index.js';

const SAMPLE_STOPS_CSV = `stop_id,stop_name,stop_lat,stop_lon
SOL,"Sol (Metro, Cercanías)",40.4169,-3.7035
GRAN_VIA,Gran Vía,40.4201,-3.7022
INVALID_ZERO,Outside Spain,0.0,0.0
`;

const SAMPLE_STOP_TIMES_CSV = `trip_id,arrival_time,departure_time,stop_id,stop_sequence
T1,08:00:00,08:00:00,SOL,1
T2,08:04:00,08:04:00,SOL,1
T3,08:08:00,08:08:00,SOL,1
T4,25:10:00,25:10:00,SOL,1
`;

describe('GTFS Transit Contracts, CSV Parser & Headway Calculations (@openbarrio/core)', () => {
  it('registers transit in ALL_LAYER_KEYS and parses GTFS times including >= 24:00:00', () => {
    expect(ALL_LAYER_KEYS).toContain('transit');
    expect(parseGtfsTimeToSeconds('08:30:00')).toBe(8 * 3600 + 30 * 60);
    expect(parseGtfsTimeToSeconds('25:10:00')).toBe(25 * 3600 + 10 * 60);
    expect(parseGtfsTimeToSeconds('invalid')).toBeNull();
  });

  it('parses GTFS stops.txt CSV with quoted fields and Spain coordinate filtering', () => {
    const stops = parseGtfsStopsCsv(SAMPLE_STOPS_CSV);
    expect(stops).toHaveLength(2);
    expect(stops[0]).toEqual({
      stopId: 'SOL',
      stopName: 'Sol (Metro, Cercanías)',
      latitude: 40.4169,
      longitude: -3.7035,
    });
    expect(stops[1]?.stopId).toBe('GRAN_VIA');
  });

  it('computes weekday morning peak headway in minutes from stop_times.txt fixture', () => {
    const peakMin = computeGtfsPeakHeadwayMinutes(SAMPLE_STOP_TIMES_CSV, 'SOL');
    expect(peakMin).toBe(4);
    expect(computeGtfsPeakHeadwayMinutes(SAMPLE_STOP_TIMES_CSV, 'UNKNOWN')).toBeNull();
  });

  it('calculates parametric 5/10/15-min stop counts and hub travel times matching TransitAccessibilitySchema', () => {
    const result = calculateTransitAccessibility(
      [-3.7038, 40.418], // ~120m from Sol & ~260m from Gran Via
      [
        {
          stopId: 'crtm-madrid:SOL',
          feedId: 'crtm-madrid',
          operatorName: 'CRTM Madrid',
          name: 'Sol',
          mode: 'metro',
          latitude: 40.4169,
          longitude: -3.7035,
          routesCount: 5,
          peakHeadwayMin: 4,
          offPeakHeadwayMin: 6,
          hubTravelTimes: [
            { hubName: 'Atocha Renfe', inVehicleMinutes: 4, mode: 'rail', lineName: 'C3' },
          ],
          licenseId: 'MITMS-NAP-RISP',
        },
        {
          stopId: 'crtm-madrid:FAR',
          feedId: 'crtm-madrid',
          operatorName: 'CRTM Madrid',
          name: 'Distant Hub',
          mode: 'bus',
          latitude: 40.425,
          longitude: -3.7038,
          routesCount: 1,
          peakHeadwayMin: 12,
          licenseId: 'MITMS-NAP-RISP',
        },
      ],
      {
        coveragePct: 100,
        coveredOperators: ['Metro de Madrid', 'Renfe Cercanías'],
        missingOperators: [],
        sourceDate: '2026-11-01',
      }
    );

    expect(Value.Check(TransitAccessibilitySchema, result)).toBe(true);
    expect(result.walkSegmentMethod).toBe('parametric');
    expect(result.walkSpeedKmH).toBe(4.5);
    expect(result.tortuosityFactor).toBe(1.25);
    expect(result.stopsWithin5Min).toBe(1);
    expect(result.stopsWithin15Min).toBe(2);
    expect(result.peakHeadwayMin).toBe(4);
    expect(result.travelTimesToHubs[0]).toMatchObject({
      hubName: 'Atocha Renfe',
      inVehicleMinutes: 4,
      waitMinutes: 2,
    });
    expect(result.travelTimesToHubs[0]!.totalMinutes).toBeGreaterThanOrEqual(7);
  });

  it('keeps BarrioScore and WalkScore invariant regardless of transit layer status', () => {
    const property: CadastralProperty = {
      cadastralReference: '9872023VH5797S0001WX',
      address: {
        street: 'Calle Mayor',
        number: '10',
        postalCode: '28013',
        municipality: 'Madrid',
        province: 'Madrid',
      },
      coordinates: { latitude: 40.418, longitude: -3.703, srs: 'EPSG:4326' },
      building: {
        constructionYear: 2010,
        builtSurfaceM2: 120,
        primaryUse: 'Residencial',
        unitsCount: 10,
        hasCommercialGroundFloor: false,
      },
      typology: 'RESIDENTIAL',
    };

    const baseInput = {
      property,
      neighborhood: {
        censusSectionCode: '2807901001',
        averageNetHouseholdIncomeEur: 40000,
        averageNetPersonIncomeEur: 18000,
        percentileInMunicipality: 75,
        rankingInCity: { rank: 100, totalSections: 2000 },
        demographics: { medianAge: 42, singlePersonHouseholdPercentage: 25 },
      },
      environment: {
        noise: { dayEveningNightDecibels: 55, category: 'MODERATE' as const, predominantSource: 'ROAD_TRAFFIC' as const },
        floodRisk: { level: 'NONE' as const, returnPeriodYears: null, isInPreferentialFlowZone: false },
      },
      connectivity: { walkScore15Min: 88, facilitiesWithin15MinCount: 12 },
      urbanPlanning: {
        landClassification: 'URBAN_CONSOLIDATED' as const,
        zoningCode: 'NZ-1',
        isProtectedLand: false,
        declaredRenovationsCount: 0,
        lastRenovationYear: null,
        isStressedHousingZone: false,
      },
    };

    const scoreOk = calculateBarrioScore({
      ...baseInput,
      layers: {
        transit: { status: 'ok', sourceName: 'MITMS NAP GTFS Transporte', coveragePct: 100 },
      },
    });
    const scoreMissing = calculateBarrioScore({
      ...baseInput,
      layers: {
        transit: {
          status: 'out_of_coverage',
          sourceName: 'MITMS NAP GTFS Transporte',
          reason: 'no_coverage',
          coveragePct: 50,
        },
      },
    });

    expect(scoreOk.overallScore).toBe(scoreMissing.overallScore);
    expect(scoreOk.subscores).toEqual(scoreMissing.subscores);
    expect(scoreOk.trafficLight).toBe(scoreMissing.trafficLight);
  });
});
