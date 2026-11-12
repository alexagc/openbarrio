import React from 'react';
import { Globe, Ban, Lock, Terminal, ShieldCheck, ArrowRight } from 'lucide-react';
import { useTranslation } from '../../i18n';
import { useWorkspaceStore } from '../../store/workspace.store';

export const CivicPrinciplesSection: React.FC = () => {
  const { t } = useTranslation();
  const setViewMode = useWorkspaceStore((s) => s.setViewMode);

  return (
    <section
      id="principios"
      className="w-full py-16 sm:py-20 lg:py-24 px-space-md sm:px-space-lg lg:px-space-xl border-b border-outline-variant/60 scroll-mt-14"
    >
      <div className="max-w-6xl w-full mx-auto text-center">
        {/* Section Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-surface-container border border-outline-variant font-mono text-xs text-primary mb-3">
          <Globe className="w-4 h-4" />
          <span>{t('principles.tag')}</span>
        </div>

        {/* Section Headline */}
        <h2 className="font-headline text-2xl sm:text-3xl font-bold text-on-surface mb-4">
          {t('principles.title')}
        </h2>

        {/* Section Subtitle */}
        <p className="font-body text-sm sm:text-base text-on-surface-variant max-w-2xl mx-auto mb-12 leading-relaxed">
          {t('principles.desc')}
        </p>

        {/* Bento Grid of 3 Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mb-12">
          {/* Principle 1 */}
          <div className="p-6 rounded-lg bg-surface-container border border-outline-variant hover:border-primary/40 transition-colors">
            <Ban className="w-7 h-7 text-primary mb-3" />
            <h3 className="font-headline text-base font-semibold text-on-surface mb-2">
              {t('principles.p1Title')}
            </h3>
            <p className="font-body text-sm text-on-surface-variant leading-relaxed">
              {t('principles.p1Desc')}
            </p>
          </div>

          {/* Principle 2 */}
          <div className="p-6 rounded-lg bg-surface-container border border-outline-variant hover:border-primary/40 transition-colors">
            <Lock className="w-7 h-7 text-primary mb-3" />
            <h3 className="font-headline text-base font-semibold text-on-surface mb-2">
              {t('principles.p2Title')}
            </h3>
            <p className="font-body text-sm text-on-surface-variant leading-relaxed">
              {t('principles.p2Desc')}
            </p>
          </div>

          {/* Principle 3 */}
          <div className="p-6 rounded-lg bg-surface-container border border-outline-variant hover:border-primary/40 transition-colors">
            <Terminal className="w-7 h-7 text-primary mb-3" />
            <h3 className="font-headline text-base font-semibold text-on-surface mb-2">
              {t('principles.p3Title')}
            </h3>
            <p className="font-body text-sm text-on-surface-variant leading-relaxed">
              {t('principles.p3Desc')}
            </p>
          </div>
        </div>

        {/* Metric Counter Bar */}
        <div className="p-6 rounded-lg bg-surface-container border border-outline-variant flex flex-wrap items-center justify-around gap-6">
          <div className="flex flex-col items-center">
            <span className="font-headline text-2xl sm:text-3xl font-bold text-primary">
              {t('principles.stat1Val')}
            </span>
            <span className="font-mono text-xs text-on-surface-variant uppercase tracking-wider mt-1">
              {t('principles.stat1Label')}
            </span>
          </div>

          <div className="h-10 w-px bg-outline-variant hidden sm:block" />

          <div className="flex flex-col items-center">
            <span className="font-headline text-2xl sm:text-3xl font-bold text-on-surface">
              {t('principles.stat2Val')}
            </span>
            <span className="font-mono text-xs text-on-surface-variant uppercase tracking-wider mt-1">
              {t('principles.stat2Label')}
            </span>
          </div>

          <div className="h-10 w-px bg-outline-variant hidden sm:block" />

          <div className="flex flex-col items-center">
            <span className="font-headline text-2xl sm:text-3xl font-bold text-tertiary">
              {t('principles.stat3Val')}
            </span>
            <span className="font-mono text-xs text-on-surface-variant uppercase tracking-wider mt-1">
              {t('principles.stat3Label')}
            </span>
          </div>
        </div>

        {/* Dedicated Transparency Catalog Access */}
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setViewMode('transparency')}
            className="inline-flex items-center gap-2 text-xs font-mono font-semibold px-4 py-2.5 rounded-lg bg-surface-container border border-outline-variant hover:border-primary text-primary transition-all shadow-sm hover:shadow-md cursor-pointer group"
          >
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>{t('principles.sourcesCatalog')}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
