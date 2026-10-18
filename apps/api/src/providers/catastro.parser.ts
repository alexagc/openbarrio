import { CadastralProperty } from '@openbarrio/core';
import { CadastralNotFoundError } from '../errors/problem-details.js';

function extractTag(xml: string, tag: string): string | null {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const match = xml.match(regex);
  return match ? match[1].trim() : null;
}

function extractAllTags(xml: string, tag: string): string[] {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'gi');
  const matches: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = regex.exec(xml)) !== null) {
    matches.push(match[1].trim());
  }
  return matches;
}

export function parseCatastroCoordinatesXml(xml: string): {
  cadastralReference: string;
  addressStr: string;
  latitude: number;
  longitude: number;
} {
  const errDes = extractTag(xml, 'des');
  if (errDes) {
    throw new CadastralNotFoundError(errDes);
  }

  const pc1 = extractTag(xml, 'pc1');
  const pc2 = extractTag(xml, 'pc2');
  if (!pc1 || !pc2) {
    throw new CadastralNotFoundError('Coordinates produced no cadastral match');
  }

  const cadastralReference = `${pc1}${pc2}`;
  const addressStr = extractTag(xml, 'ldt') || '';
  const xcen = parseFloat(extractTag(xml, 'xcen') || '0');
  const ycen = parseFloat(extractTag(xml, 'ycen') || '0');

  return {
    cadastralReference,
    addressStr,
    latitude: ycen,
    longitude: xcen,
  };
}

export function parseCatastroDnprcXml(
  xml: string,
  queriedRefcat: string,
  fallbackCoords?: { latitude: number; longitude: number }
): CadastralProperty {
  const errDes = extractTag(xml, 'des');
  if (errDes) {
    throw new CadastralNotFoundError(queriedRefcat);
  }

  const pc1 = extractTag(xml, 'pc1') || '';
  const pc2 = extractTag(xml, 'pc2') || '';
  const car = extractTag(xml, 'car') || '';
  const cc1 = extractTag(xml, 'cc1') || '';
  const cc2 = extractTag(xml, 'cc2') || '';

  const fullRc = pc1 && pc2 ? `${pc1}${pc2}${car}${cc1}${cc2}` : queriedRefcat;

  // Address
  const tv = extractTag(xml, 'tv') || 'CL';
  const nv = extractTag(xml, 'nv') || '';
  const pnp = extractTag(xml, 'pnp') || '';
  const street = nv ? `${tv} ${nv}`.trim() : (extractTag(xml, 'ldt') || 'Calle Principal');
  const postalCode = extractTag(xml, 'cp') || '28001';
  const municipality = extractTag(xml, 'nm') || 'Madrid';
  const province = extractTag(xml, 'np') || 'Madrid';

  // Coordinates
  const xcen = parseFloat(extractTag(xml, 'xcen') || '0');
  const ycen = parseFloat(extractTag(xml, 'ycen') || '0');
  const latitude = ycen !== 0 ? ycen : fallbackCoords?.latitude || 40.4168;
  const longitude = xcen !== 0 ? xcen : fallbackCoords?.longitude || -3.7038;

  // Building
  const antStr = extractTag(xml, 'ant');
  const constructionYear = antStr ? parseInt(antStr, 10) : 1975;
  const supStr = extractTag(xml, 'sup');
  const builtSurfaceM2 = supStr ? parseInt(supStr, 10) : 100;
  const primaryUse = extractTag(xml, 'uso') || 'Residencial';

  // Units count in horizontal division
  const consList = extractAllTags(xml, 'cons');
  const unitsCount = consList.length > 0 ? consList.length : 1;

  // Check if commercial ground floor exists
  const hasCommercialGroundFloor =
    primaryUse.toLowerCase().includes('comercial') ||
    consList.some((c) => c.toLowerCase().includes('comercial'));

  return {
    cadastralReference: fullRc,
    address: {
      street,
      number: pnp || '1',
      postalCode,
      municipality,
      province,
    },
    coordinates: {
      latitude,
      longitude,
      srs: 'EPSG:4326',
    },
    building: {
      constructionYear: isNaN(constructionYear) ? 1975 : constructionYear,
      builtSurfaceM2: isNaN(builtSurfaceM2) ? 100 : builtSurfaceM2,
      primaryUse,
      unitsCount,
      hasCommercialGroundFloor,
    },
  };
}
