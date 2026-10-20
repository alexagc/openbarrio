import { AuditScoreBreakdown, AuditSubscores } from '@openbarrio/core';
import { ShieldCheck, AlertTriangle, ShieldAlert, Compass } from 'lucide-react';
import { RadarChart } from './RadarChart';

interface ScoreGaugeProps {
  score: AuditScoreBreakdown;
  cityOrProvince?: string;
  percentile?: number;
}

export function ScoreGauge({ score, cityOrProvince = 'España', percentile = 89 }: ScoreGaugeProps) {
  const { overallScore } = score;

  let badgeText = 'Notable Alto - Entorno Consolidado';
  let badgeClass = 'bg-primary/10 text-primary border-primary/30';
  let gaugeColor = 'text-primary';
  let Icon = ShieldCheck;

  if (overallScore >= 85) {
    badgeText = 'Sobresaliente - Alta Solvencia & Confort';
    badgeClass = 'bg-primary/15 text-primary border-primary/40';
    gaugeColor = 'text-primary';
    Icon = ShieldCheck;
  } else if (overallScore < 50) {
    badgeText = 'Alerta / Precaución Técnica';
    badgeClass = 'bg-error/15 text-error border-error/40';
    gaugeColor = 'text-error';
    Icon = ShieldAlert;
  } else if (overallScore < 75) {
    badgeText = 'Moderado - Revisar Aislamiento o ITE';
    badgeClass = 'bg-secondary/15 text-secondary border-secondary/40';
    gaugeColor = 'text-secondary';
    Icon = AlertTriangle;
  }

  // Calculate circumference: 2 * Math.PI * 15.9155 ~= 100
  const strokeDashoffset = 100 - overallScore;

  // Resolve subscores with resilient fallback for backward compatibility
  const subscores: AuditSubscores = score.subscores ?? {
    building: score.buildingHealthScore ?? 75,
    connectivity: 75,
    environmental: Math.round(((score.acousticComfortScore ?? 75) + (score.climateSafetyScore ?? 100)) / 2),
    socioeconomic: score.socioeconomicScore ?? 80,
    urbanPlanning: 75,
  };

  return (
    <div className="p-space-lg bg-surface">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <h2 className="font-title-md text-title-md text-on-surface flex items-center gap-2 font-bold">
          <Icon className="w-4 h-4 text-primary" />
          <span>Índice Integral OpenBarrio</span>
        </h2>
        <span className={`px-2 py-0.5 rounded text-label-sm font-label-sm border font-semibold ${badgeClass}`}>
          {badgeText}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center bg-surface-container-low p-space-md rounded-xl border border-outline-variant shadow-sm">
        {/* Left Column: Circular Gauge (0-100) */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center lg:border-r border-outline-variant/60 lg:pr-3 pb-3 lg:pb-0">
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-surface-variant"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
              />
              <path
                className={`${gaugeColor} transition-all duration-1000 ease-out`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeDasharray="100, 100"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                strokeWidth="3.5"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="font-headline-lg text-2xl font-bold text-on-surface font-mono leading-none">
                {overallScore}
              </span>
              <span className="text-[9px] font-mono text-outline uppercase">/100</span>
            </div>
          </div>
          <span className="text-[10px] font-mono text-center text-outline mt-1.5 font-medium">
            Percentil {percentile}º {cityOrProvince}
          </span>
          <span className="text-[9px] font-mono text-center text-primary/80 mt-0.5">
            5 Dimensiones Cívicas
          </span>
        </div>

        {/* Middle Column: Pillar Progress Bars */}
        <div className="lg:col-span-4 space-y-2 lg:border-r border-outline-variant/60 lg:pr-3">
          {/* Sub-score 1: INE */}
          <div>
            <div className="flex justify-between text-body-sm mb-0.5 font-mono text-[11px]">
              <span className="text-on-surface-variant font-sans">Nivel Socioeconómico (INE)</span>
              <span className="text-on-surface font-semibold">{score.socioeconomicScore}/100</span>
            </div>
            <div className="w-full h-1.5 bg-surface-variant rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-700"
                style={{ width: `${score.socioeconomicScore}%` }}
              />
            </div>
          </div>

          {/* Sub-score 2: Catastro */}
          <div>
            <div className="flex justify-between text-body-sm mb-0.5 font-mono text-[11px]">
              <span className="text-on-surface-variant font-sans">Salud Edificatoria & Tejido</span>
              <span className="text-on-surface font-semibold">{score.buildingHealthScore}/100</span>
            </div>
            <div className="w-full h-1.5 bg-surface-variant rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-700"
                style={{ width: `${score.buildingHealthScore}%` }}
              />
            </div>
          </div>

          {/* Sub-score 3: MITECO SICA */}
          <div>
            <div className="flex justify-between text-body-sm mb-0.5 font-mono text-[11px]">
              <span className="text-on-surface-variant font-sans">Confort Acústico (MITECO)</span>
              <span className="text-secondary font-semibold">{score.acousticComfortScore}/100</span>
            </div>
            <div className="w-full h-1.5 bg-surface-variant rounded-full overflow-hidden">
              <div
                className="h-full bg-secondary-container rounded-full transition-all duration-700"
                style={{ width: `${score.acousticComfortScore}%` }}
              />
            </div>
          </div>

          {/* Sub-score 4: MITECO SNCZI */}
          <div>
            <div className="flex justify-between text-body-sm mb-0.5 font-mono text-[11px]">
              <span className="text-on-surface-variant font-sans">Seguridad Hídrica & Clima</span>
              <span className="text-primary font-semibold">{score.climateSafetyScore}/100</span>
            </div>
            <div className="w-full h-1.5 bg-surface-variant rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-fixed rounded-full transition-all duration-700"
                style={{ width: `${score.climateSafetyScore}%` }}
              />
            </div>
          </div>

          {/* Sub-score 5: Civic Connectivity 15-min */}
          <div>
            <div className="flex justify-between text-body-sm mb-0.5 font-mono text-[11px]">
              <span className="text-on-surface-variant font-sans flex items-center gap-1">
                <Compass className="w-3 h-3 text-tertiary" />
                Conectividad (15-min)
              </span>
              <span className="text-tertiary font-semibold">{subscores.connectivity}/100</span>
            </div>
            <div className="w-full h-1.5 bg-surface-variant rounded-full overflow-hidden">
              <div
                className="h-full bg-tertiary rounded-full transition-all duration-700"
                style={{ width: `${subscores.connectivity}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right Column: 5-Axis SVG Radar Chart */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="text-[10px] font-mono text-outline uppercase tracking-wider mb-1 flex items-center gap-1">
            <span>Pentágono de Balance Territorial</span>
          </div>
          <RadarChart
            subscores={subscores}
            overallScore={overallScore}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
