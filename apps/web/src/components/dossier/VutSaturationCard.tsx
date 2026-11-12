import { VutEvaluationDTO } from '@openbarrio/core';
import { Hotel, AlertTriangle, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

interface VutSaturationCardProps {
  vut?: VutEvaluationDTO;
}

export function VutSaturationCard({ vut }: VutSaturationCardProps) {
  if (!vut) return null;

  const isCritical = vut.saturationRisk === 'critical';
  const isModerate = vut.saturationRisk === 'moderate';
  const isEstimated = Boolean(vut.isEstimated);

  const riskBadgeClass = isCritical
    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
    : isModerate
    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';

  const riskLabel = isCritical
    ? 'Saturación Crítica'
    : isModerate
    ? 'Presión Moderada'
    : 'Baja Saturación';

  return (
    <div
      data-testid="vut-saturation-card"
      className="p-4 rounded-lg bg-surface-container-low border border-outline-variant space-y-3"
    >
      <div className="flex items-center justify-between border-b border-outline-variant pb-2 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Hotel className="w-4 h-4 text-primary shrink-0" />
          <span className="font-headline text-sm font-bold text-on-surface">
            Pisos Turísticos & Convivencia (VUT)
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isEstimated ? (
            <span
              data-testid="vut-estimated-badge"
              className="px-2 py-0.5 rounded text-[11px] font-mono bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1 font-medium"
              title="Sección censal sin registro en el censo experimental del INE: estimación estadística territorial"
            >
              <AlertCircle className="w-3 h-3" />
              <span>Estimación Territorial</span>
            </span>
          ) : (
            <span
              data-testid="vut-official-badge"
              className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-medium"
              title="Medición experimental oficial del INE"
            >
              <ShieldCheck className="w-3 h-3" />
              <span>INE Oficial</span>
            </span>
          )}
          <span className="font-mono text-[11px] text-on-surface-variant font-medium">
            Secc. {vut.censusSectionId}
          </span>
        </div>
      </div>

      {isEstimated && (
        <div
          data-testid="vut-estimated-banner"
          className="p-2.5 rounded bg-amber-500/10 border border-amber-500/25 text-xs font-mono text-amber-300 flex items-start gap-2"
        >
          <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block text-amber-200">
              Estimación Estadística Territorial
            </span>
            <span className="text-[11px] text-amber-300/80 block mt-0.5">
              Sección censal sin datos registrados en la última oleada oficial del INE. Cifras y porcentaje inferidos mediante calibración demográfica y densidad residencial.
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <span className="text-on-surface-variant block">Ratio VUT / Residencial</span>
          <span
            className={`font-mono text-base font-bold ${
              isCritical
                ? 'text-rose-400'
                : isModerate
                ? 'text-amber-400'
                : 'text-emerald-400'
            }`}
          >
            {vut.vutRatioPct.toFixed(1)}%
          </span>
        </div>
        <div>
          <span className="text-on-surface-variant block">VUTs Registradas</span>
          <span className="font-mono font-bold text-on-surface">{vut.vutCount} viviendas</span>
        </div>
        <div>
          <span className="text-on-surface-variant block">Plazas Turísticas</span>
          <span className="font-mono font-bold text-on-surface">{vut.vutBeds} plazas</span>
        </div>
        <div>
          <span className="text-on-surface-variant block">Riesgo Convivencia</span>
          <span
            className={`font-mono font-bold px-2 py-0.5 rounded border inline-block text-[11px] ${riskBadgeClass}`}
          >
            {riskLabel}
          </span>
        </div>
      </div>

      <div
        className={`p-2.5 rounded border flex items-start gap-2 text-xs ${
          isCritical
            ? 'bg-rose-500/10 border-rose-500/30'
            : isModerate
            ? 'bg-amber-500/10 border-amber-500/30'
            : 'bg-surface-container border-outline-variant/60'
        }`}
      >
        {isCritical ? (
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
        ) : isModerate ? (
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        ) : (
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        )}
        <p className="text-on-surface-variant leading-relaxed">
          {vut.description}
        </p>
      </div>
    </div>
  );
}
