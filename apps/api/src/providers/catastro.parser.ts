import {
  CadastralProperty,
  CadastralCoordinates,
  CadastralUnitsResponse,
  CadastralUnit,
} from '@openbarrio/core';
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

export function parseMultiUnitParcelSummary(
  xml: string,
  preferredPortal?: string
): {
  totalUnits: number;
  primaryUnitRef?: string;
  hasCommercialUnit: boolean;
} {
  const cudnpStr = extractTag(xml, 'cudnp');
  const rcdnpList = extractAllTags(xml, 'rcdnp');
  const totalUnits = cudnpStr ? parseInt(cudnpStr, 10) : (rcdnpList.length || 1);

  let primaryUnitRef: string | undefined;
  let targetRcdnp: string | undefined;

  if (preferredPortal && rcdnpList.length > 0) {
    const cleanPortal = preferredPortal.trim().toUpperCase();
    const portalMatches = rcdnpList.filter((rcdnp) => {
      const plp = (extractTag(rcdnp, 'plp') || '').toUpperCase();
      const bl = (extractTag(rcdnp, 'bl') || '').toUpperCase();
      const es = (extractTag(rcdnp, 'es') || '').toUpperCase();
      return plp === cleanPortal || bl === cleanPortal || es === cleanPortal;
    });

    if (portalMatches.length > 0) {
      // Prefer a residential unit in that portal over storage/parking
      const residential = portalMatches.find((rcdnp) =>
        /residencial|vivienda/i.test(extractTag(rcdnp, 'luso') || '')
      );
      targetRcdnp = residential || portalMatches[0];
    }
  }

  if (!targetRcdnp && rcdnpList.length > 0) {
    // Prefer residential unit over parking/storage
    const residential = rcdnpList.find((rcdnp) =>
      /residencial|vivienda/i.test(extractTag(rcdnp, 'luso') || '')
    );
    targetRcdnp = residential || rcdnpList[0];
  }

  if (targetRcdnp) {
    const pc1 = extractTag(targetRcdnp, 'pc1');
    const pc2 = extractTag(targetRcdnp, 'pc2');
    const car = extractTag(targetRcdnp, 'car');
    const cc1 = extractTag(targetRcdnp, 'cc1');
    const cc2 = extractTag(targetRcdnp, 'cc2');
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

export function parseCadastralUnitsXml(
  xml: string,
  requestedRefcat?: string
): CadastralUnitsResponse {
  const errDes = extractTag(xml, 'des');
  if (errDes && !/<lrcdnp\b/i.test(xml) && !/<rcdnp\b/i.test(xml) && !/<bico\b/i.test(xml)) {
    throw new CadastralNotFoundError(errDes);
  }

  const rcdnpList = extractAllTags(xml, 'rcdnp');
  const cudnpStr = extractTag(xml, 'cudnp');
  let parcelCadastralReference = requestedRefcat ? requestedRefcat.slice(0, 14) : '';

  const totalCount = cudnpStr ? parseInt(cudnpStr, 10) : rcdnpList.length;
  const defaultCpt = totalCount > 0 ? Number((100 / totalCount).toFixed(2)) : undefined;

  const units: CadastralUnit[] = [];

  for (const rcdnp of rcdnpList) {
    const pc1 = extractTag(rcdnp, 'pc1') || '';
    const pc2 = extractTag(rcdnp, 'pc2') || '';
    const car = extractTag(rcdnp, 'car') || '';
    const cc1 = extractTag(rcdnp, 'cc1') || '';
    const cc2 = extractTag(rcdnp, 'cc2') || '';

    const unitRef = `${pc1}${pc2}${car}${cc1}${cc2}`;
    if (!parcelCadastralReference && pc1 && pc2) {
      parcelCadastralReference = `${pc1}${pc2}`;
    }

    // Floor, door, stair, block from <loint>
    const loint = extractTag(rcdnp, 'loint') || '';
    let floor = extractTag(loint, 'pt') || extractTag(rcdnp, 'pt');
    let door = extractTag(loint, 'pu') || extractTag(rcdnp, 'pu');
    const staircase = extractTag(loint, 'es') || extractTag(rcdnp, 'es') || undefined;
    const plp = extractTag(rcdnp, 'plp') || '';
    const block = plp || extractTag(loint, 'bl') || extractTag(rcdnp, 'bl') || undefined;

    // Fallback parsing from descriptive text <ldt>
    const ldt = extractTag(rcdnp, 'ldt') || '';
    if (!floor && ldt) {
      const matchPl = ldt.match(/(?:Pl|Planta)[:\s]*([0-9A-Za-z+-]+)/i);
      if (matchPl) floor = matchPl[1];
    }
    if (!door && ldt) {
      const matchPt = ldt.match(/(?:Pt|Pta|Puerta)[:\s]*([0-9A-Za-z-]+)/i);
      if (matchPt) door = matchPt[1];
    }

    floor = floor || '00';
    door = door || '01';

    const floorNum = parseInt(floor, 10);
    const isBasement = floor.startsWith('-') || (!isNaN(floorNum) && floorNum < 0) || /sotano|sótano|garaje|parking|trastero/i.test(ldt);
    const isGround = floor === '00' || floor.toUpperCase() === 'PB' || floor.toUpperCase() === 'BJ' || floor.toUpperCase() === 'BAJO' || /local|comercial/i.test(ldt);

    // Use / Destino
    let use = extractTag(rcdnp, 'luso') || extractTag(rcdnp, 'cn') || extractTag(rcdnp, 'dest') || '';
    if (!use) {
      if (isBasement) {
        use = 'Aparcamiento';
      } else if (isGround) {
        use = 'Comercial';
      } else {
        use = 'Residencial';
      }
    } else if (/comercial|local|oficina/i.test(use)) {
      use = 'Comercial';
    } else if (/garaje|aparcamiento|estacionamiento/i.test(use)) {
      use = 'Aparcamiento';
    } else if (/almacen|almacén|trastero/i.test(use)) {
      use = 'Almacén';
    } else if (/residencial|vivienda/i.test(use)) {
      use = 'Residencial';
    }

    // Surface
    const sfcStr = extractTag(rcdnp, 'sfc') || extractTag(rcdnp, 'stl') || '0';
    let builtSurfaceM2 = parseInt(sfcStr, 10) || 0;

    // Catastro Consulta_DNPRC parcel listings omit <sfc>; provide realistic standard unit baselines
    if (builtSurfaceM2 === 0) {
      if (use === 'Aparcamiento' || isBasement) {
        builtSurfaceM2 = 22; // Catastro standard parking / garage unit
      } else if (use === 'Comercial' || isGround) {
        builtSurfaceM2 = 85; // Commercial baseline
      } else if (use === 'Almacén') {
        builtSurfaceM2 = 15; // Storage baseline
      } else {
        builtSurfaceM2 = 78; // Catastro standard residential unit
      }
    }

    // Participation coefficient (cpt)
    let participationCoefficient: number | undefined;
    const cptStr = extractTag(rcdnp, 'cpt');
    if (cptStr) {
      const parsedCpt = parseFloat(cptStr.replace(',', '.'));
      if (!isNaN(parsedCpt) && parsedCpt > 0) {
        participationCoefficient = parsedCpt;
      }
    }
    if (participationCoefficient === undefined && defaultCpt) {
      participationCoefficient = defaultCpt;
    }

    units.push({
      cadastralReference: unitRef || requestedRefcat || '',
      floor,
      door,
      staircase,
      block,
      use,
      builtSurfaceM2,
      participationCoefficient,
    });
  }

  // If no <rcdnp> items were found but this is a single unit (<bico>), extract the single unit
  if (units.length === 0 && (/<bico\b/i.test(xml) || /<bi\b/i.test(xml))) {
    const pc1 = extractTag(xml, 'pc1') || '';
    const pc2 = extractTag(xml, 'pc2') || '';
    const car = extractTag(xml, 'car') || '';
    const cc1 = extractTag(xml, 'cc1') || '';
    const cc2 = extractTag(xml, 'cc2') || '';
    const singleRef = pc1 && pc2 && car && cc1 && cc2 ? `${pc1}${pc2}${car}${cc1}${cc2}` : (requestedRefcat || '');

    const loint = extractTag(xml, 'loint') || '';
    const floor = extractTag(loint, 'pt') || extractTag(xml, 'pt') || '00';
    const door = extractTag(loint, 'pu') || extractTag(xml, 'pu') || '01';
    const staircase = extractTag(loint, 'es') || extractTag(xml, 'es') || undefined;
    const block = extractTag(loint, 'bl') || extractTag(xml, 'bl') || undefined;
    const use = extractTag(xml, 'luso') || 'Residencial';
    const sfcStr = extractTag(xml, 'sfc') || '0';
    const builtSurfaceM2 = parseInt(sfcStr, 10) || 0;

    units.push({
      cadastralReference: singleRef,
      floor,
      door,
      staircase,
      block,
      use,
      builtSurfaceM2,
    });
  }

  const totalUnits = cudnpStr ? parseInt(cudnpStr, 10) : units.length;

  return {
    parcelCadastralReference: parcelCadastralReference || (requestedRefcat ? requestedRefcat.slice(0, 14) : ''),
    totalUnits: Math.max(totalUnits, units.length),
    units,
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
  queriedRefcat?: string,
  fallbackCoords?: CadastralCoordinates,
  metadata?: CatastroDnprcMetadata
): CadastralProperty {
  const errDes = extractTag(xml, 'des');
  if (errDes) {
    throw new CadastralNotFoundError(errDes);
  }

  const pc1 = extractTag(xml, 'pc1') || '';
  const pc2 = extractTag(xml, 'pc2') || '';
  const car = extractTag(xml, 'car') || '';
  const cc1 = extractTag(xml, 'cc1') || '';
  const cc2 = extractTag(xml, 'cc2') || '';

  let fullRc = `${pc1}${pc2}${car}${cc1}${cc2}`.trim();
  if (queriedRefcat && queriedRefcat.length === 14) {
    fullRc = queriedRefcat;
  } else if (!fullRc || fullRc.length < 14) {
    fullRc = queriedRefcat || 'UNKNOWN_REFCAT';
  }

  // Address
  const tv = extractTag(xml, 'tv') || '';
  const nv = extractTag(xml, 'nv') || '';
  let number = extractTag(xml, 'pnp') || '';
  const snp = extractTag(xml, 'snp') || '';
  if (snp && snp !== '0') {
    number = `${number} ${snp}`;
  }
  const plp = extractTag(xml, 'plp') || '';
  const isMultiUnitBuilding = queriedRefcat && queriedRefcat.length === 14 && (metadata?.unitsCount || 0) > 1;
  if (number && plp && !isMultiUnitBuilding) {
    number = `${number} ${plp}`;
  }
  const ldt = extractTag(xml, 'ldt') || '';

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

  // Unit-level privative metadata when queried with 20-character reference
  let unit: CadastralUnit | undefined;
  if (queriedRefcat && queriedRefcat.length === 20) {
    const loint = extractTag(xml, 'loint') || '';
    let floor = extractTag(loint, 'pt') || extractTag(xml, 'pt');
    let door = extractTag(loint, 'pu') || extractTag(xml, 'pu');
    const staircase = extractTag(loint, 'es') || extractTag(xml, 'es') || undefined;
    const block = extractTag(loint, 'bl') || extractTag(xml, 'bl') || undefined;

    if (!floor && ldt) {
      const matchPl = ldt.match(/(?:Pl|Planta)[:\s]*([0-9A-Za-z+-]+)/i);
      if (matchPl) floor = matchPl[1];
    }
    if (!door && ldt) {
      const matchPt = ldt.match(/(?:Pt|Pta|Puerta)[:\s]*([0-9A-Za-z-]+)/i);
      if (matchPt) door = matchPt[1];
    }

    const sfcStr = extractTag(xml, 'sfc') || '0';
    const privSurface = parseInt(sfcStr, 10) || 0;

    let participationCoefficient: number | undefined;
    const cptStr = extractTag(xml, 'cpt');
    if (cptStr) {
      const parsed = parseFloat(cptStr.replace(',', '.'));
      if (!isNaN(parsed) && parsed > 0) participationCoefficient = parsed;
    }

    unit = {
      cadastralReference: queriedRefcat,
      floor: floor || '00',
      door: door || '01',
      staircase,
      block,
      use: primaryUse,
      builtSurfaceM2: privSurface > 0 ? privSurface : builtSurfaceM2,
      participationCoefficient,
    };
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
    unit,
  };
}

/**
 * Parses GML from Catastro WFS (wfsBU / wfsCP) into a GeoJSON Polygon CadastralGeometry.
 * In GML 3.2 EPSG:4326 posList, coordinates are formatted as lat lon pairs.
 * GeoJSON requires [lon, lat] pairs.
 */
export function parseCatastroWfsGeometryXml(
  xml: string,
  _refcat?: string,
  _geometryType?: 'building' | 'parcel'
): { coordinates: number[][][]; numberOfFloors?: number; areaM2?: number } | null {
  const posListMatch = xml.match(/<gml:posList[^>]*>([\s\S]*?)<\/gml:posList>/i);
  if (!posListMatch || !posListMatch[1].trim()) {
    return null;
  }

  const rawValues = posListMatch[1].trim().split(/\s+/).map((v) => parseFloat(v));
  if (rawValues.length < 6) {
    return null;
  }

  const ring: number[][] = [];
  for (let i = 0; i < rawValues.length - 1; i += 2) {
    const lat = rawValues[i];
    const lon = rawValues[i + 1];
    if (!isNaN(lat) && !isNaN(lon)) {
      ring.push([Number(lon.toFixed(6)), Number(lat.toFixed(6))]);
    }
  }

  if (ring.length < 3) {
    return null;
  }

  // Ensure ring is closed
  const first = ring[0];
  const last = ring[ring.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) {
    ring.push([first[0], first[1]]);
  }

  const areaStr = extractTag(xml, 'bu-ext2d:value') || extractTag(xml, 'cp:areaValue');
  const areaM2 = areaStr ? parseFloat(areaStr) : undefined;

  const floorsStr = extractTag(xml, 'bu-ext2d:numberOfFloorsAboveGround');
  const numberOfFloors = floorsStr && !isNaN(parseInt(floorsStr, 10)) ? parseInt(floorsStr, 10) : undefined;

  return {
    coordinates: [ring],
    numberOfFloors,
    areaM2,
  };
}

