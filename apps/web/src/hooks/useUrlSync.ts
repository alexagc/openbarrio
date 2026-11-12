import { useEffect, useCallback, useRef } from 'react';

export type DossierTab = 'summary' | 'building' | 'environment' | 'market';

export interface UrlParamsState {
  viewMode: 'landing' | 'map' | 'transparency';
  activeTab: 'dossier' | 'map';
  dossierTab: DossierTab;
  refcat?: string;
  coords?: { lat: number; lon: number };
  vs?: string;
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

  // Canonical & multilingual paths support: /fuentes-oficiales, /sources, /fonts-oficials, /informe/:refcat, /map
  const isTransparencyPath =
    path.startsWith('/fuentes-oficiales') ||
    path.startsWith('/transparencia') ||
    path.startsWith('/fuentes') ||
    path.startsWith('/sources') ||
    path.startsWith('/transparency') ||
    path.startsWith('/fonts-oficials');

  let pathRefcat: string | undefined;
  if (path.startsWith('/informe/')) {
    const segment = path.replace('/informe/', '').split('/')[0].split('?')[0];
    if (segment) {
      pathRefcat = segment.toUpperCase().trim();
    }
  }

  const effectiveRefcat = refcatParam ? refcatParam.toUpperCase().trim() : pathRefcat;
  const isMapPath = path.startsWith('/map') || Boolean(pathRefcat);
  const viewMode: 'landing' | 'map' | 'transparency' = isTransparencyPath
    ? 'transparency'
    : isMapPath || Boolean(effectiveRefcat)
    ? 'map'
    : 'landing';

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

      if (newState.viewMode === 'transparency') {
        const currentPathAndSearch = window.location.pathname + window.location.search;
        if (currentPathAndSearch !== '/fuentes-oficiales') {
          if (replace) {
            window.history.replaceState({ openbarrio: true }, '', '/fuentes-oficiales');
          } else {
            window.history.pushState({ openbarrio: true }, '', '/fuentes-oficiales');
          }
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
