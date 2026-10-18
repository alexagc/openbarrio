import { findExtractorForUrl } from './extractors/index.js';
import { OpenBarrioWidget } from './ui/widget.js';
import {
  AuditResponse,
  ExtensionConfig,
  ExtensionResponse,
} from '../shared/messages.js';

let widgetInstance: OpenBarrioWidget | null = null;

async function runAuditInjection(): Promise<void> {
  const currentUrl = window.location.href;
  const extractor = findExtractorForUrl(currentUrl);

  if (!extractor) {
    return;
  }

  // Extract property data from DOM / JSON-LD
  let data = extractor.extract(document, currentUrl);

  // If coordinates/refcat are not immediately available (SPA hydration delay), retry briefly
  if (!data || (!data.coordinates && !data.cadastralReference)) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    data = extractor.extract(document, currentUrl);
  }

  // If still no georeference or cadastral data, exit silently without disrupting user
  if (!data || (!data.coordinates && !data.cadastralReference)) {
    return;
  }

  // Initialize widget and show skeleton loader
  if (!widgetInstance) {
    widgetInstance = new OpenBarrioWidget();
  }
  const portalName = extractor.portal === 'idealista' ? 'Idealista' : 'Fotocasa';
  widgetInstance.showLoading(portalName);

  // Fetch extension configuration for web dashboard URL
  let webUrl = 'http://localhost:3000';
  try {
    const configRes = (await chrome.runtime.sendMessage({
      type: 'GET_CONFIG',
    })) as ExtensionResponse<ExtensionConfig>;
    if (configRes && configRes.success && configRes.data) {
      webUrl = configRes.data.webUrl;
    }
  } catch {
    // Fall back to default webUrl
  }

  // Request audit report from background service worker
  try {
    let auditRes: AuditResponse;
    if (data.cadastralReference) {
      auditRes = (await chrome.runtime.sendMessage({
        type: 'AUDIT_REFCAT',
        payload: { refcat: data.cadastralReference },
      })) as AuditResponse;
    } else if (data.coordinates) {
      auditRes = (await chrome.runtime.sendMessage({
        type: 'AUDIT_COORDS',
        payload: {
          lat: data.coordinates.latitude,
          lon: data.coordinates.longitude,
        },
      })) as AuditResponse;
    } else {
      return;
    }

    if (auditRes && auditRes.success && auditRes.data) {
      widgetInstance.showReport(auditRes.data, webUrl);
    } else {
      widgetInstance.showError(
        auditRes?.error || 'Inmueble no localizado en Catastro',
        webUrl
      );
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error de conexión';
    widgetInstance.showError(msg, webUrl);
  }
}

// Execution guard: run on document ready or immediately if already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    runAuditInjection().catch(() => {});
  });
} else {
  runAuditInjection().catch(() => {});
}

// Support for Single Page Application client-side navigation (e.g. Next.js / history API)
let lastUrl = window.location.href;
const observer = new MutationObserver(() => {
  if (window.location.href !== lastUrl) {
    lastUrl = window.location.href;
    runAuditInjection().catch(() => {});
  }
});
observer.observe(document.body, { childList: true, subtree: true });
