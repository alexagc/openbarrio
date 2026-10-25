import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as maplibregl from 'maplibre-gl';
import type { Map as MapLibreMap, Marker, MapMouseEvent } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  Layers,
  Maximize2,
  Loader2,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  X,
  Compass,
  Plus,
  Minus,
  Volume2,
  Waves,
  TrendingUp,
  Footprints,
  Navigation,
  Sun,
  Box,
} from 'lucide-react';
import { ExtendedAuditReport, apiClient } from '../services/api.client';
import { CartographicLegendsHud } from './CartographicLegendsHud';
import { SolarSimulationHud } from './map/SolarSimulationHud';
import {
  SeasonPreset,
  getMapLightConfig,
  generate3dBuildingFootprints,
  calculateBuildingShadowPolygon,
  getCardinalOrientation,
} from '../utils/solar';

export interface MapViewProps {
  selectedCoords?: { lat: number; lon: number };
  onMapClick: (lat: number, lon: number) => void;
  propertyName?: string;
  propertyAddress?: string;
  report?: ExtendedAuditReport | null;
  isLoading?: boolean;
  error?: string | null;
  onDismissError?: () => void;
  onViewReport?: () => void;
  onOpenUnitPicker?: () => void;
  isMobileLayersOpen?: boolean;
  onToggleMobileLayers?: (open?: boolean) => void;
  showFloatingAuditCard?: boolean;
  defaultLayersExpanded?: boolean;
}

export type BasemapType = 'dark-gis' | 'pnoa-satellite' | 'ign-base';

/**
 * Converts WGS84 geographic coordinates (lat, lon) to Spanish official ETRS89 / UTM Zone 30N projection.
 * Central meridian: 3° W (-3°). False Easting: 500,000m.
 */
export function wgs84ToUtm30n(lat: number, lon: number): { x: number; y: number; zone: string } {
  const a = 6378137.0; // semi-major axis
  const f = 1 / 298.257223563; // flattening
  const k0 = 0.9996; // scale factor
  const e2 = 2 * f - f * f;
  const ePrime2 = e2 / (1 - e2);

  const latRad = (lat * Math.PI) / 180;
  const lonRad = (lon * Math.PI) / 180;
  const lonOrigin = (-3 * Math.PI) / 180; // Central meridian for UTM Zone 30 (-3°)

  const N = a / Math.sqrt(1 - e2 * Math.sin(latRad) * Math.sin(latRad));
  const T = Math.tan(latRad) * Math.tan(latRad);
  const C = ePrime2 * Math.cos(latRad) * Math.cos(latRad);
  const A = Math.cos(latRad) * (lonRad - lonOrigin);

  const M =
    a *
    ((1 - e2 / 4 - (3 * e2 * e2) / 64 - (5 * e2 * e2 * e2) / 256) * latRad -
      ((3 * e2) / 8 + (3 * e2 * e2) / 32 + (45 * e2 * e2 * e2) / 1024) * Math.sin(2 * latRad) +
      ((15 * e2 * e2) / 256 + (45 * e2 * e2 * e2) / 1024) * Math.sin(4 * latRad) -
      ((35 * e2 * e2 * e2) / 3072) * Math.sin(6 * latRad));

  const x =
    500000 +
    k0 *
      N *
      (A +
        ((1 - T + C) * Math.pow(A, 3)) / 6 +
        ((5 - 18 * T + T * T + 72 * C - 58 * ePrime2) * Math.pow(A, 5)) / 120);

  const y =
    k0 *
    (M +
      N *
        Math.tan(latRad) *
        ((A * A) / 2 +
          ((5 - T + 9 * C + 4 * C * C) * Math.pow(A, 4)) / 24 +
          ((61 - 58 * T + T * T + 600 * C - 330 * ePrime2) * Math.pow(A, 6)) / 720));

  return {
    x: Math.round(x),
    y: Math.round(y),
    zone: '30N',
  };
}

function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, (m) => {
    switch (m) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      case "'":
        return '&#39;';
      default:
        return m;
    }
  });
}

export function createGeodesicCircle(
  center: [number, number],
  radiusMeters: number,
  points = 64
): number[][] {
  const [lon, lat] = center;
  const coords: number[][] = [];
  const km = radiusMeters / 1000;
  const distanceX = km / (111.32 * Math.cos((lat * Math.PI) / 180));
  const distanceY = km / 110.574;

  for (let i = 0; i <= points; i++) {
    const theta = (i / points) * (2 * Math.PI);
    const x = distanceX * Math.cos(theta);
    const y = distanceY * Math.sin(theta);
    coords.push([lon + x, lat + y]);
  }
  return coords;
}

const FACILITY_MAP_ICONS: Record<string, { color: string; path: string }> = {
  'fac-train': {
    color: '#e11d48',
    path: '<rect x="4" y="3" width="16" height="16" rx="2"/><path d="M4 11h16"/><path d="M12 3v8"/><path d="m8 19-2 3"/><path d="m18 22-2-3"/><circle cx="8" cy="15" r="1"/><circle cx="16" cy="15" r="1"/>',
  },
  'fac-metro': {
    color: '#0284c7',
    path: '<rect x="3" y="3" width="18" height="14" rx="2"/><path d="M7 21l3-4"/><path d="M17 21l-3-4"/><circle cx="7" cy="13" r="1"/><circle cx="17" cy="13" r="1"/><path d="M3 9h18"/>',
  },
  'fac-bus': {
    color: '#f59e0b',
    path: '<path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/>',
  },
  'fac-health': {
    color: '#f43f5e',
    path: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M12 7v6"/><path d="M9 10h6"/>',
  },
  'fac-education': {
    color: '#3b82f6',
    path: '<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
  },
  'fac-park': {
    color: '#10b981',
    path: '<path d="M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z"/><path d="M7 16v6"/><path d="M13 19v3"/><path d="M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7l-3.3-4.4a1 1 0 0 0-1.4 0L9 7.3"/>',
  },
};

function registerFacilityMapImages(map: MapLibreMap) {
  if (typeof window === 'undefined') return;
  const size = 32;
  for (const [id, def] of Object.entries(FACILITY_MAP_ICONS)) {
    try {
      if (typeof map.hasImage === 'function' && map.hasImage(id)) continue;
      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="14" fill="${def.color}" stroke="#ffffff" stroke-width="2.5"/>
          <g transform="translate(6, 6) scale(0.833)" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            ${def.path}
          </g>
        </svg>
      `;
      const img = new Image(size, size);
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
      img.onload = () => {
        try {
          if (typeof map.hasImage === 'function' && !map.hasImage(id)) {
            map.addImage(id, img);
          }
        } catch {
          // Ignore style transitions
        }
      };
    } catch {
      // Ignore during initial mounting
    }
  }
}

export function MapView({
  selectedCoords,
  onMapClick,
  propertyName,
  propertyAddress,
  report,
  isLoading = false,
  error = null,
  onDismissError,
  onViewReport,
  onOpenUnitPicker,
  isMobileLayersOpen,
  onToggleMobileLayers,
  showFloatingAuditCard = true,
  defaultLayersExpanded = true,
}: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const lastCenteredCoordsRef = useRef<{ lat: number; lon: number } | null>(null);
  const onMapClickRef = useRef(onMapClick);

  useEffect(() => {
    onMapClickRef.current = onMapClick;
  }, [onMapClick]);

  // Basemap & Thematic Layer States matching Stitch HUD
  const [activeBasemap, setActiveBasemap] = useState<BasemapType>('dark-gis');
  const [showCatastroWms, setShowCatastroWms] = useState<boolean>(true);
  const [showIneIncome, setShowIneIncome] = useState<boolean>(true);
  const [showMitecoNoise, setShowMitecoNoise] = useState<boolean>(false);
  const [showSncziFlood, setShowSncziFlood] = useState<boolean>(false);
  const [showIsochrones, setShowIsochrones] = useState<boolean>(true);
  const [is3DMode, setIs3DMode] = useState<boolean>(false);
  const [currentZoom, setCurrentZoom] = useState<number>(15);
  const [currentBearing, setCurrentBearing] = useState<number>(0);
  const [currentPitch, setCurrentPitch] = useState<number>(0);
  const [isSolarHudOpen, setIsSolarHudOpen] = useState<boolean>(true);
  const [currentSolarAzimuth, setCurrentSolarAzimuth] = useState<number>(214);
  const [currentSolarAltitude, setCurrentSolarAltitude] = useState<number>(38.2);

  const is3DModeRef = useRef<boolean>(is3DMode);
  useEffect(() => {
    is3DModeRef.current = is3DMode;
  }, [is3DMode]);

  const cachedCadastralGeometryRef = useRef<{
    refcat: string;
    polygon: number[][][];
    floors: number;
    height: number;
  } | null>(null);

  const currentSolarRef = useRef<{
    azimuth: number;
    altitude: number;
    directRadiationWm2: number;
    season: SeasonPreset;
    timeMinutes: number;
  }>({
    azimuth: 214,
    altitude: 38.2,
    directRadiationWm2: 842,
    season: 'summer',
    timeMinutes: 870,
  });

  // 3D building active geometry reference for dynamic shadow casting
  const currentBuildingCoordsRef = useRef<number[][][] | null>(null);
  const currentBuildingHeightRef = useRef<number>(44.8);

  const handleSolarChange = useCallback(
    (solar: {
      azimuth: number;
      altitude: number;
      directRadiationWm2: number;
      season: SeasonPreset;
      timeMinutes: number;
    }) => {
      currentSolarRef.current = solar;
      setCurrentSolarAzimuth(solar.azimuth);
      setCurrentSolarAltitude(solar.altitude);
      const map = mapRef.current;
      if (!map) return;
      try {
        if (typeof map.setLight === 'function') {
          const lightCfg = getMapLightConfig(solar.altitude, solar.azimuth);
          map.setLight({
            anchor: 'map',
            color: lightCfg.color,
            intensity: lightCfg.intensity,
            position: [1.5, solar.azimuth, Math.max(0, 90 - solar.altitude)],
          });
        }

        // Project real ground-plane shadow polygon from building footprint and sun vector
        const shadowSource = map.getSource('building-3d-shadows-source');
        if (
          shadowSource &&
          typeof (shadowSource as any).setData === 'function' &&
          currentBuildingCoordsRef.current
        ) {
          (shadowSource as any).setData(
            calculateBuildingShadowPolygon(
              currentBuildingCoordsRef.current,
              currentBuildingHeightRef.current,
              solar.azimuth,
              solar.altitude
            )
          );
        }
      } catch {
        // Ignore during style transitions
      }
    },
    []
  );

  // Mobile drawer / sheet state (Phase 11B)
  const [internalMobileLayersOpen, setInternalMobileLayersOpen] = useState<boolean>(false);
  const isLayersSheetOpen =
    isMobileLayersOpen !== undefined ? isMobileLayersOpen : internalMobileLayersOpen;

  const toggleMobileLayers = (open?: boolean) => {
    const next = open !== undefined ? open : !isLayersSheetOpen;
    setInternalMobileLayersOpen(next);
    onToggleMobileLayers?.(next);
  };

  // Layer opacity states (for mobile sliders and interactive adjustments)
  const [catastroOpacity, setCatastroOpacity] = useState<number>(0.95);
  const [ineOpacity, setIneOpacity] = useState<number>(0.75);
  const [noiseOpacity, setNoiseOpacity] = useState<number>(0.75);
  const [floodOpacity, setFloodOpacity] = useState<number>(0.75);

  // Mobile GPS Locate Me state
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // Desktop collapsible layer switcher state
  const [isDesktopLayersExpanded, setIsDesktopLayersExpanded] = useState<boolean>(defaultLayersExpanded);

  // Active thematic layers count for mobile FAB badge
  const activeThematicLayersCount = useMemo(() => {
    return [showCatastroWms, showIneIncome, showMitecoNoise, showSncziFlood, showIsochrones].filter(
      Boolean
    ).length;
  }, [showCatastroWms, showIneIncome, showMitecoNoise, showSncziFlood, showIsochrones]);

  // Real-time spatial telemetry state
  const [mapCenter, setMapCenter] = useState<{ lat: number; lon: number }>({
    lat: selectedCoords?.lat ?? 40.42028,
    lon: selectedCoords?.lon ?? -3.70379,
  });

  const utmCoords = useMemo(() => {
    return wgs84ToUtm30n(mapCenter.lat, mapCenter.lon);
  }, [mapCenter.lat, mapCenter.lon]);

  // Estimated elevation based on Spanish topography approximation
  const estimatedElevation = useMemo(() => {
    // Madrid plateau ~650m, coastal ~10-40m, inland ~400-800m
    const latDiff = Math.abs(mapCenter.lat - 40.42);
    const lonDiff = Math.abs(mapCenter.lon - -3.7);
    if (latDiff < 0.5 && lonDiff < 0.5) return 652;
    if (mapCenter.lon > 1.5 || mapCenter.lon < -8.0 || mapCenter.lat < 37.0) return 38;
    return 485;
  }, [mapCenter.lat, mapCenter.lon]);

  // Initialize MapLibre GL instance
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const initialLon = selectedCoords ? selectedCoords.lon : -3.70379;
    const initialLat = selectedCoords ? selectedCoords.lat : 40.42028;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
        sources: {
          // Esri World Dark Gray Canvas (High-precision dark GIS basemap, 100% free, zero API key)
          // Native server tiles are available up to zoom 16; setting maxzoom: 16 allows MapLibre to overzoom smoothly at z>=17
          'esri-dark': {
            type: 'raster',
            tiles: [
              'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
            ],
            tileSize: 256,
            maxzoom: 16,
            attribution:
              '&copy; <a href="https://www.esri.com" target="_blank">Esri</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
          },
          // Official IGN WMTS Basemap
          'ign-base': {
            type: 'raster',
            tiles: [
              'https://www.ign.es/wmts/ign-base?service=WMTS&request=GetTile&version=1.0.0&Format=image/png&layer=IGNBaseTodo&style=default&tilematrixset=GoogleMapsCompatible&TileMatrix={z}&TileRow={y}&TileCol={x}',
            ],
            tileSize: 256,
            attribution: '&copy; Instituto Geográfico Nacional (IGN España)',
          },
          // Official IGN PNOA Orthophoto (WMTS with CORS & persistent cache)
          'pnoa-base': {
            type: 'raster',
            tiles: [
              'https://www.ign.es/wmts/pnoa-ma?service=WMTS&request=GetTile&version=1.0.0&Format=image/jpeg&layer=OI.OrthoimageCoverage&style=default&tilematrixset=GoogleMapsCompatible&TileMatrix={z}&TileRow={y}&TileCol={x}',
            ],
            tileSize: 256,
            attribution: '&copy; Instituto Geográfico Nacional (PNOA)',
          },
          // Sede Electrónica del Catastro (OVC) Live WMS
          'catastro-wms': {
            type: 'raster',
            tiles: [
              'https://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx?SERVICE=WMS&SRS=EPSG:3857&REQUEST=GetMap&FORMAT=image/png&BBOX={bbox-epsg-3857}&WIDTH=256&HEIGHT=256&LAYERS=Catastro&TRANSPARENT=TRUE',
            ],
            tileSize: 256,
            attribution: '&copy; Dirección General del Catastro (España)',
          },
          // INE Atlas de Distribución de Renta de los Hogares (Official INE ADRH Income Choropleth MapServer)
          'ine-income-wms': {
            type: 'raster',
            tiles: [
              'https://www.ine.es/servergis/rest/services/ws/ADRH_renta_media_por_hogar/MapServer/export?bbox={bbox-epsg-3857}&size=256,256&f=image&transparent=true&bboxSR=3857&imageSR=3857',
            ],
            tileSize: 256,
            attribution: '&copy; Instituto Nacional de Estadística (INE ADRH)',
          },
          // MITECO SICA Noise WMS (Official MITECO GeoServer)
          'miteco-sica': {
            type: 'raster',
            tiles: [
              'https://gis.miteco.gob.es/geoserver/evaluacionambiental/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=TRUE&LAYERS=mer_carretera_lden,mer_aglomeracion_lden,mer_ferrocarril_lden,mer_aeropuerto_lden&STYLES=&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&BBOX={bbox-epsg-3857}',
            ],
            tileSize: 256,
            attribution: '&copy; MITECO SICA / MER',
          },
          // MITECO SNCZI Flood Risk WMS (Official MITECO GeoServer - T=10, 50, 100, 500 & ZFP)
          'miteco-snczi': {
            type: 'raster',
            tiles: [
              'https://gis.miteco.gob.es/geoserver/agua/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=TRUE&LAYERS=Zi_laminas_q10,Zi_laminas_q50,Zi_laminas_q100,Zi_laminas_q500,ZI_Laminas_ZFP&STYLES=&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&BBOX={bbox-epsg-3857}',
            ],
            tileSize: 256,
            attribution: '&copy; MITECO SNCZI',
          },
          // 15-Minute Walking Catchment Rings (GeoJSON Source)
          'walking-isochrones': {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [],
            },
          },
          // 3D Building Extrusion Footprints (GeoJSON Source)
          'building-3d-source': {
            type: 'geojson',
            data: generate3dBuildingFootprints(initialLat, initialLon),
          },
          // 3D Projected Ground Shadows Source
          'building-3d-shadows-source': {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [],
            },
          },
          // Civic Amenity Facilities Points (GPU-Anchored GeoJSON Source)
          'civic-facilities-source': {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [],
            },
          },
        },
        layers: [
          // 1. Dark GIS Basemap (Active by default)
          {
            id: 'esri-dark-layer',
            type: 'raster',
            source: 'esri-dark',
            minzoom: 0,
            maxzoom: 22,
            layout: { visibility: 'visible' },
          },
          // 2. PNOA Satellite Basemap
          {
            id: 'pnoa-layer',
            type: 'raster',
            source: 'pnoa-base',
            minzoom: 0,
            maxzoom: 20,
            layout: { visibility: 'none' },
          },
          // 3. IGN Vector Callejero
          {
            id: 'ign-layer',
            type: 'raster',
            source: 'ign-base',
            minzoom: 0,
            maxzoom: 20,
            layout: { visibility: 'none' },
          },
          // 4. INE Secciones Censales / Renta Overlay
          {
            id: 'ine-income-layer',
            type: 'raster',
            source: 'ine-income-wms',
            minzoom: 6,
            maxzoom: 20,
            paint: { 'raster-opacity': 0.75 },
            layout: { visibility: 'visible' },
          },
          // 5. MITECO SNCZI Flood Overlay
          {
            id: 'snczi-layer',
            type: 'raster',
            source: 'miteco-snczi',
            minzoom: 7,
            maxzoom: 19,
            paint: { 'raster-opacity': 0.75 },
            layout: { visibility: 'none' },
          },
          // 6. MITECO SICA Noise Overlay
          {
            id: 'sica-layer',
            type: 'raster',
            source: 'miteco-sica',
            minzoom: 7,
            maxzoom: 19,
            paint: { 'raster-opacity': 0.75 },
            layout: { visibility: 'none' },
          },
          // 7. Catastro Parcels Official WMS
          {
            id: 'catastro-layer',
            type: 'raster',
            source: 'catastro-wms',
            minzoom: 12,
            maxzoom: 20,
            paint: {
              'raster-opacity': 0.95,
              'raster-brightness-min': 0.85,
              'raster-brightness-max': 1.0,
              'raster-contrast': 0.5,
            },
            layout: { visibility: 'visible' },
          },
          // 8. 15-Minute Walking Isochrone Rings
          {
            id: 'isochrone-15m-fill',
            type: 'fill',
            source: 'walking-isochrones',
            filter: ['==', 'ring', '15m'],
            paint: {
              'fill-color': '#6366f1',
              'fill-opacity': 0.08,
            },
            layout: { visibility: 'visible' },
          },
          {
            id: 'isochrone-15m-line',
            type: 'line',
            source: 'walking-isochrones',
            filter: ['==', 'ring', '15m'],
            paint: {
              'line-color': '#6366f1',
              'line-width': 1.5,
              'line-dasharray': [4, 2],
              'line-opacity': 0.6,
            },
            layout: { visibility: 'visible' },
          },
          {
            id: 'isochrone-10m-fill',
            type: 'fill',
            source: 'walking-isochrones',
            filter: ['==', 'ring', '10m'],
            paint: {
              'fill-color': '#06b6d4',
              'fill-opacity': 0.10,
            },
            layout: { visibility: 'visible' },
          },
          {
            id: 'isochrone-10m-line',
            type: 'line',
            source: 'walking-isochrones',
            filter: ['==', 'ring', '10m'],
            paint: {
              'line-color': '#06b6d4',
              'line-width': 1.5,
              'line-dasharray': [3, 2],
              'line-opacity': 0.7,
            },
            layout: { visibility: 'visible' },
          },
          {
            id: 'isochrone-5m-fill',
            type: 'fill',
            source: 'walking-isochrones',
            filter: ['==', 'ring', '5m'],
            paint: {
              'fill-color': '#10b981',
              'fill-opacity': 0.15,
            },
            layout: { visibility: 'visible' },
          },
          {
            id: 'isochrone-5m-line',
            type: 'line',
            source: 'walking-isochrones',
            filter: ['==', 'ring', '5m'],
            paint: {
              'line-color': '#10b981',
              'line-width': 1.5,
              'line-dasharray': [2, 2],
              'line-opacity': 0.85,
            },
            layout: { visibility: 'visible' },
          },
          // Civic Amenities - GPU-Anchored Native WebGL Layers (Zero Zoom Drift)
          {
            id: 'civic-facilities-glow',
            type: 'circle',
            source: 'civic-facilities-source',
            minzoom: 11,
            paint: {
              'circle-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                12,
                6,
                15,
                12,
                18,
                18,
              ],
              'circle-color': ['get', 'color'],
              'circle-opacity': 0.35,
              'circle-blur': 0.6,
              'circle-pitch-alignment': 'map',
            },
          },
          {
            id: 'civic-facilities-point',
            type: 'circle',
            source: 'civic-facilities-source',
            minzoom: 11,
            paint: {
              'circle-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                12,
                5,
                15,
                8,
                18,
                12,
              ],
              'circle-color': ['get', 'color'],
              'circle-stroke-width': 2,
              'circle-stroke-color': '#ffffff',
              'circle-pitch-alignment': 'map',
            },
          },
          {
            id: 'civic-facilities-symbol',
            type: 'symbol',
            source: 'civic-facilities-source',
            minzoom: 11,
            layout: {
              'icon-image': ['get', 'icon'],
              'icon-size': [
                'interpolate',
                ['linear'],
                ['zoom'],
                11,
                0.75,
                14,
                0.95,
                17,
                1.15,
              ],
              'icon-allow-overlap': true,
              'icon-ignore-placement': true,
              'icon-pitch-alignment': 'viewport',
              'text-field': ['get', 'label'],
              'text-font': ['Open Sans Regular'],
              'text-size': [
                'interpolate',
                ['linear'],
                ['zoom'],
                13,
                10,
                16,
                11,
                19,
                12,
              ],
              'text-offset': [0, 1.6],
              'text-anchor': 'top',
              'text-allow-overlap': true,
              'text-ignore-placement': true,
              'text-pitch-alignment': 'viewport',
            },
            paint: {
              'text-color': '#ffffff',
              'text-halo-color': '#0b1326',
              'text-halo-width': 2.5,
              'text-halo-blur': 0.5,
            },
          },
          // 9. Projected Ground Shadows Layer (Cast below 3D Extrusion)
          {
            id: 'building-3d-ground-shadows',
            type: 'fill',
            source: 'building-3d-shadows-source',
            minzoom: 12,
            maxzoom: 22,
            layout: { visibility: 'none' },
            paint: {
              'fill-color': '#030712',
              'fill-opacity': 0.55,
            },
          },
          // 10. 3D Building Volumetric Extrusion Layer (LoD2 & Target Highlight)
          {
            id: 'building-3d-extrusion',
            type: 'fill-extrusion',
            source: 'building-3d-source',
            minzoom: 12,
            maxzoom: 22,
            layout: {
              visibility: 'none',
            },
            paint: {
              'fill-extrusion-color': [
                'case',
                ['boolean', ['get', 'isTarget'], false],
                '#68dba9',
                '#1e293b',
              ],
              'fill-extrusion-height': [
                'coalesce',
                ['get', 'height'],
                ['*', ['coalesce', ['get', 'numberOfFloors'], 4], 3.2],
              ],
              'fill-extrusion-base': 0,
              'fill-extrusion-opacity': 0.92,
            },
          },
        ],
      },
      center: [initialLon, initialLat],
      zoom: 15,
      pitch: 0,
      bearing: 0,
      maxZoom: 19,
      minZoom: 4,
    });

    map.on('zoom', () => {
      setCurrentZoom(Math.round(map.getZoom()));
    });

    map.on('rotate', () => {
      if (typeof map.getBearing === 'function') {
        setCurrentBearing(Math.round(map.getBearing()));
      }
    });

    map.on('pitch', () => {
      if (typeof map.getPitch === 'function') {
        setCurrentPitch(Math.round(map.getPitch()));
      }
    });

    map.on('moveend', () => {
      const center = map.getCenter();
      setMapCenter({
        lat: parseFloat(center.lat.toFixed(6)),
        lon: parseFloat(center.lng.toFixed(6)),
      });
    });

    map.getCanvas().style.cursor = 'crosshair';

    let clickTimeout: ReturnType<typeof setTimeout> | null = null;
    map.on('click', (e: MapMouseEvent) => {
      // In 3D mode, do not trigger coordinate re-selection on orbital navigation clicks
      if (is3DModeRef.current) return;
      const lat = parseFloat(e.lngLat.lat.toFixed(6));
      const lon = parseFloat(e.lngLat.lng.toFixed(6));
      if (clickTimeout) clearTimeout(clickTimeout);
      clickTimeout = setTimeout(() => {
        onMapClickRef.current(lat, lon);
      }, 250);
    });

    map.on('dblclick', () => {
      if (clickTimeout) {
        clearTimeout(clickTimeout);
        clickTimeout = null;
      }
    });

    // Interactive Hover Popup for Civic Facilities (Zero DOM Drift)
    const hoverFacilityPopup = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 14,
      className: 'stitch-dark-popup',
    });

    const handleFacilityMouseEnter = (e: any) => {
      map.getCanvas().style.cursor = 'pointer';
      if (!e.features || !e.features[0]) return;
      const feat = e.features[0];
      const props = feat.properties as any;
      const geom = feat.geometry as any;
      if (!geom || !geom.coordinates) return;
      const coords = geom.coordinates.slice() as [number, number];

      const html = `
        <div class="p-2.5 rounded-lg backdrop-blur-md shadow-2xl min-w-[210px] max-w-[280px] text-left select-none"
             style="background: rgba(19, 27, 46, 0.95); border: 1px solid ${props.color || '#68dba9'}; box-shadow: 0 10px 25px rgba(0,0,0,0.6);">
          <div class="flex items-center justify-between pb-1 mb-1.5 gap-2" style="border-bottom: 1px solid rgba(255,255,255,0.15);">
            <span class="text-[9px] font-bold uppercase tracking-wider font-mono flex items-center gap-1" style="color: ${props.color};">
              <span style="display:inline-block; width:6px; height:6px; border-radius:9999px; background:${props.color};"></span>
              ${escapeHtml(props.badge || 'Equipamiento')}
            </span>
            <span class="text-[9px] font-bold font-mono" style="color: #68dba9;">
              ~${props.walkTimeMinutes} min a pie
            </span>
          </div>
          <p class="font-bold text-white text-[11px] truncate mb-1 leading-snug">${escapeHtml(props.name || '')}</p>
          <div class="space-y-0.5 text-[9px] font-mono" style="color: rgba(255,255,255,0.75);">
            <div class="flex justify-between">
              <span>Distancia directa:</span>
              <span class="font-bold text-white">${props.distanceMeters} m</span>
            </div>
            <div class="flex justify-between">
              <span>Tiempo a pie:</span>
              <span class="font-bold text-white">${props.walkTimeMinutes} min (4.5 km/h)</span>
            </div>
            <div class="pt-1 text-[8px] truncate" style="border-top: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.5);">
              ${escapeHtml(props.sourceText || 'Datos oficiales')}
            </div>
          </div>
        </div>
      `;

      hoverFacilityPopup.setLngLat(coords).setHTML(html).addTo(map);
    };

    const handleFacilityMouseLeave = () => {
      map.getCanvas().style.cursor = is3DModeRef.current ? 'grab' : 'crosshair';
      hoverFacilityPopup.remove();
    };

    map.on('mouseenter', 'civic-facilities-symbol', handleFacilityMouseEnter);
    map.on('mouseenter', 'civic-facilities-point', handleFacilityMouseEnter);
    map.on('mouseleave', 'civic-facilities-symbol', handleFacilityMouseLeave);
    map.on('mouseleave', 'civic-facilities-point', handleFacilityMouseLeave);

    map.on('click', 'civic-facilities-symbol', (e) => {
      e.originalEvent?.stopPropagation();
    });
    map.on('click', 'civic-facilities-point', (e) => {
      e.originalEvent?.stopPropagation();
    });

    map.on('load', () => {
      registerFacilityMapImages(map);
      map.resize();
    });

    registerFacilityMapImages(map);
    mapRef.current = map;

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && mapContainerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        map.resize();
      });
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      hoverFacilityPopup.remove();
      resizeObserver?.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Resilient Basemap & Thematic Layer Visibility Updates
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const applyVisibility = () => {
      const setVis = (layerId: string, visible: boolean) => {
        try {
          const hasLayer = typeof map.getLayer === 'function' ? Boolean(map.getLayer(layerId)) : true;
          if (hasLayer && typeof map.setLayoutProperty === 'function') {
            map.setLayoutProperty(layerId, 'visibility', visible ? 'visible' : 'none');
          }
        } catch {
          // Gracefully ignore during style reloads
        }
      };

      setVis('esri-dark-layer', activeBasemap === 'dark-gis');
      setVis('pnoa-layer', activeBasemap === 'pnoa-satellite');
      setVis('ign-layer', activeBasemap === 'ign-base');
      setVis('catastro-layer', showCatastroWms);
      setVis('ine-income-layer', showIneIncome);
      setVis('sica-layer', showMitecoNoise);
      setVis('snczi-layer', showSncziFlood);

      // Adjust Catastro parcel line contrast dynamically:
      // Dark GIS and Satellite: brighten parcel boundary lines so they contrast sharply as white lines
      // IGN base (light): standard contrast (crisp dark parcel lines)
      try {
        const hasCatastro = typeof map.getLayer === 'function' ? Boolean(map.getLayer('catastro-layer')) : true;
        if (hasCatastro && typeof map.setPaintProperty === 'function') {
          const isDark = activeBasemap === 'dark-gis' || activeBasemap === 'pnoa-satellite';
          map.setPaintProperty('catastro-layer', 'raster-brightness-min', isDark ? 0.85 : 0.0);
          map.setPaintProperty('catastro-layer', 'raster-brightness-max', 1.0);
          map.setPaintProperty('catastro-layer', 'raster-contrast', isDark ? 0.5 : 0.0);
        }
      } catch {
        // Gracefully ignore during style reloads
      }
    };

    applyVisibility();

    if (typeof map.on === 'function') {
      map.on('load', applyVisibility);
      map.on('styledata', applyVisibility);
    }

    return () => {
      if (typeof map.off === 'function') {
        map.off('load', applyVisibility);
        map.off('styledata', applyVisibility);
      }
    };
  }, [activeBasemap, showCatastroWms, showIneIncome, showMitecoNoise, showSncziFlood]);

  // Toggle 3D Axonometric Tilt & Building Volumetric Extrusion
  const toggle3DMode = (forceState?: boolean) => {
    const map = mapRef.current;
    if (!map) return;

    const nextMode = forceState !== undefined ? forceState : !is3DMode;
    setIs3DMode(nextMode);

    if (nextMode) {
      setIsSolarHudOpen(true);
      map.easeTo({
        pitch: 55,
        bearing: -15,
        offset: [0, -80],
        duration: 1000,
      });
    } else {
      map.easeTo({
        pitch: 0,
        bearing: 0,
        offset: [0, 0],
        duration: 800,
      });
    }
  };

  // Synchronize 3D building extrusion layer visibility with 3D mode
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const applyExtrusionVis = () => {
      try {
        const hasExtrusion = typeof map.getLayer === 'function' ? Boolean(map.getLayer('building-3d-extrusion')) : true;
        if (hasExtrusion && typeof map.setLayoutProperty === 'function') {
          map.setLayoutProperty('building-3d-extrusion', 'visibility', is3DMode ? 'visible' : 'none');
        }
        const hasShadows = typeof map.getLayer === 'function' ? Boolean(map.getLayer('building-3d-ground-shadows')) : true;
        if (hasShadows && typeof map.setLayoutProperty === 'function') {
          map.setLayoutProperty('building-3d-ground-shadows', 'visibility', is3DMode ? 'visible' : 'none');
        }
      } catch {
        // Ignore during style transitions
      }
    };

    applyExtrusionVis();
    if (typeof map.on === 'function') {
      map.on('load', applyExtrusionVis);
      map.on('styledata', applyExtrusionVis);
    }
    return () => {
      if (typeof map.off === 'function') {
        map.off('load', applyExtrusionVis);
        map.off('styledata', applyExtrusionVis);
      }
    };
  }, [is3DMode]);

  // Synchronize dynamic MapLibre light with astronomical solar position when 3D mode toggles
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !is3DMode) return;

    try {
      if (typeof map.setLight === 'function') {
        const solar = currentSolarRef.current;
        const lightCfg = getMapLightConfig(solar.altitude, solar.azimuth);
        map.setLight({
          anchor: 'map',
          color: lightCfg.color,
          intensity: lightCfg.intensity,
          position: [1.5, solar.azimuth, Math.max(0, 90 - solar.altitude)],
        });
      }
    } catch {
      // Ignore during style transitions
    }
  }, [is3DMode]);

  // Update 3D building extrusion footprints when target parcel changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    let isSubscribed = true;
    const lat = selectedCoords?.lat ?? mapCenter.lat;
    const lon = selectedCoords?.lon ?? mapCenter.lon;
    const refcat = report?.property.cadastralReference;
    const floors = report?.property.building?.unitsCount
      ? Math.min(18, Math.max(4, Math.round(report.property.building.unitsCount / 2)))
      : 14;
    const height = report?.property.building?.builtSurfaceM2
      ? Math.min(90, Math.max(16, floors * 3.2))
      : 44.8;
    const name = propertyName || 'Edificio en Auditoría';

    const updateExtrusion = (customPolygon?: number[][][], overrideFloors?: number, overrideHeight?: number) => {
      if (!customPolygon || customPolygon.length === 0 || !customPolygon[0] || customPolygon[0].length < 4) {
        try {
          const source = map.getSource('building-3d-source');
          if (source && typeof (source as any).setData === 'function') {
            (source as any).setData({ type: 'FeatureCollection', features: [] });
          }
          const shadowSource = map.getSource('building-3d-shadows-source');
          if (shadowSource && typeof (shadowSource as any).setData === 'function') {
            (shadowSource as any).setData({ type: 'FeatureCollection', features: [] });
          }
        } catch {}
        return;
      }
      const effFloors = overrideFloors ?? floors;
      const effHeight = overrideHeight ?? height;
      currentBuildingHeightRef.current = effHeight;

      try {
        const source = map.getSource('building-3d-source');
        if (source && typeof (source as any).setData === 'function') {
          const footprints = generate3dBuildingFootprints(
            lat,
            lon,
            effFloors,
            effHeight,
            name,
            customPolygon
          );
          (source as any).setData(footprints);
          currentBuildingCoordsRef.current =
            customPolygon || footprints.features[0].geometry.coordinates;

          // Immediately cast initial shadow
          const shadowSource = map.getSource('building-3d-shadows-source');
          if (
            shadowSource &&
            typeof (shadowSource as any).setData === 'function' &&
            currentBuildingCoordsRef.current
          ) {
            const solar = currentSolarRef.current;
            (shadowSource as any).setData(
              calculateBuildingShadowPolygon(
                currentBuildingCoordsRef.current,
                effHeight,
                solar.azimuth,
                solar.altitude
              )
            );
          }
        }
      } catch {
        // Ignore during initialization
      }
    };

    // If we have cached geometry for this refcat, use it immediately
    if (refcat && cachedCadastralGeometryRef.current?.refcat === refcat) {
      const cached = cachedCadastralGeometryRef.current;
      updateExtrusion(cached.polygon, cached.floors, cached.height);
      return;
    }

    // Do not draw artificial square box before real Catastro WFS geometry arrives

    // Query official Catastro WFS geometry if cadastral reference is available
    if (refcat) {
      apiClient
        .getCadastralGeometry(refcat)
        .then((geom) => {
          if (!isSubscribed) return;
          if (geom && geom.geometry && geom.geometry.coordinates) {
            cachedCadastralGeometryRef.current = {
              refcat,
              polygon: geom.geometry.coordinates,
              floors: geom.properties.numberOfFloors,
              height: geom.properties.height,
            };
            updateExtrusion(
              geom.geometry.coordinates,
              geom.properties.numberOfFloors,
              geom.properties.height
            );
          }
        })
        .catch(() => {
          // Keep existing polygon on error
        });
    }

    return () => {
      isSubscribed = false;
    };
  }, [selectedCoords?.lat, selectedCoords?.lon, report?.property.cadastralReference, propertyName]);

  const handleZoomIn = () => {
    mapRef.current?.zoomIn({ duration: 300 });
  };

  const handleZoomOut = () => {
    mapRef.current?.zoomOut({ duration: 300 });
  };

  const handleResetNorth = () => {
    mapRef.current?.resetNorthPitch({ duration: 600 });
    setCurrentBearing(0);
    setCurrentPitch(0);
  };

  const resetToSpain = () => {
    if (!mapRef.current) return;
    mapRef.current.flyTo({
      center: [-3.70379, 40.42028],
      zoom: 6,
      pitch: 0,
      bearing: 0,
      duration: 1200,
    });
    setIs3DMode(false);
  };

  // Dynamically synchronize opacity changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    try {
      if (typeof map.setPaintProperty === 'function') {
        const getL =
          typeof map.getLayer === 'function' ? (id: string) => Boolean(map.getLayer(id)) : () => true;
        if (getL('catastro-layer')) {
          map.setPaintProperty('catastro-layer', 'raster-opacity', catastroOpacity);
        }
        if (getL('ine-income-layer')) {
          map.setPaintProperty('ine-income-layer', 'raster-opacity', ineOpacity);
        }
        if (getL('sica-layer')) {
          map.setPaintProperty('sica-layer', 'raster-opacity', noiseOpacity);
        }
        if (getL('snczi-layer')) {
          map.setPaintProperty('snczi-layer', 'raster-opacity', floodOpacity);
        }
      }
    } catch {
      // Gracefully ignore during style transitions
    }
  }, [catastroOpacity, ineOpacity, noiseOpacity, floodOpacity]);

  // GPS Locate Me handler (Phase 11B)
  const handleLocateMe = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const lat = parseFloat(pos.coords.latitude.toFixed(6));
        const lon = parseFloat(pos.coords.longitude.toFixed(6));
        mapRef.current?.flyTo({
          center: [lon, lat],
          zoom: 16,
          essential: true,
          duration: 1000,
        });
        onMapClickRef.current(lat, lon);
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation error:', err.message);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 }
    );
  };

  // Update Marker & Target Parcel Flag when coordinates change
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedCoords) {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
      return;
    }

    const { lat, lon } = selectedCoords;

    const isMatchingReport =
      Boolean(report) &&
      !isLoading &&
      Math.abs((report?.property.coordinates.latitude ?? 0) - lat) < 0.05 &&
      Math.abs((report?.property.coordinates.longitude ?? 0) - lon) < 0.05;

    const unitSuffix = isMatchingReport && report?.property.unit
      ? ` (Planta ${report.property.unit.floor} · Puerta ${report.property.unit.door})`
      : '';
    const safeTitle = escapeHtml(
      isMatchingReport && propertyName ? `${propertyName}${unitSuffix}` : `Punto seleccionado (${lat.toFixed(5)}, ${lon.toFixed(5)})`
    );

    // Create custom Stitch-themed modern neon amber radar target beacon (larger, high-tech)
    const el = document.createElement('div');
    el.className = 'group relative w-8 h-8 flex items-center justify-center cursor-pointer select-none';
    el.setAttribute('title', safeTitle);
    el.style.zIndex = '30';
    el.innerHTML = `
      <div class="relative flex items-center justify-center">
        <!-- Modern radar wave ping & pulse rings (strictly pointer-events-none) -->
        <div class="absolute w-16 h-16 bg-amber-500/20 rounded-full animate-ping pointer-events-none"></div>
        <div class="absolute w-10 h-10 bg-amber-400/30 rounded-full animate-pulse border border-amber-400/60 pointer-events-none"></div>

        <!-- High-tech precision reticle & glowing beacon core -->
        <div class="relative w-7 h-7 bg-surface-container-lowest text-amber-400 rounded-full flex items-center justify-center shadow-2xl border-2 border-amber-400 transform transition-transform duration-200 group-hover:scale-125">
          <div class="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b] flex items-center justify-center">
            <div class="w-1 h-1 rounded-full bg-white"></div>
          </div>
        </div>

        <!-- Micro chip label on hover (discrete single-line, does not obscure parcel) -->
        <div class="absolute -top-8 hidden group-hover:flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container-highest/95 backdrop-blur border border-amber-400/50 text-[10px] font-mono font-semibold text-on-surface whitespace-nowrap shadow-2xl pointer-events-none z-50">
          <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
          <span>${safeTitle}</span>
        </div>
      </div>
    `;

    // Dynamic stacking context elevation on hover & click isolation
    el.addEventListener('mouseenter', () => {
      el.style.zIndex = '999';
      if (el.parentElement) el.parentElement.style.zIndex = '999';
    });
    el.addEventListener('mouseleave', () => {
      el.style.zIndex = '30';
      if (el.parentElement) el.parentElement.style.zIndex = '';
    });
    el.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    if (markerRef.current) {
      markerRef.current.remove();
    }

    const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
      .setLngLat([lon, lat])
      .addTo(map);

    markerRef.current = marker;

    const last = lastCenteredCoordsRef.current;
    if (!last || Math.abs(last.lat - lat) > 0.0005 || Math.abs(last.lon - lon) > 0.0005) {
      lastCenteredCoordsRef.current = { lat, lon };
      const center = map.getCenter();
      const dist = Math.hypot(center.lat - lat, center.lng - lon);
      if (dist > 0.001) {
        map.flyTo({
          center: [lon, lat],
          zoom: Math.max(map.getZoom(), 16),
          essential: true,
          duration: 800,
        });
      }
    }
  }, [selectedCoords, propertyName, propertyAddress, report]);

  // Synchronize 15-Minute Walking Catchment Isochrones
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const updateIsochrones = () => {
      try {
        const source = map.getSource('walking-isochrones') as maplibregl.GeoJSONSource;
        if (!source || typeof source.setData !== 'function') return;

        if (!showIsochrones || is3DMode || !selectedCoords) {
          source.setData({ type: 'FeatureCollection', features: [] });
          return;
        }

        const center: [number, number] = [selectedCoords.lon, selectedCoords.lat];
        const isochronesGeoJson = {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: { ring: '15m' },
              geometry: {
                type: 'Polygon',
                coordinates: [createGeodesicCircle(center, 1200)],
              },
            },
            {
              type: 'Feature',
              properties: { ring: '10m' },
              geometry: {
                type: 'Polygon',
                coordinates: [createGeodesicCircle(center, 800)],
              },
            },
            {
              type: 'Feature',
              properties: { ring: '5m' },
              geometry: {
                type: 'Polygon',
                coordinates: [createGeodesicCircle(center, 400)],
              },
            },
          ],
        };

        source.setData(isochronesGeoJson as any);
      } catch {
        // Source not ready yet
      }
    };

    updateIsochrones();
    if (typeof map.on === 'function') {
      map.on('styledata', updateIsochrones);
    }
    return () => {
      if (typeof map.off === 'function') {
        map.off('styledata', updateIsochrones);
      }
    };
  }, [selectedCoords, showIsochrones, is3DMode]);

  // Synchronize Civic Amenities on GPU-Anchored Native WebGL Layer (Zero Zoom Drift)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const updateFacilities = () => {
      try {
        registerFacilityMapImages(map);
        const source = map.getSource('civic-facilities-source') as maplibregl.GeoJSONSource;
        if (!source || typeof source.setData !== 'function') return;

        if (!selectedCoords || !report?.connectivity) {
          source.setData({ type: 'FeatureCollection', features: [] });
          return;
        }

        const conn = report.connectivity;
        const { lat, lon } = selectedCoords;

        // Collect essential facilities (health, education, transit, park)
        const targetFacilities: CivicFacility[] = [];

        if (conn.nearestHealthcare) targetFacilities.push(conn.nearestHealthcare);
        if (conn.nearestEducation) targetFacilities.push(conn.nearestEducation);
        if (conn.nearestPark) targetFacilities.push(conn.nearestPark);

        // Transit: include nearest bus stop AND nearest train/metro station (if within 800m)
        if (conn.nearestTransit) {
          targetFacilities.push(conn.nearestTransit);
        }
        if (conn.nearbyFacilities && conn.nearbyFacilities.length > 0) {
          const isTrain = (f: CivicFacility) => {
            const n = (f.name || '').toLowerCase();
            return (
              f.subtype === 'train' ||
              f.subtype === 'metro' ||
              n.includes('cercan') ||
              n.includes('renfe') ||
              n.includes('estaci')
            );
          };
          const nearestTrain = conn.nearbyFacilities.find(isTrain);
          if (
            nearestTrain &&
            nearestTrain.id !== conn.nearestTransit?.id &&
            nearestTrain.distanceMeters <= 800
          ) {
            targetFacilities.push(nearestTrain);
          }
        }

        // Deduplicate facilities by ID
        const seenIds = new Set<string>();
        const uniqueFacilities = targetFacilities.filter((f) => {
          if (!f || !f.id || seenIds.has(f.id)) return false;
          seenIds.add(f.id);
          return true;
        });

        const resolveItemMeta = (fac: CivicFacility) => {
          const nameLower = (fac.name || '').toLowerCase();
          const subtype = (fac.subtype || '').toLowerCase();

          if (fac.type === 'transit') {
            if (subtype === 'train' || nameLower.includes('cercan') || nameLower.includes('renfe')) {
              return {
                icon: 'fac-train',
                shortBadge: 'Cercanías',
                badge: 'Cercanías / Tren',
                color: '#e11d48',
                sourceText: 'Renfe Cercanías / Consorcio Regional de Transportes',
              };
            }
            if (subtype === 'metro' || nameLower.includes('metro')) {
              return {
                icon: 'fac-metro',
                shortBadge: 'Metro',
                badge: 'Metro de Madrid',
                color: '#0284c7',
                sourceText: 'Metro / Consorcio Regional de Transportes',
              };
            }
            return {
              icon: 'fac-bus',
              shortBadge: 'Bus EMT',
              badge: 'Autobús EMT',
              color: '#f59e0b',
              sourceText: 'EMT Madrid / Consorcio Regional de Transportes',
            };
          }

          if (fac.type === 'healthcare') {
            const isHospital = subtype === 'hospital' || nameLower.includes('hospital');
            return {
              icon: 'fac-health',
              shortBadge: isHospital ? 'Hospital' : 'C. Salud',
              badge: isHospital ? 'Hospital Universitario' : 'Centro de Salud / CAP',
              color: '#f43f5e',
              sourceText: 'Registro REPS · Ministerio de Sanidad',
            };
          }

          if (fac.type === 'education') {
            const isHighSchool =
              subtype === 'high_school' || nameLower.includes('ies') || nameLower.includes('instituto');
            return {
              icon: 'fac-education',
              shortBadge: isHighSchool ? 'IES' : 'Colegio',
              badge: isHighSchool ? 'Instituto de Secundaria' : 'Colegio / Formación Profesional',
              color: '#3b82f6',
              sourceText: 'Registro Estatal Centros Docentes (MEFP)',
            };
          }

          return {
            icon: 'fac-park',
            shortBadge: 'Parque',
            badge: 'Parque / Zonas Verdes',
            color: '#10b981',
            sourceText: 'Inventario Municipal Áreas Verdes / IGN',
          };
        };

        const features = uniqueFacilities
          .filter((fac) => typeof fac.latitude === 'number' && typeof fac.longitude === 'number' && !isNaN(fac.latitude) && !isNaN(fac.longitude))
          .map((fac) => {
            const meta = resolveItemMeta(fac);
            const fLat = fac.latitude!;
            const fLon = fac.longitude!;

            return {
              type: 'Feature' as const,
              geometry: {
                type: 'Point' as const,
                coordinates: [fLon, fLat],
              },
            properties: {
              id: fac.id,
              name: fac.name,
              icon: meta.icon,
              type: fac.type,
              subtype: fac.subtype,
              distanceMeters: fac.distanceMeters,
              walkTimeMinutes: Math.round(fac.walkTimeMinutes),
              color: meta.color,
              badge: meta.badge,
              sourceText: meta.sourceText,
              label: `${meta.shortBadge}: ${fac.name} (${fac.distanceMeters}m)`,
            },
          };
        });

        source.setData({
          type: 'FeatureCollection',
          features,
        });
      } catch {
        // Source not ready yet
      }
    };

    updateFacilities();
    if (typeof map.on === 'function') {
      map.on('styledata', updateFacilities);
    }
    return () => {
      if (typeof map.off === 'function') {
        map.off('styledata', updateFacilities);
      }
    };
  }, [selectedCoords?.lat, selectedCoords?.lon, report?.connectivity, report?.property.cadastralReference]);

  return (
    <div className="relative w-full h-full min-h-[480px] rounded-xl overflow-hidden border border-outline-variant shadow-2xl bg-surface-container-lowest cadastral-grid select-none">
      {/* MapLibre WebGL Canvas Container */}
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />

      {/* ================= MOBILE ETRS89 UTM HUD PILL (Top-Left) ================= */}
      <div
        className="block lg:hidden absolute top-3 left-3 z-20 no-print pointer-events-none"
        data-testid="mobile-utm-hud"
      >
        <div className="bg-surface-container-low/95 backdrop-blur-sm border border-outline-variant px-3 py-1.5 rounded-full text-[10px] font-mono text-on-surface flex items-center gap-2 shadow-lg max-w-[calc(100vw-130px)] truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shrink-0" />
          <span className="truncate">
            {`UTM 30N: ${utmCoords.x}, ${utmCoords.y} · ${estimatedElevation}m s.n.m.`}
          </span>
        </div>
      </div>

      {/* ================= FLOATING HUD: LAYER SWITCHER WIDGET (Top-Left, Desktop) ================= */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="hidden lg:block absolute top-3 left-3 z-20 no-print"
      >
        {!isDesktopLayersExpanded ? (
          <button
            type="button"
            onClick={() => setIsDesktopLayersExpanded(true)}
            className="bg-surface-container-low/95 backdrop-blur-md border border-outline-variant hover:border-primary px-3 py-1.5 rounded-full text-xs font-mono text-on-surface flex items-center gap-2 shadow-xl hover:bg-surface-container transition-all cursor-pointer"
            title="Abrir selector de capas temáticas"
            data-testid="desktop-layers-toggle"
          >
            <Layers className="w-4 h-4 text-primary" />
            <span className="font-semibold">Capas GIS</span>
            {activeThematicLayersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-primary text-on-primary text-[10px] font-bold flex items-center justify-center">
                {activeThematicLayersCount}
              </span>
            )}
            <ChevronDown className="w-3.5 h-3.5 text-on-surface-variant" />
          </button>
        ) : (
          <div className="bg-surface-container-low/95 backdrop-blur-md border border-outline-variant rounded p-2.5 shadow-2xl w-64 text-on-surface animate-in fade-in duration-150">
            {/* HUD Title Bar */}
            <div className="flex items-center justify-between border-b border-outline-variant/60 pb-1.5 mb-2">
              <span className="text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5 text-primary font-mono">
                <Layers className="w-3.5 h-3.5 text-primary" />
                <span>Capas Temáticas GIS</span>
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-mono text-outline">v4.2 ETRS89</span>
                <button
                  type="button"
                  onClick={() => setIsDesktopLayersExpanded(false)}
                  className="p-0.5 rounded hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                  title="Minimizar panel de capas"
                  aria-label="Minimizar panel de capas"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

        {/* Basemap Selector Pills */}
        <div className="grid grid-cols-3 gap-1 p-0.5 bg-surface-container rounded border border-outline-variant/60 mb-2.5 text-[10px] font-mono">
          <button
            type="button"
            onClick={() => setActiveBasemap('dark-gis')}
            className={`py-1 rounded text-center transition font-semibold cursor-pointer ${
              activeBasemap === 'dark-gis'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Dark GIS
          </button>
          <button
            type="button"
            onClick={() => setActiveBasemap('pnoa-satellite')}
            className={`py-1 rounded text-center transition font-semibold cursor-pointer ${
              activeBasemap === 'pnoa-satellite'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Satélite
          </button>
          <button
            type="button"
            onClick={() => setActiveBasemap('ign-base')}
            className={`py-1 rounded text-center transition font-semibold cursor-pointer ${
              activeBasemap === 'ign-base'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            IGN
          </button>
        </div>

        {/* Thematic Overlays Switcher */}
        <div className="space-y-1.5 text-xs font-mono">
          {/* Layer 1: Catastro Parcels */}
          <label className="flex items-center justify-between p-1.5 rounded bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer border border-secondary-container/40">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showCatastroWms}
                onChange={(e) => setShowCatastroWms(e.target.checked)}
                className="rounded-sm bg-surface-container-lowest border-outline-variant text-secondary-container focus:ring-0 w-3.5 h-3.5 cursor-pointer"
              />
              <span className="text-[11px] text-on-surface font-sans font-medium">Catastro Parcels</span>
            </div>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-secondary-container/20 text-secondary border border-secondary-container/40">
              {showCatastroWms ? 'Activo' : 'Off'}
            </span>
          </label>

          {/* Layer 2: INE Income Heatmap */}
          <label className="flex items-center justify-between p-1.5 rounded bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer border border-tertiary/30">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showIneIncome}
                onChange={(e) => setShowIneIncome(e.target.checked)}
                className="rounded-sm bg-surface-container-lowest border-outline-variant text-tertiary focus:ring-0 w-3.5 h-3.5 cursor-pointer"
              />
              <span className="text-[11px] text-on-surface font-sans font-medium flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-tertiary" />
                <span>INE Renta (ADRH)</span>
              </span>
            </div>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-tertiary-container/30 text-tertiary border border-tertiary/40">
              {showIneIncome ? 'ADRH 2024' : 'Off'}
            </span>
          </label>

          {/* Layer 3: MITECO Noise (SICA) */}
          <label className="flex items-center justify-between p-1.5 rounded bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer border border-outline-variant/40 opacity-80 hover:opacity-100">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showMitecoNoise}
                onChange={(e) => setShowMitecoNoise(e.target.checked)}
                className="rounded-sm bg-surface-container-lowest border-outline-variant text-primary focus:ring-0 w-3.5 h-3.5 cursor-pointer"
              />
              <span className="text-[11px] text-on-surface-variant font-sans flex items-center gap-1">
                <Volume2 className="w-3 h-3 text-primary" />
                <span>MITECO Ruido</span>
              </span>
            </div>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-surface-variant text-outline">
              {showMitecoNoise ? 'SICA Lden' : 'Inactivo'}
            </span>
          </label>

          {/* Layer 4: SNCZI Flood Risk */}
          <label className="flex items-center justify-between p-1.5 rounded bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer border border-outline-variant/40 opacity-80 hover:opacity-100">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showSncziFlood}
                onChange={(e) => setShowSncziFlood(e.target.checked)}
                className="rounded-sm bg-surface-container-lowest border-outline-variant text-primary focus:ring-0 w-3.5 h-3.5 cursor-pointer"
              />
              <span className="text-[11px] text-on-surface-variant font-sans flex items-center gap-1">
                <Waves className="w-3 h-3 text-blue-400" />
                <span>SNCZI Inundación</span>
              </span>
            </div>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-surface-variant text-outline">
              {showSncziFlood ? 'T=10..500a' : 'Inactivo'}
            </span>
          </label>

          {/* Layer 5: 15-Minute Walking Catchment Rings */}
          <label className="flex items-center justify-between p-1.5 rounded bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer border border-primary/30">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showIsochrones}
                onChange={(e) => setShowIsochrones(e.target.checked)}
                className="rounded-sm bg-surface-container-lowest border-outline-variant text-primary focus:ring-0 w-3.5 h-3.5 cursor-pointer"
              />
              <span className="text-[11px] text-on-surface font-sans font-medium flex items-center gap-1">
                <Footprints className="w-3 h-3 text-primary" />
                <span>Isocronas 15 min</span>
              </span>
            </div>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-primary-container/20 text-primary border border-primary/30">
              {showIsochrones ? '5/10/15m' : 'Inactivo'}
            </span>
          </label>
        </div>

        {/* Quick navigation to active river basin flood cartography */}
        {showSncziFlood && (
          <div className="mt-2 bg-blue-500/10 border border-blue-500/30 text-blue-300 text-[10px] font-sans px-2 py-1.5 rounded flex items-center justify-between gap-1.5">
            <span>Zona fluvial oficial (Zaragoza · Ebro)</span>
            <button
              type="button"
              onClick={() => mapRef.current?.flyTo({ center: [-0.878, 41.656], zoom: 14, duration: 800 })}
              className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-200 border border-blue-500/40 text-[9px] font-mono hover:bg-blue-500/30 transition shrink-0 cursor-pointer"
            >
              Ver Ebro
            </button>
          </div>
        )}

        {/* Zoom Hint for Cadastre & Thematic Layers */}
        {showCatastroWms && currentZoom < 12 && (
          <div className="mt-2 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-sans px-2 py-1.5 rounded flex items-center justify-between gap-1.5">
            <span>Acércate (Zoom &ge; 12) para parcelas.</span>
            <button
              type="button"
              onClick={() => mapRef.current?.zoomTo(14, { duration: 600 })}
              className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-200 border border-amber-500/40 text-[9px] font-mono hover:bg-amber-500/30 transition shrink-0 cursor-pointer"
            >
              Acercar
            </button>
          </div>
        )}
        {(showMitecoNoise || showSncziFlood || showIneIncome) && currentZoom < 7 && (
          <div className="mt-1.5 bg-blue-500/10 border border-blue-500/30 text-blue-300 text-[10px] font-sans px-2 py-1.5 rounded flex items-center justify-between gap-1.5">
            <span>Acércate (Zoom &ge; 7) para capas.</span>
            <button
              type="button"
              onClick={() => mapRef.current?.zoomTo(8, { duration: 600 })}
              className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-200 border border-blue-500/40 text-[9px] font-mono hover:bg-blue-500/30 transition shrink-0 cursor-pointer"
            >
              Acercar
            </button>
          </div>
        )}
          </div>
        )}
      </div>

      {/* ================= MOBILE TOUCH FAB TOOLBAR (Top-Right, >=44x44px) ================= */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex lg:hidden absolute top-3 right-3 z-30 flex-col gap-2 items-end no-print"
        data-testid="mobile-fab-toolbar"
      >
        {/* 1) Layers FAB with active counter badge */}
        <button
          type="button"
          onClick={() => toggleMobileLayers()}
          className="relative w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-surface-container-low/95 backdrop-blur-md border border-outline-variant text-on-surface flex items-center justify-center shadow-xl active:scale-95 transition-transform cursor-pointer"
          aria-label="Abrir capas del mapa"
          title="Capas del mapa"
          data-testid="mobile-fab-layers"
        >
          <Layers className="w-5 h-5 text-primary" />
          {activeThematicLayersCount > 0 && (
            <span
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-on-primary text-[10px] font-mono font-bold flex items-center justify-center border-2 border-surface-container-low shadow-sm"
              data-testid="mobile-layers-badge"
            >
              {activeThematicLayersCount}
            </span>
          )}
        </button>

        {/* 2) Compass FAB with 'N' secondary text */}
        <button
          type="button"
          onClick={handleResetNorth}
          className="relative w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-surface-container-low/95 backdrop-blur-md border border-outline-variant text-secondary flex flex-col items-center justify-center shadow-xl active:scale-95 transition-transform cursor-pointer"
          aria-label="Orientación Norte (0°)"
          title="Orientación Norte (0°)"
          data-testid="mobile-fab-compass"
        >
          <Compass className="w-4 h-4 text-secondary" />
          <span className="text-[8px] font-bold text-secondary font-mono leading-none mt-0.5">N</span>
        </button>

        {/* 3) GPS Locate Me FAB */}
        <button
          type="button"
          onClick={handleLocateMe}
          disabled={isLocating}
          className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-surface-container-low/95 backdrop-blur-md border border-outline-variant text-primary flex items-center justify-center shadow-xl active:scale-95 transition-transform cursor-pointer disabled:opacity-50"
          aria-label="Mi ubicación"
          title="Mi ubicación"
          data-testid="mobile-fab-locate"
        >
          {isLocating ? (
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
          ) : (
            <Navigation className="w-5 h-5 text-primary" />
          )}
        </button>

        {/* 4) Zoom Pair (+ / -) */}
        <div className="bg-surface-container-low/95 backdrop-blur-md border border-outline-variant rounded-xl flex flex-col overflow-hidden shadow-xl">
          <button
            type="button"
            onClick={handleZoomIn}
            className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-on-surface hover:text-primary active:bg-surface-container transition-colors cursor-pointer"
            aria-label="Acercar mapa"
            title="Acercar (+)"
            data-testid="mobile-fab-zoom-in"
          >
            <Plus className="w-5 h-5" />
          </button>
          <div className="h-px bg-outline-variant" />
          <button
            type="button"
            onClick={handleZoomOut}
            className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-on-surface hover:text-primary active:bg-surface-container transition-colors cursor-pointer"
            aria-label="Alejar mapa"
            title="Alejar (-)"
            data-testid="mobile-fab-zoom-out"
          >
            <Minus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ================= FLOATING MAP CONTROLS & 3D COMPASS GIZMO (Top-Right, Desktop) ================= */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="hidden lg:flex absolute top-3 right-3 z-30 flex-col gap-2.5 items-end no-print"
      >
        {/* 3D Navigation Gizmo & Orientation Control */}
        <div
          data-testid="3d-compass-gizmo"
          className="bg-surface-container-low/95 border border-outline-variant rounded-xl p-2.5 shadow-2xl backdrop-blur-md flex items-center gap-3 select-none"
        >
          {/* Interactive Compass Disc */}
          <div
            className="relative w-12 h-12 rounded-full border border-outline-variant bg-surface-container flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
            onClick={handleResetNorth}
            title={
              is3DMode
                ? `Alinear al Norte · Sol: ${Math.round(currentSolarAzimuth)}° (${getCardinalOrientation(currentSolarAzimuth)})`
                : 'Alinear al Norte (0°)'
            }
            aria-label="Alinear al Norte (0°)"
          >
            <div className="absolute inset-1 rounded-full border border-dashed border-outline-variant/60" />

            {/* Sun Direction Ray & Icon (Shown in 3D Mode) */}
            {is3DMode && (
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none transition-transform duration-100"
                style={{
                  transform: `rotate(${((currentSolarAzimuth - currentBearing + 360) % 360)}deg)`,
                }}
                title={`Sol: Azimut ${Math.round(currentSolarAzimuth)}° · Elevación ${currentSolarAltitude.toFixed(1)}°`}
              >
                {/* Sun icon at perimeter */}
                <div className="absolute -top-2 flex flex-col items-center">
                  <span className="text-[11px] filter drop-shadow-[0_0_4px_#f59e0b]">☀️</span>
                </div>
                {/* Ray line pointing from Sun to Center */}
                <div className="h-4 w-0.5 bg-gradient-to-b from-amber-400 to-transparent" />
              </div>
            )}

            {/* Arrow pointing to True North (-currentBearing deg rotation) */}
            <div
              className="w-1 h-8 flex flex-col justify-between items-center origin-center transition-transform duration-150 pointer-events-none"
              style={{ transform: `rotate(${-currentBearing}deg)` }}
            >
              <span className="text-[9px] text-rose-500 font-bold font-mono leading-none">N</span>
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-[8px] text-outline font-mono leading-none">S</span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleResetNorth}
                className="w-7 h-7 bg-surface-container hover:bg-surface-container-high rounded text-on-surface border border-outline-variant flex items-center justify-center transition-colors cursor-pointer"
                title="Alinear al Norte"
                aria-label="Alinear al Norte"
              >
                <Compass className="w-3.5 h-3.5 text-secondary" />
              </button>
              <button
                type="button"
                onClick={() => toggle3DMode(false)}
                className={`w-7 h-7 rounded border border-outline-variant flex items-center justify-center transition-colors cursor-pointer ${
                  !is3DMode
                    ? 'bg-primary/20 text-primary border-primary/40 font-bold'
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                }`}
                title="Vista Cenital 2D"
                aria-label="Vista Cenital 2D"
              >
                <span className="text-[10px] font-mono">2D</span>
              </button>
              <button
                type="button"
                onClick={() => toggle3DMode(true)}
                className={`w-7 h-7 rounded border border-outline-variant flex items-center justify-center transition-colors cursor-pointer ${
                  is3DMode
                    ? 'bg-primary text-on-primary font-bold shadow-sm'
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                }`}
                title="3D Extrusión"
                aria-label="3D Extrusión"
              >
                <Box className="w-3.5 h-3.5" />
              </button>
            </div>
            <span
              className="text-[9px] font-mono text-outline text-center uppercase tracking-wider"
              title={`Inclinación Pitch: ${currentPitch}° · Orientación Bearing: ${currentBearing}°`}
            >
              {is3DMode ? 'ÓRBITA 3D ACTIVA' : 'VISTA 2D CENITAL'}
            </span>
          </div>
        </div>

        {/* Desktop Vertical Tool Palette */}
        <div className="flex items-center gap-1.5 bg-surface-container-low/95 backdrop-blur-md border border-outline-variant p-1 rounded-lg shadow-xl">
          {/* Zoom In / Out Pair */}
          <button
            type="button"
            onClick={handleZoomIn}
            className="w-7 h-7 rounded hover:bg-surface-container text-on-surface-variant hover:text-on-surface flex items-center justify-center transition-colors cursor-pointer"
            title="Acercar (+)"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="w-7 h-7 rounded hover:bg-surface-container text-on-surface-variant hover:text-on-surface flex items-center justify-center transition-colors cursor-pointer"
            title="Alejar (-)"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          {/* Reset North Compass */}
          <button
            type="button"
            onClick={handleResetNorth}
            className="w-7 h-7 bg-surface-container-low/95 hover:bg-surface-container border border-outline-variant rounded flex items-center justify-center text-secondary transition-colors cursor-pointer"
            title="Orientación Norte (0°)"
          >
            <Compass className="w-3.5 h-3.5" />
          </button>

          {/* Reset to Spain View */}
          <button
            type="button"
            onClick={resetToSpain}
            className="w-7 h-7 rounded hover:bg-surface-container text-on-surface-variant hover:text-primary flex items-center justify-center transition-colors cursor-pointer"
            title="Vista General España"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ================= SPATIAL TELEMETRY & SCALE OVERLAY (Bottom HUD) ================= */}
      {!is3DMode && (
        <div className="absolute bottom-2 left-3 right-3 z-20 hidden sm:flex flex-row items-center justify-between gap-2 pointer-events-none no-print">
          {/* Bottom-Left Real-time ETRS89 / UTM Coordinates Readout */}
          <div className="pointer-events-auto bg-surface-container-low/95 backdrop-blur-md border border-outline-variant px-3 py-1 rounded text-[10px] font-mono text-on-surface-variant flex items-center gap-2.5 shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shrink-0" />
            <span className="text-on-surface font-semibold">UTM ETRS89:</span>
            <span>X: {utmCoords.x.toLocaleString()}</span>
            <span>Y: {utmCoords.y.toLocaleString()}</span>
            <span className="text-outline">|</span>
            <span>Huso: {utmCoords.zone}</span>
            <span className="text-outline">|</span>
            <span>Cota: {estimatedElevation}m s.n.m.</span>
          </div>

          {/* Bottom-Right Scale Bar & Official Attribution */}
          <div className="pointer-events-auto bg-surface-container-low/95 backdrop-blur-md border border-outline-variant px-3 py-1 rounded text-[10px] font-mono text-on-surface-variant flex items-center gap-3 shadow-md">
            <div className="flex flex-col items-center">
              <span className="text-[9px] leading-tight text-on-surface-variant">50 m</span>
              <div className="w-16 h-1 border-b-2 border-l-2 border-r-2 border-primary" />
            </div>
            <span className="text-outline text-[9px]">Sede Electrónica Catastro · INE ADRH</span>
          </div>
        </div>
      )}

      {/* ================= FLOATING DUE DILIGENCE AUDIT CARD (Bottom Dock) ================= */}
      {!is3DMode && showFloatingAuditCard && (isLoading ? (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-12 sm:bottom-10 left-3 right-3 sm:left-auto sm:right-3 z-30 bg-surface-container/95 backdrop-blur-md px-4 py-3 rounded-lg shadow-2xl border border-outline-variant hidden lg:flex items-center space-x-3 text-xs text-on-surface animate-in fade-in"
        >
          <Loader2 className="w-4 h-4 text-primary animate-spin shrink-0" />
          <div>
            <p className="font-semibold text-on-surface font-headline">Auditando punto seleccionado...</p>
            <p className="text-[11px] text-on-surface-variant font-mono">Consultando Catastro OVC, INE ADRH y MITECO</p>
          </div>
        </div>
      ) : report ? (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-12 sm:bottom-10 left-3 right-3 sm:left-auto sm:right-3 z-30 bg-surface-container/95 backdrop-blur-md p-3.5 rounded-lg shadow-2xl border border-outline-variant hidden lg:flex items-center justify-between gap-4 text-xs sm:max-w-md animate-in slide-in-from-bottom-2"
        >
          <div className="flex items-center space-x-3 min-w-0">
            <div
              className={`w-10 h-10 rounded-md flex flex-col items-center justify-center font-bold text-sm shrink-0 shadow-inner font-mono ${
                report.score.overallScore >= 75
                  ? 'bg-primary/20 text-primary border border-primary/40'
                  : report.score.overallScore >= 50
                  ? 'bg-secondary/20 text-secondary border border-secondary/40'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              }`}
            >
              <span className="leading-none text-base">{report.score.overallScore}</span>
              <span className="text-[8px] uppercase tracking-tighter text-outline">Score</span>
            </div>
            <div className="min-w-0">
              <p className="font-bold text-on-surface font-headline text-sm truncate">
                {report.property.address.street} {report.property.address.number}
                {report.property.unit ? ` (Pta. ${report.property.unit.floor}-${report.property.unit.door})` : ''}
              </p>
              <p className="text-[11px] text-on-surface-variant font-mono truncate">
                {report.property.address.municipality} · RC {report.property.cadastralReference.slice(0, 14)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {onOpenUnitPicker && Boolean(report.property.unit || (report.property.building?.unitsCount && report.property.building.unitsCount > 1)) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenUnitPicker();
                }}
                type="button"
                className="px-2.5 py-2 rounded bg-surface-container-high hover:bg-surface-container-highest text-on-surface border border-outline-variant font-mono text-xs shadow-sm transition flex items-center justify-center cursor-pointer"
                title="Explorar división horizontal y unidades catastrales"
              >
                <span>Unidades</span>
              </button>
            )}
            {onViewReport && (
              <button
                onClick={onViewReport}
                type="button"
                className="px-3.5 py-2 rounded bg-primary text-on-primary hover:bg-primary-container font-semibold text-xs shadow-md transition flex items-center justify-center space-x-1.5 cursor-pointer font-sans"
              >
                <span>Ver Informe</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      ) : null)}

      {/* ================= FLOATING CARTOGRAPHIC LEGENDS HUD (Bottom-Left) ================= */}
      <CartographicLegendsHud
        activeLayers={{
          cadastre: showCatastroWms,
          noise: showMitecoNoise,
          flood: showSncziFlood,
          income: showIneIncome,
          isochrones: showIsochrones,
        }}
        defaultCollapsed={true}
      />

      {/* Floating Error Alert */}
      {error && !isLoading && (
        <div className="absolute bottom-12 sm:bottom-10 left-3 right-3 sm:left-auto sm:right-3 z-30 bg-rose-950/90 backdrop-blur-md px-3.5 py-2.5 rounded-lg shadow-xl border border-rose-500/50 text-xs text-rose-200 flex items-center justify-between gap-3 max-w-md animate-in slide-in-from-bottom-2">
          <div className="flex items-center space-x-2 min-w-0">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <p className="text-[11px] leading-tight font-mono truncate">{error}</p>
          </div>
          {onDismissError && (
            <button
              onClick={onDismissError}
              type="button"
              className="text-rose-400 hover:text-white cursor-pointer shrink-0"
              aria-label="Cerrar aviso"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* ================= RESPONSIVE MOBILE LAYERS DRAWER / SHEET (Phase 11B) ================= */}
      {isLayersSheetOpen && (
        <div
          className="block lg:hidden fixed inset-0 z-50 flex flex-col justify-end no-print"
          data-testid="mobile-layers-drawer"
        >
          {/* Backdrop */}
          <div
            onClick={() => toggleMobileLayers(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            aria-label="Cerrar panel de capas"
            data-testid="mobile-layers-backdrop"
          />

          {/* Drawer Sheet Body */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-h-[85vh] bg-surface-container-low border-t border-outline-variant rounded-t-2xl p-4 shadow-2xl flex flex-col overflow-hidden text-on-surface animate-in slide-in-from-bottom duration-200 z-10"
          >
            {/* Drag Handle */}
            <div className="w-10 h-1 bg-outline-variant rounded-full mx-auto mb-3 shrink-0" />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-outline-variant/60 pb-3 mb-3 shrink-0">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary" />
                <div>
                  <h3 className="text-sm font-bold font-headline text-on-surface">Capas Temáticas GIS</h3>
                  <span className="text-[10px] font-mono text-outline">v4.2 ETRS89 · Proyección Oficial</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggleMobileLayers(false)}
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                aria-label="Cerrar capas"
                title="Cerrar capas"
                data-testid="mobile-layers-close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-4 pb-4">
              {/* Basemaps Selection */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-outline font-mono block mb-2">
                  Mapas Base
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveBasemap('dark-gis')}
                    className={`min-h-[44px] py-2 px-3 rounded-lg text-xs font-mono font-semibold transition border cursor-pointer flex items-center justify-center text-center ${
                      activeBasemap === 'dark-gis'
                        ? 'bg-primary text-on-primary border-primary shadow-sm'
                        : 'bg-surface-container text-on-surface-variant border-outline-variant hover:text-on-surface'
                    }`}
                  >
                    Dark GIS
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveBasemap('pnoa-satellite')}
                    className={`min-h-[44px] py-2 px-3 rounded-lg text-xs font-mono font-semibold transition border cursor-pointer flex items-center justify-center text-center ${
                      activeBasemap === 'pnoa-satellite'
                        ? 'bg-primary text-on-primary border-primary shadow-sm'
                        : 'bg-surface-container text-on-surface-variant border-outline-variant hover:text-on-surface'
                    }`}
                  >
                    Satélite
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveBasemap('ign-base')}
                    className={`min-h-[44px] py-2 px-3 rounded-lg text-xs font-mono font-semibold transition border cursor-pointer flex items-center justify-center text-center ${
                      activeBasemap === 'ign-base'
                        ? 'bg-primary text-on-primary border-primary shadow-sm'
                        : 'bg-surface-container text-on-surface-variant border-outline-variant hover:text-on-surface'
                    }`}
                  >
                    IGN Topográfico
                  </button>
                </div>
              </div>

              {/* Thematic Overlays */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-outline font-mono block mb-2">
                  Capas Temáticas Oficiales
                </span>
                <div className="space-y-2.5">
                  {/* Layer 1: Catastro WMS */}
                  <div className="p-3 rounded-xl bg-surface-container border border-secondary-container/40 space-y-2">
                    <label className="flex items-center justify-between min-h-[44px] cursor-pointer">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={showCatastroWms}
                          onChange={(e) => setShowCatastroWms(e.target.checked)}
                          className="w-5 h-5 rounded bg-surface-container-lowest border-outline-variant text-secondary-container focus:ring-0 cursor-pointer"
                        />
                        <div>
                          <span className="text-xs font-semibold text-on-surface block">Catastro WMS</span>
                          <span className="text-[10px] text-outline font-mono">Dirección General del Catastro</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-secondary-container/20 text-secondary border border-secondary-container/40">
                        {showCatastroWms ? 'Activo' : 'Off'}
                      </span>
                    </label>
                    {showCatastroWms && (
                      <div className="pt-2 border-t border-outline-variant/40 flex items-center gap-3 text-xs">
                        <span className="text-[10px] font-mono text-outline shrink-0">
                          Opacidad: {Math.round(catastroOpacity * 100)}%
                        </span>
                        <input
                          type="range"
                          min="0.2"
                          max="1.0"
                          step="0.05"
                          value={catastroOpacity}
                          onChange={(e) => setCatastroOpacity(parseFloat(e.target.value))}
                          className="w-full accent-primary h-2 bg-surface-container-high rounded cursor-pointer"
                          aria-label="Opacidad Catastro WMS"
                        />
                      </div>
                    )}
                  </div>

                  {/* Layer 2: INE Income */}
                  <div className="p-3 rounded-xl bg-surface-container border border-tertiary/40 space-y-2">
                    <label className="flex items-center justify-between min-h-[44px] cursor-pointer">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={showIneIncome}
                          onChange={(e) => setShowIneIncome(e.target.checked)}
                          className="w-5 h-5 rounded bg-surface-container-lowest border-outline-variant text-tertiary focus:ring-0 cursor-pointer"
                        />
                        <div>
                          <span className="text-xs font-semibold text-on-surface flex items-center gap-1.5">
                            <TrendingUp className="w-3.5 h-3.5 text-tertiary" />
                            Renta INE (ADRH)
                          </span>
                          <span className="text-[10px] text-outline font-mono">Atlas Distribución Renta Hogares</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-tertiary-container/30 text-tertiary border border-tertiary/40">
                        {showIneIncome ? 'ADRH 2024' : 'Off'}
                      </span>
                    </label>
                    {showIneIncome && (
                      <div className="pt-2 border-t border-outline-variant/40 flex items-center gap-3 text-xs">
                        <span className="text-[10px] font-mono text-outline shrink-0">
                          Opacidad: {Math.round(ineOpacity * 100)}%
                        </span>
                        <input
                          type="range"
                          min="0.2"
                          max="1.0"
                          step="0.05"
                          value={ineOpacity}
                          onChange={(e) => setIneOpacity(parseFloat(e.target.value))}
                          className="w-full accent-tertiary h-2 bg-surface-container-high rounded cursor-pointer"
                          aria-label="Opacidad Renta INE"
                        />
                      </div>
                    )}
                  </div>

                  {/* Layer 3: MITECO Ruido (SICA) */}
                  <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/60 space-y-2">
                    <label className="flex items-center justify-between min-h-[44px] cursor-pointer">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={showMitecoNoise}
                          onChange={(e) => setShowMitecoNoise(e.target.checked)}
                          className="w-5 h-5 rounded bg-surface-container-lowest border-outline-variant text-primary focus:ring-0 cursor-pointer"
                        />
                        <div>
                          <span className="text-xs font-semibold text-on-surface flex items-center gap-1.5">
                            <Volume2 className="w-3.5 h-3.5 text-primary" />
                            Ruido SICA (MITECO)
                          </span>
                          <span className="text-[10px] text-outline font-mono">Mapa Estratégico de Ruido Lden</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-variant text-outline">
                        {showMitecoNoise ? 'SICA Lden' : 'Inactivo'}
                      </span>
                    </label>
                    {showMitecoNoise && (
                      <div className="pt-2 border-t border-outline-variant/40 flex items-center gap-3 text-xs">
                        <span className="text-[10px] font-mono text-outline shrink-0">
                          Opacidad: {Math.round(noiseOpacity * 100)}%
                        </span>
                        <input
                          type="range"
                          min="0.2"
                          max="1.0"
                          step="0.05"
                          value={noiseOpacity}
                          onChange={(e) => setNoiseOpacity(parseFloat(e.target.value))}
                          className="w-full accent-primary h-2 bg-surface-container-high rounded cursor-pointer"
                          aria-label="Opacidad Ruido SICA"
                        />
                      </div>
                    )}
                  </div>

                  {/* Layer 4: SNCZI Inundabilidad */}
                  <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/60 space-y-2">
                    <label className="flex items-center justify-between min-h-[44px] cursor-pointer">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={showSncziFlood}
                          onChange={(e) => setShowSncziFlood(e.target.checked)}
                          className="w-5 h-5 rounded bg-surface-container-lowest border-outline-variant text-blue-400 focus:ring-0 cursor-pointer"
                        />
                        <div>
                          <span className="text-xs font-semibold text-on-surface flex items-center gap-1.5">
                            <Waves className="w-3.5 h-3.5 text-blue-400" />
                            Inundabilidad SNCZI
                          </span>
                          <span className="text-[10px] text-outline font-mono">SNCZI Zonas Inundables T=10..500a</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-variant text-outline">
                        {showSncziFlood ? 'T=10..500a' : 'Inactivo'}
                      </span>
                    </label>
                    {showSncziFlood && (
                      <div className="pt-2 border-t border-outline-variant/40 flex items-center gap-3 text-xs">
                        <span className="text-[10px] font-mono text-outline shrink-0">
                          Opacidad: {Math.round(floodOpacity * 100)}%
                        </span>
                        <input
                          type="range"
                          min="0.2"
                          max="1.0"
                          step="0.05"
                          value={floodOpacity}
                          onChange={(e) => setFloodOpacity(parseFloat(e.target.value))}
                          className="w-full accent-blue-400 h-2 bg-surface-container-high rounded cursor-pointer"
                          aria-label="Opacidad Inundabilidad SNCZI"
                        />
                      </div>
                    )}
                  </div>

                  {/* Layer 5: 15-Minute Walking Catchment */}
                  <div className="p-3 rounded-xl bg-surface-container border border-primary/30 space-y-2">
                    <label className="flex items-center justify-between min-h-[44px] cursor-pointer">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={showIsochrones}
                          onChange={(e) => setShowIsochrones(e.target.checked)}
                          className="w-5 h-5 rounded bg-surface-container-lowest border-outline-variant text-primary focus:ring-0 cursor-pointer"
                        />
                        <div>
                          <span className="text-xs font-semibold text-on-surface flex items-center gap-1.5">
                            <Footprints className="w-3.5 h-3.5 text-primary" />
                            Isócronas 15-min
                          </span>
                          <span className="text-[10px] text-outline font-mono">Radios caminables 5, 10 y 15 min</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary-container/20 text-primary border border-primary/30">
                        {showIsochrones ? '5/10/15m' : 'Inactivo'}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= FLOATING SOLAR EXPOSURE & DAYLIGHT SIMULATION HUD ================= */}
      {is3DMode && isSolarHudOpen && (
        <SolarSimulationHud
          lat={selectedCoords?.lat ?? mapCenter.lat}
          lon={selectedCoords?.lon ?? mapCenter.lon}
          facadeAzimuthDeg={198}
          roofAreaM2={
            report?.property.building?.builtSurfaceM2
              ? Math.min(600, Math.max(120, Math.round(report.property.building.builtSurfaceM2 / 6)))
              : 200
          }
          isOpen={isSolarHudOpen}
          onClose={() => setIsSolarHudOpen(false)}
          onSolarChange={handleSolarChange}
        />
      )}

      {/* Floating Re-Open Solar HUD Button (when minimized/closed in 3D mode) */}
      {is3DMode && !isSolarHudOpen && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 no-print">
          <button
            type="button"
            onClick={() => setIsSolarHudOpen(true)}
            className="bg-surface-container/95 border border-primary/40 hover:border-primary text-primary px-3.5 py-1.5 rounded-full text-xs font-mono flex items-center gap-2 shadow-2xl backdrop-blur-md cursor-pointer hover:bg-surface-container-high transition"
            title="Abrir Simulador Solar & Sombras"
            aria-label="Abrir Simulador Solar & Sombras"
          >
            <Sun className="w-4 h-4 text-secondary" />
            <span className="font-semibold">Simulador Solar & Sombras</span>
          </button>
        </div>
      )}
    </div>
  );
}
