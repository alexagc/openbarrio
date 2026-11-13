import { useState, useMemo } from 'react';
import { calculateLegalRentCap, RentLegalCheckDTO } from '@openbarrio/core';
import {
  Scale,
  Building,
  CheckCircle2,
  Sparkles,
  Info,
  ShieldAlert,
  ArrowLeft,
  Map as MapIcon,
} from 'lucide-react';
import { ChromeExtensionBanner } from '../../components/common/ChromeExtensionBanner';
import { Header } from '../../components/landing/Header';
import { Footer } from '../../components/landing/Footer';
import { SeoHead } from '../../components/common/SeoHead';
import { useWorkspaceStore } from '../../store/workspace.store';
import { useTranslation } from '../../i18n';

interface RentLegalCalculatorToolViewProps {
  isEmbed?: boolean;
}

export function RentLegalCalculatorToolView({ isEmbed = false }: RentLegalCalculatorToolViewProps) {
  const { language, t } = useTranslation();
  const setViewMode = useWorkspaceStore((s) => s.setViewMode);

  const [municipalityName, setMunicipalityName] = useState('Barcelona');
  const [isStressed, setIsStressed] = useState(true);
  const [surfaceM2, setSurfaceM2] = useState<number>(75);
  const [isGrandTenant, setIsGrandTenant] = useState(false);
  const [previousRent, setPreviousRent] = useState<number>(920);
  const [hasCeeImprovement, setHasCeeImprovement] = useState(false);

  const result: RentLegalCheckDTO = useMemo(() => {
    return calculateLegalRentCap({
      municipalityName,
      isStressedMarket: isStressed,
      surfaceM2: Number(surfaceM2) || 0,
      isGrandTenant,
      previousContractRentEur: previousRent > 0 ? previousRent : undefined,
      hasCeeImprovement,
      serpaviLowerEurM2: isStressed ? 11.5 : 8.5,
      serpaviMedianEurM2: isStressed ? 14.2 : 10.5,
      serpaviUpperEurM2: isStressed ? 17.0 : 13.0,
    });
  }, [municipalityName, isStressed, surfaceM2, isGrandTenant, previousRent, hasCeeImprovement]);

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col bg-background text-on-surface">
      {!isEmbed && <Header onOpenMap={() => setViewMode('map')} />}

      {!isEmbed && (
        <SeoHead
          viewMode="tool-rent"
          lang={language}
          title={
            language === 'en'
              ? 'Spanish Legal Rent Cap Calculator (Housing Law 12/2023) | OpenBarrio'
              : language === 'ca'
              ? 'Calculadora de Lloguer Legal i Límit de Renda (Llei 12/2023) | OpenBarrio'
              : 'Calculadora de Alquiler Legal y Límite de Renta (Ley 12/2023) | OpenBarrio'
          }
          description={
            language === 'en'
              ? 'Calculate statutory rent ceiling under Spanish Housing Law 12/2023 and official SERPAVI price index in Stressed Markets.'
              : language === 'ca'
              ? 'Calcula el preu màxim legal del lloguer sota la Llei d’Habitatge 12/2023 i el Sistema Estatal de Referència (SERPAVI).'
              : 'Calcula el precio máximo legal del alquiler bajo la Ley de Vivienda 12/2023 y el Sistema Estatal de Referencia (SERPAVI). Consulta límites para grandes tenedores y zonas tensionadas.'
          }
        />
      )}

      <main className={`flex-1 flex flex-col items-center ${isEmbed ? 'p-4' : 'py-8 px-4 md:px-8'}`}>
        {/* Schema.org SoftwareApplication JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'Calculadora de Alquiler Legal y Límite de Renta (Ley 12/2023)',
              applicationCategory: 'FinanceApplication',
              operatingSystem: 'Web, Cloudflare Edge',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'EUR',
              },
              description:
                'Calcula el precio máximo legal del alquiler bajo la Ley de Vivienda 12/2023 y el Sistema Estatal de Referencia (SERPAVI). Consulta límites para grandes tenedores y zonas tensionadas.',
            }),
          }}
        />

        <div className="w-full max-w-4xl mx-auto space-y-8">
          {!isEmbed && (
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setViewMode('landing')}
                className="inline-flex items-center gap-2 text-xs font-mono text-primary hover:text-primary-container px-3 py-1.5 rounded bg-surface-container border border-outline-variant transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t('common.backToHome')}</span>
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
          )}

          {/* Hero Header */}
          {!isEmbed && (
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <Scale className="w-3.5 h-3.5" />
                <span>{t('rentCalculator.badge')}</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-on-surface">
                {t('rentCalculator.title')}
              </h1>
              <p className="text-base md:text-lg text-on-surface-variant max-w-2xl mx-auto">
                {t('rentCalculator.subtitle')}
              </p>
            </div>
          )}

        {/* Quick presets */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs font-semibold text-on-surface-variant flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" /> {t('rentCalculator.presetsLabel')}
          </span>
          <button
            onClick={() => {
              setMunicipalityName('Barcelona');
              setIsStressed(true);
              setIsGrandTenant(false);
              setPreviousRent(950);
              setSurfaceM2(70);
            }}
            className="text-xs px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant text-on-surface transition-colors"
          >
            {t('rentCalculator.presetBarcelona')}
          </button>
          <button
            onClick={() => {
              setMunicipalityName('Madrid');
              setIsStressed(false);
              setIsGrandTenant(false);
              setPreviousRent(1100);
              setSurfaceM2(65);
            }}
            className="text-xs px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant text-on-surface transition-colors"
          >
            {t('rentCalculator.presetMadrid')}
          </button>
          <button
            onClick={() => {
              setMunicipalityName('Barcelona');
              setIsStressed(true);
              setIsGrandTenant(true);
              setPreviousRent(1300);
              setSurfaceM2(85);
            }}
            className="text-xs px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant text-on-surface transition-colors"
          >
            {t('rentCalculator.presetGrandTenant')}
          </button>
        </div>

        {/* Main Interface Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Inputs Card */}
          <div className="md:col-span-6 bg-surface-container-low border border-outline-variant/60 rounded-2xl p-6 shadow-md space-y-5">
            <h2 className="text-base font-bold text-on-surface flex items-center gap-2">
              <Building className="w-4 h-4 text-amber-400" />
              <span>{t('rentCalculator.sectionParams')}</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
                  {t('rentCalculator.labelMunicipality')}
                </label>
                <input
                  type="text"
                  value={municipalityName}
                  onChange={(e) => setMunicipalityName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-surface-container border border-outline-variant rounded-xl text-sm font-semibold text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
                  {t('rentCalculator.labelSurface')}
                </label>
                <input
                  type="number"
                  min="1"
                  value={surfaceM2}
                  onChange={(e) => setSurfaceM2(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-surface-container border border-outline-variant rounded-xl text-sm font-mono text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
                  {t('rentCalculator.labelPreviousRent')}
                </label>
                <input
                  type="number"
                  min="0"
                  value={previousRent}
                  onChange={(e) => setPreviousRent(Number(e.target.value))}
                  placeholder="0 si es vivienda nueva o sin contrato previo"
                  className="w-full px-3.5 py-2.5 bg-surface-container border border-outline-variant rounded-xl text-sm font-mono text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              {/* Toggles */}
              <div className="pt-2 space-y-3 border-t border-outline-variant/40">
                <label className="flex items-center justify-between text-xs font-semibold text-on-surface cursor-pointer select-none">
                  <span>{t('rentCalculator.labelStressedMarket')}</span>
                  <input
                    type="checkbox"
                    checked={isStressed}
                    onChange={(e) => setIsStressed(e.target.checked)}
                    className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
                  />
                </label>

                <label className="flex items-center justify-between text-xs font-semibold text-on-surface cursor-pointer select-none">
                  <span>{t('rentCalculator.labelGrandTenant')}</span>
                  <input
                    type="checkbox"
                    checked={isGrandTenant}
                    onChange={(e) => setIsGrandTenant(e.target.checked)}
                    className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
                  />
                </label>

                <label className="flex items-center justify-between text-xs font-semibold text-on-surface cursor-pointer select-none">
                  <span>{t('rentCalculator.labelCeeImprovement')}</span>
                  <input
                    type="checkbox"
                    checked={hasCeeImprovement}
                    onChange={(e) => setHasCeeImprovement(e.target.checked)}
                    className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Results Analysis Card */}
          <div className="md:col-span-6 bg-surface-container border border-outline-variant rounded-2xl p-6 shadow-md space-y-5">
            <h2 className="text-base font-bold text-on-surface flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-amber-400" />
                <span>{t('rentCalculator.sectionResults')}</span>
              </span>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1 ${
                  isStressed
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                {isStressed ? (
                  <>
                    <ShieldAlert className="w-3 h-3" />
                    <span>{t('municipalities.statusStressed')}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{t('municipalities.statusStandard')}</span>
                  </>
                )}
              </span>
            </h2>

            {/* Ceiling Card */}
            <div className="bg-surface-container-high p-5 rounded-xl border border-outline-variant/60 space-y-1">
              <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block">
                {t('rentCalculator.legalCap')}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl md:text-4xl font-black font-mono text-amber-400">
                  {result.legalMaxRentEur.toLocaleString('es-ES')} €
                </span>
                <span className="text-sm font-semibold text-on-surface-variant">/ mes</span>
              </div>
              <span className="text-xs text-primary font-bold block pt-1">
                {t('rentCalculator.applicableRegime')}: {result.clauseLegalType}
              </span>
            </div>

            {/* SERPAVI Range */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block">
                {t('rentCalculator.serpaviRange')}
              </span>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/40">
                  <span className="text-[10px] text-on-surface-variant uppercase font-semibold block">Límite Inferior</span>
                  <span className="text-sm font-mono font-bold text-on-surface">{result.monthlyBenchmarkRangeEur.lower} €</span>
                  <span className="text-[10px] text-on-surface-variant block">{result.benchmarkEurM2.lower} €/m²</span>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-container-high border border-outline-variant/80">
                  <span className="text-[10px] text-primary uppercase font-bold block">Mediana</span>
                  <span className="text-sm font-mono font-bold text-primary">{result.monthlyBenchmarkRangeEur.median} €</span>
                  <span className="text-[10px] text-on-surface-variant block">{result.benchmarkEurM2.median} €/m²</span>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/40">
                  <span className="text-[10px] text-on-surface-variant uppercase font-semibold block">Límite Superior</span>
                  <span className="text-sm font-mono font-bold text-on-surface">{result.monthlyBenchmarkRangeEur.upper} €</span>
                  <span className="text-[10px] text-on-surface-variant block">{result.benchmarkEurM2.upper} €/m²</span>
                </div>
              </div>
            </div>

            {/* Legal Explanation */}
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/60 text-xs leading-relaxed space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-on-surface">
                <Info className="w-3.5 h-3.5 text-amber-400" />
                <span>{t('rentCalculator.legalOpinion')}</span>
              </div>
              <ul className="list-disc pl-4 space-y-1 text-on-surface-variant">
                {result.explanatoryNotes.map((note, i) => (
                  <li key={i}>{note}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* In-Content Extension Banner */}
        {!isEmbed && (
          <ChromeExtensionBanner
            variant="in-content"
            contextText={t('extensionBanner.contextRent')}
          />
        )}
      </div>
    </main>

    {!isEmbed && <Footer onOpenMap={() => setViewMode('map')} />}
  </div>
);
}
