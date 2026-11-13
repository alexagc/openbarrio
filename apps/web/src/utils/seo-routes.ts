import { ViewMode } from '../hooks/useUrlSync';
import { SupportedLanguage } from '../i18n/types';

export const BASE_SITE_URL = 'https://openbarrio.org';

export interface RouteSlugMapping {
  viewMode: ViewMode;
  es: string;
  en: string;
  ca: string;
  gl: string;
  eu: string;
  aliases?: string[];
}

export const SEO_ROUTE_DEFINITIONS: RouteSlugMapping[] = [
  {
    viewMode: 'landing',
    es: '/',
    en: '/en',
    ca: '/ca',
    gl: '/gl',
    eu: '/eu',
    aliases: ['/inicio', '/home', '/inici', '/comezo', '/hasiera'],
  },
  {
    viewMode: 'transparency',
    es: '/fuentes-oficiales',
    en: '/official-sources',
    ca: '/fonts-oficials',
    gl: '/fontes-oficiais',
    eu: '/iturri-ofizialak',
    aliases: ['/transparencia', '/fuentes', '/sources', '/transparency', '/gardentasuna'],
  },
  {
    viewMode: 'tool-surface',
    es: '/comprobar-metros-catastro',
    en: '/check-cadastral-surface',
    ca: '/comprovar-metres-cadastre',
    gl: '/comprobar-metros-catastro',
    eu: '/katastroko-metroak-egiaztatu',
    aliases: [
      '/metros-catastro',
      '/cadastral-surface-checker',
      '/verify-cadastral-meters',
      '/metres-cadastre',
      '/metroak-egiaztatu',
    ],
  },
  {
    viewMode: 'tool-rent',
    es: '/calculadora-alquiler-legal',
    en: '/legal-rent-calculator',
    ca: '/calculadora-lloguer-legal',
    gl: '/calculadora-aluguer-legal',
    eu: '/legezko-alokairuaren-kalkulagailua',
    aliases: [
      '/alquiler-legal',
      '/rent-calculator',
      '/rent-cap-calculator',
      '/lloguer-legal',
      '/aluguer-legal',
      '/alokairu-legala',
    ],
  },
  {
    viewMode: 'tool-itp',
    es: '/simulador-itp-ibi',
    en: '/property-tax-simulator',
    ca: '/simulador-itp-ibi',
    gl: '/simulador-itp-ibi',
    eu: '/itp-ibi-simulagailua',
    aliases: [
      '/simulador-itp',
      '/itp-tax-simulator',
      '/tax-simulator',
      '/simulador-fiscal',
      '/itp-simulagailua',
    ],
  },
  {
    viewMode: 'municipios-directory',
    es: '/municipios',
    en: '/municipalities',
    ca: '/municipis',
    gl: '/municipios',
    eu: '/udalerriak',
    aliases: ['/directorio-municipios', '/ciudades', '/udalerri-direktorioa'],
  },
];

/**
 * Returns localized URL path for a given viewMode and language.
 */
export function getLocalizedPath(
  viewMode: ViewMode,
  lang: SupportedLanguage,
  params?: { slug?: string; refcat?: string; isEmbed?: boolean }
): string {
  const embedSuffix = params?.isEmbed ? '?embed=true' : '';

  if (viewMode === 'municipality') {
    const slug = params?.slug || 'madrid';
    const prefix =
      lang === 'en'
        ? '/municipality/'
        : lang === 'ca'
        ? '/municipi/'
        : lang === 'eu'
        ? '/eu/udalerria/'
        : lang === 'gl'
        ? '/gl/municipio/'
        : '/municipio/';
    return `${prefix}${slug}${embedSuffix}`;
  }

  if (viewMode === 'map') {
    if (params?.refcat) {
      const prefix =
        lang === 'en'
          ? '/report/'
          : lang === 'eu'
          ? '/eu/txostena/'
          : lang === 'gl'
          ? '/gl/informe/'
          : '/informe/';
      return `${prefix}${params.refcat}${embedSuffix}`;
    }
    return lang === 'en'
      ? `/map${embedSuffix}`
      : lang === 'eu'
      ? `/eu/mapa${embedSuffix}`
      : lang === 'gl'
      ? `/gl/mapa${embedSuffix}`
      : `/mapa${embedSuffix}`;
  }

  const def = SEO_ROUTE_DEFINITIONS.find((d) => d.viewMode === viewMode);
  if (!def) return `/${embedSuffix}`;

  const basePath = def[lang] || def.es;
  return `${basePath}${embedSuffix}`;
}

/**
 * Generates an array of hreflang alternates (es, en, ca, gl, eu, x-default) for SEO meta links.
 */
export function getHreflangAlternates(
  viewMode: ViewMode,
  params?: { slug?: string; refcat?: string }
): Array<{ lang: string; url: string }> {
  const pathEs = getLocalizedPath(viewMode, 'es', params);
  const pathEn = getLocalizedPath(viewMode, 'en', params);
  const pathCa = getLocalizedPath(viewMode, 'ca', params);
  const pathGl = getLocalizedPath(viewMode, 'gl', params);
  const pathEu = getLocalizedPath(viewMode, 'eu', params);

  return [
    { lang: 'es', url: `${BASE_SITE_URL}${pathEs}` },
    { lang: 'en', url: `${BASE_SITE_URL}${pathEn}` },
    { lang: 'ca', url: `${BASE_SITE_URL}${pathCa}` },
    { lang: 'gl', url: `${BASE_SITE_URL}${pathGl}` },
    { lang: 'eu', url: `${BASE_SITE_URL}${pathEu}` },
    { lang: 'x-default', url: `${BASE_SITE_URL}${pathEs}` },
  ];
}

export interface ParsedLocalizedRoute {
  viewMode?: ViewMode;
  lang?: SupportedLanguage;
  slug?: string;
  refcat?: string;
  isEmbed?: boolean;
}

/**
 * Parses any incoming path string and resolves viewMode, language hint, and parameters.
 */
export function parseLocalizedRoute(pathname: string, search = ''): ParsedLocalizedRoute {
  const rawPath = pathname.toLowerCase().replace(/\/$/, '') || '/';
  const searchParams = new URLSearchParams(search);
  const isEmbed = searchParams.get('embed') === 'true' || searchParams.get('embed') === '1';

  // Check language prefix (e.g. /en/something, /ca/something, /gl/something, /eu/something)
  let cleanPath = rawPath;
  let explicitLang: SupportedLanguage | undefined;

  if (cleanPath.startsWith('/en/') || cleanPath === '/en') {
    explicitLang = 'en';
    cleanPath = cleanPath === '/en' ? '/' : cleanPath.replace(/^\/en/, '');
  } else if (cleanPath.startsWith('/ca/') || cleanPath === '/ca') {
    explicitLang = 'ca';
    cleanPath = cleanPath === '/ca' ? '/' : cleanPath.replace(/^\/ca/, '');
  } else if (cleanPath.startsWith('/gl/') || cleanPath === '/gl') {
    explicitLang = 'gl';
    cleanPath = cleanPath === '/gl' ? '/' : cleanPath.replace(/^\/gl/, '');
  } else if (cleanPath.startsWith('/eu/') || cleanPath === '/eu') {
    explicitLang = 'eu';
    cleanPath = cleanPath === '/eu' ? '/' : cleanPath.replace(/^\/eu/, '');
  }

  // 1. Municipalities single view: /municipio/:slug, /municipality/:slug, /municipi/:slug, /udalerria/:slug
  if (
    cleanPath.startsWith('/municipio/') ||
    cleanPath.startsWith('/municipality/') ||
    cleanPath.startsWith('/municipi/') ||
    cleanPath.startsWith('/udalerria/')
  ) {
    let lang: SupportedLanguage = explicitLang || 'es';
    if (!explicitLang) {
      if (cleanPath.startsWith('/municipality/')) lang = 'en';
      else if (cleanPath.startsWith('/municipi/')) lang = 'ca';
      else if (cleanPath.startsWith('/udalerria/')) lang = 'eu';
    }
    const segments = cleanPath.split('/').filter(Boolean);
    const slug = segments[1] || 'madrid';
    return { viewMode: 'municipality', lang, slug, isEmbed };
  }

  // 2. Report / Property Audit: /informe/:refcat, /report/:refcat, /txostena/:refcat
  if (
    cleanPath.startsWith('/informe/') ||
    cleanPath.startsWith('/report/') ||
    cleanPath.startsWith('/txostena/')
  ) {
    let lang: SupportedLanguage = explicitLang || 'es';
    if (!explicitLang) {
      if (cleanPath.startsWith('/report/')) lang = 'en';
      else if (cleanPath.startsWith('/txostena/')) lang = 'eu';
    }
    const segments = pathname.split('/').filter(Boolean);
    const refcat = segments[segments.length - 1]?.toUpperCase().trim();
    return { viewMode: 'map', lang, refcat, isEmbed };
  }

  // 3. Map views: /map, /mapa
  if (cleanPath === '/map' || cleanPath === '/mapa') {
    const lang: SupportedLanguage = explicitLang || 'es';
    return { viewMode: 'map', lang, isEmbed };
  }

  // 4. Exact match against defined SEO routes
  for (const def of SEO_ROUTE_DEFINITIONS) {
    if (cleanPath === def.es) {
      return { viewMode: def.viewMode, lang: explicitLang || 'es', isEmbed };
    }
    if (cleanPath === def.en) {
      return { viewMode: def.viewMode, lang: explicitLang || 'en', isEmbed };
    }
    if (cleanPath === def.ca) {
      return { viewMode: def.viewMode, lang: explicitLang || 'ca', isEmbed };
    }
    if (cleanPath === def.gl) {
      return { viewMode: def.viewMode, lang: explicitLang || 'gl', isEmbed };
    }
    if (cleanPath === def.eu) {
      return { viewMode: def.viewMode, lang: explicitLang || 'eu', isEmbed };
    }
    if (def.aliases?.includes(cleanPath)) {
      return { viewMode: def.viewMode, lang: explicitLang || 'es', isEmbed };
    }
  }

  // 5. Landing fallback
  if (cleanPath === '/') {
    return { viewMode: 'landing', lang: explicitLang || 'es', isEmbed };
  }

  return { isEmbed };
}
