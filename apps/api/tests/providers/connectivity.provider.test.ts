import { describe, it, expect } from 'vitest';
import {
  calculateHaversineDistanceMeters,
  calculateWalkTimeMinutes,
  calculateWalkScore,
  MockCivicConnectivityProvider,
  D1CivicConnectivityProvider,
} from '../../src/providers/connectivity.provider.js';

describe('Civic Connectivity & Walkability Provider', () => {
  describe('calculateHaversineDistanceMeters', () => {
    it('accurately calculates distance between known points', () => {
      // Madrid Sol (40.4169, -3.7035) to Gran Vía 28 (40.42028, -3.70379) ~ 375m
      const dist = calculateHaversineDistanceMeters(40.4169, -3.7035, 40.42028, -3.70379);
      expect(dist).toBeGreaterThan(350);
      expect(dist).toBeLessThan(400);
    });

    it('returns 0 for identical coordinates', () => {
      const dist = calculateHaversineDistanceMeters(40.42028, -3.70379, 40.42028, -3.70379);
      expect(dist).toBe(0);
    });
  });

  describe('calculateWalkTimeMinutes', () => {
    it('estimates walking time at 4.5 km/h (~75 m/min)', () => {
      expect(calculateWalkTimeMinutes(75)).toBe(1);
      expect(calculateWalkTimeMinutes(150)).toBe(2);
      expect(calculateWalkTimeMinutes(750)).toBe(10);
      expect(calculateWalkTimeMinutes(1125)).toBe(15);
    });
  });

  describe('calculateWalkScore', () => {
    it('scores high for comprehensive close amenities with diversity and density', () => {
      const nearest = {
        transit: {
          id: 't1',
          type: 'transit' as const,
          subtype: 'metro',
          name: 'Metro A',
          distanceMeters: 100,
          walkTimeMinutes: 1.3,
        },
        healthcare: {
          id: 'h1',
          type: 'healthcare' as const,
          subtype: 'primary_care',
          name: 'Health Center',
          distanceMeters: 250,
          walkTimeMinutes: 3.3,
        },
        education: {
          id: 'e1',
          type: 'education' as const,
          subtype: 'school',
          name: 'School B',
          distanceMeters: 200,
          walkTimeMinutes: 2.7,
        },
        park: {
          id: 'p1',
          type: 'park' as const,
          subtype: 'urban_park',
          name: 'Park C',
          distanceMeters: 150,
          walkTimeMinutes: 2.0,
        },
      };

      const score = calculateWalkScore(nearest, 8);
      expect(score).toBeGreaterThanOrEqual(85);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('returns 0 when no facilities are within 15-minute radius', () => {
      const score = calculateWalkScore({}, 0);
      expect(score).toBe(0);
    });
  });

  describe('MockCivicConnectivityProvider', () => {
    const provider = new MockCivicConnectivityProvider();

    it('resolves amenities and high walkscore for Madrid Centro', async () => {
      const res = await provider.getConnectivityByCoordinates(40.42028, -3.70379);

      expect(res.walkScore15Min).toBeGreaterThan(60);
      expect(res.facilitiesWithin15MinCount).toBeGreaterThan(0);
      expect(res.nearestTransit).toBeDefined();
      expect(res.nearestHealthcare).toBeDefined();
      expect(res.nearestEducation).toBeDefined();
      expect(res.nearestPark).toBeDefined();
      expect(res.nearestTransit?.walkTimeMinutes).toBeLessThanOrEqual(15);
    });

    it('resolves amenities for Barcelona Eixample', async () => {
      const res = await provider.getConnectivityByCoordinates(41.39167, 2.16472);

      expect(res.walkScore15Min).toBeGreaterThan(60);
      expect(res.nearestTransit?.name).toContain('Passeig de Gràcia');
      expect(res.nearestHealthcare?.name).toContain('CAP');
    });

    it('returns 0 walkscore for null coordinates (0, 0)', async () => {
      const res = await provider.getConnectivityByCoordinates(0, 0);

      expect(res.walkScore15Min).toBe(0);
      expect(res.facilitiesWithin15MinCount).toBe(0);
      expect(res.nearestTransit).toBeUndefined();
    });

    it('synthesizes realistic facilities for arbitrary Spanish coordinates', async () => {
      const res = await provider.getConnectivityByCoordinates(38.905, -6.345); // Mérida

      expect(res.walkScore15Min).toBeGreaterThan(0);
      expect(res.nearestTransit).toBeDefined();
      expect(res.nearestHealthcare).toBeDefined();
      expect(res.nearestEducation).toBeDefined();
      expect(res.nearestPark).toBeDefined();
    });
  });

  describe('D1CivicConnectivityProvider', () => {
    it('returns 0 score when database is uninitialized', async () => {
      const d1Provider = new D1CivicConnectivityProvider();
      const res = await d1Provider.getConnectivityByCoordinates(40.42028, -3.70379);

      expect(res.walkScore15Min).toBe(0);
      expect(res.facilitiesWithin15MinCount).toBe(0);
    });

    it('executes bounding box query and computes geodesic distance when db is bound', async () => {
      const mockDb: any = {
        prepare: () => ({
          bind: () => ({
            all: async () => ({
              results: [
                {
                  id: 'd1-t-1',
                  type: 'transit',
                  subtype: 'metro',
                  name: 'Metro Sol',
                  latitude: 40.4169,
                  longitude: -3.7035,
                },
                {
                  id: 'd1-h-1',
                  type: 'healthcare',
                  subtype: 'primary_care',
                  name: 'CS Centro',
                  latitude: 40.418,
                  longitude: -3.701,
                },
              ],
            }),
          }),
        }),
      };

      const d1Provider = new D1CivicConnectivityProvider({ db: mockDb });
      const res = await d1Provider.getConnectivityByCoordinates(40.42028, -3.70379);

      expect(res.walkScore15Min).toBeGreaterThan(0);
      expect(res.nearestTransit?.name).toBe('Metro Sol');
      expect(res.nearestHealthcare?.name).toBe('CS Centro');
      expect(res.facilitiesWithin15MinCount).toBe(2);
    });
  });
});
