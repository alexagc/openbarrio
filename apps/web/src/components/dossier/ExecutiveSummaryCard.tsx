import { PropertyAuditReport } from '@openbarrio/core';
import { isSubstandardHousing } from '../../utils/substandard';
import { HighlightsAndRisks } from '../HighlightsAndRisks';
import { ScoreGauge } from '../ScoreGauge';
import { useTranslation } from '../../i18n';
import { AlertTriangle, AlertOctagon } from 'lucide-react';

export interface ExecutiveSummaryCardProps {
  report: PropertyAuditReport;
  className?: string;
}

export function ExecutiveSummaryCard({ report, className = '' }: ExecutiveSummaryCardProps) {
  const { t } = useTranslation();
  const isSubstandard = isSubstandardHousing(report);
  const score = report.score;
  const property = report.property;

  return (
    <div data-testid="executive-summary-card" className={`space-y-4 ${className}`}>
      {/* Prominent Red Warning Banner for Substandard Commercial Housing (Infravivienda) */}
      {isSubstandard && (
        <div
          data-testid="substandard-housing-warning"
          className="p-4 rounded-xl bg-rose-950/90 border-2 border-rose-500 text-rose-100 shadow-xl flex items-start gap-3.5 animate-in fade-in"
        >
          <div className="p-2 rounded-lg bg-rose-900/80 border border-rose-400 text-rose-300 shrink-0">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-headline font-bold text-sm text-rose-200 uppercase tracking-wide">
                {t('dossier.substandardHousingTitle')}
              </span>
              <span className="px-2 py-0.5 rounded bg-rose-900 border border-rose-400 text-[10px] font-mono text-rose-200 uppercase font-semibold">
                Alerta Crítica
              </span>
            </div>
            <p className="text-xs font-body text-rose-200/90 leading-relaxed">
              {t('dossier.substandardHousingDesc')}
            </p>
            <div className="text-[11px] font-mono text-rose-300 pt-1 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>{t('dossier.substandardCheckAdvice')}</span>
            </div>
          </div>
        </div>
      )}

      {/* Score Gauge */}
      <ScoreGauge
        score={score}
        cityOrProvince={property.address.province}
        percentile={report.neighborhood.percentileInMunicipality}
        typology={report.typology}
      />

      {/* Highlights & Risks */}
      <HighlightsAndRisks
        highlights={score.keyHighlights}
        risks={score.keyRisks}
        refcat={property.cadastralReference}
        municipality={property.address.municipality}
      />
    </div>
  );
}
