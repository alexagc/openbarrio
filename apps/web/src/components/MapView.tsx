import { useEffect, useRef, useState } from 'react';
import maplibregl, { Map as MapLibreMap, Marker, NavigationControl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Layers, MapPin, Maximize2 } from 'lucide-react';

interface MapViewProps {
  selectedCoords?: { lat: number; lon: number };
  onMapClick: (lat: number, lon: number) => void;
  propertyName?: string;
  propertyAddress?: string;
}

type BasemapType = 'osm' | 'ign-base' | 'pnoa-satellite';

function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, (m) => {
    switch (m) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#39;';
      default: return m;
    }
  });
}

export function MapView({
  selectedCoords,
  onMapClick,
  propertyName,
  propertyAddress,
}: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markerRef = useRef<Marker | null>(null);

  const [activeBasemap, setActiveBasemap] = useState<BasemapType>('osm');
  const [showCatastroWms, setShowCatastroWms] = useState<boolean>(true);
  const [currentZoom, setCurrentZoom] = useState<number>(14);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const initialLon = selectedCoords ? selectedCoords.lon : -3.70379;
    const initialLat = selectedCoords ? selectedCoords.lat : 40.42028;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          'osm-base': {
            type: 'raster',
            tiles: [
              'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            ],
            tileSize: 256,
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
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
              'https://www.ign.es/wms-inspire/pnoa-ma?SERVICE=WMS&REQUEST=GetMap&LAYERS=OI.OrthoimageCoverage&STYLES=&FORMAT=image/jpeg&TRANSPARENT=false&VERSION=1.3.0&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&BBOX={bbox-epsg-3857}',
            ],
            tileSize: 256,
            attribution: '&copy; Instituto Geográfico Nacional (IGN PNOA)',
          },
          'catastro-wms': {
            type: 'raster',
            tiles: [
              'https://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx?SERVICE=WMS&SRS=EPSG:3857&REQUEST=GetMap&FORMAT=image/png&BBOX={bbox-epsg-3857}&WIDTH=256&HEIGHT=256&LAYERS=Catastro&TRANSPARENT=TRUE',
            ],
            tileSize: 256,
            attribution: '&copy; Dirección General del Catastro (España)',
          },
        },
        layers: [
          {
            id: 'osm-layer',
            type: 'raster',
            source: 'osm-base',
            minzoom: 0,
            maxzoom: 20,
            layout: {
              visibility: 'visible',
            },
          },
          {
            id: 'ign-layer',
            type: 'raster',
            source: 'ign-base',
            minzoom: 0,
            maxzoom: 20,
            layout: {
              visibility: 'none',
            },
          },
          {
            id: 'pnoa-layer',
            type: 'raster',
            source: 'pnoa-base',
            minzoom: 0,
            maxzoom: 20,
            layout: {
              visibility: 'none',
            },
          },
          {
            id: 'catastro-layer',
            type: 'raster',
            source: 'catastro-wms',
            minzoom: 13,
            maxzoom: 20,
            paint: {
              'raster-opacity': 0.82,
            },
            layout: {
              visibility: 'visible',
            },
          },
        ],
      },
      center: [initialLon, initialLat],
      zoom: 15,
      maxZoom: 19,
      minZoom: 5,
    });

    map.addControl(new NavigationControl({ showCompass: true }), 'top-right');

    map.on('zoom', () => {
      setCurrentZoom(Math.round(map.getZoom()));
    });

    map.on('click', (e) => {
      const lat = parseFloat(e.lngLat.lat.toFixed(6));
      const lon = parseFloat(e.lngLat.lng.toFixed(6));
      onMapClick(lat, lon);
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

  // Update basemap layers
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    map.setLayoutProperty('osm-layer', 'visibility', activeBasemap === 'osm' ? 'visible' : 'none');
    map.setLayoutProperty('ign-layer', 'visibility', activeBasemap === 'ign-base' ? 'visible' : 'none');
    map.setLayoutProperty('pnoa-layer', 'visibility', activeBasemap === 'pnoa-satellite' ? 'visible' : 'none');
  }, [activeBasemap]);

  // Update Catastro WMS overlay visibility
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    map.setLayoutProperty(
      'catastro-layer',
      'visibility',
      showCatastroWms ? 'visible' : 'none'
    );
  }, [showCatastroWms]);

  // Update marker & camera when coordinates change
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedCoords) return;

    const { lat, lon } = selectedCoords;

    // Create custom DOM element for pulsing radar pin
    const el = document.createElement('div');
    el.className = 'group relative cursor-pointer';
    el.innerHTML = `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-10 h-10 bg-indigo-500 rounded-full animate-ping opacity-60"></div>
        <div class="relative w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-xl border-2 border-white transform transition hover:scale-110">
          <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>
      </div>
    `;

    if (markerRef.current) {
      markerRef.current.remove();
    }

    const safeTitle = escapeHtml(propertyName || 'Inmueble Auditado');
    const safeAddress = escapeHtml(propertyAddress || `${lat.toFixed(5)}, ${lon.toFixed(5)}`);
    const popupHtml = `
      <div class="p-2 text-xs font-sans">
        <p class="font-bold text-slate-900">${safeTitle}</p>
        <p class="text-slate-600">${safeAddress}</p>
        <p class="mt-1 text-[10px] text-indigo-600 font-medium">Click en el mapa para auditar otro punto</p>
      </div>
    `;

    const popup = new maplibregl.Popup({ offset: 25, closeButton: false }).setHTML(popupHtml);

    const marker = new maplibregl.Marker({ element: el })
      .setLngLat([lon, lat])
      .setPopup(popup)
      .addTo(map);

    markerRef.current = marker;

    map.flyTo({
      center: [lon, lat],
      zoom: Math.max(map.getZoom(), 16),
      essential: true,
      duration: 1200,
    });
  }, [selectedCoords, propertyName, propertyAddress]);

  const resetToSpain = () => {
    if (!mapRef.current) return;
    mapRef.current.flyTo({
      center: [-3.70379, 40.42028],
      zoom: 6,
      duration: 1200,
    });
  };

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100">
      {/* MapLibre DOM Target */}
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />

      {/* Floating Map Controls & Indicators */}
      <div className="absolute top-3 left-3 z-10 flex flex-col space-y-2 no-print">
        {/* Layer Toggle Card */}
        <div className="bg-white/95 backdrop-blur-md p-1.5 rounded-xl shadow-lg border border-slate-200/80 flex items-center space-x-1 text-xs">
          <button
            onClick={() => setActiveBasemap('osm')}
            className={`px-2.5 py-1.5 rounded-lg font-medium transition ${
              activeBasemap === 'osm'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Callejero
          </button>
          <button
            onClick={() => setActiveBasemap('ign-base')}
            className={`px-2.5 py-1.5 rounded-lg font-medium transition ${
              activeBasemap === 'ign-base'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            IGN Base
          </button>
          <button
            onClick={() => setActiveBasemap('pnoa-satellite')}
            className={`px-2.5 py-1.5 rounded-lg font-medium transition ${
              activeBasemap === 'pnoa-satellite'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Satélite (PNOA)
          </button>
        </div>

        {/* Catastro Overlay Toggle */}
        <div className="bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl shadow-lg border border-slate-200/80 flex items-center justify-between space-x-2.5 text-xs text-slate-700">
          <div className="flex items-center space-x-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <span className="font-medium">Parcelas Catastro WMS</span>
          </div>
          <button
            onClick={() => setShowCatastroWms(!showCatastroWms)}
            className={`w-9 h-5 flex items-center rounded-full p-0.5 transition duration-200 ease-in-out ${
              showCatastroWms ? 'bg-indigo-600 justify-end' : 'bg-slate-300 justify-start'
            }`}
            title="Activar/Desactivar capa de parcelas catastrales oficiales"
          >
            <span className="w-4 h-4 bg-white rounded-full shadow-md transform"></span>
          </button>
        </div>

        {/* Zoom Hint if zoom is low for Catastro */}
        {showCatastroWms && currentZoom < 13 && (
          <div className="bg-amber-50/95 border border-amber-200 text-amber-800 text-[11px] px-2.5 py-1 rounded-lg shadow-sm">
            Acércate (Zoom &ge; 13) para visualizar parcelas catastrales.
          </div>
        )}
      </div>

      {/* Floating Bottom Left Helper & Reset */}
      <div className="absolute bottom-3 left-3 z-10 flex items-center space-x-2 no-print">
        <button
          onClick={resetToSpain}
          className="bg-white/95 backdrop-blur-md hover:bg-white text-slate-700 px-3 py-1.5 rounded-xl shadow-lg border border-slate-200 text-xs font-medium flex items-center space-x-1.5 transition"
          title="Centrar en el mapa general de España"
        >
          <Maximize2 className="w-3.5 h-3.5 text-slate-500" />
          <span>Vista España</span>
        </button>

        <div className="hidden sm:flex bg-slate-900/80 backdrop-blur-md text-white text-[11px] px-3 py-1.5 rounded-xl shadow-lg items-center space-x-1.5">
          <MapPin className="w-3.5 h-3.5 text-indigo-400" />
          <span>Haz click en cualquier punto para auditarlo</span>
        </div>
      </div>
    </div>
  );
}
