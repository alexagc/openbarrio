import { AuditScoreBreakdown } from '@openbarrio/core';
import { ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';

interface ScoreGaugeProps {
  score: AuditScoreBreakdown;
}

export function ScoreGauge({ score }: ScoreGaugeProps) {
  const { overallScore } = score;

  let colorTheme = {
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    barBg: 'bg-emerald-500',
    textColor: 'text-emerald-600',
    label: 'Excelente / Favorable',
    description: 'Bajo riesgo integral, alta solvencia socioeconómica y entorno favorable.',
    icon: ShieldCheck,
  };

  if (overallScore < 50) {
    colorTheme = {
      badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
      barBg: 'bg-rose-500',
      textColor: 'text-rose-600',
      label: 'Alerta / Riesgo Elevado',
      description: 'Factores de riesgo identificados: acústica crítica, inundabilidad o antigüedad.',
      icon: ShieldAlert,
    };
  } else if (overallScore < 75) {
    colorTheme = {
      badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
      barBg: 'bg-amber-500',
      textColor: 'text-amber-600',
      label: 'Moderado / Precaución',
      description: 'Nivel medio. Se recomienda revisar parámetros de aislamiento o ITE.',
      icon: AlertTriangle,
    };
  }

  const Icon = colorTheme.icon;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left: Overall Score Dial */}
        <div className="flex items-center space-x-4">
          <div className="relative flex items-center justify-center">
            {/* Circular Gauge */}
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                className="text-slate-100"
                fill="transparent"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (251.2 * overallScore) / 100}
                strokeLinecap="round"
                className={`${colorTheme.textColor} transition-all duration-1000 ease-out`}
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-slate-900 tracking-tight">{overallScore}</span>
              <span className="text-[10px] uppercase font-bold text-slate-400">/ 100</span>
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Barrio Score™</h2>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colorTheme.badgeBg}`}>
                <Icon className="w-3.5 h-3.5 mr-1" />
                {colorTheme.label}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-sm">
              {colorTheme.description}
            </p>
          </div>
        </div>

        {/* Right: Quick Sub-score Mini-Bars */}
        <div className="w-full sm:w-56 space-y-2 text-xs border-t sm:border-t-0 sm:border-l sm:pl-5 border-slate-100 pt-3 sm:pt-0">
          <div>
            <div className="flex justify-between text-slate-600 font-medium mb-1">
              <span>Socioeconómico</span>
              <span className="font-bold text-slate-800">{score.socioeconomicScore}%</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-1.5 rounded-full"
                style={{ width: `${score.socioeconomicScore}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-600 font-medium mb-1">
              <span>Salud Edificio</span>
              <span className="font-bold text-slate-800">{score.buildingHealthScore}%</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-1.5 rounded-full"
                style={{ width: `${score.buildingHealthScore}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-600 font-medium mb-1">
              <span>Confort Acústico</span>
              <span className="font-bold text-slate-800">{score.acousticComfortScore}%</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-teal-600 h-1.5 rounded-full"
                style={{ width: `${score.acousticComfortScore}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-600 font-medium mb-1">
              <span>Seguridad Climática</span>
              <span className="font-bold text-slate-800">{score.climateSafetyScore}%</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-sky-600 h-1.5 rounded-full"
                style={{ width: `${score.climateSafetyScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
