import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { SupportedLanguage, SUPPORTED_LANGUAGES, TranslationSchema, LanguageContextType } from './types';
import { es } from './translations/es';
import { en } from './translations/en';
import { ca } from './translations/ca';
import { gl } from './translations/gl';
import { eu } from './translations/eu';
import { parseLocalizedRoute, getLocalizedPath } from '../utils/seo-routes';

const DICTIONARIES: Record<SupportedLanguage, TranslationSchema> = {
  es,
  en,
  ca,
  gl,
  eu,
};

const STORAGE_KEY = 'openbarrio_lang';

export const LanguageContext = createContext<LanguageContextType | null>(null);

function detectInitialLanguage(): SupportedLanguage {
  if (typeof window === 'undefined') return 'es';

  // 1. Detect from URL (localized slugs or /en/, /ca/, /gl/, /eu/ prefix)
  const parsed = parseLocalizedRoute(window.location.pathname, window.location.search);
  if (parsed.lang) {
    return parsed.lang;
  }

  // 2. Detect from persisted storage
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'es' || saved === 'en' || saved === 'ca' || saved === 'gl' || saved === 'eu') {
      return saved as SupportedLanguage;
    }
  } catch {
    // Ignore localStorage errors
  }

  // 3. Fallback to browser locale preference
  const browserLang = (navigator.language || '').toLowerCase();
  if (browserLang.startsWith('gl')) return 'gl';
  if (browserLang.startsWith('eu')) return 'eu';
  if (browserLang.startsWith('ca')) return 'ca';
  if (browserLang.startsWith('en')) return 'en';
  return 'es';
}

function resolvePath(obj: any, path: string): string | undefined {
  if (!obj || !path) return undefined;
  const parts = path.split('.');
  let current = obj;
  for (const part of parts) {
    if (current === undefined || current === null) return undefined;
    current = current[part];
  }
  return typeof current === 'string' ? current : undefined;
}

export interface LanguageProviderProps {
  children: ReactNode;
  initialLanguage?: SupportedLanguage;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children, initialLanguage }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => initialLanguage || detectInitialLanguage());

  const setLanguage = (newLang: SupportedLanguage) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
    } catch {
      // Ignore localStorage errors
    }

    // Automatically synchronize browser URL to localized route equivalent
    if (typeof window !== 'undefined') {
      const parsed = parseLocalizedRoute(window.location.pathname, window.location.search);
      if (parsed.viewMode && parsed.viewMode !== 'landing') {
        const newPath = getLocalizedPath(parsed.viewMode, newLang, {
          slug: parsed.slug,
          refcat: parsed.refcat,
          isEmbed: parsed.isEmbed,
        });
        if (window.location.pathname + window.location.search !== newPath) {
          window.history.pushState({ openbarrio: true }, '', newPath);
        }
      }
    }
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  const t = useMemo(() => {
    return (path: string, params?: Record<string, string | number>): string => {
      const activeDict = DICTIONARIES[language] || DICTIONARIES.es;
      let template = resolvePath(activeDict, path);

      // Fallback to Spanish if key missing in active translation
      if (template === undefined) {
        template = resolvePath(DICTIONARIES.es, path);
      }

      // If still missing, return the path string as fallback
      if (template === undefined) {
        return path;
      }

      // Parameter interpolation {{param}} or {param}
      if (params) {
        return Object.entries(params).reduce((acc, [key, val]) => {
          return acc.replace(new RegExp(`\\{{1,2}\\s*${key}\\s*\\}{1,2}`, 'g'), String(val));
        }, template);
      }

      return template;
    };
  }, [language]);

  const value: LanguageContextType = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      availableLanguages: SUPPORTED_LANGUAGES,
    }),
    [language, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export function useTranslation(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    // Resilient fallback for isolated tests or standalone component mounting
    const fallbackT = (path: string, params?: Record<string, string | number>): string => {
      const keys = path.split('.');
      let current: any = DICTIONARIES.es;
      for (const k of keys) {
        if (!current || typeof current !== 'object') return path;
        current = current[k];
      }
      if (typeof current !== 'string') return path;
      if (!params) return current;
      let text = current;
      for (const [pk, pv] of Object.entries(params)) {
        text = text.replace(new RegExp(`{{\\s*${pk}\\s*}}|{\\s*${pk}\\s*}`, 'g'), String(pv));
      }
      return text;
    };
    return {
      language: 'es',
      setLanguage: () => {},
      t: fallbackT,
      availableLanguages: SUPPORTED_LANGUAGES,
    };
  }
  return context;
}
