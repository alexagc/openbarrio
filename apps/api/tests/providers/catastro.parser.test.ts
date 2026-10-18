import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  parseCatastroCoordinatesXml,
  parseCatastroDnprcXml,
} from '../../src/providers/catastro.parser.js';
import { CadastralNotFoundError } from '../../src/errors/problem-details.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('Catastro XML Parser', () => {
  const fixturesDir = join(__dirname, '../fixtures');
  const coordsXml = readFileSync(join(fixturesDir, 'catastro-coordinates.xml'), 'utf-8');
  const dnprcXml = readFileSync(join(fixturesDir, 'catastro-dnprc.xml'), 'utf-8');
  const notFoundXml = readFileSync(join(fixturesDir, 'catastro-not-found.xml'), 'utf-8');

  it('correctly parses coordinates XML to extract cadastral parcel reference and geocoding', () => {
    const result = parseCatastroCoordinatesXml(coordsXml);

    expect(result.cadastralReference).toBe('9872023VH5797S');
    expect(result.addressStr).toContain('GRAN VIA 28');
    expect(result.latitude).toBeCloseTo(40.42028, 4);
    expect(result.longitude).toBeCloseTo(-3.70379, 4);
  });

  it('correctly parses DNPRC XML to extract building attributes and horizontal division', () => {
    const property = parseCatastroDnprcXml(dnprcXml, '9872023VH5797S0001WX');

    expect(property.cadastralReference).toBe('9872023VH5797S0001WX');
    expect(property.address.street).toBe('CL GRAN VIA');
    expect(property.address.number).toBe('28');
    expect(property.address.postalCode).toBe('28013');
    expect(property.address.municipality).toBe('MADRID');
    expect(property.building.constructionYear).toBe(1924);
    expect(property.building.builtSurfaceM2).toBe(31500);
    expect(property.building.primaryUse).toBe('Comercial');
    expect(property.building.unitsCount).toBe(2);
    expect(property.building.hasCommercialGroundFloor).toBe(true);
  });

  it('throws CadastralNotFoundError when Catastro returns error XML', () => {
    expect(() => parseCatastroDnprcXml(notFoundXml, 'INVALID_REF')).toThrow(
      CadastralNotFoundError
    );
  });
});
