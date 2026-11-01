/**
 * Geodesic and cartographic mathematical utilities for OpenBarrio.
 * Supporting EPSG:4326 (WGS84) to EPSG:25830 (ETRS89 / UTM Zone 30N) conversions
 * and geodesic circle generation.
 */

/**
 * Converts WGS84 geographic coordinates (lat, lon) to Spanish official ETRS89 / UTM Zone 30N projection.
 * Central meridian: 3° W (-3°). False Easting: 500,000m.
 */
export function wgs84ToUtm30n(lat: number, lon: number): { x: number; y: number; zone: string } {
  const a = 6378137.0; // semi-major axis
  const f = 1 / 298.257223563; // flattening
  const k0 = 0.9996; // scale factor
  const e2 = 2 * f - f * f;
  const ePrime2 = e2 / (1 - e2);

  const latRad = (lat * Math.PI) / 180;
  const lonRad = (lon * Math.PI) / 180;
  const lonOrigin = (-3 * Math.PI) / 180; // Central meridian for UTM Zone 30 (-3°)

  const N = a / Math.sqrt(1 - e2 * Math.sin(latRad) * Math.sin(latRad));
  const T = Math.tan(latRad) * Math.tan(latRad);
  const C = ePrime2 * Math.cos(latRad) * Math.cos(latRad);
  const A = Math.cos(latRad) * (lonRad - lonOrigin);

  const M =
    a *
    ((1 - e2 / 4 - (3 * e2 * e2) / 64 - (5 * e2 * e2 * e2) / 256) * latRad -
      ((3 * e2) / 8 + (3 * e2 * e2) / 32 + (45 * e2 * e2 * e2) / 1024) * Math.sin(2 * latRad) +
      ((15 * e2 * e2) / 256 + (45 * e2 * e2 * e2) / 1024) * Math.sin(4 * latRad) -
      ((35 * e2 * e2 * e2) / 3072) * Math.sin(6 * latRad));

  const x =
    500000 +
    k0 *
      N *
      (A +
        ((1 - T + C) * Math.pow(A, 3)) / 6 +
        ((5 - 18 * T + T * T + 72 * C - 58 * ePrime2) * Math.pow(A, 5)) / 120);

  const y =
    k0 *
    (M +
      N *
        Math.tan(latRad) *
        ((A * A) / 2 +
          ((5 - T + 9 * C + 4 * C * C) * Math.pow(A, 4)) / 24 +
          ((61 - 58 * T + T * T + 600 * C - 330 * ePrime2) * Math.pow(A, 6)) / 720));

  return {
    x: Math.round(x),
    y: Math.round(y),
    zone: '30N',
  };
}

/**
 * Escapes unsafe HTML characters to prevent XSS in map popups.
 */
export function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, (m) => {
    switch (m) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      case "'":
        return '&#39;';
      default:
        return m;
    }
  });
}

/**
 * Creates a geodesic circle polygon around a center [lon, lat] in meters.
 */
export function createGeodesicCircle(
  center: [number, number],
  radiusMeters: number,
  points = 64
): number[][] {
  const [lon, lat] = center;
  const coords: number[][] = [];
  const km = radiusMeters / 1000;
  const distanceX = km / (111.32 * Math.cos((lat * Math.PI) / 180));
  const distanceY = km / 110.574;

  for (let i = 0; i <= points; i++) {
    const theta = (i / points) * (2 * Math.PI);
    const x = distanceX * Math.cos(theta);
    const y = distanceY * Math.sin(theta);
    coords.push([lon + x, lat + y]);
  }
  return coords;
}
