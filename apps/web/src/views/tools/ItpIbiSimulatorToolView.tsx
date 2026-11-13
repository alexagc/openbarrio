import { useState, useMemo } from 'react';
import {
  calculateFiscalEstimate,
  REGIONAL_ITP_RATES,
  FiscalEstimateDTO,
} from '@openbarrio/core';
import {
  Coins,
  Building2,
  Percent,
  Info,
  ArrowLeft,
  Map as MapIcon,
} from 'lucide-react';
import { ChromeExtensionBanner } from '../../components/common/ChromeExtensionBanner';
import { Header } from '../../components/landing/Header';
import { Footer } from '../../components/landing/Footer';
import { SeoHead } from '../../components/common/SeoHead';
import { useWorkspaceStore } from '../../store/workspace.store';
import { useTranslation } from '../../i18n';

interface ItpIbiSimulatorToolViewProps {
  isEmbed?: boolean;
}

export function ItpIbiSimulatorToolView({ isEmbed = false }: ItpIbiSimulatorToolViewProps) {
  const { language, t } = useTranslation();
  const setViewMode = useWorkspaceStore((s) => s.setViewMode);

  const [provinceCode, setProvinceCode] = useState('28'); // Madrid default
  const [purchasePrice, setPurchasePrice] = useState<number>(290000);
  const [surfaceM2, setSurfaceM2] = useState<number>(85);
  const [constructionYear, setConstructionYear] = useState<number>(1985);
  const [buyerProfile, setBuyerProfile] = useState<'general' | 'young' | 'large_family'>('general');

  const selectedCommunity = REGIONAL_ITP_RATES[provinceCode] || {
    community: 'Comunidad de Madrid',
    ratePct: 6.0,
  };

  // Adjust ITP rate for reduced brackets (e.g. youth <35 or large family)
  const effectiveItpRate = useMemo(() => {
    let rate = selectedCommunity.ratePct;
    if (buyerProfile === 'young') {
      rate = Math.max(3.0, rate - 2.0); // Concession rate for youth
    } else if (buyerProfile === 'large_family') {
      rate = Math.max(3.0, rate - 3.0); // Concession rate for large families
    }
    return rate;
  }, [selectedCommunity, buyerProfile]);

  const fiscalResult: FiscalEstimateDTO = useMemo(() => {
    const res = calculateFiscalEstimate({
      cadastralReference: `${provinceCode}000A00100001`,
      provinceCode,
      municipalityName: selectedCommunity.community,
      purchasePriceEur: Number(purchasePrice) || 0,
      cadastralSurfaceM2: Number(surfaceM2) || 80,
      constructionYear: Number(constructionYear) || 1980,
    });
    // Override ITP quota if reduced bracket
    const quota = Math.round(((Number(purchasePrice) || 0) * effectiveItpRate) / 100);
    return {
      ...res,
      itpRatePct: effectiveItpRate,
      itpQuotaEur: quota,
    };
  }, [provinceCode, selectedCommunity, purchasePrice, surfaceM2, constructionYear, effectiveItpRate]);

  // Estimated Notary & Land Registry fees based on official Royal Decrees 1426/1989 and 1427/1989
  const notaryFeesEst = useMemo(() => {
    const price = Number(purchasePrice) || 0;
    return Math.round(650 + price * 0.001);
  }, [purchasePrice]);

  const registryFeesEst = useMemo(() => {
    const price = Number(purchasePrice) || 0;
    return Math.round(400 + price * 0.0006);
  }, [purchasePrice]);

  const totalAcquisitionCost = useMemo(() => {
    return (
      (Number(purchasePrice) || 0) +
      fiscalResult.itpQuotaEur +
      notaryFeesEst +
      registryFeesEst
    );
  }, [purchasePrice, fiscalResult.itpQuotaEur, notaryFeesEst, registryFeesEst]);

  // Province dropdown options
  const provinceOptions = [
    { code: '28', label: 'Madrid (6.0%)' },
    { code: '08', label: 'Barcelona / Cataluña (10.0%)' },
    { code: '46', label: 'Valencia (10.0%)' },
    { code: '41', label: 'Sevilla / Andalucía (7.0%)' },
    { code: '50', label: 'Zaragoza / Aragón (8.0%)' },
    { code: '48', label: 'Bizkaia / Euskadi (4.0%)' },
    { code: '20', label: 'Gipuzkoa / Euskadi (4.0%)' },
    { code: '01', label: 'Araba / Euskadi (4.0%)' },
    { code: '31', label: 'Navarra (6.0%)' },
    { code: '07', label: 'Illes Balears (8.0%)' },
    { code: '35', label: 'Canarias (6.5%)' },
    { code: '15', label: 'Galicia (9.0%)' },
    { code: '33', label: 'Asturias (8.0%)' },
    { code: '39', label: 'Cantabria (8.0%)' },
    { code: '47', label: 'Castilla y León (8.0%)' },
    { code: '45', label: 'Castilla-La Mancha (9.0%)' },
    { code: '30', label: 'Murcia (8.0%)' },
    { code: '06', label: 'Extremadura (8.0%)' },
    { code: '26', label: 'La Rioja (7.0%)' },
  ];

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col bg-background text-on-surface">
      {!isEmbed && <Header onOpenMap={() => setViewMode('map')} />}

      {!isEmbed && (
        <SeoHead
          viewMode="tool-itp"
          lang={language}
          title={
            language === 'en'
              ? 'Spanish Property Tax & Acquisition Simulator (ITP & IBI) | OpenBarrio'
              : language === 'ca'
              ? 'Simulador Fiscal de Compravenda: ITP i IBI per Comunitat Autònoma | OpenBarrio'
              : 'Simulador Fiscal de Compraventa: ITP e IBI por Comunidad Autónoma | OpenBarrio'
          }
          description={
            language === 'en'
              ? 'Free official tax calculator for Spanish property acquisition: Property Transfer Tax (ITP) for all 17 regions, notary fees, and estimated annual IBI council tax.'
              : language === 'ca'
              ? 'Simulador gratuït de l’Impost de Transmissions Patrimonials (ITP) per a la compra d’habitatge a les 17 Comunitats Autònomes, aranzels notarials i IBI anual.'
              : 'Simulador gratuito del Impuesto de Transmisiones Patrimoniales (ITP) para compra de vivienda en las 17 Comunidades Autónomas, aranceles notariales y estimación del IBI anual.'
          }
        />
      )}

      <main className={`flex-1 flex flex-col items-center ${isEmbed ? 'p-4' : 'py-8 px-4 md:px-8'}`}>
        {/* Schema.org FinancialProduct JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FinancialProduct',
              name: 'Simulador Fiscal de Compraventa: ITP e IBI por Comunidad Autónoma',
              provider: {
                '@type': 'Organization',
                name: 'OpenBarrio',
              },
              description:
                'Simulador gratuito del Impuesto de Transmisiones Patrimoniales (ITP) para compra de vivienda en las 17 Comunidades Autónomas, aranceles notariales y estimación del IBI anual.',
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

          {!isEmbed && (
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-xs font-bold text-sky-400 uppercase tracking-wider">
                <Coins className="w-3.5 h-3.5" />
                <span>{t('itpSimulator.badge')}</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-on-surface">
                {t('itpSimulator.title')}
              </h1>
              <p className="text-base md:text-lg text-on-surface-variant max-w-2xl mx-auto">
                {t('itpSimulator.subtitle')}
              </p>
            </div>
          )}

        {/* Interface Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Inputs Card */}
          <div className="md:col-span-6 bg-surface-container-low border border-outline-variant/60 rounded-2xl p-6 shadow-md space-y-5">
            <h2 className="text-base font-bold text-on-surface flex items-center gap-2">
              <Building2 className="w-4 h-4 text-sky-400" />
              <span>1. {t('itpSimulator.breakdownTitle')}</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
                  {t('itpSimulator.labelProvince')}
                </label>
                <select
                  value={provinceCode}
                  onChange={(e) => setProvinceCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-surface-container border border-outline-variant rounded-xl text-sm font-semibold text-on-surface focus:outline-none focus:border-primary"
                >
                  {provinceOptions.map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
                  {t('itpSimulator.labelPrice')}
                </label>
                <input
                  type="number"
                  min="10000"
                  step="5000"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-surface-container border border-outline-variant rounded-xl text-sm font-mono text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
                    {t('itpSimulator.labelSurface')}
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
                    {t('itpSimulator.labelYear')}
                  </label>
                  <input
                    type="number"
                    min="1800"
                    max="2026"
                    value={constructionYear}
                    onChange={(e) => setConstructionYear(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-surface-container border border-outline-variant rounded-xl text-sm font-mono text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
                  {t('itpSimulator.labelBuyerProfile')}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setBuyerProfile('general')}
                    className={`py-2 px-2 text-xs font-semibold rounded-lg border text-center transition-colors ${
                      buyerProfile === 'general'
                        ? 'bg-sky-500/20 text-sky-400 border-sky-500/50'
                        : 'bg-surface-container border-outline-variant text-on-surface-variant'
                    }`}
                  >
                    {t('itpSimulator.profileGeneral')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setBuyerProfile('young')}
                    className={`py-2 px-2 text-xs font-semibold rounded-lg border text-center transition-colors ${
                      buyerProfile === 'young'
                        ? 'bg-sky-500/20 text-sky-400 border-sky-500/50'
                        : 'bg-surface-container border-outline-variant text-on-surface-variant'
                    }`}
                  >
                    {t('itpSimulator.profileYoung')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setBuyerProfile('large_family')}
                    className={`py-2 px-2 text-xs font-semibold rounded-lg border text-center transition-colors ${
                      buyerProfile === 'large_family'
                        ? 'bg-sky-500/20 text-sky-400 border-sky-500/50'
                        : 'bg-surface-container border-outline-variant text-on-surface-variant'
                    }`}
                  >
                    {t('itpSimulator.profileLargeFamily')}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Breakdown Card */}
          <div className="md:col-span-6 bg-surface-container border border-outline-variant rounded-2xl p-6 shadow-md space-y-5">
            <h2 className="text-base font-bold text-on-surface flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Percent className="w-4 h-4 text-sky-400" />
                <span>{t('itpSimulator.breakdownTitle')}</span>
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-sky-500/15 text-sky-400 font-bold border border-sky-500/30">
                ITP: {fiscalResult.itpRatePct}%
              </span>
            </h2>

            {/* Total Acquisition Summary */}
            <div className="bg-surface-container-high p-5 rounded-xl border border-outline-variant/60 space-y-1">
              <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block">
                {t('itpSimulator.totalCost')}
              </span>
              <div className="text-3xl md:text-4xl font-black font-mono text-sky-400">
                {totalAcquisitionCost.toLocaleString('es-ES')} €
              </div>
              <span className="text-xs text-on-surface-variant block">
                Precio Inmueble + {((totalAcquisitionCost - purchasePrice) / purchasePrice * 100).toFixed(1)}% en gastos asociados
              </span>
            </div>

            {/* Detailed Rows */}
            <div className="space-y-2 text-xs divide-y divide-outline-variant/30">
              <div className="flex justify-between items-center pt-2">
                <span className="text-on-surface-variant">{t('itpSimulator.itpQuota')} ({fiscalResult.itpRatePct}%):</span>
                <span className="font-mono font-bold text-on-surface">
                  {fiscalResult.itpQuotaEur.toLocaleString('es-ES')} €
                </span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-on-surface-variant">{t('itpSimulator.notaryFees')}:</span>
                <span className="font-mono font-bold text-on-surface">
                  {notaryFeesEst.toLocaleString('es-ES')} €
                </span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-on-surface-variant">{t('itpSimulator.registryFees')}:</span>
                <span className="font-mono font-bold text-on-surface">
                  {registryFeesEst.toLocaleString('es-ES')} €
                </span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-primary font-semibold">{t('itpSimulator.annualIbi')}:</span>
                <span className="font-mono font-bold text-primary">
                  ~{fiscalResult.ibiEstimatedAnnualQuotaEur.toLocaleString('es-ES')} {t('common.eurPerYear')}
                </span>
              </div>
            </div>

            {/* Info Box */}
            <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/60 text-[11px] leading-relaxed text-on-surface-variant flex items-start gap-2">
              <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <span>{t('itpSimulator.fiscalNote')}</span>
            </div>
          </div>
        </div>

        {/* In-Content Extension Banner */}
        {!isEmbed && (
          <ChromeExtensionBanner
            variant="in-content"
            contextText={t('extensionBanner.contextFiscal')}
          />
        )}
      </div>
    </main>

    {!isEmbed && <Footer onOpenMap={() => setViewMode('map')} />}
  </div>
);
}
