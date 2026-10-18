import { describe, it, expect } from 'vitest';
import { MockINEProvider } from '../../src/providers/ine.mock.js';
import { CensusTractNotFoundError } from '../../src/errors/problem-details.js';

describe('MockINEProvider', () => {
  const provider = new MockINEProvider();

  it('retrieves seeded census tract income for Madrid Sol', async () => {
    const tract = await provider.getIncomeByCensusSection('2807901001');

    expect(tract.censusSectionCode).toBe('2807901001');
    expect(tract.averageNetHouseholdIncomeEur).toBe(45200);
    expect(tract.percentileInMunicipality).toBe(82);
    expect(tract.demographics.medianAge).toBe(46);
  });

  it('retrieves high-income tract for Madrid Salamanca', async () => {
    const tract = await provider.getIncomeByCensusSection('2807904001');

    expect(tract.percentileInMunicipality).toBe(98);
    expect(tract.averageNetHouseholdIncomeEur).toBe(88400);
  });

  it('deterministically synthesizes census tract income for any valid 10-digit code', async () => {
    const tract1 = await provider.getIncomeByCensusSection('4109101004');
    const tract2 = await provider.getIncomeByCensusSection('4109101004');

    expect(tract1.censusSectionCode).toBe('4109101004');
    expect(tract1.averageNetHouseholdIncomeEur).toBe(tract2.averageNetHouseholdIncomeEur);
    expect(tract1.percentileInMunicipality).toBe(tract2.percentileInMunicipality);
  });

  it('throws CensusTractNotFoundError for non-existent census code', async () => {
    await expect(provider.getIncomeByCensusSection('0000000000')).rejects.toThrow(
      CensusTractNotFoundError
    );
  });

  it('resolves coordinates to geographic census section', async () => {
    const sectionMadrid = await provider.resolveCensusSection(40.420, -3.703);
    expect(sectionMadrid).toBe('2807901001');

    const sectionBarcelona = await provider.resolveCensusSection(41.391, 2.164);
    expect(sectionBarcelona).toBe('0801902005');
  });
});
