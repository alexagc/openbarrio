import React from 'react';
import { SeismicHazard } from '@openbarrio/core';
import { Activity, AlertTriangle, Scale } from 'lucide-react';
import { useTranslation } from '../../i18n';

interface SeismicSafetyCardProps {
  seismic?: SeismicHazard;
  constructionYear: number;
  municipality: string;
}

export const SeismicSafetyCard: React.FC<SeismicSafetyCardProps> = ({
  seismic,
  constructionYear,
  municipality,
}) => {
  const { t } = useTranslation();
  if (!seismic) return null;

  const ab = seismic.basicAccelerationG;
  const isHigh = seismic.riskLevel === 'HIGH';
  const isMedium = seismic.riskLevel === 'MEDIUM';
  const isLow = seismic.riskLevel === 'LOW';

  const riskBadgeStyle = isHigh
    ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
    : isMedium
    ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
    : isLow
    ? 'bg-sky-500/15 text-sky-400 border-sky-500/30'
    : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';

  const riskLabel = isHigh
    ? t('seismic.riskHigh')
    : isMedium
    ? t('seismic.riskMedium')
    : isLow
    ? t('seismic.riskLow')
    : t('seismic.riskVeryLow');

  const standardLabel =
    seismic.ncseStandardApplied === 'NCSE_02'
      ? 'NCSE-02 (Ductilidad Alta)'
      : seismic.ncseStandardApplied === 'NCSE_94'
      ? 'NCSE-94 (Norma Moderna)'
      : seismic.ncseStandardApplied === 'PGS_1'
      ? 'PGS-1 (Pre-1994)'
      : 'Pre-normativa sismorresistente (<1968)';

  return (
    <div
      data-testid="seismic-safety-card"
      className="p-4 rounded-lg bg-surface-container-low border border-outline-variant space-y-3"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-outline-variant pb-2.5 gap-2">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary shrink-0" />
          <span className="font-headline text-sm font-bold text-on-surface">
            {t('seismic.cardTitle')}
          </span>
        </div>
        <span className={`font-mono text-[11px] font-semibold px-2.5 py-0.5 rounded border self-start sm:self-auto ${riskBadgeStyle}`}>
          {riskLabel} · {ab.toFixed(2)}g
        </span>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <span className="text-on-surface-variant block">{t('seismic.basicAcceleration')}</span>
          <span className="font-mono font-bold text-on-surface">
            ab = {ab.toFixed(2)}g
          </span>
        </div>

        <div>
          <span className="text-on-surface-variant block">{t('seismic.structuralVulnerability')}</span>
          <span
            className={`font-mono font-bold ${
              seismic.isVulnerableToSeismic ? 'text-amber-400' : 'text-emerald-400'
            }`}
          >
            {seismic.isVulnerableToSeismic ? t('seismic.vulnerableHigh') : t('seismic.vulnerableLow')}
          </span>
        </div>

        <div>
          <span className="text-on-surface-variant block">{t('seismic.municipality')}</span>
          <span className="font-semibold text-on-surface truncate block" title={municipality || seismic.municipalityName}>
            {municipality || seismic.municipalityName}
          </span>
        </div>

        <div>
          <span className="text-on-surface-variant block">{t('seismic.standardApplied')}</span>
          <span className="font-mono font-bold text-on-surface truncate block" title={standardLabel}>
            {standardLabel}
          </span>
        </div>
      </div>

      {/* Seismic Vulnerability Advisory if Built Pre-1994 in Moderate/High Hazard Area */}
      {seismic.isVulnerableToSeismic && (
        <div
          data-testid="seismic-vulnerability-banner"
          className="p-3 rounded-lg bg-amber-950/40 border border-amber-500/40 text-xs space-y-1.5"
        >
          <div className="flex items-center gap-1.5 text-amber-300 font-semibold font-mono text-[11px]">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>{t('seismic.vulnerabilityAlertTitle')}</span>
          </div>
          <p className="text-amber-200 text-[11px] leading-relaxed">
            {t('seismic.vulnerabilityAlertBody', {
              year: constructionYear,
              ab: ab.toFixed(2),
            })}
          </p>
        </div>
      )}

      {/* IGN NCSE-02 Reference Tag */}
      <div className="flex items-center gap-2 pt-1 border-t border-outline-variant/60 text-[10px] font-mono text-on-surface-variant">
        <Scale className="w-3 h-3 text-secondary shrink-0" />
        <span className="truncate">
          {seismic.regulatoryContext || 'Norma de Construcción Sismorresistente NCSE-02 (Real Decreto 997/2002)'}
        </span>
      </div>
    </div>
  );
};
