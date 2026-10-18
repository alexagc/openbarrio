import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { SupportedLanguage, SUPPORTED_LANGUAGES, TranslationSchema, LanguageContextType } from './types';
import { es } from './translations/es';
import { en } from './translations/en';
import { ca } from './translations/ca';

const DICTIONARIES: Record<SupportedLanguage, TranslationSchema> = {
  es,
  en,
  ca,
};

const STORAGE_KEY = 'openbarrio_lang';

export const LanguageContext = createContext<LanguageContextType | null>(null);

function detectInitialLanguage(): SupportedLanguage {
  if (typeof window === 'undefined') return 'es';

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'es' || saved === 'en' || saved === 'ca') {
      return saved;
    }
  } catch {
    // Ignore localStorage errors
  }

  const browserLang = (navigator.language || '').toLowerCase();
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

      // Parameter interpolation {{param}}
      if (params) {
        return Object.entries(params).reduce((acc, [key, val]) => {
          return acc.replace(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), String(val));
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
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}
