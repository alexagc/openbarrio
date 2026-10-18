import React from 'react';
import { Building2, Compass, Github } from 'lucide-react';
import { useTranslation, SupportedLanguage } from '../../i18n';

interface HeaderProps {
  onOpenMap?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMap }) => {
  const { t, language, setLanguage, availableLanguages } = useTranslation();

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
        <a
          className="font-body text-sm text-on-surface-variant hover:text-primary transition-colors"
          href="#fuentes"
        >
          {t('nav.officialSources')}
        </a>
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
