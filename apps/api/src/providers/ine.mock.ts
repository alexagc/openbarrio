import { CensusTractIncome } from '@openbarrio/core';
import { IINEProvider } from './types.js';
import { CensusTractNotFoundError } from '../errors/problem-details.js';

export class MockINEProvider implements IINEProvider {
  private readonly tracts: Map<string, CensusTractIncome> = new Map();

  constructor() {
    this.seedDefaults();
  }

  private seedDefaults(): void {
    const defaultTracts: CensusTractIncome[] = [
      {
        censusSectionCode: '2807901001', // Madrid Centro - Sol
        averageNetHouseholdIncomeEur: 45200,
        averageNetPersonIncomeEur: 21300,
        percentileInMunicipality: 82,
        rankingInCity: { rank: 440, totalSections: 2450 },
        demographics: { medianAge: 46, singlePersonHouseholdPercentage: 42 },
      },
      {
        censusSectionCode: '2807904001', // Madrid Salamanca - Recoletos
        averageNetHouseholdIncomeEur: 88400,
        averageNetPersonIncomeEur: 39100,
        percentileInMunicipality: 98,
        rankingInCity: { rank: 48, totalSections: 2450 },
        demographics: { medianAge: 49, singlePersonHouseholdPercentage: 35 },
      },
      {
        censusSectionCode: '2807913010', // Madrid Puente de Vallecas
        averageNetHouseholdIncomeEur: 22100,
        averageNetPersonIncomeEur: 9400,
        percentileInMunicipality: 18,
        rankingInCity: { rank: 2010, totalSections: 2450 },
        demographics: { medianAge: 41, singlePersonHouseholdPercentage: 24 },
      },
      {
        censusSectionCode: '0801902005', // Barcelona Eixample
        averageNetHouseholdIncomeEur: 54600,
        averageNetPersonIncomeEur: 26800,
        percentileInMunicipality: 89,
        rankingInCity: { rank: 118, totalSections: 1068 },
        demographics: { medianAge: 47, singlePersonHouseholdPercentage: 38 },
      },
      {
        censusSectionCode: '4625001002', // València Ciutat Vella
        averageNetHouseholdIncomeEur: 39500,
        averageNetPersonIncomeEur: 19200,
        percentileInMunicipality: 74,
        rankingInCity: { rank: 156, totalSections: 600 },
        demographics: { medianAge: 45, singlePersonHouseholdPercentage: 39 },
      },
    ];

    for (const tract of defaultTracts) {
      this.tracts.set(tract.censusSectionCode, tract);
    }
  }

  async getIncomeByCensusSection(censusSectionCode: string): Promise<CensusTractIncome> {
    const code = censusSectionCode.trim();

    if (code.startsWith('00000') || code.includes('NOTFOUND')) {
      throw new CensusTractNotFoundError(code);
    }

    const existing = this.tracts.get(code);
    if (existing) {
      return existing;
    }

    // Deterministic simulation based on 10-digit section code
    let hash = 0;
    for (let i = 0; i < code.length; i++) {
      hash = (hash * 31 + code.charCodeAt(i)) & 0xffffff;
    }

    const percentile = (hash % 90) + 5; // 5 - 95
    const householdIncome = 18000 + Math.round((percentile / 100) * 45000);
    const personIncome = Math.round(householdIncome / 2.3);

    return {
      censusSectionCode: code,
      averageNetHouseholdIncomeEur: householdIncome,
      averageNetPersonIncomeEur: personIncome,
      percentileInMunicipality: percentile,
      rankingInCity: {
        rank: Math.max(1, Math.round(((100 - percentile) / 100) * 1200)),
        totalSections: 1200,
      },
      demographics: {
        medianAge: 38 + (hash % 16),
        singlePersonHouseholdPercentage: 20 + (hash % 25),
      },
    };
  }

  async resolveCensusSection(
    latitude: number,
    longitude: number,
    provinceCode = '28',
    municipalityCode = '079'
  ): Promise<string> {
    // Madrid geographic proximity
    if (Math.abs(latitude - 40.42) < 0.2 && Math.abs(longitude - -3.70) < 0.2) {
      return '2807901001';
    }

    // Barcelona geographic proximity
    if (Math.abs(latitude - 41.39) < 0.2 && Math.abs(longitude - 2.16) < 0.2) {
      return '0801902005';
    }

    // Valencia geographic proximity
    if (Math.abs(latitude - 39.47) < 0.2 && Math.abs(longitude - -0.37) < 0.2) {
      return '4625001002';
    }

    const prov = provinceCode.padStart(2, '0').slice(0, 2);
    const mun = municipalityCode.padStart(3, '0').slice(0, 3);
    const dist = '01';
    const sec = '001';

    return `${prov}${mun}${dist}${sec}`;
  }
}
