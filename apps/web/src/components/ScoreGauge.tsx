import {
  AuditScoreBreakdown,
  AuditSubscores,
  CRITICAL_LAYER_KEYS,
  LayerKey,
  LayerStatusInfo,
  PropertyTypology,
  calculateProfileScore,
  isLayerUsable,
  type ActiveProfileId,
} from '@openbarrio/core';
import { ShieldCheck, AlertTriangle, ShieldAlert, Compass, HelpCircle } from 'lucide-react';
import { RadarChart } from './RadarChart';
import { useTranslation } from '../i18n';

interface ScoreGaugeProps {
  score: AuditScoreBreakdown;
  cityOrProvince?: string;
  percentile?: number;
  typology?: PropertyTypology;
  layers?: Partial<Record<LayerKey, LayerStatusInfo>>;
  activeProfile?: ActiveProfileId;
}

export function ScoreGauge({
  score,
  cityOrProvince = 'España',
  percentile,
  typology,
  layers,
  activeProfile = 'none',
}: ScoreGaugeProps) {
  const { t } = useTranslation();
  const { overallScore, trafficLight, coverage, pillarAvailability } = score;
  const isRustic = typology === 'RUSTIC';
  const isVacantPlot = typology === 'VACANT_PLOT';
  const isIndustrial = typology === 'INDUSTRIAL';
  const isUnbuilt = isRustic || isVacantPlot;

  const missingCritical = CRITICAL_LAYER_KEYS
    .map((key) => layers?.[key])
    .filter((info): info is LayerStatusInfo => Boolean(info && !isLayerUsable(info.status)));

  const isUncertain = trafficLight === 'UNCERTAIN';
  const profileResult =
    activeProfile !== 'none'
      ? calculateProfileScore(score, typology ?? 'RESIDENTIAL', activeProfile)
      : null;

  let badgeText = isRustic
    ? 'Notable · Finca Rústica en Entorno Estable'
    : isVacantPlot
      ? 'Notable · Solar Urbano Consolidado'
      : isIndustrial
        ? 'Notable · Polígono Consolidado & Buena Conectividad'
        : 'Notable Alto - Entorno Consolidado';
  let badgeClass = 'bg-primary/10 text-primary border-primary/30';
  let gaugeColor = 'text-primary';
  let Icon = ShieldCheck;

  if (isUncertain) {
    badgeText = t('uncertainty.uncertainBadge');
    badgeClass = 'bg-surface-container-high text-on-surface-variant border-outline';
    gaugeColor = 'text-outline';
    Icon = HelpCircle;
  } else if (trafficLight === 'GREEN' || (!trafficLight && overallScore >= 85)) {
    badgeText = isRustic
      ? 'Sobresaliente · Alto Valor Natural & Aptitud Rústica'
      : isVacantPlot
        ? 'Sobresaliente · Solar de Alta Calidad & Viabilidad'
        : isIndustrial
          ? 'Sobresaliente · Nave de Alta Operatividad & Confort Logístico'
          : 'Sobresaliente - Alta Solvencia & Confort';
    badgeClass = 'bg-primary/15 text-primary border-primary/40';
    gaugeColor = 'text-primary';
    Icon = ShieldCheck;
  } else if (trafficLight === 'RED' || (!trafficLight && overallScore < 50)) {
    badgeText = isRustic
      ? 'Alerta · Servidumbres / Afecciones Rústicas Severas'
      : isVacantPlot
        ? 'Alerta · Restricciones Urbanísticas o Inundabilidad'
        : isIndustrial
          ? 'Alerta · Restricciones de Uso Industrial o Afecciones Técnicas'
          : 'Alerta / Precaución Técnica';
    badgeClass = 'bg-error/15 text-error border-error/40';
    gaugeColor = 'text-error';
    Icon = ShieldAlert;
  } else if (trafficLight === 'AMBER' || overallScore < 75) {
    badgeText = isRustic
      ? 'Moderado · Suelo No Urbanizable / Entorno Rural'
      : isVacantPlot
        ? 'Moderado · Parcela Vacante / Planeamiento Pendiente'
        : isIndustrial
          ? 'Moderado · Revisar Cubiertas, Cargas & Licencia de Actividad'
          : 'Moderado - Revisar Aislamiento o ITE';
    badgeClass = 'bg-secondary/15 text-secondary border-secondary/40';
    gaugeColor = 'text-secondary';
    Icon = isUnbuilt ? Compass : AlertTriangle;
  }

  // Calculate circumference: 2 * Math.PI * 15.9155 ~= 100
  const strokeDashoffset = 100 - overallScore;

  // Resolve subscores faithfully without inventing neutral placeholders when missing
  const subscores: AuditSubscores = score.subscores ?? {
    building: score.buildingHealthScore ?? 0,
    connectivity: 0,
    environmental: Math.round(((score.acousticComfortScore ?? 0) + (score.climateSafetyScore ?? 0)) / 2),
    socioeconomic: score.socioeconomicScore ?? 0,
    urbanPlanning: 0,
  };

  return (
    <div className="p-space-lg bg-surface" data-testid="score-gauge" data-traffic-light={trafficLight ?? 'LEGACY'}>
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <h2 className="font-title-md text-title-md text-on-surface flex items-center gap-2 font-bold">
          <Icon className={`w-4 h-4 ${isUncertain ? 'text-outline' : 'text-primary'}`} />
          <span>Índice Integral OpenBarrio</span>
        </h2>
        <div className="flex items-center gap-1.5 flex-wrap">
          {coverage && (
            <span
              data-testid="score-coverage-badge"
              className="px-2 py-0.5 rounded text-[10px] font-mono border border-outline-variant bg-surface-container text-on-surface-variant"
            >
              {t('uncertainty.coverageLabel', {
                ok: coverage.pillarsWithData,
                total: coverage.pillarsTotal,
              })}
            </span>
          )}
          <span
            data-testid="score-traffic-light-badge"
            className={`px-2 py-0.5 rounded text-label-sm font-label-sm border font-semibold ${badgeClass}`}
          >
            {badgeText}
          </span>
        </div>
      </div>

      {(isUncertain || missingCritical.length > 0) && (
        <div
          data-testid="score-uncertainty-notice"
          className="mb-3 p-2.5 rounded-lg border border-outline-variant bg-surface-container text-xs text-on-surface-variant space-y-1"
        >
          {isUncertain && coverage && (
            <p className="font-medium text-on-surface">
              {t('uncertainty.uncertainTitle', {
                ok: coverage.pillarsWithData,
                total: coverage.pillarsTotal,
              })}
              {' — '}
              <span className="font-normal text-on-surface-variant">
                {t('uncertainty.uncertainDesc')}
              </span>
            </p>
          )}
          {missingCritical.map((layerInfo) => (
            <p key={layerInfo.sourceName} className="text-[11px] font-mono text-outline">
              {t('uncertainty.criticalRiskNotEvaluated', { source: layerInfo.sourceName })}
            </p>
          ))}
        </div>
      )}

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
              <span
                data-testid="base-barrio-score-value"
                className="font-headline-lg text-2xl font-bold text-on-surface font-mono leading-none"
              >
                {overallScore}
              </span>
              <span className="text-[9px] font-mono text-outline uppercase">/100</span>
            </div>
          </div>
          {profileResult && (
            <div
              data-testid="profile-score-card"
              className="mt-2.5 w-full px-2.5 py-2 rounded-lg bg-primary/10 border border-primary/30 text-center space-y-0.5"
            >
              <span className="block text-[10px] font-mono text-primary font-semibold">
                {t('profiles.scoreForProfile', {
                  profile: t(`profiles.options.${activeProfile}.label`),
                })}
              </span>
              <div className="flex items-center justify-center gap-1.5 font-mono">
                <span
                  data-testid="profile-score-value"
                  className="text-base font-bold text-on-surface"
                >
                  {profileResult.overallScore}/100
                </span>
                <span className="text-[10px] text-on-surface-variant">
                  ({profileResult.deltaFromBase >= 0 ? `+${profileResult.deltaFromBase}` : profileResult.deltaFromBase})
                </span>
              </div>
            </div>
          )}
          {typeof percentile === 'number' ? (
            <span className="text-[10px] font-mono text-center text-outline mt-1.5 font-medium">
              Percentil {percentile}º {cityOrProvince}
            </span>
          ) : (
            <span className="text-[10px] font-mono text-center text-outline mt-1.5 font-medium">
              {cityOrProvince}
            </span>
          )}
          <span className="text-[9px] font-mono text-center text-primary/80 mt-0.5">
            {coverage
              ? t('uncertainty.coverageLabel', {
                  ok: coverage.pillarsWithData,
                  total: coverage.pillarsTotal,
                })
              : '5 Dimensiones Cívicas'}
          </span>
        </div>

        {/* Middle Column: Pillar Progress Bars */}
        <div className="lg:col-span-4 space-y-2 lg:border-r border-outline-variant/60 lg:pr-3">
          {/* Sub-score 1: INE */}
          <div>
            <div className="flex justify-between text-body-sm mb-0.5 font-mono text-[11px]">
              <span className="text-on-surface-variant font-sans">Nivel Socioeconómico (INE)</span>
              <span className={pillarAvailability?.socioeconomic === false ? 'text-outline' : 'text-on-surface font-semibold'}>
                {pillarAvailability?.socioeconomic === false
                  ? t('uncertainty.notAvailableShort')
                  : `${score.socioeconomicScore}/100`}
              </span>
            </div>
            <div className="w-full h-1.5 bg-surface-variant rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  pillarAvailability?.socioeconomic === false ? 'bg-outline/40' : 'bg-primary'
                }`}
                style={{
                  width: `${pillarAvailability?.socioeconomic === false ? 0 : score.socioeconomicScore}%`,
                }}
              />
            </div>
          </div>

          {/* Sub-score 2: Catastro */}
          <div>
            <div className="flex justify-between text-body-sm mb-0.5 font-mono text-[11px]">
              <span className="text-on-surface-variant font-sans">
                {isRustic
                  ? 'Aptitud del Terreno / Tejido'
                  : isVacantPlot
                    ? 'Idoneidad de Parcela'
                    : isIndustrial
                      ? 'Seguridad Estructural & RSCIEI'
                      : 'Salud Edificatoria & Tejido'}
              </span>
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
              <span
                className={
                  layers?.sica && !isLayerUsable(layers.sica.status)
                    ? 'text-outline'
                    : 'text-secondary font-semibold'
                }
              >
                {layers?.sica && !isLayerUsable(layers.sica.status)
                  ? t('uncertainty.notAvailableShort')
                  : `${score.acousticComfortScore}/100`}
              </span>
            </div>
            <div className="w-full h-1.5 bg-surface-variant rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  layers?.sica && !isLayerUsable(layers.sica.status)
                    ? 'bg-outline/40'
                    : 'bg-secondary-container'
                }`}
                style={{
                  width: `${layers?.sica && !isLayerUsable(layers.sica.status) ? 0 : score.acousticComfortScore}%`,
                }}
              />
            </div>
          </div>

          {/* Sub-score 4: MITECO SNCZI */}
          <div>
            <div className="flex justify-between text-body-sm mb-0.5 font-mono text-[11px]">
              <span className="text-on-surface-variant font-sans">Seguridad Hídrica & Clima</span>
              <span
                className={
                  layers?.snczi && !isLayerUsable(layers.snczi.status)
                    ? 'text-outline'
                    : 'text-primary font-semibold'
                }
              >
                {layers?.snczi && !isLayerUsable(layers.snczi.status)
                  ? t('uncertainty.notAvailableShort')
                  : `${score.climateSafetyScore}/100`}
              </span>
            </div>
            <div className="w-full h-1.5 bg-surface-variant rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  layers?.snczi && !isLayerUsable(layers.snczi.status)
                    ? 'bg-outline/40'
                    : 'bg-primary-fixed'
                }`}
                style={{
                  width: `${layers?.snczi && !isLayerUsable(layers.snczi.status) ? 0 : score.climateSafetyScore}%`,
                }}
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
              <span className={pillarAvailability?.connectivity === false ? 'text-outline' : 'text-tertiary font-semibold'}>
                {pillarAvailability?.connectivity === false
                  ? t('uncertainty.notAvailableShort')
                  : `${subscores.connectivity}/100`}
              </span>
            </div>
            <div className="w-full h-1.5 bg-surface-variant rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  pillarAvailability?.connectivity === false ? 'bg-outline/40' : 'bg-tertiary'
                }`}
                style={{
                  width: `${pillarAvailability?.connectivity === false ? 0 : subscores.connectivity}%`,
                }}
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
