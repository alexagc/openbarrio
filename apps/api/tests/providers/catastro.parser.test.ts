import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  parseCatastroCoordinatesXml,
  parseCatastroDnprcXml,
  parseCatastroCpmrcXml,
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

  it('correctly parses portal numbers with letters, suffixes, and extensions (e.g. 25 B)', () => {
    const xmlWithLetter = `
      <consulta_dnp xmlns="http://www.catastro.meh.es/">
        <bico>
          <bi>
            <idbi><rc><pc1>0177207</pc1><pc2>VK6907N</pc2><car>0001</car><cc1>X</cc1><cc2>X</cc2></rc></idbi>
            <dt>
              <np>MADRID</np>
              <nm>VALDEOLMOS-ALALPARDO</nm>
              <locs>
                <lous>
                  <lourb>
                    <dir>
                      <tv>CL</tv>
                      <nv>ALCALA</nv>
                      <pnp>25</pnp>
                      <plp>B</plp>
                    </dir>
                    <dp>28130</dp>
                  </lourb>
                </lous>
              </locs>
            </dt>
            <ldt>CL ALCALA 25(B) 28130 VALDEOLMOS-ALALPARDO</ldt>
            <debi><luso>Residencial</luso><sfc>120</sfc><ant>1998</ant></debi>
          </bi>
        </bico>
      </consulta_dnp>
    `;

    const prop = parseCatastroDnprcXml(xmlWithLetter, '0177207VK6907N0001XX');
    expect(prop.address.number).toBe('25 B');
    expect(prop.address.postalCode).toBe('28130');
    expect(prop.address.municipality).toBe('VALDEOLMOS-ALALPARDO');
  });

  it('correctly parses CPMRC XML to extract exact coordinates by cadastral reference', () => {
    const cpmrcXml = `
      <consulta_coordenadas xmlns="http://www.catastro.meh.es/">
        <coordenadas>
          <coord>
            <pc><pc1>0177207</pc1><pc2>VK6907N</pc2></pc>
            <geo><xcen>-3.472068</xcen><ycen>40.625864</ycen><srs>EPSG:4326</srs></geo>
            <ldt>CL ALCALA 25(B) VALDEOLMOS-ALALPARDO (MADRID)</ldt>
          </coord>
        </coordenadas>
      </consulta_coordenadas>
    `;

    const parsed = parseCatastroCpmrcXml(cpmrcXml);
    expect(parsed).not.toBeNull();
    expect(parsed?.latitude).toBeCloseTo(40.625864, 5);
    expect(parsed?.longitude).toBeCloseTo(-3.472068, 5);
    expect(parsed?.cadastralReference).toBe('0177207VK6907N');
  });

  it('throws CadastralNotFoundError when Catastro returns error XML', () => {
    expect(() => parseCatastroDnprcXml(notFoundXml, 'INVALID_REF')).toThrow(
      CadastralNotFoundError
    );
  });
});
