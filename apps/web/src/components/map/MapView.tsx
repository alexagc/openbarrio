import { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  Layers,
  Loader2,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  X,
  Volume2,
  Waves,
  TrendingUp,
  Footprints,
  Sun,
} from 'lucide-react';
import { ExtendedAuditReport } from '../../services/api.client';
import { wgs84ToUtm30n, createGeodesicCircle, escapeHtml } from '../../utils/geo';
import { SolarSimulationHud } from './SolarSimulationHud';
import { useMapLibre, BasemapType } from './hooks/useMapLibre';
import { useCadastralLayers } from './hooks/useCadastralLayers';
import { use3DBuildingExtrusion } from './hooks/use3DBuildingExtrusion';
import { useIsochronesLayer } from './hooks/useIsochronesLayer';
import { useEnvironmentalLayers } from './hooks/useEnvironmentalLayers';
import { MapControls } from './MapControls';
import { MapTelemetryHud } from './MapTelemetryHud';
import { MapLegendHud } from './MapLegendHud';
import { ThematicLensSelector, ThematicLens } from './ThematicLensSelector';
import { SeasonPreset } from '../../utils/solar';

// Export geodesic utilities for backward compatibility
export { wgs84ToUtm30n, createGeodesicCircle, escapeHtml };

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
  isDragging?: boolean;
}

export function MapView({
  selectedCoords,
  onMapClick,
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
  isDragging = false,
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMapDragging, setIsMapDragging] = useState(false);

  // Basemap & Thematic Layer States
  const [activeBasemap, setActiveBasemap] = useState<BasemapType>('dark-gis');
  const [activeLens, setActiveLens] = useState<ThematicLens>('urban');
  const [showCatastroWms, setShowCatastroWms] = useState<boolean>(true);
  const [showIneIncome, setShowIneIncome] = useState<boolean>(true);
  const [showMitecoNoise, setShowMitecoNoise] = useState<boolean>(false);
  const [showSncziFlood, setShowSncziFlood] = useState<boolean>(false);
  const [showIsochrones, setShowIsochrones] = useState<boolean>(true);

  // Auto-activate lens according to property typology (Decision A2)
  useEffect(() => {
    if (report) {
      const isRusticOrPlot =
        report.typology === 'RUSTIC' ||
        report.typology === 'VACANT_PLOT' ||
        report.property?.typology === 'RUSTIC' ||
        report.property?.typology === 'VACANT_PLOT';

      if (isRusticOrPlot) {
        setActiveLens('risks');
        setShowSncziFlood(true);
        setShowCatastroWms(true);
        setShowMitecoNoise(false);
        setShowIneIncome(false);
        setShowIsochrones(false);
        setIs3DMode(false);
      }
    }
  }, [report]);

  const handleSelectLens = useCallback((lens: ThematicLens) => {
    setActiveLens(lens);
    if (lens === 'urban') {
      setShowIsochrones(true);
      setShowIneIncome(true);
      setShowCatastroWms(true);
      setShowMitecoNoise(false);
      setShowSncziFlood(false);
      setIs3DMode(false);
    } else if (lens === 'silence') {
      setShowMitecoNoise(true);
      setShowCatastroWms(true);
      setShowIneIncome(false);
      setShowSncziFlood(false);
      setShowIsochrones(false);
      setIs3DMode(false);
    } else if (lens === 'risks') {
      setShowSncziFlood(true);
      setShowCatastroWms(true);
      setShowIneIncome(false);
      setShowMitecoNoise(false);
      setShowIsochrones(false);
      setIs3DMode(false);
    } else if (lens === 'solar') {
      setIs3DMode(true);
      setShowCatastroWms(true);
      setShowIsochrones(false);
      setShowMitecoNoise(false);
      setShowSncziFlood(false);
      setIsSolarHudOpen(true);
    }
  }, []);

  // 3D & Solar Simulation States
  const [is3DMode, setIs3DMode] = useState<boolean>(false);
  const [isSolarHudOpen, setIsSolarHudOpen] = useState<boolean>(true);
  const [currentSolarAzimuth, setCurrentSolarAzimuth] = useState<number>(214);
  const [currentSolarAltitude, setCurrentSolarAltitude] = useState<number>(38.2);

  // Layer Opacities
  const [catastroOpacity] = useState<number>(0.95);
  const [ineOpacity] = useState<number>(0.75);
  const [noiseOpacity] = useState<number>(0.75);
  const [floodOpacity] = useState<number>(0.75);

  // Mobile drawer state
  const [internalMobileLayersOpen, setInternalMobileLayersOpen] = useState<boolean>(false);
  const isLayersSheetOpen = isMobileLayersOpen !== undefined ? isMobileLayersOpen : internalMobileLayersOpen;
  const toggleMobileLayers = (open?: boolean) => {
    const next = typeof open === 'boolean' ? open : !isLayersSheetOpen;
    setInternalMobileLayersOpen(next);
    onToggleMobileLayers?.(next);
  };

  const [isDesktopLayersExpanded, setIsDesktopLayersExpanded] = useState<boolean>(defaultLayersExpanded);

  // Initialize MapLibre
  const {
    mapRef,
    currentBearing,
    currentPitch,
    mapCenter,
    handleZoomIn,
    handleZoomOut,
    handleResetNorth,
    handleLocateMe,
  } = useMapLibre({
    containerRef,
    selectedCoords,
    onMapClick,
    activeBasemap,
  });

  // Layer Management Hooks
  useCadastralLayers({
    map: mapRef.current,
    showCatastroWms,
    catastroOpacity,
    selectedCoords,
  });

  use3DBuildingExtrusion({
    map: mapRef.current,
    is3DMode,
    selectedCoords,
    report,
    solarAzimuth: currentSolarAzimuth,
    solarAltitude: currentSolarAltitude,
  });

  useIsochronesLayer({
    map: mapRef.current,
    showIsochrones,
    selectedCoords,
    report,
  });

  useEffect(() => {
    const map = mapRef.current;
    if (!map || typeof map.on !== 'function') return;
    const handleDragStart = () => setIsMapDragging(true);
    const handleDragEnd = () => setIsMapDragging(false);
    map.on('dragstart', handleDragStart);
    map.on('dragend', handleDragEnd);
    return () => {
      map.off('dragstart', handleDragStart);
      map.off('dragend', handleDragEnd);
    };
  }, [mapRef.current]);

  useEnvironmentalLayers({
    map: mapRef.current,
    showIneIncome,
    showMitecoNoise,
    showSncziFlood,
    ineOpacity,
    noiseOpacity,
    floodOpacity,
  });

  const activeThematicLayersCount = useMemo(() => {
    return [showCatastroWms, showIneIncome, showMitecoNoise, showSncziFlood, showIsochrones].filter(Boolean).length;
  }, [showCatastroWms, showIneIncome, showMitecoNoise, showSncziFlood, showIsochrones]);

  const handleSolarChange = useCallback(
    (solar: { azimuth: number; altitude: number; directRadiationWm2: number; season: SeasonPreset; timeMinutes: number }) => {
      setCurrentSolarAzimuth(solar.azimuth);
      setCurrentSolarAltitude(solar.altitude);
    },
    []
  );

  const resetToSpain = useCallback(() => {
    mapRef.current?.flyTo({ center: [-3.70379, 40.42028], zoom: 5.5, pitch: 0, bearing: 0, duration: 1200 });
  }, [mapRef]);

  const activeLat = selectedCoords?.lat ?? mapCenter.lat;
  const activeLon = selectedCoords?.lon ?? mapCenter.lon;
  const utmCoords = useMemo(() => wgs84ToUtm30n(activeLat, activeLon), [activeLat, activeLon]);
  const estimatedElevation = useMemo(() => {
    const latDiff = Math.abs(activeLat - 40.42);
    const lonDiff = Math.abs(activeLon - -3.7);
    if (latDiff < 0.5 && lonDiff < 0.5) return 652;
    if (activeLon > 1.5 || activeLon < -8.0 || activeLat < 37.0) return 38;
    return 485;
  }, [activeLat, activeLon]);

  return (
    <div className="relative w-full h-full min-h-[420px] bg-slate-950 overflow-hidden select-none">
      <div ref={containerRef} className="w-full h-full" style={{ position: 'absolute', inset: 0 }} />

      {/* Mobile Top-Left Telemetry HUD Pill */}
      <div
        data-testid="mobile-utm-hud"
        className="flex lg:hidden absolute top-3 left-3 z-30 pointer-events-auto bg-surface-container-low/95 backdrop-blur-md border border-outline-variant px-2.5 py-1.5 rounded-lg text-[10px] font-mono text-on-surface shadow-md items-center gap-1.5"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shrink-0" />
        <span>
          UTM 30N: {utmCoords.x}, {utmCoords.y} · {estimatedElevation}m s.n.m.
        </span>
      </div>

      {/* Desktop Thematic Layer Switcher (Top-Left) */}
      <div onClick={(e) => e.stopPropagation()} className="hidden lg:block absolute top-3 left-3 z-30">
        {!isDesktopLayersExpanded ? (
          <button
            type="button"
            onClick={() => setIsDesktopLayersExpanded(true)}
            className="flex items-center gap-2 bg-surface-container-low/95 backdrop-blur-md border border-outline-variant px-3 py-1.5 rounded shadow-xl text-xs font-mono font-semibold text-on-surface hover:text-primary transition cursor-pointer"
            aria-label="Expandir panel de capas"
          >
            <Layers className="w-4 h-4 text-primary" />
            <span>Capas ({activeThematicLayersCount})</span>
            <ChevronDown className="w-3.5 h-3.5 text-on-surface-variant" />
          </button>
        ) : (
          <div className="bg-surface-container-low/95 backdrop-blur-md border border-outline-variant rounded p-2.5 shadow-2xl w-64 text-on-surface animate-in fade-in duration-150">
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
                className={`py-1 rounded text-center transition font-semibold cursor-pointer ${activeBasemap === 'dark-gis' ? 'bg-primary text-on-primary shadow-xs' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                Dark GIS
              </button>
              <button
                type="button"
                onClick={() => setActiveBasemap('pnoa-satellite')}
                className={`py-1 rounded text-center transition font-semibold cursor-pointer ${activeBasemap === 'pnoa-satellite' ? 'bg-primary text-on-primary shadow-xs' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                Satélite
              </button>
              <button
                type="button"
                onClick={() => setActiveBasemap('ign-base')}
                className={`py-1 rounded text-center transition font-semibold cursor-pointer ${activeBasemap === 'ign-base' ? 'bg-primary text-on-primary shadow-xs' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                IGN
              </button>
            </div>

            {/* Thematic Overlays Switcher */}
            <div className="space-y-1.5 text-xs font-mono">
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
          </div>
        )}
      </div>

      {/* Centered Floating Thematic Lens Selector (Fase 20 - Decision A2) */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 max-w-[calc(100vw-24px)] overflow-x-auto no-scrollbar pointer-events-auto">
        <ThematicLensSelector
          activeLens={activeLens}
          onSelectLens={handleSelectLens}
        />
      </div>

      {/* Map Controls (Top-Right Desktop & Mobile FABs) */}
      <MapControls
        is3DMode={is3DMode}
        onToggle3DMode={(enable) => {
          if (enable) {
            handleSelectLens('solar');
          } else {
            handleSelectLens(activeLens === 'solar' ? 'urban' : activeLens);
            setIs3DMode(false);
          }
        }}
        currentBearing={currentBearing}
        currentPitch={currentPitch}
        currentSolarAzimuth={currentSolarAzimuth}
        currentSolarAltitude={currentSolarAltitude}
        onResetNorth={handleResetNorth}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetToSpain={resetToSpain}
        onToggleMobileLayers={toggleMobileLayers}
        activeThematicLayersCount={activeThematicLayersCount}
        onLocateMe={handleLocateMe}
      />

      {/* Telemetry HUD */}
      <MapTelemetryHud lat={activeLat} lon={activeLon} is3DMode={is3DMode} />

      {/* Cartographic Legends HUD */}
      <MapLegendHud
        isDragging={isDragging || isMapDragging}
        activeLayers={{
          cadastre: showCatastroWms,
          noise: showMitecoNoise,
          flood: showSncziFlood,
          income: showIneIncome,
          isochrones: showIsochrones,
        }}
        defaultCollapsed={true}
      />

      {/* 3D Solar Simulation HUD */}
      {is3DMode && (
        isSolarHudOpen ? (
          <SolarSimulationHud
            lat={activeLat}
            lon={activeLon}
            onSolarChange={handleSolarChange}
            onClose={() => setIsSolarHudOpen(false)}
          />
        ) : (
          <div className="absolute bottom-12 left-3 z-30 animate-in fade-in duration-200">
            <button
              type="button"
              onClick={() => setIsSolarHudOpen(true)}
              className="flex items-center gap-2 px-3 py-2 bg-surface-container-low/95 backdrop-blur-md border border-amber-500/50 hover:border-amber-400 rounded-xl text-xs font-mono text-amber-300 shadow-2xl transition cursor-pointer"
              title="Abrir Simulador Solar & Sombras"
            >
              <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
              <span>Simulador Solar</span>
            </button>
          </div>
        )
      )}

      {/* Floating Due Diligence Audit Card */}
      {!is3DMode && showFloatingAuditCard && (
        isLoading ? (
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
        ) : null
      )}

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

      {/* Responsive Mobile Layers Drawer */}
      {isLayersSheetOpen && (
        <div className="block lg:hidden fixed inset-0 z-50 flex flex-col justify-end no-print" data-testid="mobile-layers-drawer">
          <div
            onClick={() => toggleMobileLayers(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            aria-label="Cerrar panel de capas"
            data-testid="mobile-layers-backdrop"
          />
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-h-[85vh] bg-surface-container-low border-t border-outline-variant rounded-t-2xl p-4 shadow-2xl flex flex-col overflow-hidden text-on-surface animate-in slide-in-from-bottom duration-200 z-10"
          >
            <div className="w-10 h-1 bg-outline-variant rounded-full mx-auto mb-3 shrink-0" />
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
                data-testid="mobile-layers-close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-4 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-outline font-mono block mb-2">Mapas Base</span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveBasemap('dark-gis')}
                    className={`min-h-[44px] py-2 px-3 rounded-lg text-xs font-mono font-semibold transition border cursor-pointer flex items-center justify-center text-center ${activeBasemap === 'dark-gis' ? 'bg-primary text-on-primary border-primary shadow-sm' : 'bg-surface-container text-on-surface-variant border-outline-variant hover:text-on-surface'}`}
                  >
                    Dark GIS
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveBasemap('pnoa-satellite')}
                    className={`min-h-[44px] py-2 px-3 rounded-lg text-xs font-mono font-semibold transition border cursor-pointer flex items-center justify-center text-center ${activeBasemap === 'pnoa-satellite' ? 'bg-primary text-on-primary border-primary shadow-sm' : 'bg-surface-container text-on-surface-variant border-outline-variant hover:text-on-surface'}`}
                  >
                    Satélite
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveBasemap('ign-base')}
                    className={`min-h-[44px] py-2 px-3 rounded-lg text-xs font-mono font-semibold transition border cursor-pointer flex items-center justify-center text-center ${activeBasemap === 'ign-base' ? 'bg-primary text-on-primary border-primary shadow-sm' : 'bg-surface-container text-on-surface-variant border-outline-variant hover:text-on-surface'}`}
                  >
                    IGN Topográfico
                  </button>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-outline font-mono block mb-2">Capas Temáticas Oficiales</span>
                <div className="space-y-2.5">
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
