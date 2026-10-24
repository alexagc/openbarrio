import { useState } from 'react';
import { ChevronUp, ChevronDown, Layers, Volume2, Droplets, TrendingUp, Footprints } from 'lucide-react';

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
}

export function CartographicLegendsHud({
  activeLayers,
  defaultCollapsed = false,
}: CartographicLegendsHudProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  // If no thematic layers are active, hide HUD cleanly
  const hasThematicLayers =
    activeLayers.income || activeLayers.noise || activeLayers.flood || activeLayers.isochrones;

  if (!hasThematicLayers) return null;

  return (
    <div className="absolute bottom-10 left-3 z-20 max-w-xs w-64 bg-surface-container-lowest/95 backdrop-blur-md border border-outline-variant/80 rounded-xl shadow-2xl text-on-surface overflow-hidden font-sans transition-all no-print">
      {/* ================= HUD HEADER ================= */}
      <div className="px-3 py-2 bg-surface-container-low/90 border-b border-outline-variant/60 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-bold font-headline text-on-surface tracking-tight">
            Leyenda Cartográfica
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
          aria-label={isCollapsed ? 'Expandir leyendas' : 'Colapsar leyendas'}
          title={isCollapsed ? 'Expandir leyendas' : 'Colapsar leyendas'}
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
                  Renta Neta Hogar (INE ADRH)
                </span>
                <span className="text-[10px] font-mono text-outline">€/año</span>
              </div>

              {/* Color gradient ramp */}
              <div
                className="h-2 w-full rounded-sm"
                style={{
                  background: 'linear-gradient(to right, #ef4444, #f59e0b, #eab308, #14b8a6, #10b981)',
                }}
              />

              <div className="flex justify-between text-[9px] font-mono text-outline pt-0.5">
                <span>&lt;25k</span>
                <span>25k-40k</span>
                <span>40k-60k</span>
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
                  Ruido SICA (Lden dBA)
                </span>
                <span className="text-[10px] font-mono text-outline">MITECO</span>
              </div>

              <div className="grid grid-cols-4 gap-1 text-[9px] font-mono text-center">
                <div className="p-1 rounded bg-[#10b981]/20 border border-[#10b981]/50 text-[#10b981]">
                  &lt;55
                </div>
                <div className="p-1 rounded bg-[#eab308]/20 border border-[#eab308]/50 text-[#eab308]">
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
                <span>Confort</span>
                <span>Moderado</span>
                <span>Elevado</span>
                <span>Crítico</span>
              </div>
            </div>
          )}

          {/* 3. MITECO SNCZI INUNDABILIDAD */}
          {activeLayers.flood && (
            <div className="space-y-1.5 animate-fade-in border-t border-outline-variant/40 pt-2.5">
              <div className="flex items-center justify-between text-[11px] font-semibold text-on-surface">
                <span className="flex items-center gap-1.5">
                  <Droplets className="w-3 h-3 text-cyan-400" />
                  Riesgo Inundación (SNCZI)
                </span>
                <span className="text-[10px] font-mono text-outline">Período T</span>
              </div>

              <div className="space-y-1 text-[10px]">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-[#991b1b] border border-[#f87171]" />
                    Zona Flujo Preferente (ZFP)
                  </span>
                  <span className="font-mono text-outline">Muy Alto</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-[#f97316] border border-[#fdba74]" />
                    Alta Probabilidad (T=10 años)
                  </span>
                  <span className="font-mono text-outline">Frecuente</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-[#0284c7] border border-[#38bdf8]" />
                    Media Probabilidad (T=100 años)
                  </span>
                  <span className="font-mono text-outline">Ordinario</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-[#06b6d4] border border-[#a5f3fc]" />
                    Baja Probabilidad (T=500 años)
                  </span>
                  <span className="font-mono text-outline">Excepcional</span>
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
                  Isocronas Peatonales
                </span>
                <span className="text-[10px] font-mono text-outline">4.8 km/h</span>
              </div>

              <div className="space-y-1 text-[10px]">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]/30 border border-[#10b981]" />
                    5 min a pie (400 m)
                  </span>
                  <span className="font-mono text-outline">Inmediato</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#06b6d4]/25 border border-[#06b6d4]" />
                    10 min a pie (800 m)
                  </span>
                  <span className="font-mono text-outline">Cercano</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#6366f1]/20 border border-[#6366f1]" />
                    15 min a pie (1.200 m)
                  </span>
                  <span className="font-mono text-outline">Límite cívico</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
