import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import {
  VISIT_MODE_MAX_DOSSIERS,
  VISIT_MODE_STALE_WARN_DAYS,
} from '@openbarrio/core';
import { LanguageProvider } from '../src/i18n';
import { AuditDossier } from '../src/components/AuditDossier';
import { SwUpdateToast } from '../src/components/common/SwUpdateToast';
import {
  VisitDossierStorage,
  VisitStorageUnavailableError,
  defaultVisitDossierStorage,
} from '../src/pwa/visit-dossier-store';
import { usePwaStore } from '../src/store/pwa.store';
import { useWorkspaceStore } from '../src/store/workspace.store';
import { generateDeterministicAuditFromRefcat, generateMockReport } from './mocks/offline-simulator';
import { InMemoryIdbFactory } from './mocks/in-memory-idb';
import { createSwHarness } from './mocks/sw-harness';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, '../public');
const webPkgJson = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf8')
) as { version: string };

describe('PWA Manifest, Headers & Service Worker Behaviour (v1.5.0 Block 1)', () => {
  it('keeps sw.js cache version synchronized with package.json and enforces no-cache headers', () => {
    const swText = fs.readFileSync(path.join(publicDir, 'sw.js'), 'utf8');
    expect(swText).toContain(`const APP_VERSION = '${webPkgJson.version}';`);

    const headersText = fs.readFileSync(path.join(publicDir, '_headers'), 'utf8');
    expect(headersText).toContain('/sw.js');
    expect(headersText).toContain('Cache-Control: no-cache');
    expect(headersText).toContain('Service-Worker-Allowed: /');
    expect(headersText).toContain('/manifest.webmanifest');

    const workerJs = fs.readFileSync(path.join(publicDir, '_worker.js'), 'utf8');
    expect(workerJs).toContain("url.pathname === '/sw.js'");
    expect(workerJs).toContain('no-cache, no-store, must-revalidate');
    expect(workerJs).toContain('Service-Worker-Allowed');
    expect(workerJs).toContain("url.pathname === '/manifest.webmanifest'");

    const manifest = JSON.parse(
      fs.readFileSync(path.join(publicDir, 'manifest.webmanifest'), 'utf8')
    );
    expect(manifest.short_name).toBe('OpenBarrio');
    expect(manifest.start_url).toBe('/');
    expect(manifest.display).toBe('standalone');
    expect(
      manifest.icons.some((icon: { purpose?: string }) => icon.purpose === 'maskable')
    ).toBe(true);
    for (const icon of manifest.icons) {
      const iconPath = path.join(publicDir, String(icon.src).replace(/^\//, ''));
      expect(fs.existsSync(iconPath)).toBe(true);
    }
  });

  it('precaches shell on install WITHOUT calling skipWaiting automatically', async () => {
    const harness = createSwHarness();
    await harness.dispatchInstall();

    expect(harness.skipWaitingSpy).not.toHaveBeenCalled();

    const shellCache = await harness.caches.open(`ob-shell-v${webPkgJson.version}`);
    expect(shellCache.keys()).toEqual(
      expect.arrayContaining([
        '/',
        '/index.html',
        '/manifest.webmanifest',
        '/icons/icon.svg',
        '/metodologia',
        '/privacidad',
      ])
    );

    // Waiting SW activates ONLY when user confirms via SKIP_WAITING message
    await harness.dispatchMessage({ type: 'SKIP_WAITING' });
    expect(harness.skipWaitingSpy).toHaveBeenCalledTimes(1);
  });

  it('purges obsolete ob-shell-v* caches on activate while keeping current and unrelated caches', async () => {
    const harness = createSwHarness();
    await harness.caches.open('ob-shell-v1.3.0');
    await harness.caches.open('ob-shell-v1.3.2');
    await harness.caches.open(`ob-shell-v${webPkgJson.version}`);
    await harness.caches.open('unrelated-user-cache');

    await harness.dispatchActivate();

    const remainingKeys = await harness.caches.keys();
    expect(remainingKeys).toContain(`ob-shell-v${webPkgJson.version}`);
    expect(remainingKeys).toContain('unrelated-user-cache');
    expect(remainingKeys).not.toContain('ob-shell-v1.3.0');
    expect(remainingKeys).not.toContain('ob-shell-v1.3.2');
    expect(harness.claimSpy).toHaveBeenCalledTimes(1);

    // Kill-switch CLEAR_SHELL_CACHE purges shell caches cleanly
    await harness.dispatchMessage({ type: 'CLEAR_SHELL_CACHE' });
    expect(await harness.caches.keys()).toEqual(['unrelated-user-cache']);
  });

  it('never caches excluded API endpoints, POST requests, /sw.js, or cross-origin requests', async () => {
    const harness = createSwHarness();
    await harness.dispatchInstall();

    const uncachedUrls = [
      { url: '/api/v1/listing/resolve', method: 'POST' },
      { url: '/api/v1/telemetry', method: 'POST' },
      { url: '/api/v1/status/sources', method: 'GET' },
      { url: '/api/v1/tiles/census_tracts.pmtiles', method: 'GET' },
      { url: '/api/v1/audit/refcat/9872023VH5797S0001WX', method: 'GET' },
      { url: '/sw.js', method: 'GET' },
      { url: 'https://www.cartociudad.es/geocoder/api/geocoder/candidates?q=Gran+Via', method: 'GET' },
    ];

    for (const target of uncachedUrls) {
      const res = await harness.dispatchFetch(target.url, { method: target.method });
      expect(res.intercepted).toBe(false);
    }
  });

  it('serves static assets stale-while-revalidate and navigates offline via cached shell fallback', async () => {
    let networkOnline = true;
    let assetVersion = 1;

    const harness = createSwHarness(async (input) => {
      if (!networkOnline) {
        throw new TypeError('Offline');
      }
      const rawUrl = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
      if (rawUrl.includes('/assets/app.js')) {
        return new Response(`console.log("v${assetVersion}");`, { status: 200 });
      }
      return new Response('<html><body>OpenBarrio Shell</body></html>', { status: 200 });
    });

    await harness.dispatchInstall();

    // First static fetch populates cache
    const assetFetch1 = await harness.dispatchFetch('/assets/app.js');
    expect(assetFetch1.intercepted).toBe(true);
    expect(await assetFetch1.response!.text()).toBe('console.log("v1");');

    // Second static fetch returns cached v1 immediately while revalidating v2 in background
    assetVersion = 2;
    const assetFetch2 = await harness.dispatchFetch('/assets/app.js');
    expect(await assetFetch2.response!.text()).toBe('console.log("v1");');

    // Third fetch reflects background-revalidated v2
    const assetFetch3 = await harness.dispatchFetch('/assets/app.js');
    expect(await assetFetch3.response!.text()).toBe('console.log("v2");');

    // Offline navigation succeeds via cached shell fallback
    networkOnline = false;
    const navOffline = await harness.dispatchFetch('/metodologia', { mode: 'navigate' });
    expect(navOffline.intercepted).toBe(true);
    expect(navOffline.response!.status).toBe(200);
    expect(await navOffline.response!.text()).toContain('OpenBarrio Shell');
  });
});

describe('Saved Visit Dossier IndexedDB Store & LRU Eviction', () => {
  let idb: InMemoryIdbFactory;
  let storage: VisitDossierStorage;

  beforeEach(() => {
    idb = new InMemoryIdbFactory();
    storage = new VisitDossierStorage({ idbFactory: idb as unknown as IDBFactory });
  });

  it('persists full dossier + sourcesSnapshotAtSave and enforces max 10 LRU eviction respecting touch', async () => {
    expect(VISIT_MODE_MAX_DOSSIERS).toBe(10);
    const baseMs = Date.UTC(2026, 10, 1, 10, 0, 0);

    // Save 10 distinct dossiers (RC01 .. RC10)
    for (let i = 1; i <= 10; i++) {
      const refcat = `2807901VK4700A00${String(i).padStart(2, '0')}WX`;
      const report = generateDeterministicAuditFromRefcat(refcat);
      report.layers = {
        catastro: { status: 'ok', sourceName: 'Catastro OVC' },
        sica: { status: 'ok', sourceName: 'MITECO SICA' },
      };
      const result = await storage.saveDossierForVisit(report, {
        now: new Date(baseMs + i * 60_000),
      });
      expect(result.evictedIds).toEqual([]);
    }

    // Touch RC01 so RC02 becomes the least recently used entry
    const touched = await storage.getSavedDossier('2807901VK4700A0001WX', {
      now: new Date(baseMs + 20 * 60_000),
    });
    expect(touched?.sourcesSnapshotAtSave.catastro?.status).toBe('ok');

    // Save 11th dossier -> must evict RC02 (not touched RC01)
    const eleventhReport = generateDeterministicAuditFromRefcat('2807901VK4700A0011WX');
    const eleventhResult = await storage.saveDossierForVisit(eleventhReport, {
      now: new Date(baseMs + 25 * 60_000),
    });
    expect(eleventhResult.evictedIds).toEqual(['2807901VK4700A0002WX']);

    const list = await storage.listSavedDossiers();
    expect(list).toHaveLength(10);
    expect(list.some((item) => item.id === '2807901VK4700A0001WX')).toBe(true);
    expect(list.some((item) => item.id === '2807901VK4700A0002WX')).toBe(false);
    expect(list.some((item) => item.id === '2807901VK4700A0011WX')).toBe(true);
  });

  it('degrades gracefully on private browsing SecurityError and QuotaExceededError', async () => {
    const report = generateMockReport('madrid');

    idb.setFailWith('SecurityError');
    await expect(storage.saveDossierForVisit(report)).rejects.toBeInstanceOf(
      VisitStorageUnavailableError
    );

    idb.setFailWith('QuotaExceededError');
    try {
      await storage.saveDossierForVisit(report);
      expect.unreachable('Expected QuotaExceededError');
    } catch (err) {
      expect(err).toBeInstanceOf(VisitStorageUnavailableError);
      expect((err as VisitStorageUnavailableError).reason).toBe('quota_exceeded');
    }
  });
});

describe('Offline Visit Mode UI & Controlled SW Update Toast', () => {
  let idb: InMemoryIdbFactory;

  beforeEach(() => {
    idb = new InMemoryIdbFactory();
    defaultVisitDossierStorage.setIdbFactory(idb as unknown as IDBFactory);
    defaultVisitDossierStorage.setNow(() => new Date('2026-11-19T12:00:00.000Z'));

    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      value: true,
    });

    usePwaStore.setState({
      isOnline: true,
      hasPendingUpdate: false,
      toastDismissed: false,
      pendingUpdateAction: null,
      savedDossiers: [],
      activeSavedDossierMeta: null,
      storageError: null,
    });

    useWorkspaceStore.setState({
      viewMode: 'map',
      report: null,
      error: null,
      isLoading: false,
    });
  });

  afterEach(() => {
    defaultVisitDossierStorage.setIdbFactory(undefined);
    defaultVisitDossierStorage.setNow(() => new Date());
    vi.restoreAllMocks();
  });

  it('saves dossier via AuditDossier button, opens saved dossier offline with ZERO network calls, and disables certified PDF', async () => {
    const report = generateMockReport('madrid');
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(null, { status: 204 }));

    const { rerender } = render(
      <LanguageProvider initialLanguage="es">
        <AuditDossier report={report} />
      </LanguageProvider>
    );

    fireEvent.click(screen.getByTestId('dossier-save-visit-btn'));

    await waitFor(() => {
      expect(usePwaStore.getState().savedDossiers).toHaveLength(1);
    });

    // Visit mode telemetry event emitted when online
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(JSON.parse(String(fetchSpy.mock.calls[0]?.[1]?.body))).toEqual({
      event: 'visit_mode_enabled',
    });

    // Clear in-memory report and go offline
    fetchSpy.mockClear();
    Object.defineProperty(navigator, 'onLine', { configurable: true, value: false });

    let offlineReport: Awaited<
      ReturnType<ReturnType<typeof useWorkspaceStore.getState>['loadAuditByRefcat']>
    > = null;
    await act(async () => {
      usePwaStore.getState().setOnline(false);
      useWorkspaceStore.setState({ report: null });
      offlineReport = await useWorkspaceStore
        .getState()
        .loadAuditByRefcat(report.property.cadastralReference);
    });

    // Load saved dossier offline -> ZERO fetch calls
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(offlineReport?.property.cadastralReference).toBe(report.property.cadastralReference);

    rerender(
      <LanguageProvider initialLanguage="es">
        <AuditDossier report={offlineReport!} />
      </LanguageProvider>
    );

    const offlineBanner = screen.getByTestId('visit-mode-offline-banner');
    expect(offlineBanner.textContent).toContain('Sin conexión');
    expect(offlineBanner.textContent).toContain('2026');

    expect((screen.getByTestId('dossier-export-pdf-btn') as HTMLButtonElement).disabled).toBe(
      true
    );

    // Unsaved refcat while offline must return explicit error and ZERO synthetic fallback
    let missingOffline: Awaited<
      ReturnType<ReturnType<typeof useWorkspaceStore.getState>['loadAuditByRefcat']>
    > = null;
    await act(async () => {
      missingOffline = await useWorkspaceStore
        .getState()
        .loadAuditByRefcat('9999999AA9999A0001ZZ');
    });
    expect(missingOffline).toBeNull();
    expect(useWorkspaceStore.getState().error?.message).toBe('OFFLINE_DOSSIER_NOT_SAVED');
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('shows expiration warning when saved dossier is older than 30 days', async () => {
    const oldDate = new Date(
      Date.now() - (VISIT_MODE_STALE_WARN_DAYS + 15) * 86_400_000
    );
    defaultVisitDossierStorage.setNow(() => oldDate);

    const report = generateMockReport('barcelona');
    await defaultVisitDossierStorage.saveDossierForVisit(report);

    defaultVisitDossierStorage.setNow(() => new Date());
    Object.defineProperty(navigator, 'onLine', { configurable: true, value: false });
    act(() => {
      usePwaStore.getState().setOnline(false);
    });

    const loaded = await useWorkspaceStore
      .getState()
      .loadAuditByRefcat(report.property.cadastralReference);
    expect(loaded).not.toBeNull();

    render(
      <LanguageProvider initialLanguage="es">
        <AuditDossier report={loaded!} />
      </LanguageProvider>
    );

    expect(screen.getByTestId('visit-mode-expired-warning')).toBeTruthy();
  });

  it('keeps SW update pending until user clicks Update in SwUpdateToast', () => {
    const applySpy = vi.fn();
    act(() => {
      usePwaStore.getState().setPendingUpdate(applySpy);
    });

    render(
      <LanguageProvider initialLanguage="es">
        <SwUpdateToast />
      </LanguageProvider>
    );

    expect(screen.getByTestId('sw-update-toast')).toBeTruthy();
    expect(applySpy).not.toHaveBeenCalled();

    fireEvent.click(screen.getByTestId('sw-update-apply-btn'));
    expect(applySpy).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId('sw-update-toast')).toBeNull();
  });
});
