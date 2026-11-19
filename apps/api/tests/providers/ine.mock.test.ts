import { describe, it, expect } from 'vitest';
import { MockINEProvider } from '../../src/providers/ine.mock.js';

describe('MockINEProvider', () => {
  const provider = new MockINEProvider();

  it('retrieves seeded census tract income for Madrid Sol', async () => {
    const res = await provider.getIncomeByCensusSection('2807901001');

    expect(res.status).toBe('ok');
    expect(res.data?.censusSectionCode).toBe('2807901001');
    expect(res.data?.averageNetHouseholdIncomeEur).toBe(45200);
    expect(res.data?.percentileInMunicipality).toBe(82);
    expect(res.data?.demographics.medianAge).toBe(46);
  });

  it('retrieves high-income tract for Madrid Salamanca', async () => {
    const res = await provider.getIncomeByCensusSection('2807904001');

    expect(res.status).toBe('ok');
    expect(res.data?.percentileInMunicipality).toBe(98);
    expect(res.data?.averageNetHouseholdIncomeEur).toBe(88400);
  });

  it('deterministically synthesizes census tract income for any valid 10-digit code', async () => {
    const res1 = await provider.getIncomeByCensusSection('4109101004');
    const res2 = await provider.getIncomeByCensusSection('4109101004');

    expect(res1.status).toBe('ok');
    expect(res2.status).toBe('ok');
    expect(res1.data?.censusSectionCode).toBe('4109101004');
    expect(res1.data?.averageNetHouseholdIncomeEur).toBe(res2.data?.averageNetHouseholdIncomeEur);
    expect(res1.data?.percentileInMunicipality).toBe(res2.data?.percentileInMunicipality);
  });

  it('returns out_of_coverage for non-existent census code', async () => {
    const res = await provider.getIncomeByCensusSection('0000000000');

    expect(res.status).toBe('out_of_coverage');
    expect(res.data).toBeUndefined();
  });

  it('resolves coordinates to geographic census section or out_of_coverage for (0,0)', async () => {
    const sectionMadrid = await provider.resolveCensusSection(40.420, -3.703);
    expect(sectionMadrid.status).toBe('ok');
    expect(sectionMadrid.data).toBe('2807901001');

    const sectionBarcelona = await provider.resolveCensusSection(41.391, 2.164);
    expect(sectionBarcelona.status).toBe('ok');
    expect(sectionBarcelona.data).toBe('0801902005');

    const nullCoords = await provider.resolveCensusSection(0, 0);
    expect(nullCoords.status).toBe('out_of_coverage');
  });
});
