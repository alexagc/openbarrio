import {
  BUNDLED_PORTAL_SELECTORS,
  validateRemoteSelectorsBundle,
  type RemoteSelectorsBundle,
} from '@openbarrio/core';

export const SELECTORS_STORAGE_KEY = 'openbarrio_selectors_bundle';
export const SELECTORS_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

interface StoredSelectorsEntry {
  fetchedAt: number;
  bundle: RemoteSelectorsBundle;
}

export interface SelectorsResolution {
  bundle: RemoteSelectorsBundle;
  source: 'remote' | 'cache' | 'bundled_fallback';
  fallbackReason?: string;
}

async function readSelectorsCache(now: number): Promise<RemoteSelectorsBundle | null> {
  if (typeof chrome === 'undefined' || !chrome.storage?.local) {
    return null;
  }
  try {
    const result = await chrome.storage.local.get(SELECTORS_STORAGE_KEY);
    const entry = result[SELECTORS_STORAGE_KEY] as StoredSelectorsEntry | undefined;
    if (!entry || !entry.bundle || typeof entry.fetchedAt !== 'number') {
      return null;
    }
    if (now - entry.fetchedAt > SELECTORS_CACHE_TTL_MS) {
      return null;
    }
    const validation = validateRemoteSelectorsBundle(
      JSON.stringify(entry.bundle),
      BUNDLED_PORTAL_SELECTORS.version
    );
    return validation.valid ? validation.bundle : null;
  } catch {
    return null;
  }
}

async function writeSelectorsCache(bundle: RemoteSelectorsBundle, now: number): Promise<void> {
  if (typeof chrome === 'undefined' || !chrome.storage?.local) {
    return;
  }
  try {
    const entry: StoredSelectorsEntry = { fetchedAt: now, bundle };
    await chrome.storage.local.set({ [SELECTORS_STORAGE_KEY]: entry });
  } catch {
    // Non-fatal storage error
  }
}

/**
 * Fetches versioned JSON-only portal CSS selectors from the API, enforcing schema,
 * <=32 KB size limit, safe CSS characters, and non-downgrading semver.
 * Deterministically falls back to BUNDLED_PORTAL_SELECTORS on any error or anomaly.
 */
export async function loadRemoteSelectors(
  apiUrl: string,
  now = Date.now()
): Promise<SelectorsResolution> {
  const cached = await readSelectorsCache(now);
  if (cached) {
    return { bundle: cached, source: 'cache' };
  }

  const endpoint = `${apiUrl.replace(/\/+$/, '')}/api/v1/extension/selectors`;
  try {
    const res = await fetch(endpoint, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
      return {
        bundle: BUNDLED_PORTAL_SELECTORS,
        source: 'bundled_fallback',
        fallbackReason: `http_${res.status}`,
      };
    }

    const rawText = await res.text();
    const validation = validateRemoteSelectorsBundle(
      rawText,
      BUNDLED_PORTAL_SELECTORS.version
    );

    if (!validation.valid) {
      return {
        bundle: BUNDLED_PORTAL_SELECTORS,
        source: 'bundled_fallback',
        fallbackReason: validation.reason,
      };
    }

    await writeSelectorsCache(validation.bundle, now);
    return { bundle: validation.bundle, source: 'remote' };
  } catch {
    return {
      bundle: BUNDLED_PORTAL_SELECTORS,
      source: 'bundled_fallback',
      fallbackReason: 'network_error',
    };
  }
}
