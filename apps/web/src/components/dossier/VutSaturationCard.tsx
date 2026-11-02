import React from 'react';
import { VutEvaluationDTO } from '@openbarrio/core';
import { Hotel, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface VutSaturationCardProps {
  vut?: VutEvaluationDTO;
}

export function VutSaturationCard({ vut }: VutSaturationCardProps) {
  if (!vut) return null;

  const isCritical = vut.saturationRisk === 'critical';
  const isModerate = vut.saturationRisk === 'moderate';

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
      <div className="flex items-center justify-between border-b border-outline-variant pb-2">
        <div className="flex items-center gap-2">
          <Hotel className="w-4 h-4 text-primary shrink-0" />
          <span className="font-headline text-sm font-bold text-on-surface">
            Pisos Turísticos & Convivencia (VUT)
          </span>
        </div>
        <span className="font-mono text-[11px] text-on-surface-variant font-medium">
          INE Experimental · Secc. {vut.censusSectionId}
        </span>
      </div>

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
