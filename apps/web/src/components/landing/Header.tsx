import React, { useState, useRef, useEffect } from 'react';
import { Building2, Compass, Github, ChevronDown, Ruler, Scale, Coins } from 'lucide-react';
import { useTranslation, SupportedLanguage } from '../../i18n';
import { useWorkspaceStore } from '../../store/workspace.store';

interface HeaderProps {
  onOpenMap?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMap }) => {
  const { t, language, setLanguage, availableLanguages } = useTranslation();
  const setViewMode = useWorkspaceStore((s) => s.setViewMode);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const toolsDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        toolsDropdownRef.current &&
        !toolsDropdownRef.current.contains(event.target as Node)
      ) {
        setIsToolsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full h-14 bg-surface-container border-b border-outline-variant shadow-sm flex items-center justify-between px-space-lg backdrop-blur-md bg-surface-container/95">
      {/* Brand Cluster */}
      <div className="flex items-center gap-3">
        <a className="flex items-center gap-2 group" href="#">
          <div className="w-8 h-8 rounded bg-surface-container-high border border-outline-variant flex items-center justify-center text-primary group-hover:border-primary transition-colors">
            <Building2 className="w-5 h-5" />
          </div>
          <span className="font-headline text-lg font-bold text-primary tracking-tight">OpenBarrio</span>
        </a>

        {/* Institutional Tag Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-container-high border border-outline-variant">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="font-mono text-xs text-on-surface-variant font-medium">
            {t('nav.brandSubtitle')}
          </span>
        </div>
      </div>

      {/* Navigation Links (Desktop) */}
      <nav className="hidden lg:flex items-center gap-6">
        <button
          type="button"
          onClick={() => setViewMode('transparency')}
          className="font-body text-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
        >
          {t('nav.officialSources')}
        </button>

        {/* Tools Dropdown */}
        <div className="relative" ref={toolsDropdownRef}>
          <button
            type="button"
            onClick={() => setIsToolsOpen(!isToolsOpen)}
            className="flex items-center gap-1.5 font-body text-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer py-1"
            aria-expanded={isToolsOpen}
          >
            <span>{t('nav.tools')}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                isToolsOpen ? 'rotate-180 text-primary' : ''
              }`}
            />
          </button>

          {isToolsOpen && (
            <div className="absolute top-full mt-2 -left-4 w-72 p-2 rounded-2xl bg-surface-container-high/95 border border-outline-variant shadow-2xl backdrop-blur-xl z-50 space-y-1">
              <button
                type="button"
                onClick={() => {
                  setIsToolsOpen(false);
                  setViewMode('tool-surface' as any);
                }}
                className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-surface-container text-left transition-colors group cursor-pointer"
              >
                <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400 shrink-0 mt-0.5">
                  <Ruler className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors">
                    {t('nav.toolsSurface')}
                  </div>
                  <div className="text-[11px] text-on-surface-variant leading-tight">
                    {t('nav.toolsSurfaceDesc')}
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsToolsOpen(false);
                  setViewMode('tool-rent' as any);
                }}
                className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-surface-container text-left transition-colors group cursor-pointer"
              >
                <div className="p-2 rounded-lg bg-amber-500/15 text-amber-400 shrink-0 mt-0.5">
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-on-surface group-hover:text-amber-400 transition-colors">
                    {t('nav.toolsRent')}
                  </div>
                  <div className="text-[11px] text-on-surface-variant leading-tight">
                    {t('nav.toolsRentDesc')}
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsToolsOpen(false);
                  setViewMode('tool-itp' as any);
                }}
                className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-surface-container text-left transition-colors group cursor-pointer"
              >
                <div className="p-2 rounded-lg bg-sky-500/15 text-sky-400 shrink-0 mt-0.5">
                  <Coins className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-on-surface group-hover:text-sky-400 transition-colors">
                    {t('nav.toolsItp')}
                  </div>
                  <div className="text-[11px] text-on-surface-variant leading-tight">
                    {t('nav.toolsItpDesc')}
                  </div>
                </div>
              </button>

              <div className="border-t border-outline-variant/60 my-1" />

              <button
                type="button"
                onClick={() => {
                  setIsToolsOpen(false);
                  setViewMode('municipios-directory' as any);
                }}
                className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-surface-container text-left transition-colors group cursor-pointer"
              >
                <div className="p-2 rounded-lg bg-surface-container-highest text-on-surface-variant shrink-0 mt-0.5">
                  <Building2 className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors">
                    {t('nav.toolsMunicipalities')}
                  </div>
                  <div className="text-[11px] text-on-surface-variant leading-tight">
                    {t('nav.toolsMunicipalitiesDesc')}
                  </div>
                </div>
              </button>
            </div>
          )}
        </div>

        <a
          className="font-body text-sm text-on-surface-variant hover:text-primary transition-colors"
          href="#extension"
        >
          {t('nav.extension')}
        </a>
        <a
          className="font-body text-sm text-on-surface-variant hover:text-primary transition-colors"
          href="#principios"
        >
          {t('nav.principles')}
        </a>
        <a
          className="flex items-center gap-1.5 font-body text-sm text-on-surface-variant hover:text-primary transition-colors"
          href="https://github.com/alexagc/openbarrio"
          rel="noreferrer"
          target="_blank"
        >
          <Github className="w-4 h-4" />
          <span>{t('nav.github')}</span>
          <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-surface-container-highest border border-outline-variant text-tertiary">
            {t('nav.version')}
          </span>
        </a>
      </nav>

      {/* Trailing Actions Cluster */}
      <div className="flex items-center gap-3">
        {/* Language Pill Switcher */}
        <div
          className="flex items-center rounded bg-surface-container-low border border-outline-variant p-0.5"
          role="group"
          aria-label="Language selector"
        >
          {availableLanguages.map((lang) => {
            const isActive = language === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code as SupportedLanguage)}
                className={`px-2 py-0.5 rounded font-mono text-xs transition-colors ${
                  isActive
                    ? 'text-primary bg-surface-container font-semibold shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                type="button"
                aria-pressed={isActive}
              >
                {lang.shortLabel}
              </button>
            );
          })}
        </div>

        {/* CTA Button: Ver Mapa */}
        <button
          onClick={onOpenMap}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-container border border-primary text-primary hover:bg-primary hover:text-on-primary transition-colors font-body text-sm font-semibold cursor-pointer"
          type="button"
        >
          <Compass className="w-4 h-4" />
          <span>{t('nav.openMap')}</span>
        </button>
      </div>
    </header>
  );
};
