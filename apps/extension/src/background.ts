import { PropertyAuditReport } from '@openbarrio/core';
import {
  ExtensionRequest,
  ExtensionResponse,
  AuditResponse,
  ExtensionConfig,
} from './shared/messages.js';
import { getStoredConfig, setStoredConfig } from './shared/config.js';

interface CacheEntry {
  timestamp: number;
  data: PropertyAuditReport;
}

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

async function getFromCache(key: string): Promise<PropertyAuditReport | null> {
  if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) {
    return null;
  }
  const result = await chrome.storage.local.get(key);
  const entry = result[key] as CacheEntry | undefined;
  if (!entry) {
    return null;
  }
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    await chrome.storage.local.remove(key);
    return null;
  }
  return entry.data;
}

async function saveToCache(key: string, data: PropertyAuditReport): Promise<void> {
  if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) {
    return;
  }
  const entry: CacheEntry = {
    timestamp: Date.now(),
    data,
  };
  await chrome.storage.local.set({ [key]: entry });
}

async function fetchAuditByCoords(
  apiUrl: string,
  lat: number,
  lon: number
): Promise<AuditResponse> {
  const cacheKey = `audit_coords_${lat.toFixed(6)}_${lon.toFixed(6)}`;
  const cached = await getFromCache(cacheKey);
  if (cached) {
    return { success: true, data: cached, cached: true };
  }

  const endpoint = `${apiUrl.replace(/\/+$/, '')}/api/v1/audit/coords?lat=${lat}&lon=${lon}`;
  try {
    const res = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      let errorMessage = `API error ${res.status}: ${res.statusText}`;
      try {
        const errorJson = await res.json();
        if (errorJson && typeof errorJson.detail === 'string') {
          errorMessage = errorJson.detail;
        } else if (errorJson && typeof errorJson.title === 'string') {
          errorMessage = errorJson.title;
        }
      } catch {
        // Fallback to HTTP status text
      }
      return { success: false, error: errorMessage };
    }

    const report = (await res.json()) as PropertyAuditReport;
    await saveToCache(cacheKey, report);
    return { success: true, data: report, cached: false };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Network connection failed';
    return { success: false, error: `Failed to contact OpenBarrio API: ${msg}` };
  }
}

async function fetchAuditByRefcat(
  apiUrl: string,
  refcat: string
): Promise<AuditResponse> {
  const cleanRefcat = refcat.trim().toUpperCase();
  const cacheKey = `audit_refcat_${cleanRefcat}`;
  const cached = await getFromCache(cacheKey);
  if (cached) {
    return { success: true, data: cached, cached: true };
  }

  const endpoint = `${apiUrl.replace(/\/+$/, '')}/api/v1/audit/refcat/${encodeURIComponent(cleanRefcat)}`;
  try {
    const res = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      let errorMessage = `API error ${res.status}: ${res.statusText}`;
      try {
        const errorJson = await res.json();
        if (errorJson && typeof errorJson.detail === 'string') {
          errorMessage = errorJson.detail;
        } else if (errorJson && typeof errorJson.title === 'string') {
          errorMessage = errorJson.title;
        }
      } catch {
        // Fallback to HTTP status text
      }
      return { success: false, error: errorMessage };
    }

    const report = (await res.json()) as PropertyAuditReport;
    await saveToCache(cacheKey, report);
    return { success: true, data: report, cached: false };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Network connection failed';
    return { success: false, error: `Failed to contact OpenBarrio API: ${msg}` };
  }
}

async function checkApiHealth(apiUrl: string): Promise<ExtensionResponse<{ healthy: boolean; status: number }>> {
  try {
    const res = await fetch(`${apiUrl.replace(/\/+$/, '')}/docs`, {
      method: 'HEAD',
    });
    return {
      success: res.ok,
      data: { healthy: res.ok, status: res.status },
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unreachable',
      data: { healthy: false, status: 0 },
    };
  }
}

export async function handleExtensionMessage(
  request: ExtensionRequest
): Promise<ExtensionResponse> {
  const config: ExtensionConfig = await getStoredConfig();

  switch (request.type) {
    case 'AUDIT_COORDS':
      return await fetchAuditByCoords(
        config.apiUrl,
        request.payload.lat,
        request.payload.lon
      );

    case 'AUDIT_REFCAT':
      return await fetchAuditByRefcat(
        config.apiUrl,
        request.payload.refcat
      );

    case 'GET_CONFIG':
      return { success: true, data: config };

    case 'SET_CONFIG': {
      const updated = await setStoredConfig(request.payload);
      return { success: true, data: updated };
    }

    case 'CHECK_HEALTH':
      return await checkApiHealth(config.apiUrl);

    default:
      return { success: false, error: 'Unknown extension request type' };
  }
}

// Register Chrome message listener
if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    (async () => {
      try {
        const response = await handleExtensionMessage(message as ExtensionRequest);
        sendResponse(response);
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Internal background error';
        sendResponse({ success: false, error: errorMsg });
      }
    })();
    return true; // Keep message channel open for asynchronous response
  });
}
