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
    // Madrid Gran Vía / Sol landmark
    if (Math.abs(latitude - 40.420) < 0.005 && Math.abs(longitude - -3.703) < 0.005) {
      return '2807901001';
    }

    // Madrid Salamanca landmark
    if (Math.abs(latitude - 40.425) < 0.008 && Math.abs(longitude - -3.685) < 0.008) {
      return '2807904001';
    }

    // Madrid Vallecas landmark
    if (Math.abs(latitude - 40.392) < 0.008 && Math.abs(longitude - -3.665) < 0.008) {
      return '2807913010';
    }

    // Barcelona Eixample landmark
    if (Math.abs(latitude - 41.391) < 0.005 && Math.abs(longitude - 2.164) < 0.005) {
      return '0801902005';
    }

    // Valencia Ciutat Vella landmark
    if (Math.abs(latitude - 39.4699) < 0.005 && Math.abs(longitude - -0.3735) < 0.005) {
      return '4625001002';
    }

    const prov = provinceCode.padStart(2, '0').slice(0, 2);
    const mun = municipalityCode.padStart(3, '0').slice(0, 3);
    const latHash = (Math.abs(Math.round(latitude * 500)) % 15) + 1;
    const lonHash = (Math.abs(Math.round(longitude * 500)) % 50) + 1;
    const dist = String(latHash).padStart(2, '0');
    const sec = String(lonHash).padStart(3, '0');

    return `${prov}${mun}${dist}${sec}`;
  }
}
