import { useState, useEffect, useMemo } from 'react';
import { MunicipalitySummaryDTO } from '@openbarrio/core';
import { apiClient } from '../../services/api.client';
import {
  Building2,
  Search,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Map as MapIcon,
} from 'lucide-react';
import { useWorkspaceStore } from '../../store/workspace.store';
import { ChromeExtensionBanner } from '../../components/common/ChromeExtensionBanner';
import { Header } from '../../components/landing/Header';
import { Footer } from '../../components/landing/Footer';
import { SeoHead } from '../../components/common/SeoHead';
import { useTranslation } from '../../i18n';

export function MunicipalitiesDirectoryView() {
  const { language, t } = useTranslation();
  const [items, setItems] = useState<MunicipalitySummaryDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const setViewMode = useWorkspaceStore((s) => s.setViewMode);
  const setMunicipalitySlug = useWorkspaceStore((s) => (s as any).setMunicipalitySlug);

  useEffect(() => {
    let active = true;
    setIsLoading(true);

    apiClient
      .getMunicipalities({ limit: 100 })
      .then((res) => {
        if (active) {
          setItems(res.items);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((m) => {
      const matchesQ =
        !searchQuery ||
        m.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        m.provinceName.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        m.code.includes(searchQuery.trim());
      return matchesQ;
    });
  }, [items, searchQuery]);

  const handleSelectMunicipality = (slug: string) => {
    if (setMunicipalitySlug) {
      setMunicipalitySlug(slug);
    }
    // Update browser URL
    if (typeof window !== 'undefined') {
      window.history.pushState({ openbarrio: true }, '', `/municipio/${slug}`);
    }
    setViewMode('municipality' as any);
  };

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col bg-background text-on-surface">
      <Header onOpenMap={() => setViewMode('map')} />

      <SeoHead
        viewMode="municipios-directory"
        lang={language}
        title={
          language === 'en'
            ? 'Directory of Spanish Municipalities & Districts (INE & Housing Law) | OpenBarrio'
            : language === 'ca'
            ? 'Directori de Municipis i Districtes d’Espanya | OpenBarrio'
            : 'Directorio de Municipios y Distritos de España | OpenBarrio'
        }
        description={
          language === 'en'
            ? 'Explore income statistics (INE ADRH), Stressed Market designations, and official housing data across 8,000+ Spanish municipalities.'
            : language === 'ca'
            ? 'Explora estadístiques de renda (INE ADRH), zones tensionades i dades oficials dels més de 8.000 municipis d’Espanya.'
            : 'Explora estadísticas de renta (INE ADRH), zonas tensionadas de alquiler (Ley 12/2023) y datos oficiales de los más de 8.000 municipios de España.'
        }
      />

      <main className="flex-1 flex flex-col items-center py-8 px-4 md:px-8">
        <div className="w-full max-w-5xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setViewMode('landing')}
              className="inline-flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-on-surface transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t('common.backToHome')}</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>{t('common.exploreInGis')}</span>
            </button>
          </div>

          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5" />
              <span>{t('municipalities.directoryBadge')}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-on-surface">
              {t('municipalities.directoryTitle')}
            </h1>
            <p className="text-base text-on-surface-variant max-w-2xl mx-auto">
              {t('municipalities.directorySubtitle')}
            </p>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-surface-container-low border border-outline-variant p-3 rounded-2xl shadow-sm">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('municipalities.searchPlaceholder')}
                className="w-full pl-10 pr-4 py-2.5 bg-surface-container rounded-xl text-sm text-on-surface border border-outline-variant focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Municipalities Grid */}
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
              <span className="text-sm text-on-surface-variant">
                {t('municipalities.loadingDirectory')}
              </span>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="py-16 text-center text-on-surface-variant">
              <p className="text-base font-semibold">{t('municipalities.emptySearch')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredItems.map((m) => (
                <button
                  key={m.code}
                  onClick={() => handleSelectMunicipality(m.slug)}
                  className="p-5 rounded-2xl bg-surface-container hover:bg-surface-container-high border border-outline-variant text-left transition-all hover:border-primary/50 group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                        INE {m.code}
                      </span>
                      <span className="text-xs font-mono font-bold text-primary">
                        {m.estimatedBarrioScore} {t('common.pts')}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-on-surface group-hover:text-primary transition-colors flex items-center justify-between">
                      <span>{m.name}</span>
                      <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      {m.provinceName} · {m.autonomousCommunity}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-outline-variant/40 flex items-center justify-between text-xs">
                    <span className="text-on-surface-variant">{t('municipalities.averageIncome')}</span>
                    <span className="font-mono font-bold text-sky-400">
                      {m.averageHouseholdIncomeEur.toLocaleString('es-ES')} €
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          <ChromeExtensionBanner
            variant="in-content"
            contextText={t('extensionBanner.contextDirectory')}
          />
        </div>
      </main>

      <Footer onOpenMap={() => setViewMode('map')} />
    </div>
  );
}
