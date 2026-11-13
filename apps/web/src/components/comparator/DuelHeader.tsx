import { Shield, CheckCircle, X, Link as LinkIcon, TrendingUp } from 'lucide-react';
import { PropertyAuditReport } from '@openbarrio/core';
import { useTranslation } from '../../i18n';

export interface DuelHeaderProps {
  reportA: PropertyAuditReport;
  candidateB: PropertyAuditReport;
  verdictBadgeText: string;
  onClose: () => void;
}

export function DuelHeader({
  reportA,
  candidateB,
  verdictBadgeText,
  onClose,
}: DuelHeaderProps) {
  const { t } = useTranslation();

  return (
    <header className="w-full bg-surface-container border-b border-outline-variant sticky top-0 z-50 shrink-0">
      {/* Row 1: Top Brand & Action cluster */}
      <div className="w-full px-space-md lg:px-space-lg flex items-center justify-between gap-2 h-14 border-b border-outline-variant/60">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-surface-container-high border border-outline-variant flex items-center justify-center text-primary font-bold text-sm">
            OB
          </div>
          <div className="flex flex-col">
            <span className="font-headline font-bold text-primary tracking-tight text-sm">
              OpenBarrio
            </span>
            <span className="font-mono text-[9px] text-on-surface-variant uppercase tracking-wider hidden sm:inline">
              {t('duel.subtitle')}
            </span>
          </div>
        </div>

        {/* Institutional Badges & Close [Esc] button */}
        <div className="flex items-center gap-2">
          <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container-high border border-outline-variant text-on-surface font-mono text-[10px]">
            <Shield className="w-3 h-3 text-secondary" />
            <span>EPSG:25830 · ETRS89</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-primary/10 border border-primary/30 text-primary font-mono text-[10px]">
            <CheckCircle className="w-3 h-3" />
            <span>Sede Electrónica OVC Validada</span>
          </span>

          <button
            type="button"
            data-testid="duel-close-btn"
            onClick={onClose}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-surface-container-high hover:bg-surface-variant text-on-surface font-mono text-xs border border-outline-variant transition-colors ml-2 cursor-pointer"
            title={t('duel.close')}
          >
            <X className="w-4 h-4 text-on-surface-variant" />
            <span>{t('duel.close')} [Esc]</span>
          </button>
        </div>
      </div>

      {/* Row 2: Deep Context Breadcrumb & URL Synced Capsule */}
      <div className="w-full px-space-md lg:px-space-lg py-2 bg-surface-container-low flex flex-wrap items-center justify-between gap-y-2 text-xs font-mono">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-on-surface-variant">OpenBarrio</span>
          <span className="text-outline">/</span>
          <span className="text-on-surface-variant">Comparador Due Diligence</span>
          <span className="text-outline">/</span>
          <span className="text-on-surface font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary inline-block" />
            Duelo Inmobiliario 1 vs 1
          </span>

          {/* URL Query Synced Capsule */}
          <div
            data-testid="url-sync-capsule"
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-surface-container border border-outline-variant/80 text-primary font-mono text-[11px]"
          >
            <LinkIcon className="w-3 h-3 text-primary shrink-0" />
            <span className="tracking-tight truncate max-w-xs sm:max-w-md">
              ?refcat={reportA.property.cadastralReference}&vs={candidateB.property.cadastralReference}
            </span>
          </div>
        </div>

        {/* Global Algorithmic Verdict Top Badge */}
        <div
          data-testid="global-verdict-badge"
          className="flex items-center gap-2 bg-surface-container border border-primary/40 px-3 py-1 rounded-lg shadow-sm"
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
          <div className="text-right">
            <div className="text-[9px] font-mono uppercase text-on-surface-variant">
              Veredicto Global Algorítmico
            </div>
            <div className="text-xs sm:text-sm font-bold text-primary flex items-center gap-1">
              <span>{verdictBadgeText}</span>
              <TrendingUp className="w-3.5 h-3.5 text-primary" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
