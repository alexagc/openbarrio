import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  parseCatastroCoordinatesXml,
  parseCatastroDnprcXml,
  parseCatastroCpmrcXml,
  isMultiUnitParcelXml,
  parseMultiUnitParcelSummary,
  extractConstructionYear,
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

  it('identifies multi-unit parcel responses (horizontal division) vs single unit', () => {
    const multiUnitXml = `
      <consulta_dnp xmlns="http://www.catastro.meh.es/">
        <control><cudnp>29</cudnp></control>
        <lrcdnp>
          <rcdnp>
            <rc><pc1>0548203</pc1><pc2>VK4704H</pc2><car>0002</car><cc1>H</cc1><cc2>X</cc2></rc>
            <dt><np>MADRID</np><nm>MADRID</nm><locs><lous><lourb><dir><tv>CL</tv><nv>VALVERDE</nv><pnp>1</pnp></dir></lourb></lous></dt>
          </rcdnp>
        </lrcdnp>
      </consulta_dnp>
    `;

    expect(isMultiUnitParcelXml(multiUnitXml)).toBe(true);
    expect(isMultiUnitParcelXml(dnprcXml)).toBe(false);

    const summary = parseMultiUnitParcelSummary(multiUnitXml);
    expect(summary.totalUnits).toBe(29);
    expect(summary.primaryUnitRef).toBe('0548203VK4704H0002HX');
  });

  it('accurately extracts construction year from debi, de, and dfcons without defaulting to 1975', () => {
    const xmlWithDebiAnt = `<debi><luso>Residencial</luso><sfc>143</sfc><ant>2022</ant></debi>`;
    expect(extractConstructionYear(xmlWithDebiAnt)).toBe(2022);

    const xmlWithDeAnt = `<de><ant>1924</ant></de>`;
    expect(extractConstructionYear(xmlWithDeAnt)).toBe(1924);

    const xmlWithDfconsAnt = `<cons><dfcons><stl>120</stl><ant>1986</ant></dfcons></cons>`;
    expect(extractConstructionYear(xmlWithDfconsAnt)).toBe(1986);

    const rusticNoAntXml = `<debi><luso>Agrario</luso><sfc>0</sfc></debi>`;
    expect(extractConstructionYear(rusticNoAntXml)).toBeNull();
  });

  it('accurately parses unit XML with metadata and computes building surface from participation coefficient', () => {
    const unitXml = `
      <consulta_dnp xmlns="http://www.catastro.meh.es/">
        <bico>
          <bi>
            <idbi><rc><pc1>0548203</pc1><pc2>VK4704H</pc2><car>0002</car><cc1>H</cc1><cc2>X</cc2></rc></idbi>
            <dt>
              <np>MADRID</np>
              <nm>MADRID</nm>
              <locs><lous><lourb><dir><tv>CL</tv><nv>VALVERDE</nv><pnp>1</pnp></dir><dp>28004</dp></lourb></lous></dt>
            </dt>
            <ldt>CL VALVERDE 1 28004 MADRID (MADRID)</ldt>
            <debi>
              <luso>Residencial</luso>
              <sfc>143</sfc>
              <cpt>2,580000</cpt>
              <ant>2022</ant>
            </debi>
          </bi>
        </bico>
      </consulta_dnp>
    `;

    // Querying by 14-char parcel code should compute total building surface from participation coefficient
    const propParcel = parseCatastroDnprcXml(unitXml, '0548203VK4704H', undefined, {
      unitsCount: 29,
      hasCommercialGroundFloor: true,
    });

    expect(propParcel.cadastralReference).toBe('0548203VK4704H');
    expect(propParcel.building.constructionYear).toBe(2022);
    expect(propParcel.building.unitsCount).toBe(29);
    expect(propParcel.building.builtSurfaceM2).toBe(5543); // 143 / 0.0258 ≈ 5543 m²
    expect(propParcel.building.hasCommercialGroundFloor).toBe(true);

    // Querying by 20-char unit code should retain the unit's exact surface
    const propUnit = parseCatastroDnprcXml(unitXml, '0548203VK4704H0002HX');
    expect(propUnit.cadastralReference).toBe('0548203VK4704H0002HX');
    expect(propUnit.building.constructionYear).toBe(2022);
    expect(propUnit.building.builtSurfaceM2).toBe(143);
  });

  it('throws CadastralNotFoundError when Catastro returns error XML', () => {
    expect(() => parseCatastroDnprcXml(notFoundXml, 'INVALID_REF')).toThrow(
      CadastralNotFoundError
    );
  });
});
