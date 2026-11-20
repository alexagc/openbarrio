import { useState } from 'react';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_LENS_VALUES,
  ANALYTICS_MAX_PAYLOAD_BYTES,
  ANALYTICS_RETENTION_MONTHS,
  ANALYTICS_RETURNING_WINDOW_DAYS,
  VISIT_MODE_MAX_DOSSIERS,
  type AnalyticsEventName,
} from '@openbarrio/core';
import {
  Activity,
  ArrowLeft,
  CheckCircle2,
  Database,
  Lock,
  Map as MapIcon,
  ShieldCheck,
  ShieldOff,
} from 'lucide-react';
import { Header } from '../components/landing/Header';
import { Footer } from '../components/landing/Footer';
import { SeoHead } from '../components/common/SeoHead';
import { useConsent } from '../analytics';
import { useWorkspaceStore } from '../store/workspace.store';
import { useTranslation } from '../i18n';

export function PrivacyView() {
  const { language, t } = useTranslation();
  const setViewMode = useWorkspaceStore((s) => s.setViewMode);
  const { consent, acceptConsent, withdrawConsent } = useConsent();
  const [withdrawnFeedback, setWithdrawnFeedback] = useState(false);

  const eventRows: Record<
    AnalyticsEventName,
    { trigger: string; properties: string; purpose: string }
  > = {
    dossier_generated: {
      trigger: t('privacy.eventDossierGeneratedTrigger'),
      properties: t('privacy.eventPropsOptionalReturning'),
      purpose: t('privacy.eventDossierGeneratedDesc'),
    },
    lens_used: {
      trigger: t('privacy.eventLensUsedTrigger'),
      properties: `${ANALYTICS_LENS_VALUES.join(', ')} · ${t('privacy.eventPropsOptionalReturning')}`,
      purpose: t('privacy.eventLensUsedDesc'),
    },
    checklist_exported: {
      trigger: t('privacy.eventChecklistExportedTrigger'),
      properties: t('privacy.eventPropsOptionalReturning'),
      purpose: t('privacy.eventChecklistExportedDesc'),
    },
    visit_mode_enabled: {
      trigger: t('privacy.eventVisitModeEnabledTrigger'),
      properties: t('privacy.eventPropsOptionalReturning'),
      purpose: t('privacy.eventVisitModeEnabledDesc'),
    },
  };

  const statusText =
    consent === 'accepted'
      ? t('privacy.statusAccepted')
      : consent === 'rejected'
        ? t('privacy.statusRejected')
        : t('privacy.statusUndecided');

  const controlButtonClass =
    'px-4 py-2 rounded-lg text-xs font-semibold border border-outline-variant bg-surface-container-high hover:border-primary hover:bg-surface-container text-on-surface transition-colors cursor-pointer min-h-[36px]';

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col bg-background text-on-surface">
      <Header onOpenMap={() => setViewMode('map')} />

      <SeoHead
        viewMode="privacy"
        lang={language}
        title={t('privacy.seoTitle')}
        description={t('privacy.seoDescription')}
      />

      <main className="flex-1 flex flex-col items-center py-10 px-space-md sm:px-space-lg lg:px-space-xl">
        <div className="w-full max-w-7xl space-y-8">
          {/* Top navigation */}
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
                onClick={() => setViewMode('sources-status')}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-primary px-3 py-1.5 rounded bg-surface-container border border-primary/40 hover:bg-primary/10 transition-colors cursor-pointer"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>{t('methodology.viewSourcesStatusCta')}</span>
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

          {/* Header Card */}
          <section className="p-6 rounded-xl bg-surface-container-low border border-outline-variant space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary font-mono text-xs font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>{t('privacy.navLabel')}</span>
            </div>
            <h1 className="font-headline text-3xl sm:text-4xl font-bold text-on-surface">
              {t('privacy.title')}
            </h1>
            <p className="font-body text-sm sm:text-base text-on-surface-variant max-w-4xl leading-relaxed">
              {t('privacy.subtitle')}
            </p>
          </section>

          {/* Consent Management Card */}
          <section
            data-testid="privacy-consent-controls"
            className="p-6 rounded-xl bg-surface-container border border-outline-variant space-y-4"
          >
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div className="space-y-2 flex-1">
                <h2 className="font-headline text-lg font-bold text-on-surface">
                  {t('privacy.consentTitle')}
                </h2>
                <p className="font-body text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  {t('privacy.consentDesc')}
                </p>
                <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/60 flex flex-wrap items-center gap-2 text-xs font-mono">
                  <span className="text-on-surface-variant">{t('privacy.currentStatusLabel')}</span>
                  <span data-testid="privacy-consent-status" className="text-on-surface font-semibold">
                    {statusText}
                  </span>
                </div>
                {withdrawnFeedback && (
                  <p
                    role="status"
                    data-testid="privacy-withdrawn-notice"
                    className="text-xs font-mono text-emerald-400 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{t('privacy.withdrawnNotice')}</span>
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="button"
                    data-testid="privacy-withdraw-btn"
                    onClick={() => {
                      withdrawConsent();
                      setWithdrawnFeedback(true);
                    }}
                    className={controlButtonClass}
                  >
                    {t('privacy.withdrawBtn')}
                  </button>
                  <button
                    type="button"
                    data-testid="privacy-accept-btn"
                    onClick={() => {
                      acceptConsent();
                      setWithdrawnFeedback(false);
                    }}
                    className={controlButtonClass}
                  >
                    {t('privacy.acceptBtn')}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Closed Telemetry Events Table */}
          <section className="space-y-3">
            <h2 className="font-headline text-xl font-bold text-on-surface">
              {t('privacy.eventsTitle')}
            </h2>
            <p className="font-body text-xs sm:text-sm text-on-surface-variant">
              {t('privacy.eventsSubtitle')}
            </p>

            <div
              className="overflow-x-auto rounded-xl border border-outline-variant bg-surface-container shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              role="region"
              tabIndex={0}
              aria-label={t('privacy.eventsTableAria')}
            >
              <table
                data-testid="privacy-events-table"
                className="w-full min-w-[640px] border-collapse text-left text-sm"
              >
                <thead>
                  <tr className="border-b border-outline-variant bg-surface-container-high font-mono text-xs text-on-surface-variant">
                    <th scope="col" className="px-4 py-3 font-semibold">
                      {t('privacy.colEventId')}
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      {t('privacy.colTrigger')}
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      {t('privacy.colProperties')}
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      {t('privacy.colPurpose')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/60 text-xs">
                  {ANALYTICS_EVENTS.map((eventName) => {
                    const row = eventRows[eventName];
                    return (
                      <tr key={eventName} className="hover:bg-surface-container-low/60 transition-colors">
                        <th scope="row" className="px-4 py-3 font-mono font-semibold text-primary">
                          {eventName}
                        </th>
                        <td className="px-4 py-3 text-on-surface">{row.trigger}</td>
                        <td className="px-4 py-3 font-mono text-on-surface-variant">
                          {row.properties}
                        </td>
                        <td className="px-4 py-3 text-on-surface-variant">{row.purpose}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Limits, Never Collected & Legal Disclosure */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section className="p-5 rounded-xl bg-surface-container border border-outline-variant space-y-3">
              <h2 className="font-headline text-lg font-bold text-on-surface flex items-center gap-2">
                <Database className="w-5 h-5 text-primary shrink-0" />
                <span>{t('privacy.limitsTitle')}</span>
              </h2>
              <ul className="space-y-2 text-xs sm:text-sm text-on-surface-variant leading-relaxed list-disc pl-5">
                <li>
                  {t('privacy.retentionRule', { months: ANALYTICS_RETENTION_MONTHS })}
                </li>
                <li>
                  {t('privacy.returningWindowRule', { days: ANALYTICS_RETURNING_WINDOW_DAYS })}
                </li>
                <li>
                  {t('privacy.payloadLimitRule', { bytes: ANALYTICS_MAX_PAYLOAD_BYTES })}
                </li>
                <li>
                  {t('privacy.localDossiersRule', { max: VISIT_MODE_MAX_DOSSIERS })}
                </li>
              </ul>
            </section>

            <section className="p-5 rounded-xl bg-surface-container border border-outline-variant space-y-3">
              <h2 className="font-headline text-lg font-bold text-on-surface flex items-center gap-2">
                <ShieldOff className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{t('privacy.neverCollectedTitle')}</span>
              </h2>
              <ul className="space-y-2 text-xs sm:text-sm text-on-surface-variant leading-relaxed list-disc pl-5">
                <li>{t('privacy.neverCollected1')}</li>
                <li>{t('privacy.neverCollected2')}</li>
                <li>{t('privacy.neverCollected3')}</li>
                <li>{t('privacy.neverCollected4')}</li>
              </ul>
            </section>
          </div>

          <section className="p-5 rounded-xl bg-surface-container border border-outline-variant space-y-3">
            <h2 className="font-headline text-lg font-bold text-on-surface">
              {t('privacy.legalAndBiasTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              {t('privacy.legalBasisText')}
            </p>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              {t('privacy.biasDisclosureText')}
            </p>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              {t('privacy.extensionScopeText')}
            </p>
          </section>
        </div>
      </main>

      <Footer onOpenMap={() => setViewMode('map')} />
    </div>
  );
}
