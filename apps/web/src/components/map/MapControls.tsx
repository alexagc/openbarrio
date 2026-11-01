import {
  Compass,
  Plus,
  Minus,
  Maximize2,
  Box,
  Layers,
  Navigation,
  Loader2,
} from 'lucide-react';
import { getCardinalOrientation } from '../../utils/solar';

export interface MapControlsProps {
  is3DMode: boolean;
  onToggle3DMode: (enable: boolean) => void;
  currentBearing: number;
  currentPitch: number;
  currentSolarAzimuth: number;
  currentSolarAltitude: number;
  onResetNorth: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetToSpain: () => void;
  onToggleMobileLayers: () => void;
  activeThematicLayersCount: number;
  onLocateMe: () => void;
  isLocating?: boolean;
}

export function MapControls({
  is3DMode,
  onToggle3DMode,
  currentBearing,
  currentPitch,
  currentSolarAzimuth,
  currentSolarAltitude: _currentSolarAltitude,
  onResetNorth,
  onZoomIn,
  onZoomOut,
  onResetToSpain,
  onToggleMobileLayers,
  activeThematicLayersCount,
  onLocateMe,
  isLocating = false,
}: MapControlsProps) {
  return (
    <>
      {/* ================= MOBILE TOUCH FAB TOOLBAR (Top-Right, >=44x44px) ================= */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex lg:hidden absolute top-3 right-3 z-30 flex-col gap-2 items-end no-print"
        data-testid="mobile-fab-toolbar"
      >
        {/* 1) Layers FAB with active counter badge */}
        <button
          type="button"
          onClick={onToggleMobileLayers}
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

        {/* 2) Compass FAB */}
        <button
          type="button"
          onClick={onResetNorth}
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
          onClick={onLocateMe}
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
            onClick={onZoomIn}
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
            onClick={onZoomOut}
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
            onClick={onResetNorth}
            title={
              is3DMode
                ? `Alinear al Norte · Sol: ${Math.round(currentSolarAzimuth)}° (${getCardinalOrientation(currentSolarAzimuth)})`
                : 'Alinear al Norte (0°)'
            }
            aria-label="Alinear al Norte (0°)"
          >
            <div className="absolute inset-1 rounded-full border border-dashed border-outline-variant/60" />

            {/* Sun Direction Ray in 3D Mode */}
            {is3DMode && (
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none transition-transform duration-100"
                style={{
                  transform: `rotate(${((currentSolarAzimuth - currentBearing + 360) % 360)}deg)`,
                }}
              >
                <div className="absolute -top-2 flex flex-col items-center">
                  <span className="text-[11px] filter drop-shadow-[0_0_4px_#f59e0b]">☀️</span>
                </div>
                <div className="h-4 w-0.5 bg-gradient-to-b from-amber-400 to-transparent" />
              </div>
            )}

            {/* Arrow pointing to True North */}
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
                onClick={onResetNorth}
                className="w-7 h-7 bg-surface-container hover:bg-surface-container-high rounded text-on-surface border border-outline-variant flex items-center justify-center transition-colors cursor-pointer"
                title="Alinear al Norte"
                aria-label="Alinear al Norte"
              >
                <Compass className="w-3.5 h-3.5 text-secondary" />
              </button>
              <button
                type="button"
                onClick={() => onToggle3DMode(false)}
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
                onClick={() => onToggle3DMode(true)}
                data-testid="toggle-3d-button"
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
          <button
            type="button"
            onClick={onZoomIn}
            className="w-7 h-7 rounded hover:bg-surface-container text-on-surface-variant hover:text-on-surface flex items-center justify-center transition-colors cursor-pointer"
            title="Acercar (+)"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onZoomOut}
            className="w-7 h-7 rounded hover:bg-surface-container text-on-surface-variant hover:text-on-surface flex items-center justify-center transition-colors cursor-pointer"
            title="Alejar (-)"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onResetNorth}
            className="w-7 h-7 bg-surface-container-low/95 hover:bg-surface-container border border-outline-variant rounded flex items-center justify-center text-secondary transition-colors cursor-pointer"
            title="Orientación Norte (0°)"
          >
            <Compass className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onResetToSpain}
            className="w-7 h-7 rounded hover:bg-surface-container text-on-surface-variant hover:text-primary flex items-center justify-center transition-colors cursor-pointer"
            title="Vista General España"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </>
  );
}
