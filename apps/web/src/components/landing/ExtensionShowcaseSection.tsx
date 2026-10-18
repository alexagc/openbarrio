import React from 'react';
import { Chrome, Shield, CheckCircle2, Building, Gavel, Droplets } from 'lucide-react';
import { useTranslation } from '../../i18n';

export const ExtensionShowcaseSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section
      id="extension"
      className="py-16 px-space-lg lg:px-space-xl bg-surface-container-lowest border-b border-outline-variant scroll-mt-14"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Extension Features & Call to Action */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container border border-outline-variant font-mono text-xs text-primary mb-3 w-fit">
              <Chrome className="w-4 h-4" />
              <span>{t('extension.tag')}</span>
            </div>

            <h2 className="font-headline text-2xl sm:text-3xl font-bold text-on-surface mb-4 leading-tight">
              {t('extension.title')}
            </h2>

            <p className="font-body text-sm text-on-surface-variant mb-6 leading-relaxed">
              {t('extension.desc')}
            </p>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2.5 font-body text-sm text-on-surface">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>
                  <strong className="font-semibold">{t('extension.feature1Title')}</strong>{' '}
                  {t('extension.feature1Desc')}
                </span>
              </li>
              <li className="flex items-start gap-2.5 font-body text-sm text-on-surface">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>
                  <strong className="font-semibold">{t('extension.feature2Title')}</strong>{' '}
                  {t('extension.feature2Desc')}
                </span>
              </li>
              <li className="flex items-start gap-2.5 font-body text-sm text-on-surface">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>
                  <strong className="font-semibold">{t('extension.feature3Title')}</strong>{' '}
                  {t('extension.feature3Desc')}
                </span>
              </li>
            </ul>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <a
                href="https://github.com/alexagc/openbarrio/tree/main/apps/extension"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 rounded bg-primary text-on-primary font-body text-sm font-semibold hover:bg-primary-fixed transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <Chrome className="w-4 h-4" />
                <span>{t('extension.ctaButton')}</span>
              </a>
              <span className="font-mono text-xs text-on-surface-variant flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-primary" />
                <span>{t('extension.securityBadge')}</span>
              </span>
            </div>
          </div>

          {/* Right Column: High-Fidelity Portal Mockup + Injected OpenBarrio Widget */}
          <div className="lg:col-span-7 relative">
            <div className="rounded-lg bg-surface-container border border-outline-variant p-4 shadow-2xl relative overflow-hidden">
              {/* Browser window titlebar */}
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-error" />
                  <div className="w-3 h-3 rounded-full bg-secondary" />
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="font-mono text-xs text-outline ml-2 truncate max-w-[200px] sm:max-w-none">
                    {t('extension.mockPortal')}
                  </span>
                </div>
                <span className="font-mono text-xs text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded">
                  Portal Inmobiliario
                </span>
              </div>

              {/* Underlying listing simulated layout */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 opacity-75">
                <div className="sm:col-span-5 h-44 rounded bg-surface-container-high border border-outline-variant flex items-center justify-center text-outline">
                  <Building className="w-12 h-12" />
                </div>
                <div className="sm:col-span-7 flex flex-col justify-between py-1">
                  <div>
                    <span className="font-mono text-xs text-outline">
                      {t('extension.mockListingTitle')}
                    </span>
                    <h4 className="font-headline text-lg text-on-surface font-bold mt-1">
                      {t('extension.mockPrice')}
                    </h4>
                    <p className="font-body text-xs text-on-surface-variant mt-1">
                      {t('extension.mockListingSpecs')}
                    </p>
                  </div>
                  <div className="font-body text-xs text-outline italic">
                    {t('extension.mockListingQuote')}
                  </div>
                </div>
              </div>

              {/* INJECTED OPENBARRIO AUDIT WIDGET OVERLAY */}
              <div className="mt-4 p-4 rounded bg-surface-container-low border-2 border-primary/80 shadow-xl relative z-10">
                {/* Widget Header */}
                <div className="flex items-center justify-between pb-3 border-b border-outline-variant">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded bg-primary/20 text-primary flex items-center justify-center font-bold font-mono text-xs border border-primary/40">
                      OB
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-body text-sm text-on-surface font-bold">
                          {t('extension.widgetTitle')}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-primary/20 text-primary font-mono text-[10px] font-semibold">
                          {t('extension.widgetVerified')}
                        </span>
                      </div>
                      <span className="font-mono text-[11px] text-outline">
                        {t('extension.widgetRefcat')}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-headline text-xl font-bold text-primary">82/100</span>
                    <span className="block font-mono text-[10px] text-outline">
                      {t('extension.widgetCivicScore')}
                    </span>
                  </div>
                </div>

                {/* Widget Metrics Comparison Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-3 border-b border-outline-variant">
                  <div className="p-2 rounded bg-surface-container">
                    <span className="block font-mono text-[10px] text-outline">
                      {t('extension.widgetRealSurface')}
                    </span>
                    <span className="font-body text-xs text-on-surface font-semibold">
                      {t('extension.widgetRealSurfaceVal')}
                    </span>
                    <span className="block font-mono text-[10px] text-error font-medium">
                      {t('extension.widgetRealSurfaceDiff')}
                    </span>
                  </div>
                  <div className="p-2 rounded bg-surface-container">
                    <span className="block font-mono text-[10px] text-outline">
                      {t('extension.widgetYear')}
                    </span>
                    <span className="font-body text-xs text-on-surface font-semibold">
                      {t('extension.widgetYearVal')}
                    </span>
                    <span className="block font-mono text-[10px] text-on-surface-variant">
                      {t('extension.widgetYearSub')}
                    </span>
                  </div>
                  <div className="p-2 rounded bg-surface-container">
                    <span className="block font-mono text-[10px] text-outline">
                      {t('extension.widgetNoise')}
                    </span>
                    <span className="font-body text-xs text-secondary font-semibold">
                      {t('extension.widgetNoiseVal')}
                    </span>
                    <span className="block font-mono text-[10px] text-secondary">
                      {t('extension.widgetNoiseSub')}
                    </span>
                  </div>
                  <div className="p-2 rounded bg-surface-container">
                    <span className="block font-mono text-[10px] text-outline">
                      {t('extension.widgetIncome')}
                    </span>
                    <span className="font-body text-xs text-tertiary font-semibold">
                      {t('extension.widgetIncomeVal')}
                    </span>
                    <span className="block font-mono text-[10px] text-outline">
                      {t('extension.widgetIncomeSub')}
                    </span>
                  </div>
                </div>

                {/* Legal Regulatory Bar */}
                <div className="mt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-secondary">
                    <Gavel className="w-4 h-4 shrink-0" />
                    <span className="font-mono text-xs">
                      <strong>{t('extension.widgetStressedWarning')}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-primary">
                    <Droplets className="w-4 h-4 shrink-0" />
                    <span className="font-mono text-xs">{t('extension.widgetFloodSafety')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
