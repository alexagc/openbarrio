import React from 'react';
import { BuildingInspection, CadastralProperty } from '@openbarrio/core';
import { ShieldCheck, ShieldAlert, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '../../i18n';

interface BuildingInspectionCardProps {
  inspection?: BuildingInspection;
  property: CadastralProperty;
}

export const BuildingInspectionCard: React.FC<BuildingInspectionCardProps> = ({
  inspection,
  property,
}) => {
  const { t } = useTranslation();
  if (!inspection) return null;

  const year = property.building.constructionYear;
  const isFavorable = inspection.status === 'FAVORABLE';
  const isUnfavorable = inspection.status === 'UNFAVORABLE';
  const isPreventive = inspection.isPreventiveAlert || inspection.status === 'PREVENTIVE_REQUIRED';

  const badgeStyle = isFavorable
    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
    : isUnfavorable
    ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
    : isPreventive
    ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
    : 'bg-surface-container-high text-on-surface-variant border-outline-variant';

  const statusLabel = isFavorable
    ? t('ite.statusFavorable')
    : isUnfavorable
    ? t('ite.statusUnfavorable')
    : isPreventive
    ? t('ite.statusPreventiveRequired')
    : t('ite.statusUnknown');

  return (
    <div
      data-testid="building-inspection-card"
      className="p-4 rounded-lg bg-surface-container-low border border-outline-variant space-y-3"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-outline-variant pb-2.5 gap-2">
        <div className="flex items-center gap-2">
          {isFavorable ? (
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : isUnfavorable ? (
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          )}
          <span className="font-headline text-sm font-bold text-on-surface">
            {t('ite.cardTitle')}
          </span>
        </div>
        <span className={`font-mono text-[11px] font-semibold px-2.5 py-0.5 rounded border self-start sm:self-auto ${badgeStyle}`}>
          {statusLabel}
        </span>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <span className="text-on-surface-variant block">{t('ite.lastInspection')}</span>
          <span className="font-mono font-bold text-on-surface">
            {inspection.inspectionYear ? `Año ${inspection.inspectionYear}` : t('ite.noRecord')}
          </span>
        </div>

        <div>
          <span className="text-on-surface-variant block">{t('ite.nextDueYear')}</span>
          <span className="font-mono font-bold text-on-surface">
            {inspection.nextInspectionDueYear
              ? `Año ${inspection.nextInspectionDueYear}`
              : isPreventive
              ? t('ite.immediateDue')
              : 'Periódica (+10a)'}
          </span>
        </div>

        <div>
          <span className="text-on-surface-variant block">{t('ite.competentRegistry')}</span>
          <span className="font-semibold text-on-surface truncate block" title={inspection.municipalRegistry}>
            {inspection.municipalRegistry || property.address.municipality}
          </span>
        </div>

        <div>
          <span className="text-on-surface-variant block">{t('ite.defectsStatus')}</span>
          <span
            className={`font-mono font-bold ${
              inspection.hasDefects ? 'text-rose-400' : 'text-emerald-400'
            }`}
          >
            {inspection.hasDefects ? t('ite.activeDefects') : t('ite.noActiveDefects')}
          </span>
        </div>
      </div>

      {/* Deficiencies Alert for Unfavorable Inspections */}
      {inspection.hasDefects && inspection.defectsSummary && inspection.defectsSummary.length > 0 && (
        <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 text-rose-300 font-semibold font-mono text-[11px]">
            <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
            <span>{t('ite.subsanacionRequiredTitle')}</span>
          </div>
          <ul className="list-disc list-inside text-rose-200 text-[11px] font-mono space-y-0.5">
            {inspection.defectsSummary.map((defect, i) => (
              <li key={i}>{defect}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Preventive Alert for Buildings > 50 Years Old */}
      {isPreventive && (
        <div
          data-testid="ite-preventive-banner"
          className="p-3 rounded-lg bg-amber-950/40 border border-amber-500/40 text-xs space-y-1.5"
        >
          <div className="flex items-center gap-1.5 text-amber-300 font-semibold font-mono text-[11px]">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>{t('ite.preventiveNoticeTitle')}</span>
          </div>
          <p className="text-amber-200 text-[11px] leading-relaxed">
            {t('ite.preventiveNoticeBody', {
              year,
              muni: property.address.municipality,
            })}
          </p>
        </div>
      )}

      {/* Secondary Compliance Tags & Legal Disclaimer */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-outline-variant/60 text-[10px] font-mono text-on-surface-variant">
        <span className="flex items-center gap-1 bg-surface-container px-2 py-0.5 rounded border border-outline-variant/50">
          <FileText className="w-3 h-3 text-primary" />
          <span>RD-L 7/2015 Art. 29</span>
        </span>
        {inspection.accessibilityFulfillment !== undefined && (
          <span className="flex items-center gap-1 bg-surface-container px-2 py-0.5 rounded border border-outline-variant/50">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Accesibilidad Universal</span>
          </span>
        )}
        {inspection.energyCertificationIncluded && (
          <span className="flex items-center gap-1 bg-surface-container px-2 py-0.5 rounded border border-outline-variant/50">
            <CheckCircle2 className="w-3 h-3 text-cyan-400" />
            <span>CEE Integrado en IEE</span>
          </span>
        )}
      </div>
    </div>
  );
};
