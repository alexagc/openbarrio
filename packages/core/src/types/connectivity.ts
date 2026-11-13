import { Type, Static } from '@sinclair/typebox';

export const CivicFacilityTypeSchema = Type.Union([
  Type.Literal('healthcare'),
  Type.Literal('education'),
  Type.Literal('transit'),
  Type.Literal('park'),
]);

export const CivicFacilitySchema = Type.Object({
  id: Type.String(),
  type: CivicFacilityTypeSchema,
  subtype: Type.String({ description: 'Specific category: primary_care, hospital, school, metro, train, bus, urban_park' }),
  name: Type.String(),
  distanceMeters: Type.Number({ minimum: 0, description: 'Geodesic distance from parcel centroid' }),
  walkTimeMinutes: Type.Number({ minimum: 0, description: 'Estimated walk time based on 4.5 km/h walking speed' }),
  latitude: Type.Optional(Type.Number({ description: 'WGS84 latitude coordinate' })),
  longitude: Type.Optional(Type.Number({ description: 'WGS84 longitude coordinate' })),
});

export const CivicFacilitiesBreakdownSchema = Type.Object({
  healthcare: Type.Number({ minimum: 0, description: 'Accessible healthcare clinics and hospitals' }),
  education: Type.Number({ minimum: 0, description: 'Accessible schools, institutes and universities' }),
  transit: Type.Number({ minimum: 0, description: 'Accessible metro, train and bus stops' }),
  park: Type.Number({ minimum: 0, description: 'Accessible public gardens and urban parks' }),
});

export const PedestrianIsochroneBandSchema = Type.Object({
  minutes: Type.Number({ description: 'Isochrone walking time threshold (5, 10, or 15)' }),
  radiusMeters: Type.Number({ description: 'Pedestrian network buffer distance in meters' }),
  effectiveRadiusMeters: Type.Number({ description: 'Euclidean geometric radius adjusted for street tortuosity (radius / tortuosity)' }),
  facilitiesCount: Type.Number({ minimum: 0, description: 'Total civic amenities accessible within this time threshold' }),
  facilitiesBreakdown: CivicFacilitiesBreakdownSchema,
});

export const PedestrianIsochronesSchema = Type.Object({
  walkSpeedKmH: Type.Number({ description: 'Pedestrian walking speed benchmark (4.5 km/h = 75 m/min)' }),
  tortuosityFactor: Type.Number({ description: 'Urban street network tortuosity factor (1.25)' }),
  isochrone5Min: PedestrianIsochroneBandSchema,
  isochrone10Min: PedestrianIsochroneBandSchema,
  isochrone15Min: PedestrianIsochroneBandSchema,
  totalFacilitiesWithin15Min: Type.Number({ minimum: 0 }),
  geojson: Type.Optional(Type.Any({ description: 'GeoJSON FeatureCollection with 5, 10 and 15 min pedestrian isochrone polygons' })),
});

export const CivicConnectivityDataSchema = Type.Object({
  walkScore15Min: Type.Number({ minimum: 0, maximum: 100, description: 'Aggregated 15-minute walkability score' }),
  nearestHealthcare: Type.Optional(CivicFacilitySchema),
  nearestEducation: Type.Optional(CivicFacilitySchema),
  nearestTransit: Type.Optional(CivicFacilitySchema),
  nearestPark: Type.Optional(CivicFacilitySchema),
  facilitiesWithin15MinCount: Type.Number({ minimum: 0 }),
  nearbyFacilities: Type.Optional(Type.Array(CivicFacilitySchema)),
  isochrones: Type.Optional(PedestrianIsochronesSchema),
});

export type CivicFacilityType = Static<typeof CivicFacilityTypeSchema>;
export type CivicFacility = Static<typeof CivicFacilitySchema>;
export type CivicFacilitiesBreakdown = Static<typeof CivicFacilitiesBreakdownSchema>;
export type PedestrianIsochroneBand = Static<typeof PedestrianIsochroneBandSchema>;
export type PedestrianIsochrones = Static<typeof PedestrianIsochronesSchema>;
export type CivicConnectivityData = Static<typeof CivicConnectivityDataSchema>;

export interface IsochroneGenerationOptions {
  speedKmH?: number;
  tortuosity?: number;
  steps?: number;
}

/**
 * Generates client-side parametric isochrone GeoJSON polygons around a center [lon, lat].
 * Uses standard pedestrian walking speed (4.5 km/h = 75 m/min) and street network tortuosity (1.25).
 * - 5 min walk: ~375m street distance (~300m Euclidean)
 * - 10 min walk: ~750m street distance (~600m Euclidean)
 * - 15 min walk: ~1125m street distance (~900m Euclidean)
 */
export function generateParametricIsochrones(
  center: [number, number],
  options: IsochroneGenerationOptions = {}
): {
  type: 'FeatureCollection';
  features: Array<{
    type: 'Feature';
    properties: {
      minutes: number;
      radiusMeters: number;
      effectiveRadiusMeters: number;
      stroke: string;
      fill: string;
      fillOpacity: number;
    };
    geometry: {
      type: 'Polygon';
      coordinates: number[][][];
    };
  }>;
} {
  const [lon, lat] = center;
  const speedKmH = options.speedKmH ?? 4.5;
  const tortuosity = options.tortuosity ?? 1.25;
  const steps = options.steps ?? 48;

  // Speed in meters per minute (4.5 km/h = 75 m/min)
  const metersPerMin = (speedKmH * 1000) / 60;

  const bands = [
    { minutes: 15, stroke: '#2563eb', fill: '#3b82f6', fillOpacity: 0.12 },
    { minutes: 10, stroke: '#059669', fill: '#10b981', fillOpacity: 0.18 },
    { minutes: 5, stroke: '#4f46e5', fill: '#6366f1', fillOpacity: 0.25 },
  ];

  // Geodesic degree approximation at target latitude
  const latRad = (lat * Math.PI) / 180;
  const metersPerDegreeLat = 111320;
  const metersPerDegreeLon = 111320 * Math.cos(latRad);

  const features = bands.map((band) => {
    const streetRadius = band.minutes * metersPerMin;
    const euclideanRadius = streetRadius / tortuosity;

    const deltaLat = euclideanRadius / metersPerDegreeLat;
    const deltaLon = euclideanRadius / metersPerDegreeLon;

    const ring: number[][] = [];
    for (let i = 0; i <= steps; i++) {
      const angle = (i * 2 * Math.PI) / steps;
      const ptLon = Number((lon + deltaLon * Math.cos(angle)).toFixed(6));
      const ptLat = Number((lat + deltaLat * Math.sin(angle)).toFixed(6));
      ring.push([ptLon, ptLat]);
    }

    return {
      type: 'Feature' as const,
      properties: {
        minutes: band.minutes,
        radiusMeters: Math.round(streetRadius),
        effectiveRadiusMeters: Math.round(euclideanRadius),
        stroke: band.stroke,
        fill: band.fill,
        fillOpacity: band.fillOpacity,
      },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [ring],
      },
    };
  });

  return {
    type: 'FeatureCollection',
    features,
  };
}

/**
 * Calculates pedestrian isochrones breakdown and metrics for nearby facilities.
 */
export function calculatePedestrianIsochrones(
  center: [number, number],
  facilities: CivicFacility[] = [],
  options: IsochroneGenerationOptions = {}
): PedestrianIsochrones {
  const speedKmH = options.speedKmH ?? 4.5;
  const tortuosity = options.tortuosity ?? 1.25;
  const metersPerMin = (speedKmH * 1000) / 60;

  const createEmptyBreakdown = (): CivicFacilitiesBreakdown => ({
    healthcare: 0,
    education: 0,
    transit: 0,
    park: 0,
  });

  const b5 = createEmptyBreakdown();
  const b10 = createEmptyBreakdown();
  const b15 = createEmptyBreakdown();

  let count5 = 0;
  let count10 = 0;
  let count15 = 0;

  for (const fac of facilities) {
    const walkMin = fac.walkTimeMinutes !== undefined
      ? fac.walkTimeMinutes
      : (fac.distanceMeters * tortuosity) / metersPerMin;

    if (walkMin <= 5) {
      count5++;
      b5[fac.type] = (b5[fac.type] || 0) + 1;
    }
    if (walkMin <= 10) {
      count10++;
      b10[fac.type] = (b10[fac.type] || 0) + 1;
    }
    if (walkMin <= 15) {
      count15++;
      b15[fac.type] = (b15[fac.type] || 0) + 1;
    }
  }

  const geojson = generateParametricIsochrones(center, options);

  return {
    walkSpeedKmH: speedKmH,
    tortuosityFactor: tortuosity,
    isochrone5Min: {
      minutes: 5,
      radiusMeters: Math.round(5 * metersPerMin),
      effectiveRadiusMeters: Math.round((5 * metersPerMin) / tortuosity),
      facilitiesCount: count5,
      facilitiesBreakdown: b5,
    },
    isochrone10Min: {
      minutes: 10,
      radiusMeters: Math.round(10 * metersPerMin),
      effectiveRadiusMeters: Math.round((10 * metersPerMin) / tortuosity),
      facilitiesCount: count10,
      facilitiesBreakdown: b10,
    },
    isochrone15Min: {
      minutes: 15,
      radiusMeters: Math.round(15 * metersPerMin),
      effectiveRadiusMeters: Math.round((15 * metersPerMin) / tortuosity),
      facilitiesCount: count15,
      facilitiesBreakdown: b15,
    },
    totalFacilitiesWithin15Min: count15,
    geojson,
  };
}
