import { describe, it, expect, vi } from 'vitest';
import { downloadCadastralGML } from '../src/utils/gml';
import { PropertyAuditReport } from '@openbarrio/core';

// Polyfill URL.createObjectURL for JSDOM environment
if (typeof window !== 'undefined') {
  if (!window.URL.createObjectURL) {
    window.URL.createObjectURL = () => 'blob:mock-url';
  }
  if (!window.URL.revokeObjectURL) {
    window.URL.revokeObjectURL = () => {};
  }
}

describe('downloadCadastralGML Utility', () => {
  it('generates and triggers download of INSPIRE-compliant CadastralParcel GML', () => {
    // Mock document.createElement and click
    const mockClick = vi.fn();
    const mockAppendChild = vi.spyOn(document.body, 'appendChild').mockImplementation(() => null as any);
    const mockRemoveChild = vi.spyOn(document.body, 'removeChild').mockImplementation(() => null as any);

    const origCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      const el = origCreateElement(tagName);
      if (tagName === 'a') {
        el.click = mockClick;
      }
      return el;
    });

    const mockReport: PropertyAuditReport = {
      id: 'test-audit-gml',
      generatedAt: '2026-10-18T20:00:00.000Z',
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
        buildingHealthScore: 80,
        acousticComfortScore: 75,
        climateSafetyScore: 100,
        keyHighlights: ['Excelente renta media'],
        keyRisks: [],
      },
    };

    downloadCadastralGML(mockReport);

    expect(mockClick).toHaveBeenCalled();
    expect(mockAppendChild).toHaveBeenCalled();
    expect(mockRemoveChild).toHaveBeenCalled();

    mockAppendChild.mockRestore();
    mockRemoveChild.mockRestore();
  });
});
