import { useState, useEffect } from 'react';
import { MunicipalityDetailDTO } from '@openbarrio/core';
import { apiClient } from '../../services/api.client';
import {
  Building2,
  TrendingUp,
  MapPin,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Ruler,
  Coins,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Map as MapIcon,
} from 'lucide-react';
import { ChromeExtensionBanner } from '../../components/common/ChromeExtensionBanner';
import { Header } from '../../components/landing/Header';
import { Footer } from '../../components/landing/Footer';
import { SeoHead } from '../../components/common/SeoHead';
import { useWorkspaceStore } from '../../store/workspace.store';
import { useTranslation } from '../../i18n';

interface MunicipalityViewProps {
  slug: string;
}

export function MunicipalityView({ slug }: MunicipalityViewProps) {
  const { language, t } = useTranslation();
  const [data, setData] = useState<MunicipalityDetailDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const setViewMode = useWorkspaceStore((s) => s.setViewMode);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError(null);

    apiClient
      .getMunicipality(slug)
      .then((res) => {
        if (active) {
          setData(res);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err?.message || 'Error cargando datos del municipio');
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen min-h-[100dvh] flex flex-col bg-background text-on-surface">
        <Header onOpenMap={() => setViewMode('map')} />
        <main className="flex-1 flex flex-col items-center justify-center p-8">
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
          <p className="text-sm text-on-surface-variant font-medium">
            {t('municipalities.loadingDetail')}
          </p>
        </main>
        <Footer onOpenMap={() => setViewMode('map')} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen min-h-[100dvh] flex flex-col bg-background text-on-surface">
        <Header onOpenMap={() => setViewMode('map')} />
        <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="p-4 rounded-full bg-error-container text-on-error-container mb-4">
            <Building2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-on-surface mb-2">{t('municipalities.notFoundTitle')}</h1>
          <p className="text-sm text-on-surface-variant max-w-md mb-6">
            {t('common.notFoundDesc')}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setViewMode('municipios-directory' as any)}
              className="px-5 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant font-semibold text-sm transition-colors"
            >
              {t('common.viewMunicipalitiesDirectory')}
            </button>
            <button
              onClick={() => setViewMode('landing')}
              className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-sm shadow hover:bg-primary-hover transition-colors"
            >
              {t('common.backToHome')}
            </button>
          </div>
        </main>
        <Footer onOpenMap={() => setViewMode('map')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col bg-background text-on-surface">
      <Header onOpenMap={() => setViewMode('map')} />

      <SeoHead
        viewMode="municipality"
        lang={language}
        slug={data.slug}
        title={
          language === 'en'
            ? `${data.name} (${data.provinceName}): Real Estate Intelligence & Rental Due Diligence | OpenBarrio`
            : language === 'ca'
            ? `${data.name} (${data.provinceName}): Intel·ligència Immobiliària i Lloguer Legal | OpenBarrio`
            : `${data.name} (${data.provinceName}): Inteligencia Inmobiliaria y Due Diligence de Alquiler | OpenBarrio`
        }
        description={
          language === 'en'
            ? `Official property data for ${data.name}: INE average income (${data.averageHouseholdIncomeEur.toLocaleString('es-ES')} €), Housing Law rent cap (${data.isStressedMarket ? 'Stressed Market' : 'Standard Market'}), radon zone, and BarrioScore.`
            : language === 'ca'
            ? `Dades oficials d’habitatge per a ${data.name}: renda mitjana INE (${data.averageHouseholdIncomeEur.toLocaleString('es-ES')} €), estat de zona tensionada, radó i BarrioScore.`
            : `Consulta datos oficiales de vivienda para ${data.name}: renta media INE (${data.averageHouseholdIncomeEur.toLocaleString('es-ES')} €), tope de alquiler SERPAVI, zona de radón y BarrioScore cívico.`
        }
      />

      <main className="flex-1 flex flex-col items-center py-8 px-4 md:px-8">
        {/* Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'AdministrativeArea',
                  name: data.name,
                  alternateName: `Municipio de ${data.name}`,
                  address: {
                    '@type': 'PostalAddress',
                    addressLocality: data.name,
                    addressRegion: data.provinceName,
                    addressCountry: 'ES',
                  },
                  identifier: data.code,
                },
                {
                  '@type': 'BreadcrumbList',
                  itemListElement: [
                    {
                      '@type': 'ListItem',
                      position: 1,
                      name: 'Inicio',
                      item: 'https://openbarrio.org/',
                    },
                    {
                      '@type': 'ListItem',
                      position: 2,
                      name: 'Municipios',
                      item: 'https://openbarrio.org/municipios',
                    },
                    {
                      '@type': 'ListItem',
                      position: 3,
                      name: data.name,
                      item: `https://openbarrio.org/municipio/${data.slug}`,
                    },
                  ],
                },
              ],
            }),
          }}
        />

        <div className="w-full max-w-5xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setViewMode('municipios-directory' as any)}
              className="inline-flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-on-surface transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t('common.backToMunicipalities')}</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>{t('common.exploreInGis')}</span>
            </button>
          </div>

          {/* Breadcrumb Navigation */}
          <nav aria-label="Ruta de navegación" className="flex items-center gap-2 text-xs text-on-surface-variant">
            <button
              onClick={() => setViewMode('landing')}
              className="hover:text-primary transition-colors"
            >
              {t('common.home')}
            </button>
            <span>/</span>
            <button
              onClick={() => setViewMode('municipios-directory' as any)}
              className="hover:text-primary transition-colors"
            >
              {t('common.municipalities')}
            </button>
            <span>/</span>
            <span className="text-on-surface font-semibold">{data.name}</span>
          </nav>

          {/* Hero Section */}
          <div className="bg-gradient-to-b from-surface-container-low to-surface-container border border-outline-variant/60 rounded-3xl p-6 md:p-10 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{t('municipalities.heroBadge', { province: data.provinceName, code: data.code })}</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-on-surface tracking-tight">
                  {data.name}
                </h1>
                <p className="text-base text-on-surface-variant max-w-xl">
                  {t('municipalities.heroDesc')}
                </p>
              </div>

              {/* BarrioScore Municipal Badge */}
              <div className="shrink-0 bg-surface-container-high/90 border border-outline-variant p-5 rounded-2xl text-center min-w-[160px] shadow-lg">
                <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">
                  {t('municipalities.estimatedBarrioScore')}
                </span>
                <span className="text-4xl md:text-5xl font-black text-primary font-mono block mt-1">
                  {data.estimatedBarrioScore}
                </span>
                <span className="text-[10px] text-on-surface-variant font-semibold block mt-1">
                  {t('municipalities.scoreOutOf')}
                </span>
              </div>
            </div>
          </div>

          {/* Key Indicators Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 1. Renta Media INE */}
            <div className="bg-surface-container border border-outline-variant rounded-2xl p-6 shadow space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  {t('municipalities.householdIncomeTitle')}
                </span>
                <TrendingUp className="w-4 h-4 text-sky-400" />
              </div>
              <div className="text-3xl font-black font-mono text-sky-400">
                {data.averageHouseholdIncomeEur.toLocaleString('es-ES')} €
              </div>
              <p className="text-xs text-on-surface-variant">
                {t('municipalities.incomeDetail', {
                  percentile: data.percentileNational,
                  income: data.averagePersonIncomeEur.toLocaleString('es-ES'),
                })}
              </p>
            </div>

            {/* 2. Regulación Alquiler Ley 12/2023 */}
            <div className="bg-surface-container border border-outline-variant rounded-2xl p-6 shadow space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  {t('municipalities.rentRegimeTitle')}
                </span>
                <Scale className="w-4 h-4 text-amber-400" />
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-lg font-bold ${
                    data.isStressedMarket ? 'text-amber-400' : 'text-emerald-400'
                  }`}
                >
                  {data.isStressedMarket
                    ? t('municipalities.statusStressed')
                    : t('municipalities.statusStandard')}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant">
                {data.serpaviMedianEurM2
                  ? t('municipalities.serpaviDetail', {
                      median: data.serpaviMedianEurM2,
                      lower: data.serpaviRangeEurM2?.lower ?? 0,
                      upper: data.serpaviRangeEurM2?.upper ?? 0,
                    })
                  : t('municipalities.lauDetail')}
              </p>
            </div>

            {/* 3. Radón y Medio Ambiente */}
            <div className="bg-surface-container border border-outline-variant rounded-2xl p-6 shadow space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  {t('municipalities.radonZone')}
                </span>
                {data.radonZone === 'Zona II' ? (
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                )}
              </div>
              <div className="text-3xl font-black font-mono text-on-surface">
                {data.radonZone}
              </div>
              <p className="text-xs text-on-surface-variant">
                {data.radonZone === 'Zona 0'
                  ? t('municipalities.radonZone0Desc')
                  : t('municipalities.radonZoneIIDesc')}
              </p>
            </div>
          </div>

          {/* Micro-Tools Action Hub */}
          <div className="bg-surface-container-low border border-outline-variant/60 rounded-2xl p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg md:text-xl font-bold text-on-surface">
                  {t('municipalities.auditToolsTitle', { name: data.name })}
                </h2>
                <p className="text-xs md:text-sm text-on-surface-variant">
                  {t('municipalities.auditToolsDesc')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Tool 1 */}
              <button
                onClick={() => setViewMode('tool-surface' as any)}
                className="p-5 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant text-left transition-all hover:border-primary/50 group"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-3">
                  <Ruler className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors flex items-center justify-between">
                  <span>{t('municipalities.toolSurfaceTitle')}</span>
                  <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs text-on-surface-variant mt-1">
                  {t('municipalities.toolSurfaceActionDesc')}
                </p>
              </button>

              {/* Tool 2 */}
              <button
                onClick={() => setViewMode('tool-rent' as any)}
                className="p-5 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant text-left transition-all hover:border-amber-500/50 group"
              >
                <div className="w-10 h-10 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center mb-3">
                  <Scale className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-on-surface group-hover:text-amber-400 transition-colors flex items-center justify-between">
                  <span>{t('municipalities.toolRentTitle')}</span>
                  <ArrowRight className="w-4 h-4 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs text-on-surface-variant mt-1">
                  {t('municipalities.toolRentActionDesc', { name: data.name })}
                </p>
              </button>

              {/* Tool 3 */}
              <button
                onClick={() => setViewMode('tool-itp' as any)}
                className="p-5 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant text-left transition-all hover:border-sky-500/50 group"
              >
                <div className="w-10 h-10 rounded-lg bg-sky-500/15 text-sky-400 flex items-center justify-center mb-3">
                  <Coins className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-on-surface group-hover:text-sky-400 transition-colors flex items-center justify-between">
                  <span>{t('municipalities.toolItpTitle')}</span>
                  <ArrowRight className="w-4 h-4 text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs text-on-surface-variant mt-1">
                  {t('municipalities.toolItpActionDesc', { rate: data.itpGeneralRatePct })}
                </p>
              </button>
            </div>
          </div>

          {/* In-Content Contextual Extension Banner */}
          <ChromeExtensionBanner
            variant="in-content"
            contextText={t('extensionBanner.contextMunicipality', { name: data.name })}
          />
        </div>
      </main>

      <Footer onOpenMap={() => setViewMode('map')} />
    </div>
  );
}
