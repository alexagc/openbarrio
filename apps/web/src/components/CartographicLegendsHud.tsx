import { useState } from 'react';
import { ChevronUp, ChevronDown, Layers, Volume2, Droplets, TrendingUp, Footprints } from 'lucide-react';
import { useTranslation } from '../i18n';

export interface ActiveLayersState {
  cadastre: boolean;
  noise: boolean;
  flood: boolean;
  income: boolean;
  isochrones: boolean;
}

interface CartographicLegendsHudProps {
  activeLayers: ActiveLayersState;
  defaultCollapsed?: boolean;
  isDragging?: boolean;
}

export function CartographicLegendsHud({
  activeLayers,
  defaultCollapsed = false,
  isDragging = false,
}: CartographicLegendsHudProps) {
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  // If no thematic layers are active, hide HUD cleanly
  const hasThematicLayers =
    activeLayers.income || activeLayers.noise || activeLayers.flood || activeLayers.isochrones;

  if (!hasThematicLayers) return null;

  // Auto-minimize into floating badge during map drag gestures
  if (isDragging) {
    return (
      <div
        data-testid="hud-drag-badge"
        className="absolute bottom-10 left-3 z-20 px-3 py-1.5 bg-surface-container/80 backdrop-blur-md border border-primary/40 rounded-full shadow-lg flex items-center gap-2 font-mono text-[11px] text-primary transition-all pointer-events-none opacity-80 animate-pulse no-print"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
        <span>{t('hud.activeCartography')}</span>
      </div>
    );
  }

  return (
    <div className="absolute bottom-10 left-3 z-20 max-w-xs w-64 bg-surface-container/95 backdrop-blur-md border border-outline-variant/80 rounded-xl shadow-2xl text-on-surface overflow-hidden font-sans transition-all no-print">
      {/* ================= HUD HEADER ================= */}
      <div className="px-3 py-2 bg-surface-container-low/90 border-b border-outline-variant/60 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-bold font-headline text-on-surface tracking-tight">
            {t('hud.legendTitle')}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
          aria-label={isCollapsed ? t('hud.expandLegends') : t('hud.collapseLegends')}
          title={isCollapsed ? t('hud.expandLegends') : t('hud.collapseLegends')}
        >
          {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* ================= HUD BODY (ACCORDION / ACTIVE LEGENDS) ================= */}
      {!isCollapsed && (
        <div className="p-3 space-y-3.5 max-h-72 overflow-y-auto text-xs">
          {/* 1. INE ADRH RENTA MEDIA */}
          {activeLayers.income && (
            <div className="space-y-1.5 animate-fade-in">
              <div className="flex items-center justify-between text-[11px] font-semibold text-on-surface">
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="w-3 h-3 text-secondary" />
                  {t('hud.netHouseholdIncome')}
                </span>
                <span className="text-[10px] font-mono text-outline">{t('hud.eurYear')}</span>
              </div>

              {/* Color gradient ramp matching MapLibre 8-stop interpolation */}
              <div
                className="h-2 w-full rounded-sm"
                style={{
                  background: 'linear-gradient(to right, #312e81, #1e40af, #0284c7, #0d9488, #10b981, #eab308, #f97316, #ef4444)',
                }}
              />

              <div className="flex justify-between text-[9px] font-mono text-outline pt-0.5">
                <span>&lt;25k</span>
                <span>35k</span>
                <span>50k</span>
                <span>&gt;60k €</span>
              </div>
            </div>
          )}

          {/* 2. MITECO SICA RUIDO AMBIENTAL */}
          {activeLayers.noise && (
            <div className="space-y-1.5 animate-fade-in border-t border-outline-variant/40 pt-2.5">
              <div className="flex items-center justify-between text-[11px] font-semibold text-on-surface">
                <span className="flex items-center gap-1.5">
                  <Volume2 className="w-3 h-3 text-amber-400" />
                  {t('hud.noiseSica')}
                </span>
                <span className="text-[10px] font-mono text-outline">MITECO</span>
              </div>

              <div className="grid grid-cols-4 gap-1 text-[9px] font-mono text-center">
                <div className="p-1 rounded bg-transparent border border-outline-variant/50 text-outline">
                  &lt;55
                </div>
                <div className="p-1 rounded bg-[#fef08a]/20 border border-[#fef08a]/50 text-[#fef08a]">
                  55-65
                </div>
                <div className="p-1 rounded bg-[#f97316]/20 border border-[#f97316]/50 text-[#f97316]">
                  65-75
                </div>
                <div className="p-1 rounded bg-[#ef4444]/20 border border-[#ef4444]/50 text-[#ef4444]">
                  &gt;75
                </div>
              </div>
              <div className="flex justify-between text-[9px] text-outline pt-0.5">
                <span>{t('hud.noiseComfort')}</span>
                <span>{t('hud.noiseModerate')}</span>
                <span>{t('hud.noiseElevated')}</span>
                <span>{t('hud.noiseCritical')}</span>
              </div>
            </div>
          )}

          {/* 3. MITECO SNCZI INUNDABILIDAD */}
          {activeLayers.flood && (
            <div className="space-y-1.5 animate-fade-in border-t border-outline-variant/40 pt-2.5">
              <div className="flex items-center justify-between text-[11px] font-semibold text-on-surface">
                <span className="flex items-center gap-1.5">
                  <Droplets className="w-3 h-3 text-cyan-400" />
                  {t('hud.floodRiskTitle')}
                </span>
                <span className="text-[10px] font-mono text-outline">{t('hud.periodT')}</span>
              </div>

              <div className="space-y-1 text-[10px]">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-[#172554] border border-[#1e1b4b]" />
                    {t('hud.floodZfp')}
                  </span>
                  <span className="font-mono text-outline">{t('hud.floodVeryHigh')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-[#1e3a8a] border border-[#2563eb]" />
                    {t('hud.floodT10')}
                  </span>
                  <span className="font-mono text-outline">{t('hud.floodFrequent')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-[#1d4ed8] border border-[#3b82f6]" />
                    {t('hud.floodT50')}
                  </span>
                  <span className="font-mono text-outline">{t('hud.floodIntermediate')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-[#0284c7] border border-[#38bdf8]" />
                    {t('hud.floodT100')}
                  </span>
                  <span className="font-mono text-outline">{t('hud.floodOrdinary')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-[#38bdf8] border border-[#7dd3fc]" />
                    {t('hud.floodT500')}
                  </span>
                  <span className="font-mono text-outline">{t('hud.floodExceptional')}</span>
                </div>
              </div>
            </div>
          )}

          {/* 4. ISOCRONAS PEATONALES 15-MIN */}
          {activeLayers.isochrones && (
            <div className="space-y-1.5 animate-fade-in border-t border-outline-variant/40 pt-2.5">
              <div className="flex items-center justify-between text-[11px] font-semibold text-on-surface">
                <span className="flex items-center gap-1.5">
                  <Footprints className="w-3 h-3 text-primary" />
                  {t('hud.isochronesTitle')}
                </span>
                <span className="text-[10px] font-mono text-outline">4.8 km/h</span>
              </div>

              <div className="space-y-1 text-[10px]">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]/30 border border-[#10b981]" />
                    {t('hud.isochrone5Min')}
                  </span>
                  <span className="font-mono text-outline">{t('hud.isochroneImmediate')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#06b6d4]/25 border border-[#06b6d4]" />
                    {t('hud.isochrone10Min')}
                  </span>
                  <span className="font-mono text-outline">{t('hud.isochroneClose')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#6366f1]/20 border border-[#6366f1]" />
                    {t('hud.isochrone15Min')}
                  </span>
                  <span className="font-mono text-outline">{t('hud.isochroneCivicLimit')}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
