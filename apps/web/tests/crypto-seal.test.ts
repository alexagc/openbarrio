import { describe, it, expect } from 'vitest';
import { computeAuditSha256, buildCatastroVerificationUrl } from '../src/utils/cryptoSeal';
import { PropertyAuditReport } from '@openbarrio/core';

describe('cryptoSeal utility', () => {
  const mockReport: PropertyAuditReport = {
    id: 'test-crypto-report-id',
    generatedAt: '2026-10-24T12:00:00.000Z',
    property: {
      cadastralReference: '9872023VH5797S0001WX',
      address: {
        street: 'Gran Vía',
        number: '28',
        postalCode: '28013',
        municipality: 'Madrid',
        province: 'Madrid',
      },
      coordinates: { latitude: 40.42028, longitude: -3.70379, srs: 'EPSG:4326' },
      building: {
        constructionYear: 1924,
        builtSurfaceM2: 31500,
        primaryUse: 'Residencial Colectivo',
        unitsCount: 48,
        hasCommercialGroundFloor: true,
      },
    },
    neighborhood: {
      censusSectionCode: '2807901043',
      averageNetHouseholdIncomeEur: 45200,
      averageNetPersonIncomeEur: 22600,
      percentileInMunicipality: 82,
      rankingInCity: { rank: 14, totalSections: 150 },
      demographics: { medianAge: 46, singlePersonHouseholdPercentage: 42 },
    },
    environment: {
      noise: {
        dayEveningNightDecibels: 64,
        category: 'MODERATE',
        predominantSource: 'ROAD_TRAFFIC',
      },
      floodRisk: {
        level: 'NONE',
        returnPeriodYears: null,
        isInPreferentialFlowZone: false,
      },
      airQuality: {
        aqiIndex: 25,
        category: 'GOOD',
        stationName: 'Madrid Plaza del Carmen',
        no2MicrogramsM3: 20,
        pm25MicrogramsM3: 8,
        pm10MicrogramsM3: 14,
      },
    },
    connectivity: {
      walkScore15Min: 98,
      facilitiesWithin15MinCount: 42,
      nearestHealthcare: {
        id: 'cs-palma',
        name: 'Centro de Salud Palma - Universidad',
        type: 'healthcare',
        subtype: 'primary_care',
        distanceMeters: 380,
        walkTimeMinutes: 5,
      },
      nearestEducation: {
        id: 'cp-isabel',
        name: 'CEIP Isabel la Católica',
        type: 'education',
        subtype: 'school',
        distanceMeters: 450,
        walkTimeMinutes: 6,
      },
      nearestTransit: {
        id: 'metro-granvia',
        name: 'Metro Gran Vía (L1, L5)',
        type: 'transit',
        subtype: 'metro',
        distanceMeters: 50,
        walkTimeMinutes: 1,
      },
      nearestPark: {
        id: 'park-espana',
        name: 'Plaza de España',
        type: 'park',
        subtype: 'urban_park',
        distanceMeters: 650,
        walkTimeMinutes: 9,
      },
    },
    score: {
      overallScore: 84,
      subscores: {
        building: 80,
        socioeconomic: 88,
        environmental: 78,
        connectivity: 95,
        urbanPlanning: 82,
      },
      socioeconomicScore: 88,
      buildingHealthScore: 80,
      acousticComfortScore: 78,
      climateSafetyScore: 82,
      keyHighlights: ['Excelente conectividad'],
      keyRisks: [],
    },
    version: '0.4.0',
  };

  it('computes a 64-character SHA-256 hexadecimal hash string', async () => {
    const hash = await computeAuditSha256(mockReport);
    expect(hash).toBeDefined();
    expect(typeof hash).toBe('string');
    expect(hash).toHaveLength(64);
    expect(/^[0-9a-f]{64}$/.test(hash)).toBe(true);
  });

  it('computes identical hashes for identical payloads', async () => {
    const hash1 = await computeAuditSha256(mockReport);
    const hash2 = await computeAuditSha256({ ...mockReport });
    expect(hash1).toBe(hash2);
  });

  it('builds official Sede Electrónica del Catastro verification URL', () => {
    const url = buildCatastroVerificationUrl('9872023VH5797S0001WX');
    expect(url).toContain('https://www1.sedecatastro.gob.es/CYCBienInmueble/OVCListaBienes.aspx');
    expect(url).toContain('rc1=9872023');
    expect(url).toContain('rc2=VH5797S');
  });

  it('handles lowercase or spaced cadastral references properly', () => {
    const url = buildCatastroVerificationUrl('9872023 vh5797s 0001wx');
    expect(url).toContain('rc1=9872023');
    expect(url).toContain('rc2=VH5797S');
  });
});
