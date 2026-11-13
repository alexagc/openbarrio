import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  MapPin,
  Search,
  BarChart3,
  Building,
  Code2,
  Map as MapIcon,
  Chrome,
  ArrowRight,
} from 'lucide-react';
import { isCadastralReference } from '@openbarrio/core';
import { useTranslation } from '../../i18n';
import { apiClient } from '../../services/api.client';

interface HeroSectionProps {
  onAudit: (query: string, mode: 'address' | 'refcat', coords?: { lat: number; lon: number }) => void;
  onOpenMap?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onAudit, onOpenMap }) => {
  const { t } = useTranslation();
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

  // Debounced address search (skipped when input is a clean cadastral reference)
  useEffect(() => {
    const trimmed = searchValue.trim();
    if (trimmed.length < 3 || isCadastralReference(trimmed)) {
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
  }, [searchValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = searchValue.trim();
    if (!raw) return;

    // Automatic detection: Cadastral Reference (14 or 20 alphanumeric chars)
    if (isCadastralReference(raw)) {
      const cleanRefcat = raw.replace(/[\s\-_.]/g, '').toUpperCase();
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

    onAudit(raw, 'address');
  };

  const handleExampleClick = (exampleQuery: string, exampleMode: 'address' | 'refcat' = 'address') => {
    setSearchValue(exampleQuery);
    let coords: { lat: number; lon: number } | undefined;
    if (exampleQuery.includes('Gran Vía 28') || exampleQuery.includes('Chamberí') || exampleQuery.includes('Engracia')) {
      coords = { lat: 40.4352, lon: -3.7001 };
    } else if (exampleQuery.includes('Gràcia') || exampleQuery.includes('Gracia') || exampleQuery.includes('Mallorca')) {
      coords = { lat: 41.39170, lon: 2.16495 };
    } else if (exampleQuery.includes('Russafa') || exampleQuery.includes('Ruzafa') || exampleQuery.includes('Sierpes')) {
      coords = { lat: 39.4671, lon: -0.3742 };
    }
    onAudit(exampleQuery, exampleMode, coords);
  };

  return (
    <section className="w-full relative pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24 px-space-md sm:px-space-lg lg:px-space-xl border-b border-outline-variant/60 overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl w-full mx-auto relative z-10 flex flex-col items-center text-center">
        {/* Verification Shield Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container border border-primary/30 mb-6 shadow-xs">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="font-mono text-xs text-primary font-medium tracking-wide">
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

        {/* Universal Cadastral Search Box (Buscador Soberano Unificado) */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-3xl bg-surface-container/95 border border-primary/40 p-3 sm:p-4 rounded-xl shadow-2xl mb-4 text-left backdrop-blur-md"
        >
          {/* Unified Sovereign Bar Header */}
          <div className="flex items-center justify-between border-b border-outline-variant pb-2 mb-2.5 px-1 font-mono text-xs text-on-surface-variant">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span className="font-semibold text-on-surface">{t('hero.searchTitle')}</span>
              {isCadastralReference(searchValue.trim()) && (
                <span className="px-1.5 py-0.5 rounded bg-primary/20 text-primary text-[10px] font-bold border border-primary/40 animate-pulse">
                  {t('hero.refcatDetected')}
                </span>
              )}
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-on-surface-variant font-mono text-xs">
              <span>{t('hero.searchSources')}</span>
            </div>
          </div>

          {/* Input Bar Row */}
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative flex-1 w-full" ref={dropdownRef}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-primary">
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
                placeholder={t('hero.placeholderUnified')}
                className="w-full pl-10 pr-4 py-2.5 rounded bg-surface-container-lowest border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body text-sm placeholder:text-outline outline-hidden transition-colors"
              />

              {/* Autocomplete Dropdown */}
              {showDropdown && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-surface-container-low border border-outline-variant rounded-lg shadow-2xl overflow-hidden z-50 max-h-60 overflow-y-auto">
                  <div className="p-2 border-b border-outline-variant bg-surface-container text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider flex items-center justify-between">
                    <span>{t('hero.searchSuggestions')} ({suggestions.length})</span>
                    {isSearching ? (
                      <span className="text-primary text-[10px]">{t('hero.searching')}</span>
                    ) : (
                      <span className="text-primary text-[10px] font-mono">WFS Online</span>
                    )}
                  </div>
                  {suggestions.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setSearchValue(item.label);
                        setShowDropdown(false);
                        const coords =
                          typeof item.lat === 'number' && typeof item.lon === 'number'
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
                        <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.refcat && (
                        <span className="shrink-0 px-1.5 py-0.5 rounded bg-primary/20 text-primary font-mono text-[10px] font-semibold border border-primary/30">
                          {t('searchBar.rcOfficial')}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 rounded bg-primary-container text-on-primary-container font-body text-sm font-semibold hover:bg-primary transition-colors flex items-center justify-center gap-2 shadow-sm shrink-0 cursor-pointer"
            >
              <span>{t('hero.auditButton')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Guarantee Subtext */}
          <p className="mt-2 text-center sm:text-left font-mono text-[11px] text-on-surface-variant">
            {t('hero.searchGuarantee')}
          </p>
        </form>

        {/* 3 Iconic Emblematic Presets Grid (Decision A1) */}
        <div className="w-full max-w-3xl mb-4 text-left">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Preset 1: Chamberí / Madrid */}
            <button
              type="button"
              onClick={() => handleExampleClick('Gran Vía 28, Madrid', 'address')}
              className="p-3 rounded-lg bg-surface-container border border-outline-variant hover:border-primary/60 hover:bg-surface-container-high transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-headline text-xs font-bold text-on-surface group-hover:text-primary transition-colors">
                  Chamberí / Centro
                </span>
                <span className="px-1.5 py-0.2 rounded bg-primary/10 text-primary font-mono text-[9px] font-semibold border border-primary/20">
                  Madrid
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant font-mono truncate">
                Gran Vía 28, Madrid
              </p>
              <span className="text-[10px] text-outline font-mono block mt-1">
                ITE consolidada · 84 m²
              </span>
            </button>

            {/* Preset 2: Eixample */}
            <button
              type="button"
              onClick={() => handleExampleClick('Passeig de Gràcia 43, Barcelona', 'address')}
              className="p-3 rounded-lg bg-surface-container border border-outline-variant hover:border-primary/60 hover:bg-surface-container-high transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-headline text-xs font-bold text-on-surface group-hover:text-primary transition-colors">
                  Eixample con Terraza
                </span>
                <span className="px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 font-mono text-[9px] font-semibold border border-amber-500/20">
                  Tensionada
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant font-mono truncate">
                Passeig de Gràcia 43, Barcelona
              </p>
              <span className="text-[10px] text-outline font-mono block mt-1">
                Tope SERPAVI · 88 m²
              </span>
            </button>

            {/* Preset 3: Ruzafa */}
            <button
              type="button"
              onClick={() => handleExampleClick('Carrer de Russafa 18, Valencia', 'address')}
              className="p-3 rounded-lg bg-surface-container border border-outline-variant hover:border-primary/60 hover:bg-surface-container-high transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-headline text-xs font-bold text-on-surface group-hover:text-primary transition-colors">
                  Ruzafa Turístico
                </span>
                <span className="px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-400 font-mono text-[9px] font-semibold border border-purple-500/20">
                  ZAS / VUT
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant font-mono truncate">
                Carrer de Russafa 18
              </p>
              <span className="text-[10px] text-outline font-mono block mt-1">
                SICA 67 dB · Saturación VUT
              </span>
            </button>
          </div>
        </div>

        {/* Dual Quick-Access Action Cards (Fast Track: Map vs Extension) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md max-w-3xl w-full mb-8">
          {/* Action Card 1: Direct Map Access */}
          <button
            type="button"
            onClick={() => onOpenMap?.()}
            className="flex items-center gap-3.5 p-4 rounded-xl bg-surface-container/90 border border-primary/40 hover:border-primary hover:bg-surface-container-high transition-all shadow-md group text-left cursor-pointer backdrop-blur-sm"
          >
            <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-background transition-colors flex items-center justify-center shrink-0">
              <MapIcon className="w-6 h-6" />
            </div>
            <div>
              <span className="font-mono text-[10px] text-primary uppercase font-bold tracking-wider block">
                {t('hero.gisDirectAccess')}
              </span>
              <div className="font-headline text-sm font-bold text-on-surface group-hover:text-primary transition-colors flex items-center gap-1.5 mt-0.5">
                <span>{t('hero.gisLaunchFull')}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
              <p className="font-body text-xs text-on-surface-variant mt-0.5">
                {t('hero.gisLaunchDesc')}
              </p>
            </div>
          </button>

          {/* Action Card 2: Install Chrome Extension */}
          <a
            href="#extension"
            className="flex items-center gap-3.5 p-4 rounded-xl bg-surface-container border border-outline-variant hover:border-primary/60 hover:bg-surface-container-high transition-all shadow-md group text-left cursor-pointer"
          >
            <div className="p-3 rounded-lg bg-sky/10 text-sky group-hover:bg-sky group-hover:text-background transition-colors flex items-center justify-center">
              <Chrome className="w-6 h-6" />
            </div>
            <div>
              <div className="font-headline text-sm font-bold text-on-surface group-hover:text-sky transition-colors flex items-center gap-1.5">
                <span>{t('hero.extensionCardTitle')}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
              <p className="font-body text-xs text-on-surface-variant mt-0.5">
                {t('hero.extensionCardDesc')}
              </p>
            </div>
          </a>
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

