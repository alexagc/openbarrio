import { useCallback, useEffect, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Map as MapIcon,
  RefreshCw,
  ShieldAlert,
  XCircle,
} from 'lucide-react';
import type {
  CircuitState,
  SourceHealthEntry,
  SourceOperationalStatus,
  SourcesStatusResponse,
} from '@openbarrio/core';
import { apiClient } from '../services/api.client';
import { Header } from '../components/landing/Header';
import { Footer } from '../components/landing/Footer';
import { SeoHead } from '../components/common/SeoHead';
import { useWorkspaceStore } from '../store/workspace.store';
import { useTranslation } from '../i18n';

function formatIsoTimestamp(iso?: string, locale = 'es'): string {
  if (!iso) return '—';
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return iso;
  try {
    return parsed.toLocaleString(locale, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return iso;
  }
}

function getSourceStatusStyle(status: SourceOperationalStatus): string {
  switch (status) {
    case 'operational':
      return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    case 'degraded':
      return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    case 'outage':
      return 'bg-red-500/15 text-red-400 border-red-500/30';
    case 'unknown':
    default:
      return 'bg-slate-500/15 text-slate-300 border-slate-500/30';
  }
}

export function SourcesStatusView() {
  const { language, t } = useTranslation();
  const setViewMode = useWorkspaceStore((s) => s.setViewMode);

  const [data, setData] = useState<SourcesStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadStatus = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const response = await apiClient.getSourcesStatus();
      setData(response);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error && err.message ? err.message : t('sourcesStatus.errorText'));
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void loadStatus();
  }, [loadStatus]);

  const statusLabel = (status: SourceOperationalStatus) => {
    if (status === 'operational') return t('sourcesStatus.statusOperational');
    if (status === 'degraded') return t('sourcesStatus.statusDegraded');
    if (status === 'outage') return t('sourcesStatus.statusOutage');
    return t('sourcesStatus.statusUnknown');
  };

  const circuitLabel = (circuit: CircuitState) => {
    if (circuit === 'closed') return t('sourcesStatus.circuitClosed');
    if (circuit === 'open') return t('sourcesStatus.circuitOpen');
    return t('sourcesStatus.circuitHalfOpen');
  };

  const overallBannerConfig = (() => {
    const overall = data?.overallStatus ?? 'degraded';
    if (overall === 'operational') {
      return {
        label: t('sourcesStatus.overallOperational'),
        classes: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
        Icon: CheckCircle2,
      };
    }
    if (overall === 'outage') {
      return {
        label: t('sourcesStatus.overallOutage'),
        classes: 'bg-red-500/10 border-red-500/30 text-red-400',
        Icon: XCircle,
      };
    }
    return {
      label: t('sourcesStatus.overallDegraded'),
      classes: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
      Icon: AlertTriangle,
    };
  })();

  const BannerIcon = overallBannerConfig.Icon;

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col bg-background text-on-surface">
      <Header onOpenMap={() => setViewMode('map')} />

      <SeoHead
        viewMode="sources-status"
        lang={language}
        title={t('sourcesStatus.seoTitle')}
        description={t('sourcesStatus.seoDescription')}
      />

      <main className="flex-1 flex flex-col items-center py-10 px-space-md sm:px-space-lg lg:px-space-xl">
        <div className="w-full max-w-7xl space-y-6">
          {/* Top navigation bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setViewMode('landing')}
              className="inline-flex items-center gap-2 text-xs font-mono text-primary hover:text-primary-container px-3 py-1.5 rounded bg-surface-container border border-outline-variant transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('common.backToHome')}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => void loadStatus()}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-primary px-3 py-1.5 rounded bg-surface-container border border-primary/40 hover:bg-primary/10 transition-colors cursor-pointer disabled:opacity-60"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>{t('sourcesStatus.refreshBtn')}</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('map')}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-on-surface px-3 py-1.5 rounded bg-surface-container-high border border-outline-variant hover:border-primary transition-colors cursor-pointer"
              >
                <MapIcon className="w-4 h-4 text-primary" />
                <span>{t('common.exploreInGis')}</span>
              </button>
            </div>
          </div>

          {/* Page header card */}
          <section className="p-6 rounded-xl bg-surface-container-low border border-outline-variant space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary font-mono text-xs font-medium">
              <Activity className="w-4 h-4" />
              <span>{t('sourcesStatus.navLabel')}</span>
            </div>
            <h1 className="font-headline text-3xl sm:text-4xl font-bold text-on-surface">
              {t('sourcesStatus.title')}
            </h1>
            <p className="font-body text-sm sm:text-base text-on-surface-variant max-w-4xl leading-relaxed">
              {t('sourcesStatus.subtitle')}
            </p>
          </section>

          {/* Loading State */}
          {isLoading && (
            <div
              className="p-6 rounded-xl bg-surface-container border border-outline-variant flex items-center gap-3 text-sm font-mono text-on-surface-variant"
              role="status"
            >
              <RefreshCw className="w-4 h-4 animate-spin text-primary shrink-0" />
              <span>{t('sourcesStatus.loadingText')}</span>
            </div>
          )}

          {/* Error State */}
          {!isLoading && errorMsg && (
            <div
              role="alert"
              aria-live="assertive"
              className="p-5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-300"
            >
              <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-red-400" />
              <div className="space-y-1">
                <p className="font-headline font-semibold text-sm">{t('sourcesStatus.errorText')}</p>
                <p className="font-mono text-xs text-red-200/80">{errorMsg}</p>
              </div>
            </div>
          )}

          {/* Operational Data */}
          {!isLoading && data && (
            <div className="space-y-4">
              {/* Overall Banner */}
              <div
                className={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-3 ${overallBannerConfig.classes}`}
              >
                <div className="flex items-center gap-2.5 font-headline font-semibold text-sm sm:text-base">
                  <BannerIcon className="w-5 h-5 shrink-0" />
                  <span>{overallBannerConfig.label}</span>
                </div>
                <span className="font-mono text-xs opacity-90">
                  {t('sourcesStatus.generatedAtLabel')}: {formatIsoTimestamp(data.generatedAt, language)}
                </span>
              </div>

              {/* Accessible Responsive Table (modern-web-guidance pattern) */}
              <div
                className="overflow-x-auto rounded-xl border border-outline-variant bg-surface-container shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                role="region"
                tabIndex={0}
                aria-label={t('sourcesStatus.tableAria')}
              >
                <table className="w-full min-w-[680px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-outline-variant bg-surface-container-high font-mono text-xs text-on-surface-variant">
                      <th scope="col" className="px-4 py-3 font-semibold">
                        {t('sourcesStatus.colSource')}
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        {t('sourcesStatus.colStatus')}
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        {t('sourcesStatus.colCircuit')}
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold text-right tabular-nums">
                        {t('sourcesStatus.colFailures')}
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        {t('sourcesStatus.colLastVerified')}
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        {t('sourcesStatus.colSourceDate')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/60">
                    {data.sources.map((src: SourceHealthEntry) => (
                      <tr key={src.key} className="hover:bg-surface-container-low/60 transition-colors">
                        <th scope="row" className="px-4 py-3.5 font-medium text-on-surface">
                          <div className="font-headline font-semibold text-sm">{src.sourceName}</div>
                          <div className="font-mono text-[11px] text-on-surface-variant">{src.key}</div>
                          {src.key === 'transit' && (
                            <p className="font-body text-[11px] font-normal text-on-surface-variant mt-1 max-w-md leading-snug">
                              {t('sourcesStatus.noteTransit')}
                            </p>
                          )}
                        </th>
                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full border font-mono text-xs font-medium ${getSourceStatusStyle(
                              src.status
                            )}`}
                          >
                            {statusLabel(src.status)}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 font-mono text-xs text-on-surface-variant">
                          {circuitLabel(src.circuitState)}
                        </td>
                        <td className="px-4 py-3.5 font-mono text-xs text-right tabular-nums text-on-surface">
                          {src.recentFailures}
                        </td>
                        <td className="px-4 py-3.5 font-mono text-xs text-on-surface-variant">
                          {formatIsoTimestamp(src.lastVerifiedAt, language)}
                        </td>
                        <td className="px-4 py-3.5 font-mono text-xs text-on-surface-variant">
                          {src.sourceDate || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Per-isolate caveat */}
              <p className="font-body text-xs text-on-surface-variant leading-relaxed px-1">
                {t('sourcesStatus.isolateCaveat')}
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer onOpenMap={() => setViewMode('map')} />
    </div>
  );
}
