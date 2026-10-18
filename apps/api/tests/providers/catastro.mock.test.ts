import { describe, it, expect } from 'vitest';
import { MockCatastroProvider } from '../../src/providers/catastro.mock.js';
import { CadastralNotFoundError } from '../../src/errors/problem-details.js';

describe('MockCatastroProvider', () => {
  const provider = new MockCatastroProvider();

  it('retrieves seeded property by exact cadastral reference', async () => {
    const prop = await provider.getByCadastralReference('9872023VH5797S0001WX');

    expect(prop.cadastralReference).toBe('9872023VH5797S0001WX');
    expect(prop.address.street).toBe('Calle Gran Vía');
    expect(prop.address.number).toBe('28');
    expect(prop.building.constructionYear).toBe(1924);
  });

  it('retrieves seeded property by 14-character parcel prefix', async () => {
    const prop = await provider.getByCadastralReference('9872023VH5797S');

    expect(prop.cadastralReference).toBe('9872023VH5797S0001WX');
    expect(prop.address.street).toBe('Calle Gran Vía');
  });

  it('retrieves property by coordinates matching Madrid center', async () => {
    const prop = await provider.getByCoordinates(40.42028, -3.70379);

    expect(prop.address.municipality).toBe('Madrid');
    expect(prop.coordinates.latitude).toBeCloseTo(40.42028, 4);
    expect(prop.coordinates.longitude).toBeCloseTo(-3.70379, 4);
  });

  it('generates consistent deterministic property for unknown Spanish coordinates', async () => {
    const prop1 = await provider.getByCoordinates(36.7213, -4.4214); // Málaga
    const prop2 = await provider.getByCoordinates(36.7213, -4.4214);

    expect(prop1.cadastralReference).toBe(prop2.cadastralReference);
    expect(prop1.building.constructionYear).toBe(prop2.building.constructionYear);
  });

  it('throws CadastralNotFoundError for null island coordinates [0, 0]', async () => {
    await expect(provider.getByCoordinates(0, 0)).rejects.toThrow(CadastralNotFoundError);
  });

  it('throws CadastralNotFoundError for explicitly non-existent cadastral reference', async () => {
    await expect(provider.getByCadastralReference('00000000000000')).rejects.toThrow(
      CadastralNotFoundError
    );
  });
});
