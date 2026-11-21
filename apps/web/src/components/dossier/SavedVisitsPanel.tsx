import React from 'react';
import {
  BookmarkCheck,
  Trash2,
  ExternalLink,
  AlertTriangle,
  HardDrive,
} from 'lucide-react';
import {
  VISIT_MODE_MAX_DOSSIERS,
  VISIT_MODE_STALE_WARN_DAYS,
  isSavedDossierExpired,
} from '@openbarrio/core';
import { usePwaStore } from '../../store/pwa.store';
import { useWorkspaceStore } from '../../store/workspace.store';
import { useTranslation } from '../../i18n';

export interface SavedVisitsPanelProps {
  onSelectDossier?: () => void;
}

export const SavedVisitsPanel: React.FC<SavedVisitsPanelProps> = ({
  onSelectDossier,
}) => {
  const { t, language } = useTranslation();
  const savedDossiers = usePwaStore((s) => s.savedDossiers);
  const storageError = usePwaStore((s) => s.storageError);
  const openSavedDossier = usePwaStore((s) => s.openSavedDossier);
  const removeSavedDossier = usePwaStore((s) => s.removeSavedDossier);

  const setReport = useWorkspaceStore((s) => s.setReport);
  const setSelectedCoords = useWorkspaceStore((s) => s.setSelectedCoords);
  const setViewMode = useWorkspaceStore((s) => s.setViewMode);
  const setActiveTab = useWorkspaceStore((s) => s.setActiveTab);
  const setError = useWorkspaceStore((s) => s.setError);

  const handleOpen = async (id: string) => {
    const saved = await openSavedDossier(id);
    if (!saved) return;
    setError(null);
    setSelectedCoords({
      lat: saved.report.property.coordinates.latitude,
      lon: saved.report.property.coordinates.longitude,
    });
    setReport(saved.report);
    setViewMode('map');
    setActiveTab('dossier');
    onSelectDossier?.();
  };

  const formatDate = (iso: string) => {
    const parsed = new Date(iso);
    if (Number.isNaN(parsed.getTime())) return iso.slice(0, 10);
    return parsed.toLocaleDateString(language === 'en' ? 'en-US' : `${language}-ES`, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <section
      data-testid="saved-visits-panel"
      aria-label={t('visitMode.savedPanelTitle')}
      className="p-4 rounded-xl bg-surface-container border border-outline-variant space-y-3"
    >
      <div className="flex items-center justify-between gap-2 border-b border-outline-variant pb-2">
        <div className="flex items-center gap-2">
          <BookmarkCheck className="w-4 h-4 text-primary shrink-0" />
          <h3 className="font-headline text-sm font-bold text-on-surface">
            {t('visitMode.savedPanelTitle')}
          </h3>
        </div>
        <span className="font-mono text-xs text-on-surface-variant">
          {savedDossiers.length}/{VISIT_MODE_MAX_DOSSIERS}
        </span>
      </div>

      <p className="font-body text-xs text-on-surface-variant leading-relaxed">
        {t('visitMode.savedPanelDesc', { max: VISIT_MODE_MAX_DOSSIERS })}
      </p>

      {storageError && (
        <div
          role="alert"
          data-testid="visit-storage-error"
          className="p-3 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs flex items-start gap-2"
        >
          <HardDrive className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            {storageError === 'quota_exceeded'
              ? t('visitMode.storageQuotaError')
              : t('visitMode.storageUnavailableError')}
          </span>
        </div>
      )}

      {savedDossiers.length === 0 ? (
        <p className="text-xs font-mono text-outline py-2">
          {t('visitMode.savedPanelEmpty')}
        </p>
      ) : (
        <ul className="space-y-2">
          {savedDossiers.map((item) => {
            const expired = isSavedDossierExpired(item.savedAt);
            return (
              <li
                key={item.id}
                data-testid={`saved-visit-item-${item.id}`}
                className="p-3 rounded-lg bg-surface-container-low border border-outline-variant flex items-center justify-between gap-3"
              >
                <div className="min-w-0 space-y-1">
                  <div className="font-headline text-xs sm:text-sm font-semibold text-on-surface truncate">
                    {item.label}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-on-surface-variant">
                    <span>{item.municipality}</span>
                    <span>·</span>
                    <span>{item.id}</span>
                    <span>·</span>
                    <span className="text-primary font-semibold">{item.overallScore}/100</span>
                    <span>·</span>
                    <span>{t('visitMode.savedOnDate', { date: formatDate(item.savedAt) })}</span>
                  </div>
                  {expired && (
                    <div
                      data-testid={`saved-visit-expired-${item.id}`}
                      className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-300"
                    >
                      <AlertTriangle className="w-3 h-3 shrink-0" />
                      <span>
                        {t('visitMode.expiredWarning', { days: VISIT_MODE_STALE_WARN_DAYS })}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    data-testid={`open-saved-visit-${item.id}`}
                    onClick={() => void handleOpen(item.id)}
                    className="px-2.5 py-1.5 rounded bg-primary/15 border border-primary/40 text-primary hover:bg-primary/25 text-xs font-mono font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>{t('visitMode.openSavedBtn')}</span>
                  </button>
                  <button
                    type="button"
                    data-testid={`remove-saved-visit-${item.id}`}
                    onClick={() => void removeSavedDossier(item.id)}
                    aria-label={t('visitMode.removeSavedBtn')}
                    title={t('visitMode.removeSavedBtn')}
                    className="p-1.5 rounded bg-surface-container-high border border-outline-variant text-on-surface-variant hover:text-rose-400 hover:border-rose-400/50 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};
