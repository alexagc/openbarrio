import { describe, it, expect } from 'vitest';
import {
  calculateSolarPosition,
  analyzeFacadeSolarExposure,
  getCardinalOrientation,
  createDateForSeasonAndTime,
  SEASON_CONFIG,
  compute2DConvexHull,
  calculateBuildingShadowPolygon,
} from '../src/utils/solar';

describe('Solar Astronomical Engine (OpenBarrio Civic Precision)', () => {
  const madridLat = 40.42028;
  const madridLon = -3.70379;

  describe('calculateSolarPosition', () => {
    it('calculates expected summer afternoon position in Madrid', () => {
      // 14:30 CEST on June 21 (870 minutes)
      const date = createDateForSeasonAndTime('summer', 14 * 60 + 30);
      const pos = calculateSolarPosition(madridLat, madridLon, date);

      // In summer afternoon around 14:30-15:00, sun is in the South-West (azimuth ~200°-220°)
      expect(pos.azimuth).toBeGreaterThan(190);
      expect(pos.azimuth).toBeLessThan(230);

      // Sun elevation in summer afternoon is high
      expect(pos.altitude).toBeGreaterThan(30);
      expect(pos.altitude).toBeLessThan(75);

      // Direct radiation in afternoon sun should be strong (> 750 W/m²)
      expect(pos.directRadiationWm2).toBeGreaterThan(750);
      expect(pos.solarTimeStr).toMatch(/^\d{2}:\d{2}$/);
    });

    it('returns zero direct radiation during night hours', () => {
      // Midnight in winter
      const nightDate = createDateForSeasonAndTime('winter', 0);
      const pos = calculateSolarPosition(madridLat, madridLon, nightDate);

      expect(pos.altitude).toBeLessThan(0);
      expect(pos.directRadiationWm2).toBe(0);
    });

    it('verifies solar noon elevation is higher in summer than in winter', () => {
      const summerNoon = createDateForSeasonAndTime('summer', 14 * 60); // ~solar noon CEST
      const winterNoon = createDateForSeasonAndTime('winter', 13 * 60); // ~solar noon CET

      const summerPos = calculateSolarPosition(madridLat, madridLon, summerNoon);
      const winterPos = calculateSolarPosition(madridLat, madridLon, winterNoon);

      expect(summerPos.altitude).toBeGreaterThan(winterPos.altitude);
      expect(summerPos.altitude).toBeGreaterThan(65);
      expect(winterPos.altitude).toBeLessThan(35);
    });
  });

  describe('getCardinalOrientation', () => {
    it('resolves cardinal directions correctly', () => {
      expect(getCardinalOrientation(0)).toContain('NORTE');
      expect(getCardinalOrientation(90)).toContain('ESTE');
      expect(getCardinalOrientation(180)).toContain('SUR');
      expect(getCardinalOrientation(198)).toBe('SUR-SUROESTE (198°)');
      expect(getCardinalOrientation(270)).toContain('OESTE');
    });
  });

  describe('analyzeFacadeSolarExposure', () => {
    it('evaluates South-Southwest (198°) facade exposure accurately for Madrid in summer', () => {
      const analysis = analyzeFacadeSolarExposure(198, madridLat, madridLon, 'summer', 200);

      expect(analysis.facadeOrientation).toBe('SUR-SUROESTE (198°)');
      // Direct sunlight hours in summer for SSW facade should be around 8.0 - 8.6 hours
      expect(analysis.directSunlightHours).toBeGreaterThanOrEqual(7.5);
      expect(analysis.directSunlightHours).toBeLessThanOrEqual(9.5);
      expect(analysis.comfortRating).toBe('optimal');
      expect(analysis.comfortScore).toBeGreaterThanOrEqual(90);
      // Photovoltaic potential for 200m² roof
      expect(analysis.photovoltaicPotentialMWh).toBe(46.8);
    });

    it('evaluates North facade receives significantly fewer hours and lower score in winter', () => {
      const northWinter = analyzeFacadeSolarExposure(0, madridLat, madridLon, 'winter', 200);

      expect(northWinter.directSunlightHours).toBe(0);
      expect(northWinter.comfortRating).toBe('low');
      expect(northWinter.comfortScore).toBeLessThan(65);
    });
  });

  describe('Season Configuration', () => {
    it('defines winter, equinox, and summer presets with proper months', () => {
      expect(SEASON_CONFIG.winter.month).toBe(11); // December
      expect(SEASON_CONFIG.equinox.month).toBe(2); // March
      expect(SEASON_CONFIG.summer.month).toBe(5); // June
    });
  });

  describe('Convex Hull & Dynamic Ground Shadows', () => {
    it('computes a closed 2D convex hull for arbitrary points', () => {
      const square = [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
        [0.5, 0.5], // interior point
      ];
      const hull = compute2DConvexHull(square);
      // Hull should exclude interior point and close the ring
      expect(hull.length).toBe(5);
      expect(hull[0]).toEqual(hull[hull.length - 1]);
    });

    it('calculates dynamic ground shadow projected opposite to sun', () => {
      const buildingPoly = [
        [
          [-3.70379, 40.42028],
          [-3.70359, 40.42028],
          [-3.70359, 40.42048],
          [-3.70379, 40.42048],
          [-3.70379, 40.42028],
        ],
      ];

      // Sun at azimuth 180° (South), altitude 45°
      // Shadow should be cast to North (azimuth 0° / 360°)
      const shadow = calculateBuildingShadowPolygon(buildingPoly, 40, 180, 45);
      expect(shadow.features.length).toBe(1);
      const ring = shadow.features[0].geometry.coordinates[0];
      expect(ring.length).toBeGreaterThan(4);
      expect(ring[0]).toEqual(ring[ring.length - 1]);
      // Shadow length for 40m at 45° elevation is ~40m
      expect(shadow.features[0].properties.lengthMeters).toBe(40);
    });
  });
});
