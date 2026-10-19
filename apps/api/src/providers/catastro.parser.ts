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

export function parseCatastroCpmrcXml(xml: string): {
  latitude: number;
  longitude: number;
  cadastralReference?: string;
  addressStr?: string;
} | null {
  const errDes = extractTag(xml, 'des');
  if (errDes) {
    return null;
  }

  const xcenStr = extractTag(xml, 'xcen');
  const ycenStr = extractTag(xml, 'ycen');
  if (!xcenStr || !ycenStr) {
    return null;
  }

  const lon = parseFloat(xcenStr);
  const lat = parseFloat(ycenStr);
  if (isNaN(lat) || isNaN(lon) || (lat === 0 && lon === 0)) {
    return null;
  }

  const pc1 = extractTag(xml, 'pc1') || '';
  const pc2 = extractTag(xml, 'pc2') || '';
  const cadastralReference = pc1 && pc2 ? `${pc1}${pc2}` : undefined;
  const addressStr = extractTag(xml, 'ldt') || undefined;

  return {
    latitude: lat,
    longitude: lon,
    cadastralReference,
    addressStr,
  };
}

export interface CatastroDnprcMetadata {
  unitsCount?: number;
  hasCommercialGroundFloor?: boolean;
  totalBuildingSurface?: number;
}

export function isMultiUnitParcelXml(xml: string): boolean {
  return /<lrcdnp\b/i.test(xml) && !/<bico\b/i.test(xml);
}

export function parseMultiUnitParcelSummary(xml: string): {
  totalUnits: number;
  primaryUnitRef?: string;
  hasCommercialUnit: boolean;
} {
  const cudnpStr = extractTag(xml, 'cudnp');
  const rcdnpList = extractAllTags(xml, 'rcdnp');
  const totalUnits = cudnpStr ? parseInt(cudnpStr, 10) : (rcdnpList.length || 1);

  let primaryUnitRef: string | undefined;
  if (rcdnpList.length > 0) {
    const firstRcdnp = rcdnpList[0];
    const pc1 = extractTag(firstRcdnp, 'pc1');
    const pc2 = extractTag(firstRcdnp, 'pc2');
    const car = extractTag(firstRcdnp, 'car');
    const cc1 = extractTag(firstRcdnp, 'cc1');
    const cc2 = extractTag(firstRcdnp, 'cc2');
    if (pc1 && pc2 && car && cc1 && cc2) {
      primaryUnitRef = `${pc1}${pc2}${car}${cc1}${cc2}`;
    }
  }

  const hasCommercialUnit = /comercial|oficina|local/i.test(xml);

  return {
    totalUnits,
    primaryUnitRef,
    hasCommercialUnit,
  };
}

export function extractConstructionYear(xml: string): number | null {
  // 1. Check <ant> (antigüedad de la construcción in <debi> or <de>)
  const antStr = extractTag(xml, 'ant');
  if (antStr) {
    const y = parseInt(antStr, 10);
    if (!isNaN(y) && y >= 1000 && y <= new Date().getFullYear() + 2) {
      return y;
    }
  }

  // 2. Check <aag> (año antigüedad in some construction elements)
  const aagStr = extractTag(xml, 'aag');
  if (aagStr) {
    const y = parseInt(aagStr, 10);
    if (!isNaN(y) && y >= 1000 && y <= new Date().getFullYear() + 2) {
      return y;
    }
  }

  // 3. Check inside any <dfcons> tags for <ant> or <aag>
  const dfconsList = extractAllTags(xml, 'dfcons');
  for (const dfcons of dfconsList) {
    const dAnt = extractTag(dfcons, 'ant') || extractTag(dfcons, 'aag');
    if (dAnt) {
      const y = parseInt(dAnt, 10);
      if (!isNaN(y) && y >= 1000 && y <= new Date().getFullYear() + 2) {
        return y;
      }
    }
  }

  return null;
}

export function parseCatastroDnprcXml(
  xml: string,
  queriedRefcat: string,
  fallbackCoords?: { latitude: number; longitude: number },
  metadata?: CatastroDnprcMetadata
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

  // Retain queried reference when valid, else compose from XML components
  let fullRc = queriedRefcat;
  if (!fullRc || fullRc.length < 14) {
    fullRc = pc1 && pc2 ? `${pc1}${pc2}${car}${cc1}${cc2}` : queriedRefcat;
  }

  // Address: parse street name, primary number, letters, suffixes, portal, and horizontal division
  const tv = extractTag(xml, 'tv') || 'CL';
  const nv = extractTag(xml, 'nv') || '';
  const pnp = extractTag(xml, 'pnp') || '';
  const plp = extractTag(xml, 'plp') || '';
  const snp = extractTag(xml, 'snp') || '';
  const slp = extractTag(xml, 'slp') || '';
  const ldt = extractTag(xml, 'ldt') || '';

  let number = pnp;
  if (plp) {
    number = number ? `${number} ${plp}`.trim() : plp;
  }
  if (snp && snp !== '0') {
    number = `${number}-${snp}${slp ? ` ${slp}` : ''}`;
  }
  if (!number) {
    const match = ldt.match(/\b(\d+[\s\w()/-]*?)(?:\s+\d{5}|$)/);
    number = match ? match[1].trim() : '1';
  }

  const street = nv ? `${tv} ${nv}`.trim() : (ldt || 'Calle Principal');
  const postalCode = extractTag(xml, 'dp') || extractTag(xml, 'cp') || '28001';
  const municipality = extractTag(xml, 'nm') || 'Madrid';
  const province = extractTag(xml, 'np') || 'Madrid';

  // Extract INE province and municipality codes from <loine>
  let provinceCode: string | undefined;
  let municipalityCode: string | undefined;
  const loineBlock = extractTag(xml, 'loine');
  if (loineBlock) {
    const cp = extractTag(loineBlock, 'cp');
    const cm = extractTag(loineBlock, 'cm');
    if (cp) provinceCode = cp.padStart(2, '0');
    if (cm) municipalityCode = cm.padStart(3, '0');
  }
  if (!provinceCode && postalCode.length >= 2) {
    provinceCode = postalCode.slice(0, 2);
  }

  // Coordinates
  const xcen = parseFloat(extractTag(xml, 'xcen') || '0');
  const ycen = parseFloat(extractTag(xml, 'ycen') || '0');
  const latitude = ycen !== 0 ? ycen : fallbackCoords?.latitude || 40.4168;
  const longitude = xcen !== 0 ? xcen : fallbackCoords?.longitude || -3.7038;

  // Building Attributes
  const parsedYear = extractConstructionYear(xml);
  const constructionYear = parsedYear !== null ? parsedYear : 0;
  const primaryUse = extractTag(xml, 'luso') || extractTag(xml, 'uso') || 'Residencial';

  // Units count in horizontal division
  let unitsCount = metadata?.unitsCount;
  if (!unitsCount) {
    const cudnpStr = extractTag(xml, 'cudnp');
    const cudnp = cudnpStr ? parseInt(cudnpStr, 10) : 0;
    const consList = extractAllTags(xml, 'cons');
    const rcdnpList = extractAllTags(xml, 'rcdnp');
    unitsCount = cudnp > 0 ? cudnp : rcdnpList.length > 0 ? rcdnpList.length : consList.length > 0 ? consList.length : 1;
  }

  // Commercial ground floor presence
  const consList = extractAllTags(xml, 'cons');
  const hasCommercialGroundFloor =
    metadata?.hasCommercialGroundFloor ??
    (primaryUse.toLowerCase().includes('comercial') ||
      primaryUse.toLowerCase().includes('oficina') ||
      consList.some((c) => /comercial|oficina|local/i.test(c)));

  // Built surface (m2)
  let builtSurfaceM2 = metadata?.totalBuildingSurface;
  if (!builtSurfaceM2) {
    const sfcStr = extractTag(xml, 'sfc') || extractTag(xml, 'sup');
    const rawSurface = sfcStr ? parseInt(sfcStr, 10) : 0;
    const cptStr = extractTag(xml, 'cpt');

    if (queriedRefcat && queriedRefcat.length === 14 && cptStr) {
      const cptVal = parseFloat(cptStr.replace(',', '.'));
      if (cptVal > 0 && cptVal < 100 && rawSurface > 0) {
        builtSurfaceM2 = Math.round(rawSurface / (cptVal / 100));
      } else {
        builtSurfaceM2 = rawSurface > 0 ? rawSurface : (unitsCount > 1 ? unitsCount * 90 : 100);
      }
    } else if (rawSurface > 0) {
      builtSurfaceM2 = rawSurface;
    } else if (constructionYear === 0 && primaryUse.toLowerCase().includes('agrario')) {
      builtSurfaceM2 = 0;
    } else if (unitsCount > 1) {
      builtSurfaceM2 = unitsCount * 90;
    } else {
      builtSurfaceM2 = 100;
    }
  }

  return {
    cadastralReference: fullRc,
    address: {
      street,
      number: number || '1',
      postalCode,
      municipality,
      province,
      provinceCode,
      municipalityCode,
    },
    coordinates: {
      latitude,
      longitude,
      srs: 'EPSG:4326',
    },
    building: {
      constructionYear: isNaN(constructionYear) ? 0 : constructionYear,
      builtSurfaceM2: isNaN(builtSurfaceM2) ? 100 : builtSurfaceM2,
      primaryUse,
      unitsCount,
      hasCommercialGroundFloor,
    },
  };
}
