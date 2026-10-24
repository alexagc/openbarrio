import { BuildingCapExRisk, PropertyAuditReport } from '@openbarrio/core';
import {
  Wrench,
  CheckCircle,
  AlertTriangle,
  Clock,
  Shield,
  Coins,
  TrendingUp,
  Scale,
  Sparkles,
} from 'lucide-react';

export interface BuildingCapExCardProps {
  report?: PropertyAuditReport;
  capex?: BuildingCapExRisk;
  onCompareClick?: () => void;
  className?: string;
}

export function deriveBuildingCapEx(
  yearBuilt: number,
  _builtSurfaceM2: number = 90,
  overrides?: Partial<BuildingCapExRisk>
): BuildingCapExRisk {
  const currentYear = new Date().getFullYear();
  const age = yearBuilt > 0 ? Math.max(0, currentYear - yearBuilt) : 42;

  let iteStatus: BuildingCapExRisk['iteStatus'] = 'favorable_active';
  let iteDeadlineYear = currentYear + (10 - (age % 10));
  let accessibilityRisk: BuildingCapExRisk['accessibilityRisk'] = 'low';
  const hasElevator = true;
  let elevatorRisk = false;
  let reserveFundAdequacy: BuildingCapExRisk['reserveFundAdequacy'] = 'optimal';
  let reserveDeficit = 5;
  let capexMin = 10;
  let capexMax = 35;
  let feeMin = 50;
  let feeMax = 80;
  let priorities = ['Mantenimiento preventivo anual', 'Limpieza y sellado bajantes'];
  let capexRiskScore = 85;

  if (age < 20) {
    iteStatus = 'exempt';
    iteDeadlineYear = yearBuilt + 50;
    reserveDeficit = 0;
    capexMin = 5;
    capexMax = 15;
    feeMin = 45;
    feeMax = 70;
    priorities = ['Mantenimiento preventivo', 'Optimización eficiencia LED'];
    capexRiskScore = 95;
  } else if (age < 50) {
    iteStatus = 'favorable_active';
    accessibilityRisk = 'medium';
    reserveDeficit = 15;
    capexMin = 20;
    capexMax = 55;
    feeMin = 65;
    feeMax = 100;
    priorities = ['Impermeabilización cubierta', 'Sustitución luminarias zonas comunes'];
    capexRiskScore = 82;
  } else if (age < 75) {
    iteStatus = 'mandatory_in_progress';
    accessibilityRisk = 'high';
    elevatorRisk = true;
    reserveFundAdequacy = 'deficit_moderate';
    reserveDeficit = 42;
    capexMin = 60;
    capexMax = 120;
    feeMin = 95;
    feeMax = 165;
    priorities = [
      'Rehabilitación térmica envolvente (SATE)',
      'Subsanación deficiencias ITE (Petos/Cornisas)',
      'Adecuación accesibilidad cota cero',
    ];
    capexRiskScore = 58;
  } else {
    iteStatus = 'mandatory_overdue';
    accessibilityRisk = 'high';
    elevatorRisk = true;
    reserveFundAdequacy = 'deficit_severe';
    reserveDeficit = 65;
    capexMin = 95;
    capexMax = 190;
    feeMin = 130;
    feeMax = 230;
    priorities = [
      'Inspección estructural integral',
      'Sustitución bajantes de fibrocemento',
      'Modernización motor y cabina ascensor',
      'Impermeabilización total tejado',
    ];
    capexRiskScore = 44;
  }

  const base: BuildingCapExRisk = {
    buildingAgeYears: age,
    iteStatus,
    iteDeadlineYear,
    iteRequired: age >= 50,
    accessibilityRisk,
    hasElevator,
    elevatorRisk,
    estimatedCommunityExpenseRangeEurMonth: { min: feeMin, max: feeMax },
    estimatedCapExPerM2Eur: { min: capexMin, max: capexMax },
    reserveFundAdequacy,
    estimatedReserveFundDeficitPct: reserveDeficit,
    renovationPriorities: priorities,
    thermalEnvelopeLossPct: Math.min(65, Math.max(10, Math.round(age * 0.75))),
    capexRiskScore,
  };

  return { ...base, ...overrides };
}

export function BuildingCapExCard({
  report,
  capex: directCapex,
  onCompareClick,
  className = '',
}: BuildingCapExCardProps) {
  const capexData =
    directCapex ||
    report?.capex ||
    deriveBuildingCapEx(
      report?.property?.building?.constructionYear || 1980,
      report?.property?.building?.builtSurfaceM2 || 90
    );

  // Derramas Risk Level (1 to 5 scale)
  const derramasLevel =
    capexData.capexRiskScore >= 80
      ? 1
      : capexData.capexRiskScore >= 65
      ? 2
      : capexData.capexRiskScore >= 50
      ? 3
      : capexData.capexRiskScore >= 35
      ? 4
      : 5;

  const getIteBadge = () => {
    switch (capexData.iteStatus) {
      case 'favorable_active':
        return {
          icon: <CheckCircle className="w-4 h-4 text-primary" />,
          label: `Favorable (Vigente hasta ${capexData.iteDeadlineYear})`,
          badgeClass: 'bg-primary/10 border-primary/30 text-primary',
        };
      case 'mandatory_in_progress':
      case 'due_soon':
        return {
          icon: <Clock className="w-4 h-4 text-amber-400" />,
          label: 'Obligatoria en curso / Pendiente',
          badgeClass: 'bg-amber-950/40 border-amber-500/40 text-amber-300',
        };
      case 'mandatory_overdue':
        return {
          icon: <AlertTriangle className="w-4 h-4 text-rose-400" />,
          label: 'Desfavorable / Vencida',
          badgeClass: 'bg-rose-950/40 border-rose-500/40 text-rose-300',
        };
      case 'exempt':
      default:
        return {
          icon: <Shield className="w-4 h-4 text-on-surface-variant" />,
          label: `Exento por antigüedad (<50 años)`,
          badgeClass: 'bg-surface-container border-outline-variant text-on-surface-variant',
        };
    }
  };

  const iteBadge = getIteBadge();

  return (
    <div
      data-testid="building-capex-card"
      className={`bg-surface-container-low border border-outline-variant rounded-xl p-space-md sm:p-space-lg flex flex-col gap-space-md shadow-sm ${className}`}
    >
      {/* Header with Title and Compare CTA */}
      <div className="flex items-start justify-between gap-3 border-b border-outline-variant/60 pb-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-surface-container border border-outline-variant text-primary shrink-0">
            <Wrench className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-headline font-bold text-on-surface text-base sm:text-lg flex items-center gap-2">
              <span>Diagnóstico CapEx & Salud ITE</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-container border border-outline-variant text-on-surface-variant font-normal uppercase">
                Edificio {capexData.buildingAgeYears} años
              </span>
            </h3>
            <p className="font-body text-xs text-on-surface-variant mt-0.5">
              Inspección Técnica de Edificios (ITE/IEE), riesgo de derramas y adecuación de cuotas LPH
            </p>
          </div>
        </div>

        {onCompareClick && (
          <button
            type="button"
            data-testid="duel-open-btn"
            onClick={onCompareClick}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-container-high border border-primary/50 text-primary hover:bg-primary/20 text-xs font-semibold font-mono transition-colors cursor-pointer shrink-0"
            title="Comparar este inmueble en duelo 1 vs 1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Comparar 1 vs 1</span>
          </button>
        )}
      </div>

      {/* Primary 4-Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Metric 1: ITE Municipal Status */}
        <div className="p-3 rounded-lg bg-surface-container border border-outline-variant/80 flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-mono text-on-surface-variant uppercase flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-primary" />
              <span>Estado ITE / IEE</span>
            </div>
            <div className="mt-2">
              <span
                data-testid="ite-status-badge"
                className={`inline-flex items-center gap-1.5 px-2 py-1 rounded border text-xs font-semibold font-mono ${iteBadge.badgeClass}`}
              >
                {iteBadge.icon}
                <span>{iteBadge.label}</span>
              </span>
            </div>
          </div>
          <div className="mt-3 text-[11px] font-mono text-outline">
            Obligatoria desde 50 años (RDL 7/2015)
          </div>
        </div>

        {/* Metric 2: Derramas Risk Gauge (Level 1-5) */}
        <div className="p-3 rounded-lg bg-surface-container border border-outline-variant/80 flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-mono text-on-surface-variant uppercase flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-secondary" />
              <span>Riesgo Derramas (5-10a)</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5" data-testid="derramas-risk-gauge">
              {[1, 2, 3, 4, 5].map((lvl) => {
                const isActive = lvl <= derramasLevel;
                let bgClass = 'bg-surface-container-highest';
                if (isActive) {
                  bgClass =
                    derramasLevel <= 2
                      ? 'bg-primary'
                      : derramasLevel === 3
                      ? 'bg-amber-400'
                      : 'bg-rose-500';
                }
                return (
                  <div
                    key={lvl}
                    className={`h-2.5 flex-1 rounded-sm ${bgClass} transition-all`}
                    title={`Nivel ${lvl}/5`}
                  />
                );
              })}
            </div>
            <div className="mt-1.5 flex items-center justify-between text-xs font-mono">
              <span className="text-on-surface font-semibold">
                Nivel {derramasLevel} de 5
              </span>
              <span
                className={
                  derramasLevel <= 2
                    ? 'text-primary'
                    : derramasLevel === 3
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }
              >
                {derramasLevel <= 2 ? 'Riesgo Bajo' : derramasLevel === 3 ? 'Moderado' : 'Alto / Inminente'}
              </span>
            </div>
          </div>
          <div className="mt-2 text-[11px] font-mono text-outline">
            CapEx: {capexData.estimatedCapExPerM2Eur.min}-{capexData.estimatedCapExPerM2Eur.max} €/m²
          </div>
        </div>

        {/* Metric 3: Reserve Fund Adequacy (LPH 9.1.f) */}
        <div className="p-3 rounded-lg bg-surface-container border border-outline-variant/80 flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-mono text-on-surface-variant uppercase flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-tertiary" />
              <span>Fondo de Reserva LPH</span>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span
                data-testid="reserve-fund-deficit"
                className={`text-lg font-bold font-mono ${
                  capexData.estimatedReserveFundDeficitPct > 30
                    ? 'text-rose-400'
                    : capexData.estimatedReserveFundDeficitPct > 10
                    ? 'text-amber-400'
                    : 'text-primary'
                }`}
              >
                {capexData.estimatedReserveFundDeficitPct === 0
                  ? 'Adecuado'
                  : `-${capexData.estimatedReserveFundDeficitPct}%`}
              </span>
              <span className="text-[11px] font-mono text-on-surface-variant">
                {capexData.estimatedReserveFundDeficitPct === 0 ? 'Sin déficit' : 'déficit estimado'}
              </span>
            </div>
          </div>
          <div className="mt-3 text-[11px] font-mono text-outline">
            Exigencia legal: mín 10% presupuesto ordinario
          </div>
        </div>

        {/* Metric 4: Estimated Monthly Quota Impact */}
        <div className="p-3 rounded-lg bg-surface-container border border-outline-variant/80 flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-mono text-on-surface-variant uppercase flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-primary" />
              <span>Cuota Comunidad Est.</span>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span
                data-testid="monthly-fee-impact"
                className="text-lg font-bold font-mono text-on-surface"
              >
                {capexData.estimatedCommunityExpenseRangeEurMonth.min} -{' '}
                {capexData.estimatedCommunityExpenseRangeEurMonth.max} €
              </span>
              <span className="text-[11px] font-mono text-on-surface-variant">/ mes</span>
            </div>
          </div>
          <div className="mt-3 text-[11px] font-mono text-outline">
            Pérdida térmica envolvente: {capexData.thermalEnvelopeLossPct}%
          </div>
        </div>
      </div>

      {/* Renovation Priorities Section */}
      {capexData.renovationPriorities && capexData.renovationPriorities.length > 0 && (
        <div className="pt-2">
          <div className="text-xs font-mono text-on-surface-variant mb-2">
            Prioridades de Intervención & Conservación Detectadas:
          </div>
          <div className="flex flex-wrap gap-2">
            {capexData.renovationPriorities.map((item, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container border border-outline-variant/80 text-on-surface font-mono text-xs"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                <span>{item}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
