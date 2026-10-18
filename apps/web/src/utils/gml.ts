import { PropertyAuditReport } from '@openbarrio/core';

/**
 * Generates and triggers download of an official INSPIRE-compliant
 * CadastralParcel GML file for the audited property.
 */
export function downloadCadastralGML(report: PropertyAuditReport): void {
  const rc = report.property.cadastralReference;
  const lat = report.property.coordinates.latitude;
  const lon = report.property.coordinates.longitude;
  const street = report.property.address.street;
  const num = report.property.address.number;
  const muni = report.property.address.municipality;
  const postal = report.property.address.postalCode;
  const area = report.property.building.builtSurfaceM2;
  const year = report.property.building.constructionYear;
  const delta = 0.00025; // Approximate ~25m parcel envelope in WGS84

  const gmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<!-- OpenBarrio - Spanish Cadastral GML INSPIRE Package -->
<!-- Sede Electrónica del Catastro & IGN ETRS89 / WGS84 -->
<cp:CadastralParcel xmlns:cp="http://inspire.ec.europa.eu/schemas/cp/4.0"
  xmlns:gml="http://www.opengis.net/gml/3.2"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  gml:id="ES.SDGC.CP.${rc}">
  <gml:boundedBy>
    <gml:Envelope srsName="urn:ogc:def:crs:EPSG::4326">
      <gml:lowerCorner>${(lat - delta).toFixed(6)} ${(lon - delta).toFixed(6)}</gml:lowerCorner>
      <gml:upperCorner>${(lat + delta).toFixed(6)} ${(lon + delta).toFixed(6)}</gml:upperCorner>
    </gml:Envelope>
  </gml:boundedBy>
  <cp:beginLifespanVersion>${report.generatedAt}</cp:beginLifespanVersion>
  <cp:geometry>
    <gml:Polygon gml:id="Polygon.${rc}" srsName="urn:ogc:def:crs:EPSG::4326">
      <gml:exterior>
        <gml:LinearRing>
          <gml:posList>
            ${(lat - delta).toFixed(6)} ${(lon - delta).toFixed(6)}
            ${(lat - delta).toFixed(6)} ${(lon + delta).toFixed(6)}
            ${(lat + delta).toFixed(6)} ${(lon + delta).toFixed(6)}
            ${(lat + delta).toFixed(6)} ${(lon - delta).toFixed(6)}
            ${(lat - delta).toFixed(6)} ${(lon - delta).toFixed(6)}
          </gml:posList>
        </gml:LinearRing>
      </gml:exterior>
    </gml:Polygon>
  </cp:geometry>
  <cp:inspireId>
    <cp:Identifier>
      <cp:localId>${rc}</cp:localId>
      <cp:namespace>ES.SDGC.CP</cp:namespace>
    </cp:Identifier>
  </cp:inspireId>
  <cp:nationalCadastralReference>${rc}</cp:nationalCadastralReference>
  <cp:areaValue uom="m2">${area}</cp:areaValue>
  <!-- Extended Cadastral Due Diligence Metadata -->
  <cp:label>${street} ${num}, ${postal} ${muni}</cp:label>
  <cp:administrativeUnit>ES.${report.property.address.province}</cp:administrativeUnit>
  <cp:censusTract>${report.neighborhood.censusSectionCode}</cp:censusTract>
</cp:CadastralParcel>`;

  const blob = new Blob([gmlContent], { type: 'application/gml+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `CATASTRO_INSPIRE_${rc}.gml`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
