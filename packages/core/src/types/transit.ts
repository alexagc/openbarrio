import { Type, Static } from '@sinclair/typebox';

export const TransitModeSchema = Type.Union([
  Type.Literal('metro'),
  Type.Literal('rail'),
  Type.Literal('tram'),
  Type.Literal('bus'),
  Type.Literal('ferry'),
]);

export const WalkSegmentMethodSchema = Type.Literal('parametric');

export const TransitStopSchema = Type.Object({
  stopId: Type.String(),
  feedId: Type.String(),
  operatorName: Type.String(),
  name: Type.String(),
  mode: TransitModeSchema,
  distanceMeters: Type.Number({ minimum: 0 }),
  walkTimeMinutes: Type.Number({ minimum: 0 }),
  routesCount: Type.Number({ minimum: 1 }),
  peakHeadwayMin: Type.Optional(Type.Number({ minimum: 0.5 })),
  offPeakHeadwayMin: Type.Optional(Type.Number({ minimum: 0.5 })),
  latitude: Type.Number(),
  longitude: Type.Number(),
  licenseId: Type.String(),
});

export const TransitHubTravelTimeSchema = Type.Object({
  hubName: Type.String(),
  totalMinutes: Type.Number({ minimum: 1 }),
  walkMinutes: Type.Number({ minimum: 0 }),
  waitMinutes: Type.Number({ minimum: 0 }),
  inVehicleMinutes: Type.Number({ minimum: 1 }),
  mode: TransitModeSchema,
  originStopName: Type.String(),
  lineName: Type.Optional(Type.String()),
});

export const TransitAccessibilitySchema = Type.Object({
  stopsWithin5Min: Type.Number({ minimum: 0 }),
  stopsWithin10Min: Type.Number({ minimum: 0 }),
  stopsWithin15Min: Type.Number({ minimum: 0 }),
  nearestStops: Type.Array(TransitStopSchema),
  peakHeadwayMin: Type.Optional(Type.Number({ minimum: 0.5 })),
  offPeakHeadwayMin: Type.Optional(Type.Number({ minimum: 0.5 })),
  travelTimesToHubs: Type.Array(TransitHubTravelTimeSchema),
  walkSegmentMethod: WalkSegmentMethodSchema,
  walkSpeedKmH: Type.Number({ minimum: 1 }),
  tortuosityFactor: Type.Number({ minimum: 1 }),
  coveragePct: Type.Number({ minimum: 0, maximum: 100 }),
  coveredOperators: Type.Array(Type.String()),
  missingOperators: Type.Array(Type.String()),
  sourceDate: Type.Optional(Type.String()),
});

export type TransitMode = Static<typeof TransitModeSchema>;
export type WalkSegmentMethod = Static<typeof WalkSegmentMethodSchema>;
export type TransitStop = Static<typeof TransitStopSchema>;
export type TransitHubTravelTime = Static<typeof TransitHubTravelTimeSchema>;
export type TransitAccessibility = Static<typeof TransitAccessibilitySchema>;

export interface RawGtfsStop {
  stopId: string;
  stopName: string;
  latitude: number;
  longitude: number;
}

export interface TransitHubDefinition {
  hubName: string;
  inVehicleMinutes: number;
  mode: TransitMode;
  lineName?: string;
}

export interface TransitStopInput {
  stopId: string;
  feedId: string;
  operatorName: string;
  name: string;
  mode: TransitMode;
  latitude: number;
  longitude: number;
  routesCount: number;
  peakHeadwayMin?: number;
  offPeakHeadwayMin?: number;
  hubTravelTimes?: TransitHubDefinition[];
  licenseId: string;
}

export interface TransitCoverageMetadata {
  coveragePct: number;
  coveredOperators: string[];
  missingOperators: string[];
  sourceDate?: string;
}

function splitCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i]!;
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      fields.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  fields.push(current.trim());
  return fields;
}

/**
 * Parses a GTFS HH:MM:SS timestamp into total seconds from service day midnight.
 * Supports GTFS post-midnight timestamps >= 24:00:00 (e.g. "25:15:00").
 */
export function parseGtfsTimeToSeconds(hhmmss: string): number | null {
  const match = /^\s*(\d{1,3}):([0-5]\d):([0-5]\d)\s*$/.exec(hhmmss);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  const seconds = Number(match[3]);
  return hours * 3600 + minutes * 60 + seconds;
}

/**
 * Parses raw GTFS stops.txt CSV content, filtering to valid Spanish WGS84 coordinates.
 */
export function parseGtfsStopsCsv(csvText: string): RawGtfsStop[] {
  const lines = csvText
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  if (lines.length < 2) return [];

  const headers = splitCsvLine(lines[0]!).map((h) => h.toLowerCase());
  const idIdx = headers.indexOf('stop_id');
  const nameIdx = headers.indexOf('stop_name');
  const latIdx = headers.indexOf('stop_lat');
  const lonIdx = headers.indexOf('stop_lon');

  if (idIdx === -1 || nameIdx === -1 || latIdx === -1 || lonIdx === -1) {
    return [];
  }

  const results: RawGtfsStop[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = splitCsvLine(lines[i]!);
    const stopId = cols[idIdx];
    const stopName = cols[nameIdx];
    const latitude = Number(cols[latIdx]);
    const longitude = Number(cols[lonIdx]);

    if (
      !stopId ||
      !stopName ||
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      latitude < 27.5 ||
      latitude > 44.0 ||
      longitude < -18.5 ||
      longitude > 4.5
    ) {
      continue;
    }

    results.push({ stopId, stopName, latitude, longitude });
  }
  return results;
}

/**
 * Computes average headway (in minutes) at a GTFS stop within a service window
 * (defaults to morning peak 07:30-09:30 -> 27000..34200s) from stop_times.txt.
 */
export function computeGtfsPeakHeadwayMinutes(
  stopTimesCsv: string,
  targetStopId: string,
  windowStartSec: number = 27_000,
  windowEndSec: number = 34_200
): number | null {
  const lines = stopTimesCsv
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  if (lines.length < 2) return null;

  const headers = splitCsvLine(lines[0]!).map((h) => h.toLowerCase());
  const stopIdx = headers.indexOf('stop_id');
  const depIdx = headers.indexOf('departure_time');
  if (stopIdx === -1 || depIdx === -1) return null;

  const departures: number[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = splitCsvLine(lines[i]!);
    if (cols[stopIdx] !== targetStopId) continue;
    const sec = parseGtfsTimeToSeconds(cols[depIdx] ?? '');
    if (sec !== null && sec >= windowStartSec && sec <= windowEndSec) {
      departures.push(sec);
    }
  }

  if (departures.length < 2) return null;
  departures.sort((a, b) => a - b);

  const gaps: number[] = [];
  for (let i = 1; i < departures.length; i++) {
    const diff = departures[i]! - departures[i - 1]!;
    if (diff > 0) gaps.push(diff);
  }
  if (gaps.length === 0) return null;

  const avgSec = gaps.reduce((sum, g) => sum + g, 0) / gaps.length;
  return Math.round((avgSec / 60) * 10) / 10;
}

function computeHaversineMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const earthRadius = 6_371_000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(earthRadius * c);
}

/**
 * Computes GTFS transit catchment and estimated hub travel times around `[lon, lat]`.
 * Walking access legs strictly use the parametric 4.5 km/h & 1.25x tortuosity model.
 */
export function calculateTransitAccessibility(
  originLonLat: [number, number],
  stops: TransitStopInput[],
  coverage: TransitCoverageMetadata,
  options: { walkSpeedKmH?: number; tortuosityFactor?: number; maxStops?: number } = {}
): TransitAccessibility {
  const [originLon, originLat] = originLonLat;
  const walkSpeedKmH = options.walkSpeedKmH ?? 4.5;
  const tortuosityFactor = options.tortuosityFactor ?? 1.25;
  const metersPerMin = (walkSpeedKmH * 1000) / 60;
  const maxStops = options.maxStops ?? 6;

  const mapped: Array<TransitStop & { hubTravelTimes?: TransitHubDefinition[] }> = stops.map(
    (stop) => {
      const distanceMeters = computeHaversineMeters(
        originLat,
        originLon,
        stop.latitude,
        stop.longitude
      );
      const walkTimeMinutes =
        Math.round(((distanceMeters * tortuosityFactor) / metersPerMin) * 10) / 10;
      return {
        stopId: stop.stopId,
        feedId: stop.feedId,
        operatorName: stop.operatorName,
        name: stop.name,
        mode: stop.mode,
        distanceMeters,
        walkTimeMinutes,
        routesCount: stop.routesCount,
        ...(typeof stop.peakHeadwayMin === 'number' ? { peakHeadwayMin: stop.peakHeadwayMin } : {}),
        ...(typeof stop.offPeakHeadwayMin === 'number'
          ? { offPeakHeadwayMin: stop.offPeakHeadwayMin }
          : {}),
        latitude: stop.latitude,
        longitude: stop.longitude,
        licenseId: stop.licenseId,
        hubTravelTimes: stop.hubTravelTimes,
      };
    }
  );

  mapped.sort((a, b) => a.walkTimeMinutes - b.walkTimeMinutes);

  const stopsWithin5Min = mapped.filter((s) => s.walkTimeMinutes <= 5).length;
  const stopsWithin10Min = mapped.filter((s) => s.walkTimeMinutes <= 10).length;
  const stopsWithin15Min = mapped.filter((s) => s.walkTimeMinutes <= 15).length;

  const walkableStops = mapped.filter((s) => s.walkTimeMinutes <= 15);
  const peakHeadways = walkableStops
    .map((s) => s.peakHeadwayMin)
    .filter((h): h is number => typeof h === 'number' && h > 0);
  const offPeakHeadways = walkableStops
    .map((s) => s.offPeakHeadwayMin)
    .filter((h): h is number => typeof h === 'number' && h > 0);

  const peakHeadwayMin = peakHeadways.length > 0 ? Math.min(...peakHeadways) : undefined;
  const offPeakHeadwayMin = offPeakHeadways.length > 0 ? Math.min(...offPeakHeadways) : undefined;

  // Build fastest unique hub travel times using parametric walk + half-headway wait + GTFS ride time
  const bestHubMap = new Map<string, TransitHubTravelTime>();
  for (const stop of mapped.slice(0, maxStops)) {
    if (!stop.hubTravelTimes || stop.hubTravelTimes.length === 0) continue;
    const waitMinutes =
      typeof stop.peakHeadwayMin === 'number'
        ? Math.round((stop.peakHeadwayMin / 2) * 10) / 10
        : 0;
    const walkMinutes = Math.round(stop.walkTimeMinutes);

    for (const hub of stop.hubTravelTimes) {
      const totalMinutes = Math.max(1, Math.round(walkMinutes + waitMinutes + hub.inVehicleMinutes));
      const existing = bestHubMap.get(hub.hubName);
      if (!existing || totalMinutes < existing.totalMinutes) {
        bestHubMap.set(hub.hubName, {
          hubName: hub.hubName,
          totalMinutes,
          walkMinutes,
          waitMinutes,
          inVehicleMinutes: hub.inVehicleMinutes,
          mode: hub.mode,
          originStopName: stop.name,
          ...(hub.lineName ? { lineName: hub.lineName } : {}),
        });
      }
    }
  }

  const travelTimesToHubs = Array.from(bestHubMap.values())
    .sort((a, b) => a.totalMinutes - b.totalMinutes)
    .slice(0, 4);

  const nearestStops: TransitStop[] = mapped.slice(0, maxStops).map((item) => {
    const { hubTravelTimes: _ignored, ...cleanStop } = item;
    void _ignored;
    return cleanStop;
  });

  return {
    stopsWithin5Min,
    stopsWithin10Min,
    stopsWithin15Min,
    nearestStops,
    ...(typeof peakHeadwayMin === 'number' ? { peakHeadwayMin } : {}),
    ...(typeof offPeakHeadwayMin === 'number' ? { offPeakHeadwayMin } : {}),
    travelTimesToHubs,
    walkSegmentMethod: 'parametric',
    walkSpeedKmH,
    tortuosityFactor,
    coveragePct: Math.min(100, Math.max(0, Math.round(coverage.coveragePct))),
    coveredOperators: coverage.coveredOperators,
    missingOperators: coverage.missingOperators,
    ...(coverage.sourceDate ? { sourceDate: coverage.sourceDate } : {}),
  };
}
