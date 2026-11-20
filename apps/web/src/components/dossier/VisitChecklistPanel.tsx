import { useMemo, useState } from 'react';
import {
  generateVisitChecklist,
  type ActiveProfileId,
  type PropertyAuditReport,
  type VisitChecklistItem,
  type VisitChecklistSeverity,
} from '@openbarrio/core';
import {
  AlertOctagon,
  AlertTriangle,
  CheckSquare,
  Download,
  FileText,
  Info,
  Printer,
  ShieldCheck,
  Square,
} from 'lucide-react';
import { useTranslation } from '../../i18n';
import { trackAnalyticsEvent } from '../../analytics';
import { formatChecklistExport } from '../../utils/checklist-export';
import { LayerStatusBadge } from '../common/LayerStatusBadge';

interface VisitChecklistPanelProps {
  report: PropertyAuditReport;
  profile?: ActiveProfileId;
}

const SEVERITY_BADGE_STYLES: Record<VisitChecklistSeverity, string> = {
  critical: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
  important: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  info: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
};

function SeverityIcon({ severity }: { severity: VisitChecklistSeverity }) {
  if (severity === 'critical') {
    return <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0" />;
  }
  if (severity === 'important') {
    return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
  }
  return <Info className="w-4 h-4 text-sky-400 shrink-0" />;
}

function triggerTextDownload(filename: string, content: string, mimeType: string): void {
  if (typeof window === 'undefined') return;
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function VisitChecklistPanel({
  report,
  profile = 'none',
}: VisitChecklistPanelProps) {
  const { t } = useTranslation();
  const [checkedIds, setCheckedIds] = useState<Record<string, boolean>>({});

  const checklist = useMemo(
    () => generateVisitChecklist(report, { profile }),
    [report, profile]
  );

  const toggleItem = (id: string) => {
    setCheckedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleExport = (format: 'md' | 'txt') => {
    const content = formatChecklistExport(checklist, format, t);
    const ext = format === 'md' ? 'md' : 'txt';
    const mime = format === 'md' ? 'text/markdown' : 'text/plain';
    triggerTextDownload(
      `openbarrio-checklist-${checklist.refcat}.${ext}`,
      content,
      mime
    );
    void trackAnalyticsEvent({ event: 'checklist_exported' });
  };

  const handlePrint = () => {
    void trackAnalyticsEvent({ event: 'checklist_exported' });
    window.print();
  };

  const renderItem = (item: VisitChecklistItem) => {
    const isChecked = Boolean(checkedIds[item.id]);
    const layerInfo = report.layers?.[item.sourceLayer];

    return (
      <li
        key={item.id}
        data-testid={`checklist-item-${item.id}`}
        data-severity={item.severity}
        data-layer-status={item.layerStatus}
        className={`p-3 rounded-lg border transition-colors page-break-inside-avoid ${
          isChecked
            ? 'bg-surface-container-low/50 border-outline-variant/50 opacity-75'
            : 'bg-surface-container-low border-outline-variant'
        }`}
      >
        <div className="flex items-start gap-3">
          <button
            type="button"
            role="checkbox"
            aria-checked={isChecked}
            onClick={() => toggleItem(item.id)}
            className="mt-0.5 text-primary hover:text-primary-container transition-colors shrink-0 cursor-pointer no-print"
            aria-label={t(item.titleKey, item.params)}
          >
            {isChecked ? (
              <CheckSquare className="w-4 h-4 text-emerald-400" />
            ) : (
              <Square className="w-4 h-4 text-on-surface-variant" />
            )}
          </button>

          {/* Print-only A4 physical checkbox */}
          <span
            aria-hidden="true"
            className="hidden print:inline-block w-4 h-4 mt-0.5 border-2 border-slate-800 rounded-sm shrink-0"
          />

          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <SeverityIcon severity={item.severity} />
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase border ${SEVERITY_BADGE_STYLES[item.severity]}`}
              >
                {t(`checklist.severity.${item.severity}`)}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-surface-container-high border border-outline-variant text-on-surface-variant">
                {t(`checklist.category.${item.category}`)}
              </span>
              {item.layerStatus !== 'ok' && (
                <LayerStatusBadge
                  info={
                    layerInfo ?? {
                      status: item.layerStatus,
                      sourceName: String(item.params?.source ?? item.sourceLayer),
                    }
                  }
                />
              )}
            </div>

            <p
              className={`text-xs sm:text-sm font-semibold text-on-surface ${
                isChecked ? 'line-through' : ''
              }`}
            >
              {t(item.titleKey, item.params)}
            </p>

            {item.askKey && (
              <p className="text-xs text-on-surface-variant">
                <span className="font-mono font-semibold text-primary">
                  {t('checklist.askLabel')}:{' '}
                </span>
                <span>{t(item.askKey, item.params)}</span>
              </p>
            )}

            {item.verifyKey && (
              <p className="text-xs text-on-surface-variant">
                <span className="font-mono font-semibold text-secondary">
                  {t('checklist.verifyLabel')}:{' '}
                </span>
                <span>{t(item.verifyKey, item.params)}</span>
              </p>
            )}
          </div>
        </div>
      </li>
    );
  };

  return (
    <section
      data-testid="visit-checklist-panel"
      className="space-y-4"
      aria-label={t('checklist.title')}
    >
      {/* Header & Summary */}
      <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <h3 className="font-headline text-base font-bold text-on-surface flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-primary" />
              <span>{t('checklist.title')}</span>
            </h3>
            <p className="text-xs text-on-surface-variant">
              {t('checklist.subtitle')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 no-print">
            <button
              type="button"
              data-testid="checklist-export-md-btn"
              onClick={() => handleExport('md')}
              className="px-2.5 py-1.5 rounded bg-surface-container-high hover:bg-surface-variant border border-outline-variant text-xs font-mono text-on-surface flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-primary" />
              <span>{t('checklist.exportMdBtn')}</span>
            </button>

            <button
              type="button"
              data-testid="checklist-export-txt-btn"
              onClick={() => handleExport('txt')}
              className="px-2.5 py-1.5 rounded bg-surface-container-high hover:bg-surface-variant border border-outline-variant text-xs font-mono text-on-surface flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-primary" />
              <span>{t('checklist.exportTxtBtn')}</span>
            </button>

            <button
              type="button"
              data-testid="checklist-print-btn"
              onClick={handlePrint}
              className="px-2.5 py-1.5 rounded bg-primary/20 hover:bg-primary/30 border border-primary/40 text-xs font-mono font-semibold text-primary flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t('checklist.printBtn')}</span>
            </button>
          </div>
        </div>

        {/* Counts Bar */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
          <span className="px-2 py-0.5 rounded bg-surface-container border border-outline-variant text-on-surface">
            {t('checklist.countTotal', { count: checklist.counts.total })}
          </span>
          {checklist.counts.critical > 0 && (
            <span className="px-2 py-0.5 rounded bg-rose-500/15 border border-rose-500/40 text-rose-300">
              {t('checklist.countCritical', { count: checklist.counts.critical })}
            </span>
          )}
          {checklist.counts.important > 0 && (
            <span className="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/40 text-amber-300">
              {t('checklist.countImportant', { count: checklist.counts.important })}
            </span>
          )}
          {checklist.counts.unverified > 0 && (
            <span className="px-2 py-0.5 rounded bg-surface-container-high border border-outline text-on-surface-variant">
              {t('checklist.countUnverified', { count: checklist.counts.unverified })}
            </span>
          )}
        </div>
      </div>

      {/* Checklist Items or Empty State */}
      {checklist.items.length === 0 ? (
        <div
          data-testid="checklist-empty-state"
          className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3"
        >
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-emerald-300">
              {t('checklist.emptyTitle')}
            </p>
            <p className="text-xs text-on-surface-variant">
              {t('checklist.emptyDesc')}
            </p>
          </div>
        </div>
      ) : (
        <ul className="space-y-2.5">{checklist.items.map(renderItem)}</ul>
      )}

      {/* Legal Disclaimer */}
      <p className="text-[11px] font-mono text-outline leading-relaxed">
        {t('checklist.legalDisclaimer')}
      </p>
    </section>
  );
}
