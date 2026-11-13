import { useState, useMemo } from 'react';
import {
  evaluateSurfaceDiscrepancy,
  SurfaceDiscrepancyCheckDTO,
} from '@openbarrio/core';
import {
  Ruler,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Info,
  Scale,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Map as MapIcon,
} from 'lucide-react';
import { ChromeExtensionBanner } from '../../components/common/ChromeExtensionBanner';
import { Header } from '../../components/landing/Header';
import { Footer } from '../../components/landing/Footer';
import { SeoHead } from '../../components/common/SeoHead';
import { useWorkspaceStore } from '../../store/workspace.store';
import { useTranslation } from '../../i18n';

interface SurfaceCheckerToolViewProps {
  isEmbed?: boolean;
}

export function SurfaceCheckerToolView({ isEmbed = false }: SurfaceCheckerToolViewProps) {
  const { language, t } = useTranslation();
  const setViewMode = useWorkspaceStore((s) => s.setViewMode);
  const loadAuditByRefcat = useWorkspaceStore((s) => s.loadAuditByRefcat);

  const [cadastralRef, setCadastralRef] = useState('28079A00100001');
  const [cadastralSurface, setCadastralSurface] = useState<number>(85);
  const [advertisedSurface, setAdvertisedSurface] = useState<number>(105);
  const [advertisedPrice, setAdvertisedPrice] = useState<number>(340000);

  const result: SurfaceDiscrepancyCheckDTO = useMemo(() => {
    return evaluateSurfaceDiscrepancy(
      cadastralRef || '28079A00100001',
      Number(cadastralSurface) || 0,
      Number(advertisedSurface) || 0,
      Number(advertisedPrice) || 0
    );
  }, [cadastralRef, cadastralSurface, advertisedSurface, advertisedPrice]);

  const loadPreset = (preset: {
    ref: string;
    cadSurface: number;
    advSurface: number;
    price: number;
  }) => {
    setCadastralRef(preset.ref);
    setCadastralSurface(preset.cadSurface);
    setAdvertisedSurface(preset.advSurface);
    setAdvertisedPrice(preset.price);
  };

  const handleOpenInMap = () => {
    setViewMode('map');
    loadAuditByRefcat(cadastralRef);
  };

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col bg-background text-on-surface">
      {!isEmbed && <Header onOpenMap={() => setViewMode('map')} />}

      {!isEmbed && (
        <SeoHead
          viewMode="tool-surface"
          lang={language}
          title={
            language === 'en'
              ? 'Cadastral Surface Checker vs Property Adverts | OpenBarrio'
              : language === 'ca'
              ? 'Comprovador de Metres del Cadastre vs Anunci Immobiliari | OpenBarrio'
              : 'Comprobador de Metros de Catastro vs Anuncio Inmobiliario | OpenBarrio'
          }
          description={
            language === 'en'
              ? 'Free official tool to verify advertised square meters against Spanish Cadastre (Catastro OVC). Detect overpricing and legal discrepancies >15%.'
              : language === 'ca'
              ? 'Comprova gratis si els metres quadrats anunciats coincideixen amb la superfície oficial del Cadastre. Detecta sobrepreus i discrepàncies >15%.'
              : 'Comprueba gratis si los metros cuadrados anunciados en Idealista o Fotocasa coinciden con la superficie oficial del Catastro Inmobiliario español. Detecta sobreprecio por exceso de cabida y discrepancias >15%.'
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
              name: 'Comprobador de Metros de Catastro vs Anuncio Inmobiliario',
              applicationCategory: 'RealEstateApplication',
              operatingSystem: 'Web, Cloudflare Edge',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'EUR',
              },
              description:
                'Comprueba gratis si los metros cuadrados anunciados en Idealista o Fotocasa coinciden con la superficie oficial del Catastro Inmobiliario español. Detecta sobreprecio por exceso de cabida y discrepancias >15%.',
            }),
          }}
        />

        <div className="w-full max-w-4xl mx-auto space-y-6">
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

          {!isEmbed && (
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary uppercase tracking-wider">
                <Ruler className="w-3.5 h-3.5" />
                <span>{t('surfaceChecker.badge')}</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-on-surface">
                {t('surfaceChecker.title')}
              </h1>
              <p className="text-sm md:text-base text-on-surface-variant max-w-2xl mx-auto">
                {t('surfaceChecker.subtitle')}
              </p>
            </div>
          )}

        {/* Preset Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs font-semibold text-on-surface-variant flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-primary" /> {t('surfaceChecker.presetsLabel')}
          </span>
          <button
            onClick={() =>
              loadPreset({
                ref: '28079A00100001',
                cadSurface: 82,
                advSurface: 104,
                price: 380000,
              })
            }
            className="text-xs px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant text-on-surface transition-colors"
          >
            Salamanca (+23%)
          </button>
          <button
            onClick={() =>
              loadPreset({
                ref: '41091A00100001',
                cadSurface: 75,
                advSurface: 80,
                price: 195000,
              })
            }
            className="text-xs px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant text-on-surface transition-colors"
          >
            Triana (+7%)
          </button>
          <button
            onClick={() =>
              loadPreset({
                ref: '46250A00100001',
                cadSurface: 110,
                advSurface: 110,
                price: 260000,
              })
            }
            className="text-xs px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant text-on-surface transition-colors"
          >
            Ruzafa (Exacto 100%)
          </button>
        </div>

        {/* Input Form & Realtime Results */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Inputs Card */}
          <div className="md:col-span-6 bg-surface-container-low border border-outline-variant/60 rounded-2xl p-6 shadow-md space-y-5">
            <h2 className="text-base font-bold text-on-surface flex items-center gap-2">
              <Scale className="w-4 h-4 text-primary" />
              <span>{t('surfaceChecker.sectionParams')}</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
                  {t('surfaceChecker.labelRefcat')}
                </label>
                <input
                  type="text"
                  value={cadastralRef}
                  onChange={(e) => setCadastralRef(e.target.value.toUpperCase().trim())}
                  placeholder="Ej. 28079A00100001"
                  className="w-full px-3.5 py-2.5 bg-surface-container border border-outline-variant rounded-xl text-sm font-mono text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
                    {t('surfaceChecker.labelCadastralSurface')}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={cadastralSurface}
                    onChange={(e) => setCadastralSurface(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-surface-container border border-outline-variant rounded-xl text-sm font-mono text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
                    {t('surfaceChecker.labelAdvertisedSurface')}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={advertisedSurface}
                    onChange={(e) => setAdvertisedSurface(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-surface-container border border-outline-variant rounded-xl text-sm font-mono text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
                  {t('surfaceChecker.labelAdvertisedPrice')}
                </label>
                <input
                  type="number"
                  min="0"
                  step="5000"
                  value={advertisedPrice}
                  onChange={(e) => setAdvertisedPrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-surface-container border border-outline-variant rounded-xl text-sm font-mono text-on-surface focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-on-surface-variant">
              <span>Fuente: Sede del Catastro (DGC)</span>
              <a
                href={result.catastroDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline font-semibold"
              >
                <span>Ficha oficial</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Results Analysis Card */}
          <div className="md:col-span-6 bg-surface-container border border-outline-variant rounded-2xl p-6 shadow-md space-y-5">
            <h2 className="text-base font-bold text-on-surface flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Ruler className="w-4 h-4 text-primary" />
                <span>{t('surfaceChecker.sectionDiagnosis')}</span>
              </span>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1 ${
                  result.isSignificantDiscrepancy
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                {result.isSignificantDiscrepancy ? (
                  <>
                    <AlertTriangle className="w-3 h-3" />
                    <span>{t('surfaceChecker.statusCritical')}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{t('surfaceChecker.statusNormal')}</span>
                  </>
                )}
              </span>
            </h2>

            {/* Metric Comparison Badges */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface-container-high p-4 rounded-xl border border-outline-variant/40">
                <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block">
                  {t('surfaceChecker.discrepancySurface')}
                </span>
                <span
                  className={`text-2xl font-black font-mono ${
                    result.divergenceM2 > 0 ? 'text-amber-400' : 'text-emerald-400'
                  }`}
                >
                  {result.divergenceM2 > 0 ? `+${result.divergenceM2}` : result.divergenceM2} m²
                </span>
                <span className="text-[11px] text-on-surface-variant block mt-0.5">
                  ({result.discrepancyPct > 0 ? `+${result.discrepancyPct}` : result.discrepancyPct}%)
                </span>
              </div>

              <div className="bg-surface-container-high p-4 rounded-xl border border-outline-variant/40">
                <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block">
                  {t('surfaceChecker.overpriceEstimated')}
                </span>
                <span
                  className={`text-2xl font-black font-mono ${
                    result.estimatedOverpriceEur ? 'text-amber-400' : 'text-on-surface'
                  }`}
                >
                  {result.estimatedOverpriceEur
                    ? `${result.estimatedOverpriceEur.toLocaleString('es-ES')} €`
                    : '0 €'}
                </span>
                <span className="text-[11px] text-on-surface-variant block mt-0.5">
                  a {result.advertisedEurM2 ? `${result.advertisedEurM2.toLocaleString('es-ES')} €/m²` : '-'}
                </span>
              </div>
            </div>

            {/* Legal Remedy Explanation */}
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/60 text-xs leading-relaxed space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-on-surface">
                <Info className="w-3.5 h-3.5 text-primary" />
                <span>{t('surfaceChecker.legalScope')}</span>
              </div>
              <p className="text-on-surface-variant">{result.legalRemedySummary}</p>
            </div>

            {/* CTA to Map */}
            <button
              onClick={handleOpenInMap}
              className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary-hover text-on-primary font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-colors"
            >
              <span>{t('surfaceChecker.ctaMap')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* In-Content Extension Banner */}
        {!isEmbed && (
          <ChromeExtensionBanner
            variant="in-content"
            contextText="¿Quieres ver estas alertas automáticamente en Idealista y Fotocasa?"
          />
        )}
      </div>
    </main>

    {!isEmbed && <Footer onOpenMap={() => setViewMode('map')} />}
  </div>
);
}
