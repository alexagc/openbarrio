import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, MapPin, Tag, Search, Zap, BarChart3, Building, Code2 } from 'lucide-react';
import { useTranslation } from '../../i18n';
import { apiClient } from '../../services/api.client';

interface HeroSectionProps {
  onAudit: (query: string, mode: 'address' | 'refcat', coords?: { lat: number; lon: number }) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onAudit }) => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'address' | 'refcat'>('address');
  const [searchValue, setSearchValue] = useState<string>('');
  const [suggestions, setSuggestions] = useState<
    Array<{ label: string; lat: number; lon: number; refcat?: string }>
  >([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isFocusedRef = useRef(false);

  // Close dropdown on outside click or touch
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        isFocusedRef.current = false;
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Debounced address search
  useEffect(() => {
    if (mode !== 'address') {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const trimmed = searchValue.trim();
    if (trimmed.length < 3) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const results = await apiClient.searchAddress(trimmed);
      setSuggestions(results);
      setIsSearching(false);
      if (isFocusedRef.current && results.length > 0) {
        setShowDropdown(true);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchValue, mode]);

  const handleModeChange = (newMode: 'address' | 'refcat') => {
    setMode(newMode);
    setSearchValue('');
    setSuggestions([]);
    setShowDropdown(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = searchValue.trim();
    if (!raw) return;

    // Auto-detect cadastral reference format even if submitted in address mode
    const cleanRefcat = raw.replace(/[\s\-_.]/g, '').toUpperCase();
    if (/^[0-9A-Z]{14,20}$/.test(cleanRefcat)) {
      onAudit(cleanRefcat, 'refcat');
      return;
    }

    // If suggestions are available, use the best match with its coordinates
    if (suggestions.length > 0) {
      const best = suggestions[0];
      const coords =
        typeof best.lat === 'number' && typeof best.lon === 'number'
          ? { lat: best.lat, lon: best.lon }
          : undefined;
      if (best.refcat) {
        onAudit(best.refcat, 'refcat', coords);
      } else {
        onAudit(best.label, 'address', coords);
      }
      return;
    }

    onAudit(raw, mode);
  };

  const handleExampleClick = (exampleQuery: string, exampleMode: 'address' | 'refcat' = 'address') => {
    setMode(exampleMode);
    setSearchValue(exampleQuery);
    onAudit(exampleQuery, exampleMode);
  };

  return (
    <section className="relative pt-12 pb-16 px-space-lg lg:px-space-xl border-b border-outline-variant bg-surface-container-lowest gis-grid-pattern overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center text-center">
        {/* Verification Shield Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-surface-container border border-primary/30 mb-6 shadow-xs">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span className="font-mono text-xs text-primary tracking-wide">
            {t('hero.badge')}
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="font-headline text-3xl sm:text-4xl lg:text-[42px] lg:leading-[48px] text-on-surface font-bold tracking-tight max-w-4xl mb-4">
          {t('hero.title')}
        </h1>

        {/* Subtitle */}
        <p className="font-body text-sm sm:text-base text-on-surface-variant max-w-3xl mb-8 leading-relaxed">
          {t('hero.subtitle')}
        </p>

        {/* Universal Cadastral Search Box */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-3xl bg-surface-container-low border border-outline-variant p-2.5 sm:p-3 rounded-lg shadow-xl mb-4 text-left"
        >
          {/* Mode Tabs */}
          <div className="flex items-center gap-2 mb-2 px-1">
            <button
              type="button"
              onClick={() => handleModeChange('address')}
              className={`px-2.5 py-1 rounded font-mono text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                mode === 'address'
                  ? 'bg-surface-container border border-primary/40 text-primary'
                  : 'bg-transparent border border-outline-variant text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{t('hero.tabAddress')}</span>
            </button>
            <button
              type="button"
              onClick={() => handleModeChange('refcat')}
              className={`px-2.5 py-1 rounded font-mono text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                mode === 'refcat'
                  ? 'bg-surface-container border border-primary/40 text-primary'
                  : 'bg-transparent border border-outline-variant text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>{t('hero.tabRefcat')}</span>
            </button>
            <span className="ml-auto font-mono text-xs text-outline hidden sm:inline-block">
              {t('hero.spatialRef')}
            </span>
          </div>

          {/* Input Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative flex-1 w-full" ref={dropdownRef}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                <Search className="w-4 h-4" />
              </div>
              <input
                id="cadastral-search-input"
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onFocus={() => {
                  isFocusedRef.current = true;
                  if (suggestions.length > 0) setShowDropdown(true);
                }}
                onBlur={() => {
                  setTimeout(() => {
                    isFocusedRef.current = false;
                  }, 200);
                }}
                placeholder={mode === 'address' ? t('hero.placeholderAddress') : t('hero.placeholderRefcat')}
                className="w-full pl-10 pr-4 py-2.5 rounded bg-surface-container border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body text-sm placeholder:text-outline outline-hidden transition-colors"
              />

              {/* Autocomplete Dropdown */}
              {showDropdown && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-surface-container border border-outline-variant rounded-lg shadow-2xl overflow-hidden z-50 max-h-60 overflow-y-auto">
                  <div className="p-2 border-b border-outline-variant bg-surface-container-high text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider flex items-center justify-between">
                    <span>Sugerencias de Dirección</span>
                    {isSearching && <span className="text-primary text-[10px]">Buscando...</span>}
                  </div>
                  {suggestions.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setSearchValue(item.label);
                        setShowDropdown(false);
                        const coords = (typeof item.lat === 'number' && typeof item.lon === 'number')
                          ? { lat: item.lat, lon: item.lon }
                          : undefined;
                        if (item.refcat) {
                          onAudit(item.refcat, 'refcat', coords);
                        } else {
                          onAudit(item.label, 'address', coords);
                        }
                      }}
                      className="w-full text-left px-3.5 py-2.5 text-xs text-on-surface hover:bg-surface-container-high border-b border-outline-variant/40 last:border-0 flex items-center justify-between space-x-2 transition cursor-pointer"
                    >
                      <div className="flex items-start space-x-2 min-w-0">
                        <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.refcat && (
                        <span className="shrink-0 px-1.5 py-0.5 rounded bg-primary/20 text-primary font-mono text-[10px] font-semibold border border-primary/30">
                          RC Oficial
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 rounded bg-primary text-on-primary font-body text-sm font-semibold hover:bg-primary-fixed transition-colors flex items-center justify-center gap-2 shadow-md shrink-0 cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>{t('hero.auditButton')}</span>
            </button>
          </div>
        </form>

        {/* Quick Access Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-left mb-8">
          <span className="font-mono text-xs text-on-surface-variant">
            {t('hero.auditedExamples')}
          </span>
          <button
            type="button"
            onClick={() => handleExampleClick('Gran Vía 28, Madrid')}
            className="px-2 py-0.5 rounded bg-surface-container border border-outline-variant hover:border-primary text-on-surface font-mono text-xs transition-colors cursor-pointer"
          >
            {t('hero.example1')}
          </button>
          <button
            type="button"
            onClick={() => handleExampleClick('Passeig de Gràcia 43, Barcelona')}
            className="px-2 py-0.5 rounded bg-surface-container border border-outline-variant hover:border-primary text-on-surface font-mono text-xs transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>{t('hero.example2')}</span>
            <span className="text-secondary font-semibold">{t('hero.example2Badge')}</span>
          </button>
          <button
            type="button"
            onClick={() => handleExampleClick('Calle Sierpes 22, Sevilla')}
            className="px-2 py-0.5 rounded bg-surface-container border border-outline-variant hover:border-primary text-on-surface font-mono text-xs transition-colors cursor-pointer"
          >
            {t('hero.example3')}
          </button>
        </div>

        {/* Trust Badges Metrics Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-3xl pt-6 border-t border-outline-variant/60">
          <div className="flex items-center justify-center gap-2 text-on-surface-variant">
            <BarChart3 className="w-4 h-4 text-primary" />
            <span className="font-mono text-sm font-semibold text-on-surface">
              {t('hero.statIne')}
            </span>
            <span className="font-body text-xs">{t('hero.statIneLabel')}</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-on-surface-variant">
            <Building className="w-4 h-4 text-primary" />
            <span className="font-mono text-sm font-semibold text-on-surface">
              {t('hero.statCatastro')}
            </span>
            <span className="font-body text-xs">{t('hero.statCatastroLabel')}</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-on-surface-variant">
            <Code2 className="w-4 h-4 text-primary" />
            <span className="font-mono text-sm font-semibold text-on-surface">
              {t('hero.statOpenSource')}
            </span>
            <span className="font-body text-xs">{t('hero.statOpenSourceLabel')}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
