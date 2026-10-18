import React from 'react';
import { Building2, BarChart3, AlertTriangle, Scale, Landmark } from 'lucide-react';
import { useTranslation } from '../../i18n';

export const PillarsSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section
      id="fuentes"
      className="py-16 px-space-lg lg:px-space-xl bg-surface-container-low border-b border-outline-variant scroll-mt-14"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-primary font-mono text-xs mb-2">
              <Landmark className="w-4 h-4" />
              <span>{t('pillars.tag')}</span>
            </div>
            <h2 className="font-headline text-2xl sm:text-3xl font-bold text-on-surface">
              {t('pillars.title')}
            </h2>
          </div>
          <p className="font-body text-sm text-on-surface-variant max-w-md">
            {t('pillars.subtitle')}
          </p>
        </div>

        {/* 4-Pillar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pillar 1: Catastro */}
          <div className="p-6 rounded-lg bg-surface-container border border-outline-variant flex flex-col justify-between hover:border-primary/50 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded bg-surface-container-high border border-outline-variant flex items-center justify-center text-primary">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-1 rounded bg-primary/10 border border-primary/30 font-mono text-xs text-primary font-medium">
                  {t('pillars.catastro.badge')}
                </span>
              </div>
              <h3 className="font-headline text-lg font-semibold text-on-surface mb-2">
                {t('pillars.catastro.title')}
              </h3>
              <p className="font-mono text-xs text-outline mb-3 uppercase tracking-wide">
                {t('pillars.catastro.agency')}
              </p>
              <p className="font-body text-sm text-on-surface-variant mb-4 leading-relaxed">
                {t('pillars.catastro.desc')}
              </p>
            </div>
            <div className="pt-4 border-t border-outline-variant flex items-center justify-between font-mono text-xs text-on-surface-variant">
              <span>{t('pillars.catastro.layer')}</span>
              <span className="text-primary font-semibold">
                {t('pillars.catastro.protocol')}
              </span>
            </div>
          </div>

          {/* Pillar 2: INE */}
          <div className="p-6 rounded-lg bg-surface-container border border-outline-variant flex flex-col justify-between hover:border-tertiary/50 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded bg-surface-container-high border border-outline-variant flex items-center justify-center text-tertiary">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-1 rounded bg-tertiary/10 border border-tertiary/30 font-mono text-xs text-tertiary font-medium">
                  {t('pillars.ine.badge')}
                </span>
              </div>
              <h3 className="font-headline text-lg font-semibold text-on-surface mb-2">
                {t('pillars.ine.title')}
              </h3>
              <p className="font-mono text-xs text-outline mb-3 uppercase tracking-wide">
                {t('pillars.ine.agency')}
              </p>
              <p className="font-body text-sm text-on-surface-variant mb-4 leading-relaxed">
                {t('pillars.ine.desc')}
              </p>
            </div>
            <div className="pt-4 border-t border-outline-variant flex items-center justify-between font-mono text-xs text-on-surface-variant">
              <span>{t('pillars.ine.layer')}</span>
              <span className="text-tertiary font-semibold">
                {t('pillars.ine.protocol')}
              </span>
            </div>
          </div>

          {/* Pillar 3: Ruido & SNCZI */}
          <div className="p-6 rounded-lg bg-surface-container border border-outline-variant flex flex-col justify-between hover:border-secondary/50 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded bg-surface-container-high border border-outline-variant flex items-center justify-center text-secondary">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-1 rounded bg-secondary-container/20 border border-secondary/30 font-mono text-xs text-secondary font-medium">
                  {t('pillars.environmental.badge')}
                </span>
              </div>
              <h3 className="font-headline text-lg font-semibold text-on-surface mb-2">
                {t('pillars.environmental.title')}
              </h3>
              <p className="font-mono text-xs text-outline mb-3 uppercase tracking-wide">
                {t('pillars.environmental.agency')}
              </p>
              <p className="font-body text-sm text-on-surface-variant mb-4 leading-relaxed">
                {t('pillars.environmental.desc')}
              </p>
            </div>
            <div className="pt-4 border-t border-outline-variant flex items-center justify-between font-mono text-xs text-on-surface-variant">
              <span>{t('pillars.environmental.layer')}</span>
              <span className="text-secondary font-semibold">
                {t('pillars.environmental.protocol')}
              </span>
            </div>
          </div>

          {/* Pillar 4: SERPAVI */}
          <div className="p-6 rounded-lg bg-surface-container border border-outline-variant flex flex-col justify-between hover:border-primary/50 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded bg-surface-container-high border border-outline-variant flex items-center justify-center text-primary">
                  <Scale className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-1 rounded bg-primary/10 border border-primary/30 font-mono text-xs text-primary font-medium">
                  {t('pillars.serpavi.badge')}
                </span>
              </div>
              <h3 className="font-headline text-lg font-semibold text-on-surface mb-2">
                {t('pillars.serpavi.title')}
              </h3>
              <p className="font-mono text-xs text-outline mb-3 uppercase tracking-wide">
                {t('pillars.serpavi.agency')}
              </p>
              <p className="font-body text-sm text-on-surface-variant mb-4 leading-relaxed">
                {t('pillars.serpavi.desc')}
              </p>
            </div>
            <div className="pt-4 border-t border-outline-variant flex items-center justify-between font-mono text-xs text-on-surface-variant">
              <span>{t('pillars.serpavi.layer')}</span>
              <span className="text-primary font-semibold">
                {t('pillars.serpavi.protocol')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
