import { EnergyPerformanceCertificate } from '@openbarrio/core';
import { Zap, Leaf, AlertCircle, ShieldCheck, HelpCircle } from 'lucide-react';

interface EnergyPerformanceCardProps {
  energy?: EnergyPerformanceCertificate;
}

const RATING_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  A: { bg: 'bg-[#009640]', text: 'text-white', border: 'border-[#009640]' },
  B: { bg: 'bg-[#4BB748]', text: 'text-white', border: 'border-[#4BB748]' },
  C: { bg: 'bg-[#B5D333]', text: 'text-slate-900', border: 'border-[#B5D333]' },
  D: { bg: 'bg-[#FFF200]', text: 'text-slate-900', border: 'border-[#FFF200]' },
  E: { bg: 'bg-[#FDB913]', text: 'text-slate-900', border: 'border-[#FDB913]' },
  F: { bg: 'bg-[#EB690B]', text: 'text-white', border: 'border-[#EB690B]' },
  G: { bg: 'bg-[#E30613]', text: 'text-white', border: 'border-[#E30613]' },
};

const RATING_STEPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'] as const;

export function EnergyPerformanceCard({ energy }: EnergyPerformanceCardProps) {
  if (!energy) return null;

  const currentRating = energy.ratingEmissions || 'E';
  const isEstimated = energy.isEstimated;

  return (
    <div
      data-testid="energy-performance-card"
      className="p-space-lg bg-surface-container-low border-y border-outline-variant"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-on-surface">
            Certificado de Eficiencia Energética (CEE)
          </h3>
        </div>

        {isEstimated ? (
          <span
            data-testid="cee-estimated-badge"
            className="px-2 py-0.5 rounded text-[11px] font-mono bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1 font-medium"
            title="Inmueble sin CEE registrado en bases autonómicas abiertas: estimación por año de construcción"
          >
            <AlertCircle className="w-3 h-3" />
            <span>Estimación CTE / NBE</span>
          </span>
        ) : (
          <span
            data-testid="cee-official-badge"
            className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-medium"
          >
            <ShieldCheck className="w-3 h-3" />
            <span>Registro Oficial Autonómico</span>
          </span>
        )}
      </div>

      {/* Energy Ladder (A through G) */}
      <div className="mb-4">
        <div className="flex items-center gap-1 h-7 w-full max-w-md">
          {RATING_STEPS.map((step) => {
            const isSelected = step === currentRating;
            const style = RATING_COLORS[step];

            return (
              <div
                key={step}
                className={`flex-1 h-full rounded flex items-center justify-center font-mono font-bold text-xs transition-all relative ${
                  isSelected
                    ? `${style.bg} ${style.text} ring-2 ring-white/60 scale-105 z-10 shadow-md`
                    : 'bg-surface-container-high/60 text-outline opacity-40 hover:opacity-75'
                }`}
                title={`Calificación energética clase ${step}`}
              >
                {step}
                {isSelected && (
                  <div className="absolute -bottom-1 w-1.5 h-1.5 bg-white rotate-45" />
                )}
              </div>
            );
          })}
        </div>
        <p className="text-[11px] text-outline font-mono mt-1.5 flex items-center gap-1">
          {isEstimated ? (
            <>
              <HelpCircle className="w-3 h-3 text-amber-400 shrink-0" />
              <span>Base de inferencia: {energy.estimationBasis || 'Código Técnico de la Edificación'}</span>
            </>
          ) : (
            <>
              <Leaf className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>
                Registro Nº {energy.registrationNumber || 'Oficial'} · Válido hasta{' '}
                {energy.validUntil ? new Date(energy.validUntil).toLocaleDateString('es-ES') : '2033'}
              </span>
            </>
          )}
        </p>
      </div>

      {/* Key Energy Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
        <div className="p-2.5 rounded bg-surface-container-high border border-outline-variant/50">
          <span className="text-[10px] text-outline uppercase block">Emisiones CO₂</span>
          <span className="text-sm font-semibold text-on-surface">
            {energy.co2Emissions !== undefined ? `${energy.co2Emissions} ` : '— '}
            <span className="text-[10px] font-normal text-outline">kg/m²·año</span>
          </span>
        </div>

        <div className="p-2.5 rounded bg-surface-container-high border border-outline-variant/50">
          <span className="text-[10px] text-outline uppercase block">Consumo Energía</span>
          <span className="text-sm font-semibold text-on-surface">
            {energy.primaryEnergyConsumption !== undefined ? `${energy.primaryEnergyConsumption} ` : '— '}
            <span className="text-[10px] font-normal text-outline">kWh/m²·año</span>
          </span>
        </div>

        <div className="p-2.5 rounded bg-surface-container-high border border-outline-variant/50">
          <span className="text-[10px] text-outline uppercase block">Gasto Estimado</span>
          <span className="text-sm font-semibold text-primary">
            {energy.annualEstimatedCostEur !== undefined ? `~${energy.annualEstimatedCostEur.toLocaleString('es-ES')} ` : '— '}
            <span className="text-[10px] font-normal text-outline">€/año</span>
          </span>
        </div>

        <div className="p-2.5 rounded bg-surface-container-high border border-outline-variant/50">
          <span className="text-[10px] text-outline uppercase block">Alcance CEE</span>
          <span className="text-sm font-semibold text-on-surface capitalize">
            {energy.scope === 'unit' ? 'Vivienda individual' : 'Edificio completo'}
          </span>
        </div>
      </div>
    </div>
  );
}
