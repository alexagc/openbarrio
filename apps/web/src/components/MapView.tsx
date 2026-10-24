import { useEffect, useRef, useState, useMemo } from 'react';
import * as maplibregl from 'maplibre-gl';
import type { Map as MapLibreMap, Marker, MapMouseEvent } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  Layers,
  Maximize2,
  Loader2,
  ChevronRight,
  AlertTriangle,
  X,
  Compass,
  Plus,
  Minus,
  Volume2,
  Waves,
  TrendingUp,
  Footprints,
} from 'lucide-react';
import { ExtendedAuditReport } from '../services/api.client';
import { CartographicLegendsHud } from './CartographicLegendsHud';

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
}: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const amenityMarkersRef = useRef<Marker[]>([]);
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

    map.on('move', () => {
      const center = map.getCenter();
      setMapCenter({
        lat: parseFloat(center.lat.toFixed(6)),
        lon: parseFloat(center.lng.toFixed(6)),
      });
    });

    map.getCanvas().style.cursor = 'crosshair';

    map.on('click', (e: MapMouseEvent) => {
      const lat = parseFloat(e.lngLat.lat.toFixed(6));
      const lon = parseFloat(e.lngLat.lng.toFixed(6));
      onMapClickRef.current(lat, lon);
    });

    map.on('load', () => {
      map.resize();
    });

    mapRef.current = map;

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && mapContainerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        map.resize();
      });
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
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

  // Toggle 3D Axonometric Tilt
  const toggle3DMode = () => {
    const map = mapRef.current;
    if (!map) return;

    const nextMode = !is3DMode;
    setIs3DMode(nextMode);

    map.easeTo({
      pitch: nextMode ? 55 : 0,
      bearing: nextMode ? -15 : 0,
      duration: 1000,
    });
  };

  const handleZoomIn = () => {
    mapRef.current?.zoomIn({ duration: 300 });
  };

  const handleZoomOut = () => {
    mapRef.current?.zoomOut({ duration: 300 });
  };

  const handleResetNorth = () => {
    mapRef.current?.resetNorthPitch({ duration: 600 });
    setIs3DMode(false);
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

  // Update Marker & Target Parcel Flag when coordinates change
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedCoords) return;

    const { lat, lon } = selectedCoords;

    // Create custom Stitch-themed neon amber target node
    const el = document.createElement('div');
    el.className = 'group relative cursor-pointer';
    el.innerHTML = `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-12 h-12 bg-amber-500/20 rounded-full animate-ping"></div>
        <div class="absolute w-7 h-7 bg-amber-400/30 rounded-full animate-pulse border border-amber-400/60"></div>
        <div class="relative w-5 h-5 bg-surface-container-lowest text-secondary rounded-full flex items-center justify-center shadow-lg border-2 border-secondary transform transition hover:scale-125">
          <div class="w-2 h-2 rounded-full bg-secondary"></div>
        </div>
      </div>
    `;

    if (markerRef.current) {
      markerRef.current.remove();
    }

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
    const safeAddress = escapeHtml(
      isMatchingReport && propertyAddress ? propertyAddress : 'Consultando Sede del Catastro & INE...'
    );
    const refcat = isMatchingReport ? report!.property.cadastralReference : 'Consultando Catastro...';
    const surfaceM2 = isMatchingReport
      ? report!.property.unit
        ? `${report!.property.unit.builtSurfaceM2.toLocaleString('es-ES')} m² (privativos)`
        : `${report!.property.building.builtSurfaceM2.toLocaleString('es-ES')} m²`
      : 'Calculando...';
    const yearBuilt = isMatchingReport
      ? report!.property.building.constructionYear > 0
        ? `Año ${report!.property.building.constructionYear}`
        : 'Suelo sin edificar'
      : 'Consultando...';
    const scoreVal = isMatchingReport ? `${report!.score.overallScore}/100` : '--/100';

    const popupHtml = `
      <div class="p-3 text-xs font-mono bg-surface-container-low text-on-surface border border-secondary/40 rounded-lg shadow-2xl min-w-[220px]">
        <div class="flex items-center justify-between border-b border-outline-variant/60 pb-1.5 mb-2">
          <span class="text-[9px] font-bold text-secondary uppercase tracking-wider flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            PARCELA AUDITADA
          </span>
          <span class="px-1.5 py-0.2 rounded bg-primary/20 text-primary border border-primary/40 text-[9px] font-bold">
            ${scoreVal}
          </span>
        </div>
        <p class="font-bold text-on-surface text-[11px] truncate mb-0.5">${safeTitle}</p>
        <p class="text-on-surface-variant text-[10px] truncate mb-2">${safeAddress}</p>
        <div class="bg-surface-container p-1.5 rounded border border-outline-variant/40 space-y-0.5 text-[9px]">
          <div class="flex justify-between text-on-surface-variant">
            <span>RC:</span>
            <span class="text-secondary font-semibold">${escapeHtml(refcat)}</span>
          </div>
          <div class="flex justify-between text-on-surface-variant">
            <span>Superficie:</span>
            <span class="text-on-surface font-semibold">${surfaceM2}</span>
          </div>
          <div class="flex justify-between text-on-surface-variant">
            <span>Construcción:</span>
            <span class="text-on-surface font-semibold">${yearBuilt}</span>
          </div>
        </div>
                <div class="mt-2 pt-1.5 border-t border-outline-variant/40 flex items-center justify-between gap-1">
          <span class="text-[9px] text-secondary font-semibold">Inmuebles:</span>
          <button id="ob-popup-open-units" type="button" class="px-2 py-0.5 rounded bg-primary text-on-primary text-[9px] font-bold cursor-pointer hover:bg-primary-container">
            Ver unidades ▾
          </button>
        </div>
        <p class="mt-1 text-[8px] text-outline font-sans text-center">Click en el mapa para auditar otro punto</p>
      </div>
    `;

    const popup = new maplibregl.Popup({
      offset: 20,
      closeButton: false,
      className: 'stitch-dark-popup',
    }).setHTML(popupHtml);

    const marker = new maplibregl.Marker({ element: el })
      .setLngLat([lon, lat])
      .setPopup(popup)
      .addTo(map);

    if (typeof (popup as any).on === 'function') {
      (popup as any).on('open', () => {
      const btn = document.getElementById('ob-popup-open-units');
      if (btn) {
        btn.onclick = (e) => {
          e.stopPropagation();
          if (onOpenUnitPicker) {
            onOpenUnitPicker();
          }
        };
      }
      });
    }

    markerRef.current = marker;
    marker.togglePopup();

    const center = map.getCenter();
    const dist = Math.hypot(center.lat - lat, center.lng - lon);
    if (dist > 0.001) {
      map.flyTo({
        center: [lon, lat],
        zoom: Math.max(map.getZoom(), 16),
        essential: true,
        duration: 1000,
      });
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

        if (!showIsochrones || !selectedCoords) {
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
  }, [selectedCoords, showIsochrones]);

  // Synchronize Civic Amenities POI Markers on Isochrones
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing amenity markers
    for (const m of amenityMarkersRef.current) {
      m.remove();
    }
    amenityMarkersRef.current = [];

    if (!showIsochrones || !selectedCoords || !report?.connectivity) return;

    const conn = report.connectivity;
    const { lat, lon } = selectedCoords;

    const amenitiesList = [
      {
        facility: conn.nearestHealthcare,
        type: 'healthcare',
        icon: '🏥',
        badge: 'Sanidad / CAP',
        color: '#f43f5e',
        bearing: 315, // NW
        sourceText: 'Registro REPS · Ministerio de Sanidad',
      },
      {
        facility: conn.nearestTransit,
        type: 'transit',
        icon: '🚇',
        badge: 'Transporte Público',
        color: '#f59e0b',
        bearing: 45, // NE
        sourceText: 'Consorcio Regional de Transportes',
      },
      {
        facility: conn.nearestEducation,
        type: 'education',
        icon: '🏫',
        badge: 'Colegio / Educación',
        color: '#3b82f6',
        bearing: 225, // SW
        sourceText: 'Registro Estatal Centros Docentes (MEFP)',
      },
      {
        facility: conn.nearestPark,
        type: 'park',
        icon: '🌳',
        badge: 'Zonas Verdes',
        color: '#10b981',
        bearing: 135, // SE
        sourceText: 'Inventario Municipal Áreas Verdes / IGN',
      },
    ].filter((item) => Boolean(item.facility));

    const newMarkers: Marker[] = [];

    for (const item of amenitiesList) {
      const fac = item.facility!;
      const dMeters = Math.max(80, Math.min(1300, fac.distanceMeters));
      const rad = (item.bearing * Math.PI) / 180;
      const dKm = dMeters / 1000;
      const dLat = (dKm / 110.574) * Math.cos(rad);
      const dLon = (dKm / (111.32 * Math.cos((lat * Math.PI) / 180))) * Math.sin(rad);

      const fLat = lat + dLat;
      const fLon = lon + dLon;

      const el = document.createElement('div');
      el.className = 'group relative cursor-pointer';
      el.innerHTML = `
        <div class="relative flex items-center justify-center">
          <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-lg border-2 transition-transform hover:scale-125" style="background: #0b1326; border-color: ${item.color};">
            <span>${item.icon}</span>
          </div>
        </div>
      `;

      const popupHtml = `
        <div class="p-3 text-xs font-mono bg-surface-container-low text-on-surface border rounded-lg shadow-2xl min-w-[200px]" style="border-color: ${item.color}60;">
          <div class="flex items-center justify-between border-b border-outline-variant/60 pb-1 mb-1.5">
            <span class="text-[9px] font-bold uppercase tracking-wider" style="color: ${item.color};">
              ${escapeHtml(item.badge)}
            </span>
            <span class="text-[9px] font-bold text-primary font-mono">
              ~${Math.round(fac.walkTimeMinutes)} min
            </span>
          </div>
          <p class="font-bold text-on-surface text-[11px] truncate mb-1">${escapeHtml(fac.name)}</p>
          <div class="space-y-0.5 text-[9px] text-on-surface-variant">
            <div class="flex justify-between">
              <span>Distancia directa:</span>
              <span class="font-bold text-on-surface">${fac.distanceMeters} m</span>
            </div>
            <div class="flex justify-between">
              <span>Tiempo a pie (4.5 km/h):</span>
              <span class="font-bold text-on-surface">${Math.round(fac.walkTimeMinutes)} min</span>
            </div>
            <div class="pt-1 text-[8px] text-outline border-t border-outline-variant/30 truncate">
              ${escapeHtml(item.sourceText)}
            </div>
          </div>
        </div>
      `;

      const popup = new maplibregl.Popup({
        offset: 14,
        closeButton: false,
        className: 'stitch-dark-popup',
      }).setHTML(popupHtml);

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([fLon, fLat])
        .setPopup(popup)
        .addTo(map);

      newMarkers.push(marker);
    }

    amenityMarkersRef.current = newMarkers;

    return () => {
      for (const m of newMarkers) m.remove();
    };
  }, [selectedCoords, showIsochrones, report]);

  return (
    <div className="relative w-full h-full min-h-[480px] rounded-xl overflow-hidden border border-outline-variant shadow-2xl bg-surface-container-lowest cadastral-grid select-none">
      {/* MapLibre WebGL Canvas Container */}
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />

      {/* ================= FLOATING HUD: LAYER SWITCHER WIDGET (Top-Left) ================= */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute top-3 left-3 z-20 bg-surface-container-low/95 backdrop-blur-md border border-outline-variant rounded p-2.5 shadow-2xl w-64 text-on-surface no-print"
      >
        {/* HUD Title Bar */}
        <div className="flex items-center justify-between border-b border-outline-variant/60 pb-1.5 mb-2">
          <span className="text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5 text-primary font-mono">
            <Layers className="w-3.5 h-3.5 text-primary" />
            <span>Capas Temáticas GIS</span>
          </span>
          <span className="text-[9px] font-mono text-outline">v4.2 ETRS89</span>
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

      {/* ================= FLOATING MAP CONTROLS: ZOOM & 3D (Top-Right) ================= */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute top-3 right-3 z-20 flex flex-col gap-1.5 no-print"
      >
        {/* Zoom Controls */}
        <div className="bg-surface-container-low/95 backdrop-blur-md border border-outline-variant rounded flex flex-col overflow-hidden shadow-xl">
          <button
            type="button"
            onClick={handleZoomIn}
            className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
            title="Acercar (+)"
          >
            <Plus className="w-4 h-4" />
          </button>
          <div className="h-px bg-outline-variant" />
          <button
            type="button"
            onClick={handleZoomOut}
            className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
            title="Alejar (-)"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* Reset North Compass */}
        <button
          type="button"
          onClick={handleResetNorth}
          className="w-8 h-8 bg-surface-container-low/95 backdrop-blur-md border border-outline-variant rounded flex items-center justify-center text-secondary hover:text-white transition-colors shadow-xl cursor-pointer"
          title="Orientación Norte (0°)"
        >
          <Compass className="w-4 h-4" />
        </button>

        {/* 3D Axonometric Tilt Button */}
        <button
          type="button"
          onClick={toggle3DMode}
          className={`w-8 h-8 bg-surface-container-low/95 backdrop-blur-md border rounded flex items-center justify-center text-[10px] font-mono font-bold transition-colors shadow-xl cursor-pointer ${
            is3DMode
              ? 'border-primary text-primary bg-primary/10 shadow-primary/20'
              : 'border-outline-variant text-on-surface-variant hover:text-primary'
          }`}
          title="Alternar Perspectiva 3D / Axonometría"
        >
          3D
        </button>

        {/* Reset to Spain View */}
        <button
          type="button"
          onClick={resetToSpain}
          className="w-8 h-8 bg-surface-container-low/95 backdrop-blur-md border border-outline-variant rounded flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors shadow-xl cursor-pointer"
          title="Vista General España"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ================= SPATIAL TELEMETRY & SCALE OVERLAY (Bottom HUD) ================= */}
      <div className="absolute bottom-2 left-3 right-3 z-20 flex flex-col sm:flex-row items-center justify-between gap-2 pointer-events-none no-print">
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

      {/* ================= FLOATING DUE DILIGENCE AUDIT CARD (Bottom Dock) ================= */}
      {isLoading ? (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-12 sm:bottom-10 left-3 right-3 sm:left-auto sm:right-3 z-30 bg-surface-container/95 backdrop-blur-md px-4 py-3 rounded-lg shadow-2xl border border-outline-variant flex items-center space-x-3 text-xs text-on-surface animate-in fade-in"
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
          className="absolute bottom-12 sm:bottom-10 left-3 right-3 sm:left-auto sm:right-3 z-30 bg-surface-container/95 backdrop-blur-md p-3.5 rounded-lg shadow-2xl border border-outline-variant flex items-center justify-between gap-4 text-xs sm:max-w-md animate-in slide-in-from-bottom-2"
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
          {onViewReport && (
            <button
              onClick={onViewReport}
              type="button"
              className="px-3.5 py-2 rounded bg-primary text-on-primary hover:bg-primary-container font-semibold text-xs shadow-md transition flex items-center justify-center space-x-1.5 shrink-0 cursor-pointer font-sans"
            >
              <span>Ver Informe</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ) : null}

      {/* ================= FLOATING CARTOGRAPHIC LEGENDS HUD (Bottom-Left) ================= */}
      <CartographicLegendsHud
        activeLayers={{
          cadastre: showCatastroWms,
          noise: showMitecoNoise,
          flood: showSncziFlood,
          income: showIneIncome,
          isochrones: showIsochrones,
        }}
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
    </div>
  );
}
