import { useEffect, useCallback, useRef } from 'react';
import { parseLocalizedRoute, getLocalizedPath } from '../utils/seo-routes';
import { SupportedLanguage } from '../i18n/types';

export type DossierTab = 'summary' | 'building' | 'environment' | 'market';

export type ViewMode =
  | 'landing'
  | 'map'
  | 'transparency'
  | 'tool-surface'
  | 'tool-rent'
  | 'tool-itp'
  | 'municipality'
  | 'municipios-directory';

export interface UrlParamsState {
  viewMode: ViewMode;
  activeTab: 'dossier' | 'map';
  dossierTab: DossierTab;
  refcat?: string;
  coords?: { lat: number; lon: number };
  vs?: string;
  municipalitySlug?: string;
  isEmbed?: boolean;
}

export function parseUrlState(): UrlParamsState {
  if (typeof window === 'undefined') {
    return { viewMode: 'landing', activeTab: 'dossier', dossierTab: 'summary' };
  }

  const path = window.location.pathname;
  const searchParams = new URLSearchParams(window.location.search);

  const refcatParam = searchParams.get('refcat') || searchParams.get('rc') || undefined;
  const latParam = searchParams.get('lat');
  const lonParam = searchParams.get('lon');
  const tabParam = searchParams.get('tab');
  const vsParam = searchParams.get('vs') || undefined;

  let coords: { lat: number; lon: number } | undefined;
  if (latParam && lonParam) {
    const lat = parseFloat(latParam);
    const lon = parseFloat(lonParam);
    if (!isNaN(lat) && !isNaN(lon)) {
      coords = { lat, lon };
    }
  }

  // Canonical & multilingual paths support (es, en, ca) via parseLocalizedRoute
  const localized = parseLocalizedRoute(path, window.location.search);

  const isEmbed = searchParams.get('embed') === 'true' || searchParams.get('embed') === '1' || Boolean(localized.isEmbed);
  const municipalitySlug = localized.slug;

  let pathRefcat: string | undefined;
  if (path.startsWith('/informe/') || path.startsWith('/report/')) {
    const segment = path.replace(/^\/(informe|report)\//, '').split('/')[0].split('?')[0];
    if (segment) {
      pathRefcat = segment.toUpperCase().trim();
    }
  }

  const effectiveRefcat = refcatParam ? refcatParam.toUpperCase().trim() : (localized.refcat || pathRefcat);
  const isMapPath = path.startsWith('/map') || path.startsWith('/mapa') || Boolean(effectiveRefcat);

  let viewMode: ViewMode = localized.viewMode || 'landing';
  if (!localized.viewMode || localized.viewMode === 'landing') {
    if (isMapPath || Boolean(effectiveRefcat) || Boolean(coords)) {
      viewMode = 'map';
    }
  }

  // Support both mobile map tab toggle ('map' | 'dossier') and 4-way dossier tabs
  const validDossierTabs: DossierTab[] = ['summary', 'building', 'environment', 'market'];
  const dossierTab: DossierTab = validDossierTabs.includes(tabParam as DossierTab)
    ? (tabParam as DossierTab)
    : 'summary';

  const activeTab: 'dossier' | 'map' = tabParam === 'map' ? 'map' : 'dossier';

  return {
    viewMode,
    activeTab,
    dossierTab,
    refcat: effectiveRefcat,
    coords,
    vs: vsParam ? vsParam.toUpperCase().trim() : undefined,
    municipalitySlug,
    isEmbed,
  };
}

export function useUrlSync(
  state: UrlParamsState,
  onUrlStateChange?: (newState: UrlParamsState) => void
) {
  const isInitialMount = useRef(true);

  // Sync state to URL via history.pushState / replaceState
  const syncToUrl = useCallback(
    (newState: UrlParamsState, replace = false) => {
      if (typeof window === 'undefined') return;

      if (newState.viewMode === 'landing') {
        const currentPathAndSearch = window.location.pathname + window.location.search;
        if (currentPathAndSearch !== '/') {
          if (replace) {
            window.history.replaceState({ openbarrio: true }, '', '/');
          } else {
            window.history.pushState({ openbarrio: true }, '', '/');
          }
        }
        return;
      }

      let currentLang: SupportedLanguage = 'es';
      try {
        const saved = localStorage.getItem('openbarrio_lang');
        if (saved === 'es' || saved === 'en' || saved === 'ca') {
          currentLang = saved;
        }
      } catch {
        // Ignore localStorage error
      }

      if (
        newState.viewMode === 'transparency' ||
        newState.viewMode === 'tool-surface' ||
        newState.viewMode === 'tool-rent' ||
        newState.viewMode === 'tool-itp' ||
        newState.viewMode === 'municipios-directory' ||
        newState.viewMode === 'municipality'
      ) {
        const target = getLocalizedPath(newState.viewMode, currentLang, {
          slug: newState.municipalitySlug,
          isEmbed: newState.isEmbed,
        });
        const currentPathAndSearch = window.location.pathname + window.location.search;
        if (currentPathAndSearch !== target) {
          if (replace) window.history.replaceState({ openbarrio: true }, '', target);
          else window.history.pushState({ openbarrio: true }, '', target);
        }
        return;
      }

      const params = new URLSearchParams();
      let targetPath = newState.viewMode === 'map' ? '/map' : '/';

      if (newState.refcat) {
        targetPath = `/informe/${newState.refcat}`;
      } else if (newState.coords) {
        params.set('lat', newState.coords.lat.toFixed(5));
        params.set('lon', newState.coords.lon.toFixed(5));
      }

      if (newState.activeTab === 'map') {
        params.set('tab', 'map');
      } else if (newState.dossierTab && newState.dossierTab !== 'summary') {
        params.set('tab', newState.dossierTab);
      }

      if (newState.vs) {
        params.set('vs', newState.vs);
      }

      const queryString = params.toString();
      const targetUrl = queryString ? `${targetPath}?${queryString}` : targetPath;

      const currentPathAndSearch = window.location.pathname + window.location.search;
      if (currentPathAndSearch !== targetUrl) {
        if (replace) {
          window.history.replaceState({ openbarrio: true }, '', targetUrl);
        } else {
          window.history.pushState({ openbarrio: true }, '', targetUrl);
        }
      }
    },
    []
  );

  // Push updates when state changes after initial mount
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    syncToUrl(state, false);
  }, [
    state.viewMode,
    state.activeTab,
    state.dossierTab,
    state.refcat,
    state.coords?.lat,
    state.coords?.lon,
    state.vs,
    syncToUrl,
  ]);

  const onUrlStateChangeRef = useRef(onUrlStateChange);
  useEffect(() => {
    onUrlStateChangeRef.current = onUrlStateChange;
  }, [onUrlStateChange]);

  // Handle native browser back/forward buttons (popstate)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePopState = () => {
      const parsed = parseUrlState();
      if (onUrlStateChangeRef.current) {
        onUrlStateChangeRef.current(parsed);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return {
    syncToUrl,
    parseUrlState,
  };
}
