import { RadonEvaluationDTO } from '@openbarrio/core';
import { ShieldAlert, ShieldCheck, Info } from 'lucide-react';
import { useTranslation } from '../../i18n';

interface RadonCardProps {
  radon?: RadonEvaluationDTO;
  municipality?: string;
  floor?: string;
}

export function RadonCard({ radon, municipality, floor }: RadonCardProps) {
  const { t } = useTranslation();
  if (!radon) return null;

  const isNegligible = radon.riskLevel === 'negligible';
  const isHigh = radon.riskLevel === 'high';

  const badgeColorClass = isNegligible
    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
    : isHigh
    ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
    : 'bg-amber-500/15 text-amber-400 border-amber-500/30';

  const zoneBadgeColor =
    radon.municipalityZone === 'Zona 0'
      ? 'bg-surface-container-high text-on-surface-variant border-outline-variant'
      : radon.municipalityZone === 'Zona I'
      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
      : 'bg-rose-500/20 text-rose-300 border-rose-500/40';

  return (
    <div
      data-testid="radon-card"
      className="p-4 rounded-lg bg-surface-container-low border border-outline-variant space-y-3"
    >
      <div className="flex items-center justify-between border-b border-outline-variant pb-2">
        <div className="flex items-center gap-2">
          {radon.requiresMitigation ? (
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span className="font-headline text-sm font-bold text-on-surface">
            {t('radon.title')}
          </span>
        </div>
        <span
          className={`font-mono text-[11px] font-semibold px-2 py-0.5 rounded border ${zoneBadgeColor}`}
        >
          {radon.municipalityZone} · CTE DB-HS 6
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <span className="text-on-surface-variant block">{t('radon.municipality')}</span>
          <span className="font-semibold text-on-surface">{municipality || 'Término Municipal'}</span>
        </div>
        <div>
          <span className="text-on-surface-variant block">{t('radon.floorLevel')}</span>
          <span className="font-mono font-bold text-on-surface">
            {floor !== undefined && floor !== ''
              ? `Planta ${floor}`
              : radon.isGroundContact
              ? 'En contacto con terreno (PB)'
              : 'Planta elevada'}
          </span>
        </div>
        <div>
          <span className="text-on-surface-variant block">{t('radon.cteObligation')}</span>
          <span
            className={`font-mono font-bold ${
              radon.requiresMitigation ? 'text-amber-400' : 'text-emerald-400'
            }`}
          >
            {radon.requiresMitigation ? t('radon.mitigationRequired') : t('radon.mitigationNotRequired')}
          </span>
        </div>
        <div>
          <span className="text-on-surface-variant block">{t('radon.riskLevel')}</span>
          <span
            className={`font-mono font-bold px-1.5 py-0.5 rounded border inline-block text-[11px] ${badgeColorClass}`}
          >
            {radon.riskLevel === 'negligible'
              ? t('radon.riskNegligible')
              : radon.riskLevel === 'moderate'
              ? t('radon.riskModerate')
              : t('radon.riskHigh')}
          </span>
        </div>
      </div>

      <div className="p-2.5 rounded bg-surface-container border border-outline-variant/60 flex items-start gap-2 text-xs">
        <Info className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
        <p className="text-on-surface-variant leading-relaxed">
          {radon.contextualReason}
        </p>
      </div>
    </div>
  );
}
