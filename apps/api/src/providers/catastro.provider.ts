import {
  CadastralProperty,
  CadastralUnitsResponse,
  CadastralCoordinates,
  CadastralGeometry,
  CadastralUnit,
  BuildingSurroundingsDTO,
} from '@openbarrio/core';
import type { D1Database } from '../types/env.js';
import { ICatastroProvider } from './types.js';
import { CadastralCache } from './cadastral-cache.js';
import {
  parseCatastroCoordinatesXml,
  parseCatastroDnprcXml,
  parseCatastroCpmrcXml,
  parseCadastralUnitsXml,
  isMultiUnitParcelXml,
  parseMultiUnitParcelSummary,
  parseCatastroWfsGeometryXml,
  generateDeterministicSurroundings,
} from './catastro.parser.js';
import { UpstreamProviderError } from '../errors/problem-details.js';

export interface CatastroProviderOptions {
  baseUrl?: string;
  coordenadasBaseUrl?: string;
  callejeroBaseUrl?: string;
  timeoutMs?: number;
  db?: D1Database;
  ttlSeconds?: number;
}

export class CatastroProvider implements ICatastroProvider {
  private readonly coordenadasBaseUrl: string;
  private readonly callejeroBaseUrl: string;
  private readonly timeoutMs: number;
  private readonly cache: CadastralCache;

  constructor(options: CatastroProviderOptions = {}) {
    this.coordenadasBaseUrl =
      options.coordenadasBaseUrl ||
      options.baseUrl ||
      'https://ovc.catastro.meh.es/ovcservweb/ovcswlocalizacionrc/ovccoordenadas.asmx';
    this.callejeroBaseUrl =
      options.callejeroBaseUrl ||
      'https://ovc.catastro.meh.es/ovcservweb/ovcswlocalizacionrc/ovccallejero.asmx';
    this.timeoutMs = options.timeoutMs || 15000;
    this.cache = new CadastralCache({ db: options.db, ttlSeconds: options.ttlSeconds });
  }

  setDatabase(db: D1Database): void {
    this.cache.setDatabase(db);
  }

  async getByCoordinates(latitude: number, longitude: number): Promise<CadastralProperty> {
    const cacheKey = `coords:${latitude.toFixed(5)},${longitude.toFixed(5)}`;
    const cached = await this.cache.get<CadastralProperty>(cacheKey);
    if (cached) {
      return cached;
    }

    const url = `${this.coordenadasBaseUrl}/Consulta_RCCOOR?SRS=EPSG:4326&Coordenada_X=${longitude}&Coordenada_Y=${latitude}`;

    let xmlText: string;
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeoutMs);
      const res = await fetch(url, {
        signal: controller.signal,
        headers: { 'User-Agent': 'OpenBarrio-DueDiligence/0.1' },
        ...({ cf: { cacheTtl: 7776000, cacheEverything: true } } as any),
      });
      clearTimeout(timer);

      if (!res.ok) {
        throw new UpstreamProviderError('Catastro OVC', `HTTP status ${res.status}`);
      }
      xmlText = await res.text();
    } catch (err: any) {
      if (err instanceof UpstreamProviderError) throw err;
      throw new UpstreamProviderError('Catastro OVC', err.message || 'Network request failed');
    }

    let cadastralReference: string | undefined;
    let resLat = latitude;
    let resLon = longitude;

    try {
      const parsed = parseCatastroCoordinatesXml(xmlText);
      cadastralReference = parsed.cadastralReference;
      resLat = parsed.latitude || latitude;
      resLon = parsed.longitude || longitude;
    } catch (parseErr) {
      // If Catastro has no exact parcel on coordinate (e.g. street), snap to nearest portal via CartoCiudad
      try {
        const cartoUrl = `https://www.cartociudad.es/geocoder/api/geocoder/reverseGeocode?lat=${latitude}&lon=${longitude}`;
        const cartoRes = await fetch(cartoUrl);
        if (cartoRes.ok) {
          const cartoData = (await cartoRes.json()) as any;
          if (cartoData && cartoData.refCatastral) {
            cadastralReference = cartoData.refCatastral;
            resLat = typeof cartoData.lat === 'number' ? cartoData.lat : latitude;
            resLon = typeof cartoData.lng === 'number' ? cartoData.lng : longitude;
          }
        }
      } catch {
        // Fall through
      }

      if (!cadastralReference) {
        throw parseErr;
      }
    }

        // Snap to the exact portal number & letter via CartoCiudad IGN geocoder (e.g. 2 F vs 2 I)
    let targetPortal: string | undefined;
    try {
      const cartoUrl = `https://www.cartociudad.es/geocoder/api/geocoder/reverseGeocode?lat=${latitude}&lon=${longitude}`;
      const cartoRes = await fetch(cartoUrl);
      if (cartoRes.ok) {
        const cartoData = (await cartoRes.json()) as any;
        if (cartoData?.extension) {
          targetPortal = String(cartoData.extension).trim().toUpperCase();
        }
        if (typeof cartoData?.lat === 'number' && typeof cartoData?.lng === 'number') {
          resLat = cartoData.lat;
          resLon = cartoData.lng;
        }
      }
    } catch {
      // Non-critical: continue
    }

    // Fetch detailed property attributes using the cadastral reference obtained
    const propertyResult = await this.getByCadastralReference(
      cadastralReference,
      {
        latitude: resLat || latitude,
        longitude: resLon || longitude,
        srs: 'EPSG:4326',
      },
      targetPortal
    );

    await this.cache.set(cacheKey, 'coordinates', propertyResult.cadastralReference, propertyResult);
    return propertyResult;
  }

    async getByCadastralReference(
    refcat: string,
    fallbackCoords?: CadastralCoordinates,
    preferredPortal?: string
  ): Promise<CadastralProperty> {
    let activePortal = preferredPortal;
    if (!activePortal && fallbackCoords) {
      try {
        const cartoUrl = `https://www.cartociudad.es/geocoder/api/geocoder/reverseGeocode?lat=${fallbackCoords.latitude}&lon=${fallbackCoords.longitude}`;
        const cartoRes = await fetch(cartoUrl);
        if (cartoRes.ok) {
          const cartoData = (await cartoRes.json()) as any;
          if (cartoData?.extension) {
            activePortal = String(cartoData.extension).trim().toUpperCase();
          }
        }
      } catch {
        // Non-critical: continue
      }
    }
    const cleanRef = refcat.replace(/[\s\-_.]/g, '').toUpperCase();
    const cacheKey = `prop:${cleanRef}${activePortal ? `:${activePortal}` : ''}`;
    const cached = await this.cache.get<CadastralProperty>(cacheKey);
    if (cached) {
      return cached;
    }

    const dnprcUrl = `${this.callejeroBaseUrl}/Consulta_DNPRC?Provincia=&Municipio=&RC=${encodeURIComponent(cleanRef)}`;

    // If coordinates are not passed, query Consulta_CPMRC to get the exact parcel centroid coordinates
    let resolvedCoords: CadastralCoordinates | undefined = fallbackCoords;
    if (!resolvedCoords) {
      try {
        const parcelRef = cleanRef.slice(0, 14);
        const cpmrcUrl = `${this.coordenadasBaseUrl}/Consulta_CPMRC?Provincia=&Municipio=&SRS=EPSG:4326&RC=${encodeURIComponent(parcelRef)}`;
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), this.timeoutMs);
        const cpmrcRes = await fetch(cpmrcUrl, {
          signal: controller.signal,
          headers: { 'User-Agent': 'OpenBarrio-DueDiligence/0.1' },
          ...({ cf: { cacheTtl: 7776000, cacheEverything: true } } as any),
        });
        clearTimeout(timer);

        if (cpmrcRes.ok) {
          const cpmrcXml = await cpmrcRes.text();
          const parsed = parseCatastroCpmrcXml(cpmrcXml);
          if (parsed) {
            resolvedCoords = { latitude: parsed.latitude, longitude: parsed.longitude, srs: 'EPSG:4326' };
          }
        }
      } catch {
        // Non-critical: continue with fallback coordinates if CPMRC fails
      }
    }

    let xmlText: string;
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeoutMs);
      const res = await fetch(dnprcUrl, {
        signal: controller.signal,
        headers: { 'User-Agent': 'OpenBarrio-DueDiligence/0.1' },
        ...({ cf: { cacheTtl: 7776000, cacheEverything: true } } as any),
      });
      clearTimeout(timer);

      if (!res.ok) {
        throw new UpstreamProviderError('Catastro OVC', `HTTP status ${res.status}`);
      }
      xmlText = await res.text();
    } catch (err: any) {
      if (err instanceof UpstreamProviderError) throw err;
      throw new UpstreamProviderError('Catastro OVC', err.message || 'Network request failed');
    }

    // If parcel has horizontal division (<lrcdnp>), fetch primary unit to extract official building year and specs
    if (isMultiUnitParcelXml(xmlText)) {
      const summary = parseMultiUnitParcelSummary(xmlText, activePortal);
      if (summary.primaryUnitRef) {
        try {
          const unitUrl = `${this.callejeroBaseUrl}/Consulta_DNPRC?Provincia=&Municipio=&RC=${encodeURIComponent(summary.primaryUnitRef)}`;
          const unitController = new AbortController();
          const unitTimer = setTimeout(() => unitController.abort(), this.timeoutMs);
          const unitRes = await fetch(unitUrl, {
            signal: unitController.signal,
            headers: { 'User-Agent': 'OpenBarrio-DueDiligence/0.1' },
            ...({ cf: { cacheTtl: 7776000, cacheEverything: true } } as any),
          });
          clearTimeout(unitTimer);

          if (unitRes.ok) {
            const unitXml = await unitRes.text();
            let totalBuildingSurface: number | undefined;

            // When queried as a 14-char building, calculate total building constructed surface across all units
            if (cleanRef.length === 14 && summary.totalUnits > 1 && summary.totalUnits <= 30) {
              try {
                const unitsResp = await this.getUnitsByCadastralReference(cleanRef);
                const sumSurface = unitsResp.units.reduce((acc, u) => acc + (u.builtSurfaceM2 || 0), 0);
                if (sumSurface > 0) {
                  totalBuildingSurface = sumSurface;
                }
              } catch {
                // Fall back if units lookup fails
              }
            }

            const result = parseCatastroDnprcXml(unitXml, cleanRef, resolvedCoords, {
              unitsCount: summary.totalUnits,
              hasCommercialGroundFloor: summary.hasCommercialUnit,
              totalBuildingSurface,
            });
            if (result.building.builtSurfaceM2 === 0 || result.typology === 'RUSTIC' || result.typology === 'VACANT_PLOT') {
              try {
                const geom = await this.getGeometryByCadastralReference(cleanRef);
                if (geom?.properties?.areaM2 && geom.properties.areaM2 > 0) {
                  result.building.plotSurfaceM2 = geom.properties.areaM2;
                  result.plotSurfaceM2 = geom.properties.areaM2;
                }
              } catch {
                // Non-critical: continue
              }
            }
            await this.cache.set(cacheKey, 'property', cleanRef, result);
            return result;
          }
        } catch {
          // Fall through to parsing parent XML on unit lookup timeout/error
        }
      }
    }

    const result = parseCatastroDnprcXml(xmlText, cleanRef, resolvedCoords);
    if (result.building.builtSurfaceM2 === 0 || result.typology === 'RUSTIC' || result.typology === 'VACANT_PLOT') {
      try {
        const geom = await this.getGeometryByCadastralReference(cleanRef);
        if (geom?.properties?.areaM2 && geom.properties.areaM2 > 0) {
          result.building.plotSurfaceM2 = geom.properties.areaM2;
          result.plotSurfaceM2 = geom.properties.areaM2;
        }
      } catch {
        // Non-critical: continue
      }
    }
    await this.cache.set(cacheKey, 'property', cleanRef, result);
    return result;
  }

  async getUnitsByCadastralReference(refcat: string): Promise<CadastralUnitsResponse> {
    const cleanRef = refcat.replace(/[\s\-_.]/g, '').toUpperCase();
    const parcelRef = cleanRef.slice(0, 14);
    const cacheKey = `units:${parcelRef}`;
    const cached = await this.cache.get<CadastralUnitsResponse>(cacheKey);
    if (cached) {
      return cached;
    }

    const dnprcUrl = `${this.callejeroBaseUrl}/Consulta_DNPRC?Provincia=&Municipio=&RC=${encodeURIComponent(parcelRef)}`;

    let xmlText: string;
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeoutMs);
      const res = await fetch(dnprcUrl, {
        signal: controller.signal,
        headers: { 'User-Agent': 'OpenBarrio-DueDiligence/0.1' },
        ...({ cf: { cacheTtl: 7776000, cacheEverything: true } } as any),
      });
      clearTimeout(timer);

      if (!res.ok) {
        throw new UpstreamProviderError('Catastro OVC', `HTTP status ${res.status}`);
      }
      xmlText = await res.text();
    } catch (err: any) {
      if (err instanceof UpstreamProviderError) throw err;
      throw new UpstreamProviderError('Catastro OVC', err.message || 'Network request failed');
    }

    const parsed = parseCadastralUnitsXml(xmlText, parcelRef);
    if (!parsed.units || parsed.units.length === 0) {
      await this.cache.set(cacheKey, 'units', parcelRef, parsed);
      return parsed;
    }

    // Hydrate each individual unit's real built surface (<sfc>) and official use (<luso>) from Catastro OVC in controlled batches
    const BATCH_SIZE = 15;
    const hydratedUnits: CadastralUnit[] = [];

    for (let i = 0; i < parsed.units.length; i += BATCH_SIZE) {
      const batch = parsed.units.slice(i, i + BATCH_SIZE);
      const batchHydrated = await Promise.all(
        batch.map(async (u) => {
          if (!u.cadastralReference || u.cadastralReference.length !== 20) {
            return u;
          }
          try {
            const unitUrl = `${this.callejeroBaseUrl}/Consulta_DNPRC?Provincia=&Municipio=&RC=${encodeURIComponent(u.cadastralReference)}`;
            const unitController = new AbortController();
            const unitTimer = setTimeout(() => unitController.abort(), 4000);
            const unitRes = await fetch(unitUrl, {
              signal: unitController.signal,
              headers: { 'User-Agent': 'OpenBarrio-DueDiligence/0.1' },
              ...({ cf: { cacheTtl: 7776000, cacheEverything: true } } as any),
            });
            clearTimeout(unitTimer);

            if (unitRes.ok) {
              const uXml = await unitRes.text();
              const sfcMatch = uXml.match(/<sfc>([^<]+)<\/sfc>/i) || uXml.match(/<stl>([^<]+)<\/stl>/i);
              const lusoMatch = uXml.match(/<luso>([^<]+)<\/luso>/i);

              const sfc = sfcMatch ? parseInt(sfcMatch[1], 10) : 0;
              let use = u.use;
              if (lusoMatch) {
                const rawLuso = lusoMatch[1].trim();
                if (/comercial|local|oficina/i.test(rawLuso)) use = 'Comercial';
                else if (/garaje|aparcamiento|estacionamiento/i.test(rawLuso)) use = 'Aparcamiento';
                else if (/almacen|almacén|trastero/i.test(rawLuso)) use = 'Almacén';
                else if (/residencial|vivienda/i.test(rawLuso)) use = 'Residencial';
                else use = rawLuso;
              }

              return {
                ...u,
                use,
                builtSurfaceM2: sfc > 0 ? sfc : u.builtSurfaceM2,
              };
            }
          } catch {
            // Keep unit as-is on network/timeout error
          }
          return u;
        })
      );
      hydratedUnits.push(...batchHydrated);
    }

    // Compute accurate participation coefficients based on real square meters
    const totalSurface = hydratedUnits.reduce((acc, u) => acc + (u.builtSurfaceM2 || 0), 0);
    const finalUnits = hydratedUnits.map((u) => {
      if (totalSurface > 0 && u.builtSurfaceM2 > 0) {
        return {
          ...u,
          participationCoefficient: Number(((u.builtSurfaceM2 / totalSurface) * 100).toFixed(2)),
        };
      }
      return u;
    });

    const result = {
      ...parsed,
      units: finalUnits,
    };
    await this.cache.set(cacheKey, 'units', parcelRef, result);
    return result;
  }

  async getGeometryByCadastralReference(refcat: string): Promise<CadastralGeometry> {
    const cleanRef = refcat.replace(/[\s\-_.]/g, '').toUpperCase();
    const parcelRef = cleanRef.slice(0, 14);
    const cacheKey = `geom:${parcelRef}`;
    const cached = await this.cache.get<CadastralGeometry>(cacheKey);
    if (cached) {
      return cached;
    }

    // 1. Try Building footprint (wfsBU)
    const buUrl = `https://ovc.catastro.meh.es/INSPIRE/wfsBU.aspx?service=WFS&version=2.0.0&request=GetFeature&STOREDQUERY_ID=GetBuildingByParcel&refcat=${encodeURIComponent(parcelRef)}&srsname=EPSG::4326`;
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeoutMs);
      const res = await fetch(buUrl, {
        signal: controller.signal,
        headers: { 'User-Agent': 'OpenBarrio-DueDiligence/0.1' },
        ...({ cf: { cacheTtl: 7776000, cacheEverything: true } } as any),
      });
      clearTimeout(timer);

      if (res.ok) {
        const xml = await res.text();
        const parsed = parseCatastroWfsGeometryXml(xml, parcelRef, 'building');
        if (parsed) {
          const floors = parsed.numberOfFloors || 4;
          const height = floors * 3.2;
          const buildingGeom: CadastralGeometry = {
            cadastralReference: cleanRef,
            type: 'building',
            geometry: {
              type: 'Polygon',
              coordinates: parsed.coordinates,
            },
            properties: {
              numberOfFloors: floors,
              height: Number(height.toFixed(1)),
              areaM2: parsed.areaM2,
            },
          };
          await this.cache.set(cacheKey, 'geometry', parcelRef, buildingGeom);
          return buildingGeom;
        }
      }
    } catch {
      // Continue to parcel boundary fallback
    }

    // 2. Try Cadastral Parcel boundary (wfsCP)
    const cpUrl = `https://ovc.catastro.meh.es/INSPIRE/wfsCP.aspx?service=WFS&version=2.0.0&request=GetFeature&STOREDQUERY_ID=GetParcel&REFCAT=${encodeURIComponent(parcelRef)}&srsname=EPSG::4326`;
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeoutMs);
      const res = await fetch(cpUrl, {
        signal: controller.signal,
        headers: { 'User-Agent': 'OpenBarrio-DueDiligence/0.1' },
        ...({ cf: { cacheTtl: 7776000, cacheEverything: true } } as any),
      });
      clearTimeout(timer);

      if (res.ok) {
        const xml = await res.text();
        const parsed = parseCatastroWfsGeometryXml(xml, parcelRef, 'parcel');
        if (parsed) {
          const parcelGeom: CadastralGeometry = {
            cadastralReference: cleanRef,
            type: 'parcel',
            geometry: {
              type: 'Polygon',
              coordinates: parsed.coordinates,
            },
            properties: {
              numberOfFloors: 3,
              height: 9.6,
              areaM2: parsed.areaM2,
            },
          };
          await this.cache.set(cacheKey, 'geometry', parcelRef, parcelGeom);
          return parcelGeom;
        }
      }
    } catch {
      // Continue to deterministic fallback
    }

    // 3. Fallback: Query coordinates from Catastro to generate realistic parcel box
    let centerLat = 40.42028;
    let centerLon = -3.70379;
    try {
      const prop = await this.getByCadastralReference(cleanRef);
      centerLat = prop.coordinates.latitude;
      centerLon = prop.coordinates.longitude;
    } catch {
      // keep default center
    }

    const dLat = 0.00020;
    const dLon = 0.00025;
    const coords = [
      [
        [Number((centerLon - dLon).toFixed(6)), Number((centerLat - dLat).toFixed(6))],
        [Number((centerLon + dLon).toFixed(6)), Number((centerLat - dLat).toFixed(6))],
        [Number((centerLon + dLon).toFixed(6)), Number((centerLat + dLat).toFixed(6))],
        [Number((centerLon - dLon).toFixed(6)), Number((centerLat + dLat).toFixed(6))],
        [Number((centerLon - dLon).toFixed(6)), Number((centerLat - dLat).toFixed(6))],
      ],
    ];

    const fallbackGeom: CadastralGeometry = {
      cadastralReference: cleanRef,
      type: 'fallback',
      geometry: {
        type: 'Polygon',
        coordinates: coords,
      },
      properties: {
        numberOfFloors: 4,
        height: 12.8,
      },
    };
    await this.cache.set(cacheKey, 'geometry', parcelRef, fallbackGeom);
    return fallbackGeom;
  }

  async getSurroundingsByCadastralReference(refcat: string): Promise<BuildingSurroundingsDTO> {
    const cleanRef = refcat.replace(/[\s\-_.]/g, '').toUpperCase();
    const parcelRef = cleanRef.substring(0, 14);
    const cacheKey = `surroundings:${parcelRef}`;
    const cached = await this.cache.get<BuildingSurroundingsDTO>(cacheKey);
    if (cached) {
      return cached;
    }

    // 1. Query Catastro INSPIRE WFS GetNeighbourParcel to get real official cadastral parcels
    const realParcels: BuildingSurroundingsDTO['parcels'] = [];
    const parcelMap = new Set<string>();

    try {
      const wfsUrl = `https://ovc.catastro.meh.es/INSPIRE/wfsCP.aspx?service=wfs&version=2.0.0&request=GetFeature&STOREDQUERY_ID=GetNeighbourParcel&REFCAT=${encodeURIComponent(parcelRef)}&srsname=EPSG::4326`;
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeoutMs);
      const res = await fetch(wfsUrl, {
        signal: controller.signal,
        headers: { 'User-Agent': 'OpenBarrio-DueDiligence/0.1' },
        ...({ cf: { cacheTtl: 7776000, cacheEverything: true } } as any),
      });
      clearTimeout(timer);

      if (res.ok) {
        const xml = await res.text();
        const firstTierRefs: string[] = [];
        const members = xml.match(/<(?:wfs:|gml:)?member[\s\S]*?<\/(?:wfs:|gml:)?member>/gi) || [];

        for (const m of members) {
          const rcMatch = m.match(/<cp:nationalCadastralReference>([^<]+)<\/cp:nationalCadastralReference>/i);
          if (!rcMatch) continue;
          const rc = rcMatch[1].trim();
          if (rc === parcelRef || rc === cleanRef) continue;
          firstTierRefs.push(rc);

          const parsedGeom = parseCatastroWfsGeometryXml(m);
          if (parsedGeom && parsedGeom.coordinates.length > 0 && !parcelMap.has(rc)) {
            parcelMap.add(rc);
            const floors = parsedGeom.numberOfFloors ?? (5 + (realParcels.length % 4));
            const heightMeters = Number((floors * 3.2 + 1.0).toFixed(1));
            realParcels.push({
              cadastralReference: rc,
              floors,
              heightMeters,
              geometry: {
                type: 'Polygon',
                coordinates: parsedGeom.coordinates,
              },
            });
          }
        }

        // Fetch 2nd tier neighbors in parallel to complete the full urban block
        if (firstTierRefs.length > 0) {
          try {
            const secondTierXmls = await Promise.all(
              firstTierRefs.slice(0, 3).map(async (nRef) => {
                const subUrl = `https://ovc.catastro.meh.es/INSPIRE/wfsCP.aspx?service=wfs&version=2.0.0&request=GetFeature&STOREDQUERY_ID=GetNeighbourParcel&REFCAT=${encodeURIComponent(nRef)}&srsname=EPSG::4326`;
                const subCtrl = new AbortController();
                const subTimer = setTimeout(() => subCtrl.abort(), this.timeoutMs);
                const subRes = await fetch(subUrl, {
                  signal: subCtrl.signal,
                  headers: { 'User-Agent': 'OpenBarrio-DueDiligence/0.1' },
                  ...({ cf: { cacheTtl: 7776000, cacheEverything: true } } as any),
                });
                clearTimeout(subTimer);
                return subRes.ok ? await subRes.text() : '';
              })
            );

            for (const subXml of secondTierXmls) {
              if (!subXml) continue;
              const subMembers = subXml.match(/<(?:wfs:|gml:)?member[\s\S]*?<\/(?:wfs:|gml:)?member>/gi) || [];
              for (const sm of subMembers) {
                const rcMatch = sm.match(/<cp:nationalCadastralReference>([^<]+)<\/cp:nationalCadastralReference>/i);
                if (!rcMatch) continue;
                const rc = rcMatch[1].trim();
                if (rc === parcelRef || rc === cleanRef || parcelMap.has(rc)) continue;

                const parsedGeom = parseCatastroWfsGeometryXml(sm);
                if (parsedGeom && parsedGeom.coordinates.length > 0) {
                  parcelMap.add(rc);
                  const floors = parsedGeom.numberOfFloors ?? (6 + (realParcels.length % 3));
                  const heightMeters = Number((floors * 3.2 + 1.0).toFixed(1));
                  realParcels.push({
                    cadastralReference: rc,
                    floors,
                    heightMeters,
                    geometry: {
                      type: 'Polygon',
                      coordinates: parsedGeom.coordinates,
                    },
                  });
                }
              }
            }
          } catch {
            // Ignore second-tier failures
          }
        }
      }
    } catch {
      // Ignore WFS network failure and fallback
    }

    // 2. If no direct neighbors found (e.g. isolated parcel occupying entire block), probe across adjacent streets
    if (realParcels.length === 0) {
      let centerLat = 40.42028;
      let centerLon = -3.70379;
      try {
        const prop = await this.getByCadastralReference(cleanRef);
        centerLat = prop.coordinates.latitude;
        centerLon = prop.coordinates.longitude;
      } catch {
        // Keep default center
      }

      const probes = [
        [0.0006, 0],
        [-0.0006, 0],
        [0, 0.0007],
        [0, -0.0007],
        [0.0005, 0.0006],
        [-0.0005, -0.0006],
      ];

      try {
        const probedRefs = new Set<string>();
        const rccos = await Promise.all(
          probes.map(async ([dLat, dLon]) => {
            const probeUrl = `${this.coordenadasBaseUrl}/Consulta_RCCOOR?SRS=EPSG:4326&Coordenada_X=${(centerLon + dLon).toFixed(6)}&Coordenada_Y=${(centerLat + dLat).toFixed(6)}`;
            const pCtrl = new AbortController();
            const pTimer = setTimeout(() => pCtrl.abort(), this.timeoutMs);
            const pRes = await fetch(probeUrl, {
              signal: pCtrl.signal,
              headers: { 'User-Agent': 'OpenBarrio-DueDiligence/0.1' },
            });
            clearTimeout(pTimer);
            return pRes.ok ? await pRes.text() : '';
          })
        );

        for (const rx of rccos) {
          const m = rx.match(/<pc1>([^<]+)<\/pc1>\s*<pc2>([^<]+)<\/pc2>/i);
          if (m) {
            const rc = (m[1].trim() + m[2].trim()).substring(0, 14);
            if (rc !== parcelRef && rc !== cleanRef) {
              probedRefs.add(rc);
            }
          }
        }

        if (probedRefs.size > 0) {
          const blocks = await Promise.all(
            [...probedRefs].slice(0, 4).map(async (rc) => {
              const subUrl = `https://ovc.catastro.meh.es/INSPIRE/wfsCP.aspx?service=wfs&version=2.0.0&request=GetFeature&STOREDQUERY_ID=GetNeighbourParcel&REFCAT=${encodeURIComponent(rc)}&srsname=EPSG::4326`;
              const subCtrl = new AbortController();
              const subTimer = setTimeout(() => subCtrl.abort(), this.timeoutMs);
              const subRes = await fetch(subUrl, {
                signal: subCtrl.signal,
                headers: { 'User-Agent': 'OpenBarrio-DueDiligence/0.1' },
                ...({ cf: { cacheTtl: 7776000, cacheEverything: true } } as any),
              });
              clearTimeout(subTimer);
              return subRes.ok ? await subRes.text() : '';
            })
          );

          for (const bx of blocks) {
            const bMembers = bx.match(/<(?:wfs:|gml:)?member[\s\S]*?<\/(?:wfs:|gml:)?member>/gi) || [];
            for (const bm of bMembers) {
              const rcMatch = bm.match(/<cp:nationalCadastralReference>([^<]+)<\/cp:nationalCadastralReference>/i);
              if (!rcMatch) continue;
              const rc = rcMatch[1].trim();
              if (rc === parcelRef || rc === cleanRef || parcelMap.has(rc)) continue;

              const parsedGeom = parseCatastroWfsGeometryXml(bm);
              if (parsedGeom && parsedGeom.coordinates.length > 0) {
                parcelMap.add(rc);
                const floors = parsedGeom.numberOfFloors ?? (6 + (realParcels.length % 3));
                const heightMeters = Number((floors * 3.2 + 1.0).toFixed(1));
                realParcels.push({
                  cadastralReference: rc,
                  floors,
                  heightMeters,
                  geometry: {
                    type: 'Polygon',
                    coordinates: parsedGeom.coordinates,
                  },
                });
              }
            }
          }
        }
      } catch {
        // Fall back to deterministic
      }
    }

    if (realParcels.length > 0) {
      const result: BuildingSurroundingsDTO = {
        targetRefcat: cleanRef,
        parcels: realParcels,
      };
      await this.cache.set(cacheKey, 'surroundings', parcelRef, result);
      return result;
    }

    // Fallback if WFS unavailable
    let centerLat = 40.42028;
    let centerLon = -3.70379;
    try {
      const prop = await this.getByCadastralReference(cleanRef);
      centerLat = prop.coordinates.latitude;
      centerLon = prop.coordinates.longitude;
    } catch {
      // Keep default center
    }

    const deterministic = generateDeterministicSurroundings(cleanRef, centerLat, centerLon);
    deterministic.parcels = deterministic.parcels.filter(
      (p) => p.cadastralReference !== cleanRef && p.cadastralReference !== parcelRef
    );
    await this.cache.set(cacheKey, 'surroundings', parcelRef, deterministic);
    return deterministic;
  }

  async getSurroundingsByBbox(bbox: [number, number, number, number]): Promise<BuildingSurroundingsDTO> {
    const [minX, minY, maxX, maxY] = bbox;
    const centerLat = (minY + maxY) / 2;
    const centerLon = (minX + maxX) / 2;
    return generateDeterministicSurroundings('BBOX_QUERY', centerLat, centerLon);
  }
}
