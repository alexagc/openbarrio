import { useEffect, useCallback, useRef } from 'react';

export interface UrlParamsState {
  viewMode: 'landing' | 'map';
  activeTab: 'dossier' | 'map';
  refcat?: string;
  coords?: { lat: number; lon: number };
  vs?: string;
}

export function parseUrlState(): UrlParamsState {
  if (typeof window === 'undefined') {
    return { viewMode: 'landing', activeTab: 'dossier' };
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

  const isMapPath = path.startsWith('/map');
  const viewMode: 'landing' | 'map' = isMapPath || Boolean(refcatParam) ? 'map' : 'landing';
  const activeTab: 'dossier' | 'map' = tabParam === 'map' ? 'map' : 'dossier';

  return {
    viewMode,
    activeTab,
    refcat: refcatParam ? refcatParam.toUpperCase().trim() : undefined,
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

      const params = new URLSearchParams();

      if (newState.refcat) {
        params.set('refcat', newState.refcat);
      } else if (newState.coords) {
        params.set('lat', newState.coords.lat.toFixed(5));
        params.set('lon', newState.coords.lon.toFixed(5));
      }

      if (newState.activeTab === 'map') {
        params.set('tab', 'map');
      }

      if (newState.vs) {
        params.set('vs', newState.vs);
      }

      const queryString = params.toString();
      const targetPath = newState.viewMode === 'map' ? '/map' : '/';
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
  }, [state.viewMode, state.activeTab, state.refcat, state.coords?.lat, state.coords?.lon, state.vs, syncToUrl]);

  // Handle native browser back/forward buttons (popstate)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePopState = () => {
      const parsed = parseUrlState();
      if (onUrlStateChange) {
        onUrlStateChange(parsed);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [onUrlStateChange]);

  return {
    syncToUrl,
    parseUrlState,
  };
}
