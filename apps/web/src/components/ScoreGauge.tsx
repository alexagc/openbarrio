import { AuditScoreBreakdown } from '@openbarrio/core';
import { ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';

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

  return (
    <div className="p-space-lg bg-surface">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-title-md text-title-md text-on-surface flex items-center gap-2 font-bold">
          <Icon className="w-4 h-4 text-primary" />
          <span>Índice Integral OpenBarrio</span>
        </h2>
        <span className={`px-2 py-0.5 rounded text-label-sm font-label-sm border font-semibold ${badgeClass}`}>
          {badgeText}
        </span>
      </div>

      <div className="grid grid-cols-12 gap-4 items-center bg-surface-container-low p-space-md rounded border border-outline-variant">
        {/* Circular Gauge */}
        <div className="col-span-12 sm:col-span-4 flex flex-col items-center justify-center sm:border-r border-outline-variant/60 sm:pr-2 pb-2 sm:pb-0">
          <div className="relative w-24 h-24 flex items-center justify-center">
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
          <span className="text-[10px] font-mono text-center text-outline mt-1">
            Percentil {percentile}º {cityOrProvince}
          </span>
        </div>

        {/* 4 Sub-score Progress Bars */}
        <div className="col-span-12 sm:col-span-8 space-y-2">
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
        </div>
      </div>
    </div>
  );
}
