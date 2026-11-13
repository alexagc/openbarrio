import {
  MunicipalitySummaryDTO,
  MunicipalityDetailDTO,
  slugifySpanishMunicipality,
  REGIONAL_ITP_RATES,
} from '@openbarrio/core';
import { IMunicipalityProvider } from './types.js';

export const SPANISH_MUNICIPALITIES_SEED: Array<{
  code: string;
  name: string;
  provCode: string;
  provName: string;
  ccaa: string;
  income: number;
  medianIncome: number;
  personIncome: number;
  percentile: number;
  isStressed: boolean;
  radon: string;
  sections: number;
  score: number;
  serpaviMedian?: number;
  serpaviLower?: number;
  serpaviUpper?: number;
  medianAge: number;
  singlePersonPct: number;
  sampleProperties: Array<{ refcat: string; address: string; year: number; surfaceM2: number }>;
}> = [
  {
    code: '28079',
    name: 'Madrid',
    provCode: '28',
    provName: 'Madrid',
    ccaa: 'Comunidad de Madrid',
    income: 44250,
    medianIncome: 39500,
    personIncome: 19800,
    percentile: 88,
    isStressed: false,
    radon: 'Zona I',
    sections: 2420,
    score: 84,
    serpaviMedian: 14.8,
    serpaviLower: 12.2,
    serpaviUpper: 18.5,
    medianAge: 44.1,
    singlePersonPct: 32.5,
    sampleProperties: [
      { refcat: '28079A00100001', address: 'Calle Gran Vía 32', year: 1924, surfaceM2: 145 },
      { refcat: '28079A00200002', address: 'Calle Alcalá 42', year: 1930, surfaceM2: 120 },
    ],
  },
  {
    code: '08019',
    name: 'Barcelona',
    provCode: '08',
    provName: 'Barcelona',
    ccaa: 'Cataluña',
    income: 42100,
    medianIncome: 37400,
    personIncome: 18950,
    percentile: 86,
    isStressed: true,
    radon: 'Zona 0',
    sections: 1068,
    score: 86,
    serpaviMedian: 15.2,
    serpaviLower: 12.8,
    serpaviUpper: 19.4,
    medianAge: 44.8,
    singlePersonPct: 31.2,
    sampleProperties: [
      { refcat: '08019A00100001', address: 'Passeig de Gràcia 43', year: 1906, surfaceM2: 135 },
      { refcat: '08019A00200002', address: 'Rambla de Catalunya 12', year: 1912, surfaceM2: 110 },
    ],
  },
  {
    code: '46250',
    name: 'València',
    provCode: '46',
    provName: 'Valencia',
    ccaa: 'Comunitat Valenciana',
    income: 34800,
    medianIncome: 30500,
    personIncome: 15400,
    percentile: 71,
    isStressed: false,
    radon: 'Zona 0',
    sections: 610,
    score: 80,
    serpaviMedian: 10.5,
    serpaviLower: 8.5,
    serpaviUpper: 13.0,
    medianAge: 44.5,
    singlePersonPct: 28.5,
    sampleProperties: [
      { refcat: '46250A00100001', address: 'Carrer de Colón 20', year: 1945, surfaceM2: 105 },
    ],
  },
  {
    code: '41091',
    name: 'Sevilla',
    provCode: '41',
    provName: 'Sevilla',
    ccaa: 'Andalucía',
    income: 33200,
    medianIncome: 29100,
    personIncome: 14600,
    percentile: 65,
    isStressed: false,
    radon: 'Zona 0',
    sections: 520,
    score: 79,
    serpaviMedian: 9.8,
    serpaviLower: 7.9,
    serpaviUpper: 12.4,
    medianAge: 43.6,
    singlePersonPct: 27.8,
    sampleProperties: [
      { refcat: '41091A00100001', address: 'Avenida de la Constitución 15', year: 1929, surfaceM2: 115 },
    ],
  },
  {
    code: '50297',
    name: 'Zaragoza',
    provCode: '50',
    provName: 'Zaragoza',
    ccaa: 'Aragón',
    income: 36500,
    medianIncome: 32400,
    personIncome: 16200,
    percentile: 74,
    isStressed: false,
    radon: 'Zona 0',
    sections: 512,
    score: 81,
    serpaviMedian: 9.4,
    serpaviLower: 7.6,
    serpaviUpper: 11.8,
    medianAge: 45.2,
    singlePersonPct: 29.1,
    sampleProperties: [
      { refcat: '50297A00100001', address: 'Paseo de la Independencia 8', year: 1950, surfaceM2: 125 },
    ],
  },
  {
    code: '29067',
    name: 'Málaga',
    provCode: '29',
    provName: 'Málaga',
    ccaa: 'Andalucía',
    income: 32900,
    medianIncome: 28800,
    personIncome: 14300,
    percentile: 64,
    isStressed: false,
    radon: 'Zona 0',
    sections: 430,
    score: 78,
    serpaviMedian: 12.2,
    serpaviLower: 9.9,
    serpaviUpper: 15.5,
    medianAge: 43.8,
    singlePersonPct: 26.9,
    sampleProperties: [
      { refcat: '29067A00100001', address: 'Calle Marqués de Larios 5', year: 1920, surfaceM2: 130 },
    ],
  },
  {
    code: '48020',
    name: 'Bilbao',
    provCode: '48',
    provName: 'Bizkaia',
    ccaa: 'País Vasco',
    income: 43800,
    medianIncome: 38900,
    personIncome: 19400,
    percentile: 87,
    isStressed: false,
    radon: 'Zona 0',
    sections: 290,
    score: 85,
    serpaviMedian: 13.8,
    serpaviLower: 11.2,
    serpaviUpper: 17.0,
    medianAge: 46.5,
    singlePersonPct: 33.1,
    sampleProperties: [
      { refcat: '48020A00100001', address: 'Gran Vía de Don Diego López de Haro 25', year: 1935, surfaceM2: 140 },
    ],
  },
  {
    code: '07040',
    name: 'Palma',
    provCode: '07',
    provName: 'Illes Balears',
    ccaa: 'Illes Balears',
    income: 37400,
    medianIncome: 33100,
    personIncome: 16500,
    percentile: 75,
    isStressed: false,
    radon: 'Zona 0',
    sections: 310,
    score: 81,
    serpaviMedian: 14.5,
    serpaviLower: 11.8,
    serpaviUpper: 18.2,
    medianAge: 43.1,
    singlePersonPct: 29.5,
    sampleProperties: [
      { refcat: '07040A00100001', address: 'Passeig des Born 10', year: 1928, surfaceM2: 120 },
    ],
  },
  {
    code: '35016',
    name: 'Las Palmas de Gran Canaria',
    provCode: '35',
    provName: 'Las Palmas',
    ccaa: 'Canarias',
    income: 31800,
    medianIncome: 27900,
    personIncome: 13900,
    percentile: 60,
    isStressed: false,
    radon: 'Zona 0',
    sections: 285,
    score: 77,
    serpaviMedian: 11.0,
    serpaviLower: 8.9,
    serpaviUpper: 14.0,
    medianAge: 44.0,
    singlePersonPct: 27.2,
    sampleProperties: [
      { refcat: '35016A00100001', address: 'Calle Mayor de Triana 30', year: 1932, surfaceM2: 115 },
    ],
  },
  {
    code: '03014',
    name: 'Alicante / Alacant',
    provCode: '03',
    provName: 'Alicante',
    ccaa: 'Comunitat Valenciana',
    income: 33600,
    medianIncome: 29400,
    personIncome: 14800,
    percentile: 67,
    isStressed: false,
    radon: 'Zona 0',
    sections: 260,
    score: 79,
    serpaviMedian: 10.2,
    serpaviLower: 8.2,
    serpaviUpper: 12.9,
    medianAge: 44.7,
    singlePersonPct: 28.1,
    sampleProperties: [
      { refcat: '03014A00100001', address: 'Rambla Méndez Núñez 18', year: 1940, surfaceM2: 110 },
    ],
  },
  {
    code: '47186',
    name: 'Valladolid',
    provCode: '47',
    provName: 'Valladolid',
    ccaa: 'Castilla y León',
    income: 36200,
    medianIncome: 32000,
    personIncome: 16100,
    percentile: 73,
    isStressed: false,
    radon: 'Zona 0',
    sections: 245,
    score: 82,
    serpaviMedian: 8.9,
    serpaviLower: 7.2,
    serpaviUpper: 11.1,
    medianAge: 46.8,
    singlePersonPct: 31.0,
    sampleProperties: [
      { refcat: '47186A00100001', address: 'Calle Santiago 14', year: 1952, surfaceM2: 118 },
    ],
  },
  {
    code: '36057',
    name: 'Vigo',
    provCode: '36',
    provName: 'Pontevedra',
    ccaa: 'Galicia',
    income: 35100,
    medianIncome: 30900,
    personIncome: 15500,
    percentile: 72,
    isStressed: false,
    radon: 'Zona II',
    sections: 235,
    score: 80,
    serpaviMedian: 9.6,
    serpaviLower: 7.8,
    serpaviUpper: 12.1,
    medianAge: 46.2,
    singlePersonPct: 29.4,
    sampleProperties: [
      { refcat: '36057A00100001', address: 'Rúa do Príncipe 22', year: 1948, surfaceM2: 112 },
    ],
  },
  {
    code: '20069',
    name: 'Donostia / San Sebastián',
    provCode: '20',
    provName: 'Gipuzkoa',
    ccaa: 'País Vasco',
    income: 46800,
    medianIncome: 41500,
    personIncome: 20800,
    percentile: 92,
    isStressed: false,
    radon: 'Zona 0',
    sections: 155,
    score: 88,
    serpaviMedian: 16.5,
    serpaviLower: 13.5,
    serpaviUpper: 21.0,
    medianAge: 47.1,
    singlePersonPct: 34.2,
    sampleProperties: [
      { refcat: '20069A00100001', address: 'Paseo de la Concha 8', year: 1918, surfaceM2: 150 },
    ],
  },
  {
    code: '31201',
    name: 'Pamplona / Iruña',
    provCode: '31',
    provName: 'Navarra',
    ccaa: 'Comunidad Foral de Navarra',
    income: 42800,
    medianIncome: 37900,
    personIncome: 18900,
    percentile: 85,
    isStressed: false,
    radon: 'Zona 0',
    sections: 160,
    score: 85,
    serpaviMedian: 11.8,
    serpaviLower: 9.6,
    serpaviUpper: 14.8,
    medianAge: 44.9,
    singlePersonPct: 30.8,
    sampleProperties: [
      { refcat: '31201A00100001', address: 'Plaza del Castillo 1', year: 1930, surfaceM2: 130 },
    ],
  },
  {
    code: '01059',
    name: 'Vitoria-Gasteiz',
    provCode: '01',
    provName: 'Araba',
    ccaa: 'País Vasco',
    income: 43200,
    medianIncome: 38200,
    personIncome: 19100,
    percentile: 86,
    isStressed: false,
    radon: 'Zona 0',
    sections: 190,
    score: 86,
    serpaviMedian: 11.5,
    serpaviLower: 9.4,
    serpaviUpper: 14.3,
    medianAge: 44.6,
    singlePersonPct: 31.5,
    sampleProperties: [
      { refcat: '01059A00100001', address: 'Plaza de la Virgen Blanca 4', year: 1925, surfaceM2: 125 },
    ],
  },
  {
    code: '28068',
    name: 'Guadarrama',
    provCode: '28',
    provName: 'Madrid',
    ccaa: 'Comunidad de Madrid',
    income: 38900,
    medianIncome: 34500,
    personIncome: 17200,
    percentile: 79,
    isStressed: false,
    radon: 'Zona II',
    sections: 12,
    score: 79,
    serpaviMedian: 9.5,
    serpaviLower: 7.8,
    serpaviUpper: 11.9,
    medianAge: 43.5,
    singlePersonPct: 24.2,
    sampleProperties: [
      { refcat: '28068A00100001', address: 'Calle Alfonso Senra 12', year: 1978, surfaceM2: 95 },
    ],
  },
];

export class MockMunicipalityProvider implements IMunicipalityProvider {
  private readonly items = SPANISH_MUNICIPALITIES_SEED;

  async listMunicipalities(params?: {
    query?: string;
    province?: string;
    page?: number;
    limit?: number;
  }): Promise<{ items: MunicipalitySummaryDTO[]; total: number; page: number; limit: number }> {
    let filtered = [...this.items];

    if (params?.province) {
      filtered = filtered.filter(
        (m) =>
          m.provCode === params.province ||
          m.provName.toLowerCase() === params.province?.toLowerCase()
      );
    }

    if (params?.query) {
      const q = params.query.toLowerCase().trim();
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.code.includes(q) ||
          m.provName.toLowerCase().includes(q)
      );
    }

    const page = Math.max(1, params?.page || 1);
    const limit = Math.max(1, Math.min(100, params?.limit || 20));
    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    const summaries: MunicipalitySummaryDTO[] = paginated.map((m) => ({
      code: m.code,
      name: m.name,
      slug: slugifySpanishMunicipality(m.name),
      provinceCode: m.provCode,
      provinceName: m.provName,
      autonomousCommunity: m.ccaa,
      averageHouseholdIncomeEur: m.income,
      percentileNational: m.percentile,
      isStressedMarket: m.isStressed,
      radonZone: m.radon,
      totalCensusSections: m.sections,
      estimatedBarrioScore: m.score,
    }));

    return {
      items: summaries,
      total,
      page,
      limit,
    };
  }

  async getBySlugOrCode(slugOrCode: string): Promise<MunicipalityDetailDTO> {
    const term = slugOrCode.toLowerCase().trim();
    const found = this.items.find(
      (m) =>
        m.code === term ||
        slugifySpanishMunicipality(m.name) === term ||
        m.name.toLowerCase() === term
    );

    if (!found) {
      // Fallback synthesis for any unknown municipality code
      const provCode = term.length === 5 ? term.slice(0, 2) : '28';
      const itp = REGIONAL_ITP_RATES[provCode]?.ratePct || 8.0;
      const ccaa = REGIONAL_ITP_RATES[provCode]?.community || 'España';

      return {
        code: term.length === 5 ? term : '00000',
        name: term.charAt(0).toUpperCase() + term.slice(1),
        slug: slugifySpanishMunicipality(term),
        provinceCode: provCode,
        provinceName: ccaa,
        autonomousCommunity: ccaa,
        averageHouseholdIncomeEur: 33000,
        medianHouseholdIncomeEur: 29000,
        averagePersonIncomeEur: 14500,
        percentileNational: 65,
        isStressedMarket: false,
        serpaviMedianEurM2: 10.0,
        serpaviRangeEurM2: { lower: 8.0, upper: 12.5 },
        radonZone: 'Zona 0',
        totalCensusSections: 25,
        medianAge: 44.0,
        singlePersonHouseholdPct: 28.0,
        estimatedBarrioScore: 80,
        sampleProperties: [],
        itpGeneralRatePct: itp,
        updatedAt: new Date().toISOString(),
      };
    }

    const itp = REGIONAL_ITP_RATES[found.provCode]?.ratePct || 8.0;

    return {
      code: found.code,
      name: found.name,
      slug: slugifySpanishMunicipality(found.name),
      provinceCode: found.provCode,
      provinceName: found.provName,
      autonomousCommunity: found.ccaa,
      averageHouseholdIncomeEur: found.income,
      medianHouseholdIncomeEur: found.medianIncome,
      averagePersonIncomeEur: found.personIncome,
      percentileNational: found.percentile,
      isStressedMarket: found.isStressed,
      serpaviMedianEurM2: found.serpaviMedian,
      serpaviRangeEurM2:
        found.serpaviLower && found.serpaviUpper
          ? { lower: found.serpaviLower, upper: found.serpaviUpper }
          : undefined,
      radonZone: found.radon,
      totalCensusSections: found.sections,
      medianAge: found.medianAge,
      singlePersonHouseholdPct: found.singlePersonPct,
      estimatedBarrioScore: found.score,
      sampleProperties: found.sampleProperties,
      itpGeneralRatePct: itp,
      updatedAt: new Date().toISOString(),
    };
  }
}
