import { useState, useEffect, useMemo, useRef } from 'react';
import { Play, Pause, Compass, Sun, Zap, ChevronDown, ChevronUp, X, Sparkles } from 'lucide-react';
import {
  SeasonPreset,
  calculateSolarPosition,
  analyzeFacadeSolarExposure,
  createDateForSeasonAndTime,
  getCardinalOrientation,
} from '../../utils/solar';

export interface SolarSimulationHudProps {
  lat?: number;
  lon?: number;
  facadeAzimuthDeg?: number;
  roofAreaM2?: number;
  initialSeason?: SeasonPreset;
  initialTimeMinutes?: number; // e.g. 14 * 60 + 30 = 870 (14:30)
  isOpen?: boolean;
  onClose?: () => void;
  onSolarChange?: (solar: {
    azimuth: number;
    altitude: number;
    directRadiationWm2: number;
    solarTimeStr: string;
    season: SeasonPreset;
    timeMinutes: number;
  }) => void;
}

export function SolarSimulationHud({
  lat = 40.42028,
  lon = -3.70379,
  facadeAzimuthDeg = 198,
  roofAreaM2 = 200,
  initialSeason = 'summer',
  initialTimeMinutes = 870, // 14:30
  isOpen = true,
  onClose,
  onSolarChange,
}: SolarSimulationHudProps) {
  const [season, setSeason] = useState<SeasonPreset>(initialSeason);
  const [timeMinutes, setTimeMinutes] = useState<number>(initialTimeMinutes);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  // Current Solar Calculation
  const solarPosition = useMemo(() => {
    const date = createDateForSeasonAndTime(season, timeMinutes);
    return calculateSolarPosition(lat, lon, date);
  }, [lat, lon, season, timeMinutes]);

  // Facade Exposure Analysis
  const facadeAnalysis = useMemo(() => {
    return analyzeFacadeSolarExposure(facadeAzimuthDeg, lat, lon, season, roofAreaM2);
  }, [facadeAzimuthDeg, lat, lon, season, roofAreaM2]);

  // Synchronize with external listener (e.g. MapView 3D lighting)
  const onSolarChangeRef = useRef(onSolarChange);
  useEffect(() => {
    onSolarChangeRef.current = onSolarChange;
  }, [onSolarChange]);

  useEffect(() => {
    onSolarChangeRef.current?.({
      ...solarPosition,
      season,
      timeMinutes,
    });
  }, [solarPosition, season, timeMinutes]);

  // Auto-scrubbing timeline animation
  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    lastTimeRef.current = performance.now();

    const loop = (now: number) => {
      const deltaMs = now - lastTimeRef.current;
      lastTimeRef.current = now;

      // Advance ~30 minutes of solar time per real second
      const minutesAdvance = (deltaMs / 1000) * 30;

      setTimeMinutes((prev) => {
        let next = prev + minutesAdvance;
        if (next > 22 * 60) {
          next = 6 * 60; // Loop back to 06:00
        }
        return next;
      });

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying]);

  if (!isOpen) return null;

  // Local Time formatted
  const hours = Math.floor(timeMinutes / 60);
  const mins = Math.floor(timeMinutes % 60);
  const timeFormatted = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  const tzLabel = season === 'summer' ? 'CEST' : 'CET';

  // Cardinal abbreviation
  const cardinalStr = getCardinalOrientation(solarPosition.azimuth);
  const cardinalShort = cardinalStr.split(' ')[0] || 'SUR';

  // Slider percentage calculation for 06:00 (360m) to 22:00 (1320m)
  const minSlider = 6 * 60;
  const maxSlider = 22 * 60;
  const sliderPercent = Math.max(0, Math.min(100, ((timeMinutes - minSlider) / (maxSlider - minSlider)) * 100));

  return (
    <div
      data-testid="solar-simulation-hud"
      className="absolute bottom-2 sm:bottom-3 left-2 right-2 sm:left-auto sm:right-auto sm:w-[680px] sm:left-1/2 sm:-translate-x-1/2 z-40 pointer-events-none"
    >
      <div className="bg-surface-container/95 border border-outline-variant rounded-xl shadow-2xl backdrop-blur-xl p-2.5 sm:p-3 pointer-events-auto flex flex-col gap-2 text-on-surface animate-in slide-in-from-bottom-3 duration-200">
        {/* Header Row: Astronomical Engine Status & Live Vector */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-outline-variant/60 pb-1.5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary" />
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-headline font-bold text-xs sm:text-sm text-on-surface tracking-tight">
                SIMULADOR SOLAR & SOMBRAS
              </span>
              <span className="hidden sm:inline font-mono text-[9px] text-outline uppercase tracking-widest pl-2 border-l border-outline-variant">
                Cálculo Astronómico Algorítmico
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Live Sun Coordinates Vector Pill */}
            <div
              data-testid="live-sun-vector"
              className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs font-mono bg-surface-container-low px-2.5 py-1 rounded border border-outline-variant"
            >
              <div>
                Azimut: <span className="text-secondary font-bold">{Math.round(solarPosition.azimuth)}° ({cardinalShort})</span>
              </div>
              <div className="text-outline">|</div>
              <div>
                Elevación: <span className="text-primary font-bold">{solarPosition.altitude.toFixed(1)}°</span>
              </div>
              <div className="text-outline">|</div>
              <div>
                Radiación: <span className="text-secondary font-bold">{solarPosition.directRadiationWm2} W/m²</span>
              </div>
            </div>

            {/* Minimize / Expand Toggle */}
            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
              title={isCollapsed ? 'Expandir HUD Solar' : 'Minimizar HUD Solar'}
              aria-label={isCollapsed ? 'Expandir HUD Solar' : 'Minimizar HUD Solar'}
            >
              {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-rose-400 transition-colors cursor-pointer"
                title="Cerrar Simulador Solar"
                aria-label="Cerrar Simulador Solar"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {!isCollapsed && (
          <>
            {/* Presets and Controls Subgrid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              {/* Season Segmented Controls (5 cols) */}
              <div className="md:col-span-5 flex items-center bg-surface-container-low p-1 rounded-lg border border-outline-variant gap-1">
                {(['winter', 'equinox', 'summer'] as const).map((s) => {
                  const labels: Record<SeasonPreset, string> = {
                    winter: 'Invierno (21 Dic)',
                    equinox: 'Equinoccio (21 Mar)',
                    summer: 'Verano (21 Jun)',
                  };
                  const isSelected = season === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSeason(s)}
                      className={`flex-1 py-1.5 px-2 text-center rounded-md text-[11px] font-mono transition cursor-pointer flex items-center justify-center gap-1 ${
                        isSelected
                          ? 'bg-primary/20 text-primary border border-primary/40 font-bold shadow-xs'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />}
                      <span>{labels[s]}</span>
                    </button>
                  );
                })}
              </div>

              {/* Scrub Timeline Slider with Golden Daylight Curve (7 cols) */}
              <div className="md:col-span-7 flex items-center gap-3 bg-surface-container-low px-3 py-2 rounded-lg border border-outline-variant">
                {/* Play / Pause Toggle Button */}
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  aria-label={isPlaying ? 'Pausar simulación solar' : 'Reproducir simulación solar'}
                  className="w-8 h-8 rounded-md bg-primary text-on-primary flex items-center justify-center hover:bg-primary-container transition-colors shadow-sm shrink-0 cursor-pointer"
                  title={isPlaying ? 'Pausar animación' : 'Reproducir simulación diurna'}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  )}
                </button>

                {/* Time Display */}
                <div className="flex flex-col shrink-0 min-w-[110px]">
                  <span className="text-[15px] text-on-surface font-bold font-mono leading-none">
                    {timeFormatted} <span className="text-[10px] font-normal text-outline">{tzLabel}</span>
                  </span>
                  <span className="text-[10px] text-on-surface-variant font-mono mt-0.5">
                    Solar: {solarPosition.solarTimeStr}
                  </span>
                </div>

                {/* Visual Scrub Bar & Golden Daylight Wave */}
                <div className="flex-1 flex flex-col gap-1 min-w-0">
                  <div className="relative w-full h-3 bg-surface-container-high rounded-full overflow-hidden flex items-center">
                    {/* Daylight curve intensity gradient */}
                    <div className="absolute inset-y-0 left-[10%] right-[10%] bg-gradient-to-r from-amber-600/30 via-amber-400/80 to-amber-600/30 opacity-70 pointer-events-none" />

                    {/* Native Accessible Range Slider Overlay */}
                    <input
                      type="range"
                      min={minSlider}
                      max={maxSlider}
                      step={5}
                      value={timeMinutes}
                      onChange={(e) => {
                        setIsPlaying(false);
                        setTimeMinutes(parseFloat(e.target.value));
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      aria-label="Control temporal solar (hora del día)"
                    />

                    {/* Scrub Thumb Visual Indicator */}
                    <div
                      className="absolute w-3.5 h-3.5 rounded-full bg-white border-2 border-primary shadow-lg transform -translate-x-1/2 pointer-events-none transition-[left] duration-75"
                      style={{ left: `${sliderPercent}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[9px] text-outline font-mono">
                    <span>06:00 (Amanecer)</span>
                    <span className="text-secondary font-bold">14:00 Cenit</span>
                    <span>22:00 (Ocaso)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Telemetry Pills Footer (4 items) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1 border-t border-outline-variant/60 text-xs">
              {/* 1. Orientación Fachada */}
              <div className="bg-surface-container-low px-2.5 py-1.5 rounded border border-outline-variant flex items-center gap-2">
                <Compass className="w-4 h-4 text-outline shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="text-[9px] text-outline uppercase font-mono truncate">Orientación Fachada</span>
                  <span className="text-[11px] text-on-surface font-semibold font-mono truncate">
                    {facadeAnalysis.facadeOrientation}
                  </span>
                </div>
              </div>

              {/* 2. Insolación Directa */}
              <div className="bg-surface-container-low px-2.5 py-1.5 rounded border border-outline-variant flex items-center gap-2">
                <Sun className="w-4 h-4 text-secondary shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="text-[9px] text-outline uppercase font-mono truncate">Insolación Directa</span>
                  <span className="text-[11px] text-secondary font-bold font-mono truncate">
                    {facadeAnalysis.directSunlightHours} h / día
                  </span>
                </div>
              </div>

              {/* 3. Confort Lumínico */}
              <div className="bg-surface-container-low px-2.5 py-1.5 rounded border border-outline-variant flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="text-[9px] text-outline uppercase font-mono truncate">Confort Lumínico</span>
                  <span className="text-[11px] text-primary font-bold font-mono truncate">
                    {facadeAnalysis.comfortRating.toUpperCase()} ({facadeAnalysis.comfortScore}/100)
                  </span>
                </div>
              </div>

              {/* 4. Potencial Fotovoltaico */}
              <div className="bg-surface-container-low px-2.5 py-1.5 rounded border border-outline-variant flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-300 shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="text-[9px] text-outline uppercase font-mono truncate">Potencial Fotovoltaico</span>
                  <span className="text-[11px] text-amber-300 font-bold font-mono truncate">
                    {facadeAnalysis.photovoltaicPotentialMWh} MWh / año
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
