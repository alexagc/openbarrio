import { useEffect, useRef } from 'react';
import type { Map as MapLibreMap, Popup } from 'maplibre-gl';
import * as maplibregl from 'maplibre-gl';
import { createGeodesicCircle, escapeHtml } from '../../../utils/geo';
import { ExtendedAuditReport } from '../../../services/api.client';
import type { CivicFacility } from '@openbarrio/core';

export interface UseIsochronesLayerProps {
  map: MapLibreMap | null;
  showIsochrones: boolean;
  selectedCoords?: { lat: number; lon: number };
  report?: ExtendedAuditReport | null;
}

const FACILITY_ICONS_CONFIG: Record<string, { icon: string; color: string; label: string }> = {
  // Transit
  train: { icon: 'fac-train', color: '#e11d48', label: 'Cercanías / Tren' },
  commuter_rail: { icon: 'fac-train', color: '#e11d48', label: 'Cercanías' },
  metro: { icon: 'fac-metro', color: '#0284c7', label: 'Metro' },
  subway: { icon: 'fac-metro', color: '#0284c7', label: 'Metro' },
  bus: { icon: 'fac-bus', color: '#f59e0b', label: 'Autobús' },
  bus_hub: { icon: 'fac-bus', color: '#f59e0b', label: 'Intercambiador' },
  transit: { icon: 'fac-train', color: '#e11d48', label: 'Transporte' },

  // Healthcare
  primary_care: { icon: 'fac-health', color: '#f43f5e', label: 'Centro de Salud' },
  hospital: { icon: 'fac-health', color: '#f43f5e', label: 'Hospital' },
  consultorio: { icon: 'fac-health', color: '#f43f5e', label: 'Consultorio Médico' },
  emergency_care: { icon: 'fac-health', color: '#f43f5e', label: 'Urgencias' },
  healthcare: { icon: 'fac-health', color: '#f43f5e', label: 'Salud' },

  // Education
  school: { icon: 'fac-education', color: '#3b82f6', label: 'Colegio' },
  high_school: { icon: 'fac-education', color: '#3b82f6', label: 'Instituto' },
  education: { icon: 'fac-education', color: '#3b82f6', label: 'Educación' },

  // Parks & Nature
  urban_park: { icon: 'fac-park', color: '#10b981', label: 'Parque' },
  metropolitan_park: { icon: 'fac-park', color: '#10b981', label: 'Parque' },
  public_square: { icon: 'fac-park', color: '#10b981', label: 'Plaza' },
  park: { icon: 'fac-park', color: '#10b981', label: 'Parque' },
};

function getFacilityConfig(fac: CivicFacility): { icon: string; color: string; label: string } {
  const subtype = (fac.subtype || '').toLowerCase();
  const type = (fac.type || '').toLowerCase();
  const name = (fac.name || '').toLowerCase();

  // 1. Direct match on subtype
  if (FACILITY_ICONS_CONFIG[subtype]) {
    return FACILITY_ICONS_CONFIG[subtype];
  }

  // 2. Keyword detection for train / rail / station
  if (
    subtype.includes('train') ||
    subtype.includes('cercan') ||
    subtype.includes('rail') ||
    name.includes('estaci') ||
    name.includes('renfe') ||
    name.includes('cercan') ||
    name.includes('adif') ||
    name.includes('tren')
  ) {
    return { icon: 'fac-train', color: '#e11d48', label: 'Cercanías / Tren' };
  }

  // 3. Keyword detection for metro
  if (subtype.includes('metro') || name.includes('metro')) {
    return { icon: 'fac-metro', color: '#0284c7', label: 'Metro' };
  }

  // 4. Keyword detection for bus
  if (subtype.includes('bus') || name.includes('autob') || name.includes('emt')) {
    return { icon: 'fac-bus', color: '#f59e0b', label: 'Autobús' };
  }

  // 5. Healthcare keywords
  if (
    type === 'healthcare' ||
    subtype.includes('health') ||
    name.includes('hospital') ||
    name.includes('salud') ||
    name.includes('cap') ||
    name.includes('clínic') ||
    name.includes('clinic')
  ) {
    return { icon: 'fac-health', color: '#f43f5e', label: 'Salud' };
  }

  // 6. Education keywords
  if (
    type === 'education' ||
    subtype.includes('school') ||
    name.includes('colegio') ||
    name.includes('instituto') ||
    name.includes('ies') ||
    name.includes('ceip') ||
    name.includes('escuela')
  ) {
    return { icon: 'fac-education', color: '#3b82f6', label: 'Educación' };
  }

  // 7. Direct match on type
  if (FACILITY_ICONS_CONFIG[type]) {
    return FACILITY_ICONS_CONFIG[type];
  }

  // 8. Safe fallback for parks / public spaces
  return {
    icon: 'fac-park',
    color: '#10b981',
    label: fac.name || 'Parque / Zona Verde',
  };
}

export function useIsochronesLayer({
  map,
  showIsochrones,
  selectedCoords,
  report,
}: UseIsochronesLayerProps) {
  const facilityPopupRef = useRef<Popup | null>(null);

  // Update 15-minute walking catchment rings
  useEffect(() => {
    if (!map || !selectedCoords) return;

    const center: [number, number] = [selectedCoords.lon, selectedCoords.lat];
    const ring5m = createGeodesicCircle(center, 375, 64);
    const ring10m = createGeodesicCircle(center, 750, 64);
    const ring15m = createGeodesicCircle(center, 1125, 64);

    const isochronesGeoJson = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: { ring: '15m', minutes: 15, label: '15 min caminando (~1.125m)' },
          geometry: { type: 'Polygon', coordinates: [ring15m] },
        },
        {
          type: 'Feature',
          properties: { ring: '10m', minutes: 10, label: '10 min caminando (~750m)' },
          geometry: { type: 'Polygon', coordinates: [ring10m] },
        },
        {
          type: 'Feature',
          properties: { ring: '5m', minutes: 5, label: '5 min caminando (~375m)' },
          geometry: { type: 'Polygon', coordinates: [ring5m] },
        },
      ],
    };

    try {
      const source = map.getSource('walking-isochrones');
      if (source && typeof (source as any).setData === 'function') {
        (source as any).setData(isochronesGeoJson);
      }
    } catch {
      // Ignore
    }
  }, [map, selectedCoords?.lat, selectedCoords?.lon]);

  // Update facilities GeoJSON (curated landmark points to avoid map clutter)
  useEffect(() => {
    if (!map) return;

    const conn = report?.connectivity;
    if (!conn) {
      try {
        const source = map.getSource('civic-facilities-source');
        if (source && typeof (source as any).setData === 'function') {
          (source as any).setData({
            type: 'FeatureCollection',
            features: [],
          });
        }
      } catch {
        // Ignore
      }
      return;
    }

    const keyFacilities: CivicFacility[] = [];
    if (conn.nearestHealthcare) keyFacilities.push(conn.nearestHealthcare);
    if (conn.nearestEducation) keyFacilities.push(conn.nearestEducation);
    if (conn.nearestPark) keyFacilities.push(conn.nearestPark);
    if (conn.nearestTransit) keyFacilities.push(conn.nearestTransit);

    // At most ONE major train/subway hub from nearbyFacilities if within 800m
    if (conn.nearbyFacilities && conn.nearbyFacilities.length > 0) {
      const isMajorStation = (f: CivicFacility) => {
        const n = (f.name || '').toLowerCase();
        const s = (f.subtype || '').toLowerCase();
        return (
          s === 'train' ||
          s === 'commuter_rail' ||
          s === 'metro' ||
          n.includes('cercan') ||
          n.includes('renfe') ||
          n.includes('estaci')
        );
      };
      const majorStation = conn.nearbyFacilities.find(isMajorStation);
      if (
        majorStation &&
        majorStation.id !== conn.nearestTransit?.id &&
        majorStation.distanceMeters <= 800
      ) {
        keyFacilities.push(majorStation);
      }
    }

    // Deduplicate by ID and ensure valid numbers
    const seenIds = new Set<string>();
    const uniqueFacilities = keyFacilities.filter((fac) => {
      if (!fac || !fac.id || seenIds.has(fac.id)) return false;
      if (
        typeof fac.latitude !== 'number' ||
        typeof fac.longitude !== 'number' ||
        isNaN(fac.latitude) ||
        isNaN(fac.longitude)
      ) {
        return false;
      }
      seenIds.add(fac.id);
      return true;
    });

    const features = uniqueFacilities.map((fac) => {
      const cfg = getFacilityConfig(fac);

      return {
        type: 'Feature' as const,
        properties: {
          id: fac.id,
          name: fac.name,
          category: fac.type,
          subtype: fac.subtype,
          distanceMeters: fac.distanceMeters,
          walkTimeMinutes: fac.walkTimeMinutes,
          color: cfg.color,
          icon: cfg.icon,
          label: fac.name,
        },
        geometry: {
          type: 'Point' as const,
          coordinates: [fac.longitude, fac.latitude],
        },
      };
    });

    try {
      const source = map.getSource('civic-facilities-source');
      if (source && typeof (source as any).setData === 'function') {
        (source as any).setData({
          type: 'FeatureCollection',
          features,
        });
      }
    } catch {
      // Ignore
    }
  }, [map, report]);

  // Toggle visibility of isochrones and facilities
  useEffect(() => {
    if (!map) return;

    const isochroneLayers = [
      'isochrone-15m-fill',
      'isochrone-15m-line',
      'isochrone-10m-fill',
      'isochrone-10m-line',
      'isochrone-5m-fill',
      'isochrone-5m-line',
      'civic-facilities-glow',
      'civic-facilities-point',
      'civic-facilities-symbol',
    ];

    try {
      for (const layerId of isochroneLayers) {
        if (map.getLayer(layerId)) {
          map.setLayoutProperty(
            layerId,
            'visibility',
            showIsochrones ? 'visible' : 'none'
          );
        }
      }
    } catch {
      // Ignore
    }
  }, [map, showIsochrones]);

  // Interactive hover tooltip for civic facilities
  useEffect(() => {
    if (!map) return;

    const onMouseEnter = (e: any) => {
      if (!e.features || e.features.length === 0) return;
      const feat = e.features[0];
      const coords = feat.geometry.coordinates.slice() as [number, number];
      const p = feat.properties;

      map.getCanvas().style.cursor = 'pointer';

      if (!facilityPopupRef.current) {
        facilityPopupRef.current = new maplibregl.Popup({
          closeButton: false,
          closeOnClick: false,
          offset: 14,
        });
      }

      facilityPopupRef.current
        .setLngLat(coords)
        .setHTML(`
          <div style="font-family: system-ui, sans-serif; font-size: 12px; color: #f8fafc; padding: 4px 6px;">
            <div style="font-weight: 700; color: ${escapeHtml(p.color || '#38bdf8')}; margin-bottom: 2px;">${escapeHtml(p.name)}</div>
            <div style="font-size: 11px; color: #94a3b8;">${escapeHtml(p.subtype || p.category)} · <strong style="color: #ffffff;">${p.walkTimeMinutes} min</strong> (${p.distanceMeters}m)</div>
          </div>
        `)
        .addTo(map);
    };

    const onMouseLeave = () => {
      map.getCanvas().style.cursor = '';
      if (facilityPopupRef.current) {
        facilityPopupRef.current.remove();
      }
    };

    map.on('mouseenter', 'civic-facilities-point', onMouseEnter);
    map.on('mouseleave', 'civic-facilities-point', onMouseLeave);

    return () => {
      map.off('mouseenter', 'civic-facilities-point', onMouseEnter);
      map.off('mouseleave', 'civic-facilities-point', onMouseLeave);
      facilityPopupRef.current?.remove();
    };
  }, [map]);
}
