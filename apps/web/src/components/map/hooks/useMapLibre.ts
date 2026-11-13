import { useEffect, useRef, useState, useCallback } from 'react';
import * as maplibregl from 'maplibre-gl';
import type { Map as MapLibreMap, Marker, MapMouseEvent } from 'maplibre-gl';
import { Protocol } from 'pmtiles';
import { generate3dBuildingFootprints } from '../../../utils/solar';

let pmtilesProtocolRegistered = false;
export function _resetPMTilesProtocolForTesting() {
  pmtilesProtocolRegistered = false;
}
function registerPMTilesProtocol() {
  if (!pmtilesProtocolRegistered && typeof (maplibregl as any).addProtocol === 'function') {
    const protocol = new Protocol();
    (maplibregl as any).addProtocol('pmtiles', protocol.tile);
    pmtilesProtocolRegistered = true;
  }
}

export type BasemapType = 'dark-gis' | 'pnoa-satellite' | 'ign-base';

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

export interface UseMapLibreProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  selectedCoords?: { lat: number; lon: number };
  onMapClick: (lat: number, lon: number) => void;
  activeBasemap: BasemapType;
}

export function useMapLibre({
  containerRef,
  selectedCoords,
  onMapClick,
  activeBasemap,
}: UseMapLibreProps) {
  const mapRef = useRef<MapLibreMap | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const onMapClickRef = useRef(onMapClick);

  const [currentZoom, setCurrentZoom] = useState<number>(15);
  const [currentBearing, setCurrentBearing] = useState<number>(0);
  const [currentPitch, setCurrentPitch] = useState<number>(0);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lon: number }>({
    lat: selectedCoords?.lat ?? 40.42028,
    lon: selectedCoords?.lon ?? -3.70379,
  });

  useEffect(() => {
    onMapClickRef.current = onMapClick;
  }, [onMapClick]);

  // Initialize MapLibre GL
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    registerPMTilesProtocol();

    const initialLon = selectedCoords ? selectedCoords.lon : -3.70379;
    const initialLat = selectedCoords ? selectedCoords.lat : 40.42028;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: {
        version: 8,
        glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
        sources: {
          'esri-dark': {
            type: 'raster',
            tiles: [
              'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
            ],
            tileSize: 256,
            maxzoom: 16,
            attribution: '&copy; Esri &copy; OpenStreetMap',
          },
          'ign-base': {
            type: 'raster',
            tiles: [
              'https://www.ign.es/wmts/ign-base?service=WMTS&request=GetTile&version=1.0.0&Format=image/png&layer=IGNBaseTodo&style=default&tilematrixset=GoogleMapsCompatible&TileMatrix={z}&TileRow={y}&TileCol={x}',
            ],
            tileSize: 256,
            attribution: '&copy; Instituto Geográfico Nacional (IGN España)',
          },
          'pnoa-base': {
            type: 'raster',
            tiles: [
              'https://www.ign.es/wmts/pnoa-ma?service=WMTS&request=GetTile&version=1.0.0&Format=image/jpeg&layer=OI.OrthoimageCoverage&style=default&tilematrixset=GoogleMapsCompatible&TileMatrix={z}&TileRow={y}&TileCol={x}',
            ],
            tileSize: 256,
            attribution: '&copy; Instituto Geográfico Nacional (PNOA)',
          },
          'catastro-wms': {
            type: 'raster',
            tiles: [
              'https://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx?SERVICE=WMS&SRS=EPSG:3857&REQUEST=GetMap&FORMAT=image/png&BBOX={bbox-epsg-3857}&WIDTH=256&HEIGHT=256&LAYERS=Catastro&TRANSPARENT=TRUE',
            ],
            tileSize: 256,
            attribution: '&copy; Dirección General del Catastro (España)',
          },
          'catastro-bizkaia-wms': {
            type: 'raster',
            tiles: [
              'https://geo.bizkaia.eus/arcgisserverinspire/rest/services/Catastro/Annex1/MapServer/exts/InspireView/service?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=TRUE&LAYERS=CP.CadastralParcel&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&BBOX={bbox-epsg-3857}',
            ],
            tileSize: 256,
            attribution: '&copy; Catastro Foral de Bizkaia',
          },
          'catastro-navarra-wms': {
            type: 'raster',
            tiles: [
              'https://idena.navarra.es/ogc/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=TRUE&LAYERS=catastro&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&BBOX={bbox-epsg-3857}',
            ],
            tileSize: 256,
            attribution: '&copy; IDENA / Catastro de Navarra',
          },
          'catastro-araba-wms': {
            type: 'raster',
            tiles: [
              'https://geo.araba.eus/WMS_Katastroa?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=TRUE&LAYERS=PartzelaHiritarrak_ParcelasUrbanas,Eraikinak_Edificios&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&BBOX={bbox-epsg-3857}&STYLES=',
            ],
            tileSize: 256,
            attribution: '&copy; Catastro Foral de Álava',
          },
          'catastro-gipuzkoa-wms': {
            type: 'raster',
            tiles: [
              'https://b5m.gipuzkoa.eus/inspire/wms/gipuzkoa_wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=TRUE&LAYERS=CP.CadastralParcel&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&BBOX={bbox-epsg-3857}',
            ],
            tileSize: 256,
            attribution: '&copy; Catastro Foral de Gipuzkoa (b5m)',
          },
          'ine-income-pmtiles': {
            type: 'vector',
            url: `pmtiles://${(import.meta.env.VITE_TILES_URL || `${(import.meta.env.VITE_API_URL || '').replace(/\/$/, '')}/api/v1/tiles`).replace(/\/$/, '')}/census_tracts.pmtiles`,
            attribution: '&copy; Instituto Nacional de Estadística (INE ADRH) & IGN',
          },
          'miteco-sica': {
            type: 'vector',
            url: `pmtiles://${(import.meta.env.VITE_TILES_URL || `${(import.meta.env.VITE_API_URL || '').replace(/\/$/, '')}/api/v1/tiles`).replace(/\/$/, '')}/noise.pmtiles`,
            attribution: '&copy; MITECO SICA / MER',
          },
          'miteco-snczi': {
            type: 'vector',
            url: `pmtiles://${(import.meta.env.VITE_TILES_URL || `${(import.meta.env.VITE_API_URL || '').replace(/\/$/, '')}/api/v1/tiles`).replace(/\/$/, '')}/floods.pmtiles`,
            attribution: '&copy; MITECO SNCZI',
          },
          'walking-isochrones': {
            type: 'geojson',
            data: { type: 'FeatureCollection', features: [] },
          },
          'building-3d-source': {
            type: 'geojson',
            data: generate3dBuildingFootprints(initialLat, initialLon),
          },
          'building-3d-shadows-source': {
            type: 'geojson',
            data: { type: 'FeatureCollection', features: [] },
          },
          'civic-facilities-source': {
            type: 'geojson',
            data: { type: 'FeatureCollection', features: [] },
          },
        },
        layers: [
          {
            id: 'esri-dark-layer',
            type: 'raster',
            source: 'esri-dark',
            minzoom: 0,
            maxzoom: 22,
            layout: { visibility: 'visible' },
          },
          {
            id: 'pnoa-layer',
            type: 'raster',
            source: 'pnoa-base',
            minzoom: 0,
            maxzoom: 20,
            layout: { visibility: 'none' },
          },
          {
            id: 'ign-layer',
            type: 'raster',
            source: 'ign-base',
            minzoom: 0,
            maxzoom: 20,
            layout: { visibility: 'none' },
          },
          {
            id: 'ine-income-layer',
            type: 'fill',
            source: 'ine-income-pmtiles',
            'source-layer': 'census_tracts',
            minzoom: 6,
            maxzoom: 20,
            paint: {
              'fill-color': [
                'interpolate',
                ['linear'],
                ['coalesce', ['get', 'income'], ['get', 'average_net_household_income_eur'], 28000],
                14000, '#312e81',
                20000, '#1e40af',
                28000, '#0284c7',
                36000, '#0d9488',
                44000, '#10b981',
                54000, '#eab308',
                68000, '#f97316',
                85000, '#ef4444',
              ],
              'fill-opacity': 0.75,
            },
            layout: { visibility: 'visible' },
          },
          {
            id: 'ine-income-borders',
            type: 'line',
            source: 'ine-income-pmtiles',
            'source-layer': 'census_tracts',
            minzoom: 10,
            maxzoom: 20,
            paint: {
              'line-color': '#0B1326',
              'line-width': ['interpolate', ['linear'], ['zoom'], 10, 0.5, 16, 1.5],
              'line-opacity': 0.35,
            },
            layout: { visibility: 'visible' },
          },
          {
            id: 'snczi-layer',
            type: 'fill',
            source: 'miteco-snczi',
            'source-layer': 'snczi_floods',
            minzoom: 6,
            maxzoom: 22,
            filter: [
              'any',
              ['==', ['coalesce', ['get', 'period'], ['get', 'return_period_years'], 500], 500],
              ['==', ['coalesce', ['get', 'level'], ['get', 'flood_risk_level']], 'LOW'],
            ],
            paint: {
              'fill-color': '#38bdf8', // MITECO T=500: Low probability / Exceptional (sky blue / celeste)
              'fill-opacity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                6, 0.35,
                13, 0.30,
                16, 0.22,
                19, 0.18,
              ],
              'fill-antialias': true,
            },
            layout: { visibility: 'none' },
          },
          {
            id: 'snczi-t100-layer',
            type: 'fill',
            source: 'miteco-snczi',
            'source-layer': 'snczi_floods',
            minzoom: 6,
            maxzoom: 22,
            filter: [
              'any',
              ['==', ['coalesce', ['get', 'period'], ['get', 'return_period_years']], 100],
              ['==', ['coalesce', ['get', 'period'], ['get', 'return_period_years']], 50],
              ['==', ['coalesce', ['get', 'level'], ['get', 'flood_risk_level']], 'MEDIUM'],
            ],
            paint: {
              'fill-color': [
                'case',
                ['==', ['coalesce', ['get', 'period'], ['get', 'return_period_years']], 50],
                '#1d4ed8', // MITECO T=50: Medium-high probability (cobalt blue)
                '#0284c7', // MITECO T=100: Medium probability / Ordinary reference (cerulean blue)
              ],
              'fill-opacity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                6, 0.55,
                13, 0.50,
                16, 0.42,
                19, 0.35,
              ],
              'fill-antialias': true,
            },
            layout: { visibility: 'none' },
          },
          {
            id: 'snczi-t10-layer',
            type: 'fill',
            source: 'miteco-snczi',
            'source-layer': 'snczi_floods',
            minzoom: 6,
            maxzoom: 22,
            filter: [
              'any',
              ['==', ['coalesce', ['get', 'period'], ['get', 'return_period_years']], 10],
              [
                'all',
                ['==', ['coalesce', ['get', 'level'], ['get', 'flood_risk_level']], 'HIGH'],
                ['!=', ['coalesce', ['get', 'zfp'], ['get', 'is_in_preferential_flow_zone'], 0], 1],
              ],
            ],
            paint: {
              'fill-color': '#1e3a8a', // MITECO T=10: High probability / Frequent (deep navy blue)
              'fill-opacity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                6, 0.72,
                13, 0.68,
                16, 0.60,
                19, 0.52,
              ],
              'fill-antialias': true,
            },
            layout: { visibility: 'none' },
          },
          {
            id: 'snczi-zfp-layer',
            type: 'fill',
            source: 'miteco-snczi',
            'source-layer': 'snczi_floods',
            minzoom: 6,
            maxzoom: 22,
            filter: [
              'any',
              ['==', ['coalesce', ['get', 'zfp'], ['get', 'is_in_preferential_flow_zone']], 1],
              ['==', ['get', 'source_layer'], 'ZI_Laminas_ZFP'],
            ],
            paint: {
              'fill-color': '#172554', // MITECO ZFP: Maximum danger Preferential Flow Zone (midnight indigo)
              'fill-opacity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                6, 0.85,
                13, 0.80,
                16, 0.72,
                19, 0.65,
              ],
              'fill-antialias': true,
            },
            layout: { visibility: 'none' },
          },
          {
            id: 'snczi-borders',
            type: 'line',
            source: 'miteco-snczi',
            'source-layer': 'snczi_floods',
            minzoom: 8,
            maxzoom: 22,
            layout: {
              visibility: 'none',
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': [
                'case',
                ['any', ['==', ['coalesce', ['get', 'zfp'], ['get', 'is_in_preferential_flow_zone']], 1], ['==', ['get', 'source_layer'], 'ZI_Laminas_ZFP']],
                '#172554',
                ['==', ['coalesce', ['get', 'period'], ['get', 'return_period_years']], 10],
                '#1e3a8a',
                ['==', ['coalesce', ['get', 'period'], ['get', 'return_period_years']], 50],
                '#1d4ed8',
                ['==', ['coalesce', ['get', 'period'], ['get', 'return_period_years']], 100],
                '#0284c7',
                '#38bdf8', // T=500
              ],
              'line-width': [
                'interpolate',
                ['linear'],
                ['zoom'],
                8, 1.0,
                13, 1.6,
                16, 2.2,
                19, 2.0,
              ],
              'line-opacity': 0.85,
              'line-blur': 0.5,
            },
          },
          {
            id: 'sica-isophone-halo',
            type: 'line',
            source: 'miteco-sica',
            'source-layer': 'sica_noise',
            minzoom: 6,
            maxzoom: 22,
            layout: {
              visibility: 'none',
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': [
                'case',
                ['has', 'lden'],
                [
                  'step',
                  ['get', 'lden'],
                  'rgba(0, 0, 0, 0)',
                  55,
                  '#fef08a',
                  60,
                  '#fde047',
                  65,
                  '#f97316',
                  70,
                  '#ef4444',
                  75,
                  '#7f1d1d',
                ],
                [
                  'match',
                  ['get', 'category'],
                  'VERY_NOISY',
                  '#7f1d1d',
                  'NOISY',
                  '#f97316',
                  'MODERATE',
                  '#fde047',
                  'QUIET',
                  'rgba(0, 0, 0, 0)',
                  'rgba(0, 0, 0, 0)',
                ],
              ],
              'line-width': [
                'interpolate',
                ['linear'],
                ['zoom'],
                6, 2.5,
                10, 6.0,
                14, 14.0,
                17, 24.0,
                20, 36.0,
              ],
              'line-blur': 1.5,
              'line-opacity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                6, 0.40,
                10, 0.50,
                14, 0.42,
                17, 0.35,
                20, 0.25,
              ],
            },
          },
          {
            id: 'sica-borders',
            type: 'line',
            source: 'miteco-sica',
            'source-layer': 'sica_noise',
            minzoom: 6,
            maxzoom: 22,
            layout: {
              visibility: 'none',
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': [
                'case',
                ['has', 'lden'],
                [
                  'step',
                  ['get', 'lden'],
                  'rgba(0, 0, 0, 0)',
                  55,
                  '#ca8a04',
                  60,
                  '#d97706',
                  65,
                  '#ea580c',
                  70,
                  '#dc2626',
                  75,
                  '#991b1b',
                ],
                '#ea580c',
              ],
              'line-width': [
                'interpolate',
                ['linear'],
                ['zoom'],
                6, 1.0,
                10, 1.6,
                14, 2.2,
                17, 2.8,
                20, 3.2,
              ],
              'line-blur': 0.5,
              'line-opacity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                6, 0.75,
                10, 0.85,
                14, 0.80,
                17, 0.70,
                20, 0.60,
              ],
            },
          },
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
          {
            id: 'catastro-bizkaia-layer',
            type: 'raster',
            source: 'catastro-bizkaia-wms',
            minzoom: 12,
            maxzoom: 20,
            paint: {
              'raster-opacity': 0.95,
              'raster-brightness-min': 0.85,
              'raster-brightness-max': 1.0,
              'raster-contrast': 0.5,
            },
            layout: { visibility: 'none' },
          },
          {
            id: 'catastro-navarra-layer',
            type: 'raster',
            source: 'catastro-navarra-wms',
            minzoom: 12,
            maxzoom: 20,
            paint: {
              'raster-opacity': 0.95,
              'raster-brightness-min': 0.85,
              'raster-brightness-max': 1.0,
              'raster-contrast': 0.5,
            },
            layout: { visibility: 'none' },
          },
          {
            id: 'catastro-araba-layer',
            type: 'raster',
            source: 'catastro-araba-wms',
            minzoom: 12,
            maxzoom: 20,
            paint: {
              'raster-opacity': 0.95,
              'raster-brightness-min': 0.85,
              'raster-brightness-max': 1.0,
              'raster-contrast': 0.5,
            },
            layout: { visibility: 'none' },
          },
          {
            id: 'catastro-gipuzkoa-layer',
            type: 'raster',
            source: 'catastro-gipuzkoa-wms',
            minzoom: 12,
            maxzoom: 20,
            paint: {
              'raster-opacity': 0.95,
              'raster-brightness-min': 0.85,
              'raster-brightness-max': 1.0,
              'raster-contrast': 0.5,
            },
            layout: { visibility: 'none' },
          },
          {
            id: 'isochrone-15m-fill',
            type: 'fill',
            source: 'walking-isochrones',
            filter: ['==', ['get', 'ring'], '15m'],
            paint: { 'fill-color': '#6366f1', 'fill-opacity': 0.08 },
            layout: { visibility: 'visible' },
          },
          {
            id: 'isochrone-15m-line',
            type: 'line',
            source: 'walking-isochrones',
            filter: ['==', ['get', 'ring'], '15m'],
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
            filter: ['==', ['get', 'ring'], '10m'],
            paint: { 'fill-color': '#06b6d4', 'fill-opacity': 0.1 },
            layout: { visibility: 'visible' },
          },
          {
            id: 'isochrone-10m-line',
            type: 'line',
            source: 'walking-isochrones',
            filter: ['==', ['get', 'ring'], '10m'],
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
            filter: ['==', ['get', 'ring'], '5m'],
            paint: { 'fill-color': '#10b981', 'fill-opacity': 0.15 },
            layout: { visibility: 'visible' },
          },
          {
            id: 'isochrone-5m-line',
            type: 'line',
            source: 'walking-isochrones',
            filter: ['==', ['get', 'ring'], '5m'],
            paint: {
              'line-color': '#10b981',
              'line-width': 1.5,
              'line-dasharray': [2, 2],
              'line-opacity': 0.85,
            },
            layout: { visibility: 'visible' },
          },
          {
            id: 'civic-facilities-glow',
            type: 'circle',
            source: 'civic-facilities-source',
            minzoom: 11,
            paint: {
              'circle-radius': ['interpolate', ['linear'], ['zoom'], 12, 6, 15, 12, 18, 18],
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
              'circle-radius': ['interpolate', ['linear'], ['zoom'], 12, 5, 15, 8, 18, 12],
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
              'icon-size': ['interpolate', ['linear'], ['zoom'], 11, 0.75, 14, 0.95, 17, 1.15],
              'icon-allow-overlap': true,
              'icon-ignore-placement': true,
              'icon-pitch-alignment': 'viewport',
              'text-field': ['get', 'label'],
              'text-font': ['Open Sans Regular'],
              'text-size': ['interpolate', ['linear'], ['zoom'], 13, 10, 16, 11, 19, 12],
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
          {
            id: 'building-3d-ground-shadows',
            type: 'fill',
            source: 'building-3d-shadows-source',
            minzoom: 12,
            maxzoom: 22,
            layout: { visibility: 'none' },
            paint: { 'fill-color': '#030712', 'fill-opacity': 0.55 },
          },
          {
            id: 'building-3d-extrusion',
            type: 'fill-extrusion',
            source: 'building-3d-source',
            minzoom: 12,
            maxzoom: 22,
            layout: { visibility: 'none' },
            paint: {
              'fill-extrusion-color': [
                'case',
                ['boolean', ['get', 'isTarget'], false],
                '#68dba9',
                '#334155',
              ],
              'fill-extrusion-height': [
                'coalesce',
                ['get', 'height'],
                ['*', ['coalesce', ['get', 'numberOfFloors'], 4], 3.2],
              ],
              'fill-extrusion-base': 0,
              'fill-extrusion-opacity': 0.88,
              'fill-extrusion-opacity-transition': {
                duration: 400,
                delay: 0,
              },
            },
          },
        ],
      },
      center: [initialLon, initialLat],
      zoom: 15,
      bearing: 0,
      pitch: 0,
      attributionControl: false,
    });

    mapRef.current = map;

    map.on('load', () => {
      registerFacilityMapImages(map);
    });

    const handleMapClick = (e: MapMouseEvent) => {
      onMapClickRef.current(e.lngLat.lat, e.lngLat.lng);
    };
    map.on('click', handleMapClick);

    const handleMove = () => {
      setCurrentZoom(map.getZoom());
      setCurrentBearing(map.getBearing());
      setCurrentPitch(map.getPitch());
      const center = map.getCenter();
      setMapCenter({ lat: center.lat, lon: center.lng });
    };
    map.on('move', handleMove);

    return () => {
      map.off('click', handleMapClick);
      map.off('move', handleMove);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update marker when selectedCoords changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedCoords) return;

    if (!markerRef.current) {
      const el = document.createElement('div');
      el.className = 'radar-beacon-marker group relative w-8 h-8 flex items-center justify-center cursor-pointer select-none';
      el.setAttribute('data-testid', 'map-marker');
      el.style.zIndex = '30';
      el.innerHTML = `
        <div style="position: relative; display: flex; align-items: center; justify-content: center; pointer-events: none;">
          <!-- Dual radar ping & pulse rings (high-visibility neon amber) -->
          <div style="position: absolute; width: 56px; height: 56px; border-radius: 50%; background: rgba(245, 158, 11, 0.22); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite; pointer-events: none;"></div>
          <div style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background: rgba(245, 158, 11, 0.3); border: 1.5px solid rgba(251, 191, 36, 0.7); animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; pointer-events: none;"></div>

          <!-- Precision reticle & glowing beacon core -->
          <div style="position: relative; width: 26px; height: 26px; border-radius: 50%; background: #060e20; border: 2.5px solid #f59e0b; box-shadow: 0 0 16px rgba(245, 158, 11, 0.85), 0 0 4px rgba(251, 191, 36, 1); display: flex; align-items: center; justify-content: center;">
            <div style="width: 10px; height: 10px; border-radius: 50%; background: #f59e0b; box-shadow: 0 0 8px #f59e0b; display: flex; align-items: center; justify-content: center;">
              <div style="width: 3px; height: 3px; border-radius: 50%; background: #ffffff;"></div>
            </div>
          </div>
        </div>
      `;

      el.addEventListener('mouseenter', () => {
        el.style.zIndex = '999';
        if (el.parentElement) el.parentElement.style.zIndex = '999';
      });
      el.addEventListener('mouseleave', () => {
        el.style.zIndex = '30';
        if (el.parentElement) el.parentElement.style.zIndex = '';
      });

      markerRef.current = new maplibregl.Marker({ element: el, anchor: 'center' })
        .setLngLat([selectedCoords.lon, selectedCoords.lat])
        .addTo(map);
    } else {
      markerRef.current.setLngLat([selectedCoords.lon, selectedCoords.lat]);
    }

    map.flyTo({
      center: [selectedCoords.lon, selectedCoords.lat],
      zoom: Math.max(map.getZoom(), 16),
      essential: true,
      duration: 1200,
    });
  }, [selectedCoords?.lat, selectedCoords?.lon]);

  // Basemap switching
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    try {
      const basemapLayers = [
        { id: 'esri-dark-layer', type: 'dark-gis' },
        { id: 'pnoa-layer', type: 'pnoa-satellite' },
        { id: 'ign-layer', type: 'ign-base' },
      ];

      for (const b of basemapLayers) {
        if (map.getLayer(b.id)) {
          map.setLayoutProperty(
            b.id,
            'visibility',
            activeBasemap === b.type ? 'visible' : 'none'
          );
        }
      }
    } catch {
      // Ignore during initial load
    }
  }, [activeBasemap]);

  const handleZoomIn = useCallback(() => {
    mapRef.current?.zoomIn();
  }, []);

  const handleZoomOut = useCallback(() => {
    mapRef.current?.zoomOut();
  }, []);

  const handleResetNorth = useCallback(() => {
    mapRef.current?.resetNorthPitch();
  }, []);

  const handleLocateMe = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        onMapClickRef.current(lat, lon);
      },
      () => {
        // Geolocation error
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  return {
    mapRef,
    markerRef,
    currentZoom,
    currentBearing,
    currentPitch,
    mapCenter,
    handleZoomIn,
    handleZoomOut,
    handleResetNorth,
    handleLocateMe,
  };
}
