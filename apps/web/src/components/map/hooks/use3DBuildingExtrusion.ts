import { useEffect, useRef } from 'react';
import type { Map as MapLibreMap } from 'maplibre-gl';
import { BuildingSurroundingsDTO } from '@openbarrio/core';
import {
  generate3dBuildingFootprints,
  calculateBuildingShadowPolygon,
  getMapLightConfig,
} from '../../../utils/solar';
import { ExtendedAuditReport, apiClient } from '../../../services/api.client';

export interface Use3DBuildingExtrusionProps {
  map: MapLibreMap | null;
  is3DMode: boolean;
  selectedCoords?: { lat: number; lon: number };
  report?: ExtendedAuditReport | null;
  solarAzimuth: number;
  solarAltitude: number;
}

// In-memory module cache for real cadastral geometry to prevent initial cube-pop glitch
const geometryCache = new Map<string, { coordinates: number[][][]; height?: number }>();
const surroundingsCache = new Map<string, BuildingSurroundingsDTO>();

export function use3DBuildingExtrusion({
  map,
  is3DMode,
  selectedCoords,
  report,
  solarAzimuth,
  solarAltitude,
}: Use3DBuildingExtrusionProps) {
  const currentBuildingCoordsRef = useRef<number[][][] | null>(null);
  const currentBuildingHeightRef = useRef<number>(44.8);

  // Toggle 3D mode & animate pitch/bearing
  useEffect(() => {
    if (!map) return;

    try {
      if (is3DMode) {
        map.easeTo({
          pitch: 55,
          bearing: -15,
          duration: 1000,
        });

        if (map.getLayer('building-3d-extrusion')) {
          map.setLayoutProperty('building-3d-extrusion', 'visibility', 'visible');
        }
        if (map.getLayer('building-3d-ground-shadows')) {
          map.setLayoutProperty('building-3d-ground-shadows', 'visibility', 'visible');
        }
      } else {
        map.easeTo({
          pitch: 0,
          bearing: 0,
          duration: 800,
        });

        if (map.getLayer('building-3d-extrusion')) {
          map.setLayoutProperty('building-3d-extrusion', 'visibility', 'none');
        }
        if (map.getLayer('building-3d-ground-shadows')) {
          map.setLayoutProperty('building-3d-ground-shadows', 'visibility', 'none');
        }
      }
    } catch {
      // Ignore during transitions
    }
  }, [map, is3DMode]);

  // Update building footprints and 3D geometry when selectedCoords or report changes
  useEffect(() => {
    if (!map) return;

    let isCancelled = false;
    const lat = selectedCoords?.lat ?? 40.42028;
    const lon = selectedCoords?.lon ?? -3.70379;

    const floors = report?.property.building.unitsCount
      ? Math.max(3, Math.min(12, Math.round(report.property.building.unitsCount / 4)))
      : 5;
    const height = Number((floors * 3.2).toFixed(1));
    currentBuildingHeightRef.current = height;

    const applyFootprints = (
      customPolygon?: number[][][],
      overrideHeight?: number,
      surroundingsData?: BuildingSurroundingsDTO
    ) => {
      if (isCancelled) return;
      const effectiveHeight = overrideHeight ?? height;
      currentBuildingHeightRef.current = effectiveHeight;

      const footprints = generate3dBuildingFootprints(
        lat,
        lon,
        floors,
        effectiveHeight,
        report?.property.address.street || 'Gran Vía 28',
        customPolygon
      );
      const targetFeature = footprints.features.find((f: any) => f.properties.isTarget);
      if (targetFeature && targetFeature.geometry) {
        currentBuildingCoordsRef.current = targetFeature.geometry.coordinates as number[][][];
      }

      // Append surrounding buildings with matte slate treatment (#334155)
      const surroundingParcels =
        surroundingsData?.parcels || (refcat ? surroundingsCache.get(refcat)?.parcels : undefined);

      if (surroundingParcels && surroundingParcels.length > 0) {
        for (let i = 0; i < surroundingParcels.length; i++) {
          const sp = surroundingParcels[i];
          footprints.features.push({
            type: 'Feature' as const,
            properties: {
              id: `surrounding-${i}-${sp.cadastralReference}`,
              isTarget: false,
              isSurrounding: true,
              name: sp.cadastralReference,
              numberOfFloors: sp.floors,
              height: sp.heightMeters,
            },
            geometry: sp.geometry,
          } as any);
        }
      }

      try {
        const source = map.getSource('building-3d-source');
        if (source && typeof (source as any).setData === 'function') {
          (source as any).setData(footprints);
        }

        const shadowSource = map.getSource('building-3d-shadows-source');
        if (
          shadowSource &&
          typeof (shadowSource as any).setData === 'function' &&
          currentBuildingCoordsRef.current
        ) {
          const shadowPolygon = calculateBuildingShadowPolygon(
            currentBuildingCoordsRef.current,
            effectiveHeight,
            solarAzimuth,
            solarAltitude
          );
          (shadowSource as any).setData(shadowPolygon);
        }
      } catch {
        // Ignore during initial load
      }
    };

    const refcat = report?.property.cadastralReference;

    // Fetch surrounding buildings in parallel
    if (refcat && !surroundingsCache.has(refcat)) {
      apiClient
        .getCadastralSurroundings(refcat)
        .then((surr) => {
          if (isCancelled) return;
          if (surr?.parcels && surr.parcels.length > 0) {
            surroundingsCache.set(refcat, surr);
            const cachedGeom = geometryCache.get(refcat);
            applyFootprints(cachedGeom?.coordinates, cachedGeom?.height, surr);
          }
        })
        .catch(() => {
          // Surroundings optional; ignore network fail
        });
    }

    // 1. If geometry is already cached, apply immediately without any placeholder
    if (refcat && geometryCache.has(refcat)) {
      const cached = geometryCache.get(refcat)!;
      applyFootprints(cached.coordinates, cached.height);
      return;
    }

    // 2. If refcat exists but is not cached yet, fetch geometry directly without rendering a cube first
    if (refcat) {
      apiClient
        .getCadastralGeometry(refcat)
        .then((geom) => {
          if (isCancelled) return;
          if (geom?.geometry?.coordinates && geom.geometry.coordinates.length > 0) {
            const coords = geom.geometry.coordinates;
            const realHeight = geom.properties?.height ?? height;
            geometryCache.set(refcat, { coordinates: coords, height: realHeight });
            applyFootprints(coords, realHeight);
          } else {
            applyFootprints(); // fallback if empty
          }
        })
        .catch(() => {
          if (!isCancelled) {
            applyFootprints(); // fallback on error
          }
        });
    } else {
      // 3. No refcat available (e.g. initial coords before audit report loads)
      applyFootprints();
    }

    return () => {
      isCancelled = true;
    };
  }, [map, selectedCoords?.lat, selectedCoords?.lon, report, solarAzimuth, solarAltitude]);

  // Update shadows and lighting when solar position or geometry changes
  useEffect(() => {
    if (!map) return;

    try {
      if (typeof map.setLight === 'function') {
        const lightCfg = getMapLightConfig(solarAltitude, solarAzimuth);
        map.setLight({
          anchor: 'map',
          color: lightCfg.color,
          intensity: lightCfg.intensity,
          position: [1.5, solarAzimuth, Math.max(0, 90 - solarAltitude)],
        });
      }

      const shadowSource = map.getSource('building-3d-shadows-source');
      if (
        shadowSource &&
        typeof (shadowSource as any).setData === 'function' &&
        currentBuildingCoordsRef.current
      ) {
        const shadowPolygon = calculateBuildingShadowPolygon(
          currentBuildingCoordsRef.current,
          currentBuildingHeightRef.current,
          solarAzimuth,
          solarAltitude
        );
        (shadowSource as any).setData(shadowPolygon);
      }
    } catch {
      // Ignore
    }
  }, [map, solarAzimuth, solarAltitude]);
}
