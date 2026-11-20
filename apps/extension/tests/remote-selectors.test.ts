import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { JSDOM } from 'jsdom';
import { BUNDLED_PORTAL_SELECTORS, SELECTORS_MAX_BYTES } from '@openbarrio/core';
import { loadRemoteSelectors, SELECTORS_STORAGE_KEY } from '../src/shared/selectors.js';
import { handleExtensionMessage } from '../src/background.js';
import { IdealistaExtractor } from '../src/content/extractors/idealista.js';

describe('Remote Selector Config Loader & Bundled Fallback (MV3 Safe)', () => {
  const storageMap = new Map<string, unknown>();

  beforeEach(() => {
    storageMap.clear();
    (globalThis as any).chrome = {
      storage: {
        local: {
          get: vi.fn(async (key: string) => ({ [key]: storageMap.get(key) })),
          set: vi.fn(async (obj: Record<string, unknown>) => {
            for (const [k, v] of Object.entries(obj)) storageMap.set(k, v);
          }),
          remove: vi.fn(async (key: string) => storageMap.delete(key)),
        },
      },
      runtime: {
        onMessage: { addListener: vi.fn() },
      },
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('loads valid remote selector upgrade, validates schema & stores 24h cache', async () => {
    const upgraded = structuredClone(BUNDLED_PORTAL_SELECTORS);
    upgraded.version = '1.5.1';
    upgraded.portals.idealista.title = ['.new-idealista-heading', 'h1'];

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(upgraded), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      })
    );

    const first = await loadRemoteSelectors('https://api.openbarrio.org', 1_000_000);
    expect(first.source).toBe('remote');
    expect(first.bundle.version).toBe('1.5.1');
    expect(storageMap.has(SELECTORS_STORAGE_KEY)).toBe(true);
    expect(fetchSpy).toHaveBeenCalledTimes(1);

    // Second call within 24h hits cache without invoking fetch
    const second = await loadRemoteSelectors('https://api.openbarrio.org', 1_000_000 + 60_000);
    expect(second.source).toBe('cache');
    expect(second.bundle.version).toBe('1.5.1');
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it('falls back deterministically to BUNDLED_PORTAL_SELECTORS on oversize, downgrade, invalid JSON, schema fail, unsafe CSS, or network failure', async () => {
    // 1. Oversize (> 32 KB)
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response('x'.repeat(SELECTORS_MAX_BYTES + 100), { status: 200 })
    );
    expect(await loadRemoteSelectors('https://api.openbarrio.org')).toMatchObject({
      source: 'bundled_fallback',
      fallbackReason: 'oversize',
      bundle: BUNDLED_PORTAL_SELECTORS,
    });

    // 2. Version downgrade (1.3.2 < 1.5.0)
    const downgraded = { ...BUNDLED_PORTAL_SELECTORS, version: '1.3.2' };
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(downgraded), { status: 200 })
    );
    expect(await loadRemoteSelectors('https://api.openbarrio.org')).toMatchObject({
      source: 'bundled_fallback',
      fallbackReason: 'version_downgrade',
      bundle: BUNDLED_PORTAL_SELECTORS,
    });

    // 3. Malformed JSON
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response('{not-json', { status: 200 })
    );
    expect(await loadRemoteSelectors('https://api.openbarrio.org')).toMatchObject({
      source: 'bundled_fallback',
      fallbackReason: 'invalid_json',
      bundle: BUNDLED_PORTAL_SELECTORS,
    });

    // 4. Schema invalid
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ version: '1.5.1' }), { status: 200 })
    );
    expect(await loadRemoteSelectors('https://api.openbarrio.org')).toMatchObject({
      source: 'bundled_fallback',
      fallbackReason: 'schema_invalid',
      bundle: BUNDLED_PORTAL_SELECTORS,
    });

    // 5. Unsafe script/CSS injection token
    const unsafe = structuredClone(BUNDLED_PORTAL_SELECTORS);
    unsafe.version = '1.5.2';
    unsafe.portals.fotocasa.title = ['javascript:alert(1)'];
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(unsafe), { status: 200 })
    );
    expect(await loadRemoteSelectors('https://api.openbarrio.org')).toMatchObject({
      source: 'bundled_fallback',
      fallbackReason: 'unsafe_selector',
      bundle: BUNDLED_PORTAL_SELECTORS,
    });

    // 6. Network failure
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('offline'));
    expect(await loadRemoteSelectors('https://api.openbarrio.org')).toMatchObject({
      source: 'bundled_fallback',
      fallbackReason: 'network_error',
      bundle: BUNDLED_PORTAL_SELECTORS,
    });
  });

  it('serves GET_SELECTORS extension message and lets extractors consume overridden selectors', async () => {
    const upgraded = structuredClone(BUNDLED_PORTAL_SELECTORS);
    upgraded.version = '1.5.2';
    upgraded.portals.idealista.title = ['.v14-custom-title'];

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(upgraded), { status: 200 })
    );

    const msgRes = await handleExtensionMessage({ type: 'GET_SELECTORS' });
    expect(msgRes.success).toBe(true);
    const bundle = msgRes.data as typeof BUNDLED_PORTAL_SELECTORS;
    expect(bundle.version).toBe('1.5.2');

    const dom = new JSDOM(
      `<html><body><div class="v14-custom-title">Ático Renovado Chamberí</div><span data-latitude="40.42" data-longitude="-3.70"></span></body></html>`,
      { url: 'https://www.idealista.com/inmueble/99999999/' }
    );
    const extractor = new IdealistaExtractor();
    extractor.setSelectorConfig(bundle.portals.idealista);
    const extracted = extractor.extract(dom.window.document, 'https://www.idealista.com/inmueble/99999999/');
    expect(extracted?.title).toBe('Ático Renovado Chamberí');
  });
});
