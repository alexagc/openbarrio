import {
  METHODOLOGY_CHANGELOG,
  METHODOLOGY_VERSION,
  SCORING_MODIFIERS,
  SCORING_WEIGHTS_BY_TYPOLOGY,
  type PropertyTypology,
} from '@openbarrio/core';
import { Activity, ArrowLeft, BookOpen, Map as MapIcon, ShieldAlert } from 'lucide-react';
import { Header } from '../components/landing/Header';
import { Footer } from '../components/landing/Footer';
import { SeoHead } from '../components/common/SeoHead';
import { useWorkspaceStore } from '../store/workspace.store';
import { useTranslation } from '../i18n';

const TYPOLOGY_ORDER: PropertyTypology[] = [
  'RESIDENTIAL',
  'COMMERCIAL',
  'EQUIPMENT',
  'VACANT_PLOT',
  'RUSTIC',
  'INDUSTRIAL',
];

export function MethodologyView() {
  const { language, t } = useTranslation();
  const setViewMode = useWorkspaceStore((s) => s.setViewMode);

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col bg-background text-on-surface">
      <Header onOpenMap={() => setViewMode('map')} />

      <SeoHead
        viewMode="methodology"
        lang={language}
        title={t('methodology.seoTitle')}
        description={t('methodology.seoDescription')}
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
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary font-mono text-xs font-medium">
                <BookOpen className="w-4 h-4" />
                <span>{t('methodology.navLabel')}</span>
              </span>
              <span
                data-testid="methodology-version-badge"
                className="px-2.5 py-1 rounded-full bg-surface-container-high border border-outline-variant font-mono text-xs font-semibold text-on-surface"
              >
                {t('methodology.versionBadge', { version: METHODOLOGY_VERSION })}
              </span>
            </div>
            <h1 className="font-headline text-3xl sm:text-4xl font-bold text-on-surface">
              {t('methodology.title')}
            </h1>
            <p className="font-body text-sm sm:text-base text-on-surface-variant max-w-4xl leading-relaxed">
              {t('methodology.subtitle')}
            </p>
          </section>

          {/* Weights by Typology Table (live from @openbarrio/core) */}
          <section className="space-y-3">
            <h2 className="font-headline text-xl font-bold text-on-surface">
              {t('methodology.pillarsSectionTitle')}
            </h2>

            <div
              className="overflow-x-auto rounded-xl border border-outline-variant bg-surface-container shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              role="region"
              tabIndex={0}
              aria-label={t('methodology.weightsTableAria')}
            >
              <table
                data-testid="methodology-weights-table"
                className="w-full min-w-[640px] border-collapse text-left text-sm"
              >
                <thead>
                  <tr className="border-b border-outline-variant bg-surface-container-high font-mono text-xs text-on-surface-variant">
                    <th scope="col" className="px-4 py-3 font-semibold">
                      {t('methodology.colTypology')}
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold text-right tabular-nums">
                      {t('methodology.colConnectivity')}
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold text-right tabular-nums">
                      {t('methodology.colBuilding')}
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold text-right tabular-nums">
                      {t('methodology.colSocioeconomic')}
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold text-right tabular-nums">
                      {t('methodology.colEnvironmental')}
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold text-right tabular-nums">
                      {t('methodology.colUrbanPlanning')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/60 font-mono text-xs">
                  {TYPOLOGY_ORDER.map((typology) => {
                    const w = SCORING_WEIGHTS_BY_TYPOLOGY[typology];
                    return (
                      <tr key={typology} className="hover:bg-surface-container-low/60 transition-colors">
                        <th scope="row" className="px-4 py-3 font-semibold text-on-surface">
                          {typology}
                        </th>
                        <td className="px-4 py-3 text-right tabular-nums text-on-surface">
                          {Math.round(w.connectivity * 100)}%
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums text-on-surface">
                          {Math.round(w.building * 100)}%
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums text-on-surface">
                          {Math.round(w.socioeconomic * 100)}%
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums text-on-surface">
                          {Math.round(w.environmental * 100)}%
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums text-on-surface">
                          {Math.round(w.urbanPlanning * 100)}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Modifiers Table (live from @openbarrio/core) */}
          <section className="space-y-3">
            <h2 className="font-headline text-xl font-bold text-on-surface">
              {t('methodology.modifiersSectionTitle')}
            </h2>

            <div
              className="overflow-x-auto rounded-xl border border-outline-variant bg-surface-container shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              role="region"
              tabIndex={0}
              aria-label={t('methodology.modifiersTableAria')}
            >
              <table
                data-testid="methodology-modifiers-table"
                className="w-full min-w-[640px] border-collapse text-left text-sm"
              >
                <thead>
                  <tr className="border-b border-outline-variant bg-surface-container-high font-mono text-xs text-on-surface-variant">
                    <th scope="col" className="px-4 py-3 font-semibold">
                      {t('methodology.colFactor')}
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold text-right tabular-nums">
                      {t('methodology.colImpact')}
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      {t('methodology.colRule')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/60 text-xs">
                  {SCORING_MODIFIERS.map((mod) => (
                    <tr key={mod.id} className="hover:bg-surface-container-low/60 transition-colors">
                      <th scope="row" className="px-4 py-3 font-mono font-semibold text-on-surface">
                        <div>{mod.id}</div>
                        <div className="text-[11px] font-normal text-on-surface-variant">{mod.pillar}</div>
                      </th>
                      <td
                        className={`px-4 py-3 font-mono font-bold text-right tabular-nums ${
                          mod.points > 0 ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      >
                        {mod.signedLabel}
                      </td>
                      <td className="px-4 py-3 text-on-surface-variant">{mod.rule}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Missing data policy & Changelog */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section className="p-5 rounded-xl bg-surface-container border border-outline-variant space-y-3">
              <h2 className="font-headline text-lg font-bold text-on-surface flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
                <span>{t('methodology.missingDataTitle')}</span>
              </h2>
              <ul className="space-y-2 text-xs sm:text-sm text-on-surface-variant leading-relaxed list-disc pl-5">
                <li>{t('methodology.missingDataRule1')}</li>
                <li>{t('methodology.missingDataRule2')}</li>
                <li>{t('methodology.missingDataRule3')}</li>
              </ul>
            </section>

            <section className="p-5 rounded-xl bg-surface-container border border-outline-variant space-y-3">
              <h2 className="font-headline text-lg font-bold text-on-surface">
                {t('methodology.changelogTitle')}
              </h2>
              <ul className="space-y-3 text-xs">
                {METHODOLOGY_CHANGELOG.map((entry) => (
                  <li
                    key={entry.version}
                    className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/60 space-y-1"
                  >
                    <div className="flex items-center justify-between font-mono font-semibold text-primary">
                      <span>v{entry.version}</span>
                      <span className="text-on-surface-variant">{entry.date}</span>
                    </div>
                    <p className="text-on-surface-variant leading-relaxed">{entry.summary}</p>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </main>

      <Footer onOpenMap={() => setViewMode('map')} />
    </div>
  );
}
