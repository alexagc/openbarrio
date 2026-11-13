import { useEffect } from 'react';
import { ViewMode } from '../../hooks/useUrlSync';
import { SupportedLanguage } from '../../i18n/types';
import {
  BASE_SITE_URL,
  getHreflangAlternates,
  getLocalizedPath,
} from '../../utils/seo-routes';

export interface SeoHeadProps {
  viewMode: ViewMode;
  lang: SupportedLanguage;
  title: string;
  description: string;
  slug?: string;
  refcat?: string;
}

/**
 * Manages document head elements for SEO: Title, Meta Description, Canonical, and Hreflang Alternates.
 */
export function SeoHead({
  viewMode,
  lang,
  title,
  description,
  slug,
  refcat,
}: SeoHeadProps) {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    // 1. Update Document Title
    document.title = title;

    // 2. Update html lang attribute
    document.documentElement.lang = lang;

    // 3. Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // 4. Update Canonical Link
    const currentCanonicalPath = getLocalizedPath(viewMode, lang, { slug, refcat });
    const fullCanonicalUrl = `${BASE_SITE_URL}${currentCanonicalPath}`;

    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', fullCanonicalUrl);

    // 5. Update or Inject Hreflang Alternates
    // Remove existing hreflang alternates first to prevent duplicate stacking
    document
      .querySelectorAll('link[rel="alternate"][hreflang]')
      .forEach((el) => el.remove());

    const alternates = getHreflangAlternates(viewMode, { slug, refcat });
    for (const alt of alternates) {
      const link = document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', alt.lang);
      link.setAttribute('href', alt.url);
      document.head.appendChild(link);
    }
  }, [viewMode, lang, title, description, slug, refcat]);

  return null;
}
