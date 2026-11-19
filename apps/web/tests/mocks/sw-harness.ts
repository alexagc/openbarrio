/// <reference types="node" />
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { vi } from 'vitest';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const swFilePath = path.resolve(__dirname, '../../public/sw.js');

export class InMemoryCache {
  private readonly entries = new Map<string, Response>();

  private normalizeKey(requestOrUrl: RequestInfo | URL): string {
    const raw =
      typeof requestOrUrl === 'string'
        ? requestOrUrl
        : requestOrUrl instanceof URL
          ? requestOrUrl.toString()
          : requestOrUrl.url;
    const parsed = new URL(raw, 'https://openbarrio.org');
    return parsed.pathname + parsed.search;
  }

  async match(requestOrUrl: RequestInfo | URL): Promise<Response | undefined> {
    const found = this.entries.get(this.normalizeKey(requestOrUrl));
    return found ? found.clone() : undefined;
  }

  async put(requestOrUrl: RequestInfo | URL, response: Response): Promise<void> {
    this.entries.set(this.normalizeKey(requestOrUrl), response.clone());
  }

  keys(): string[] {
    return Array.from(this.entries.keys());
  }
}

export class InMemoryCacheStorage {
  private readonly stores = new Map<string, InMemoryCache>();

  async open(cacheName: string): Promise<InMemoryCache> {
    let cache = this.stores.get(cacheName);
    if (!cache) {
      cache = new InMemoryCache();
      this.stores.set(cacheName, cache);
    }
    return cache;
  }

  async keys(): Promise<string[]> {
    return Array.from(this.stores.keys());
  }

  async delete(cacheName: string): Promise<boolean> {
    return this.stores.delete(cacheName);
  }

  async match(requestOrUrl: RequestInfo | URL): Promise<Response | undefined> {
    for (const cache of this.stores.values()) {
      const hit = await cache.match(requestOrUrl);
      if (hit) return hit;
    }
    return undefined;
  }
}

export interface SwHarness {
  swSource: string;
  caches: InMemoryCacheStorage;
  fetchMock: ReturnType<typeof vi.fn>;
  skipWaitingSpy: ReturnType<typeof vi.fn>;
  claimSpy: ReturnType<typeof vi.fn>;
  dispatchInstall: () => Promise<void>;
  dispatchActivate: () => Promise<void>;
  dispatchMessage: (data: unknown) => Promise<void>;
  dispatchFetch: (
    url: string,
    init?: { method?: string; mode?: RequestMode }
  ) => Promise<{ intercepted: boolean; response?: Response }>;
}

/**
 * Executes the real `apps/web/public/sw.js` file inside an isolated mocked ServiceWorkerGlobalScope.
 */
export function createSwHarness(
  fetchImpl?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>
): SwHarness {
  const swSource = fs.readFileSync(swFilePath, 'utf8');
  const caches = new InMemoryCacheStorage();
  const skipWaitingSpy = vi.fn(async () => {});
  const claimSpy = vi.fn(async () => {});
  const fetchMock = vi.fn(
    fetchImpl ??
      (async (input: RequestInfo | URL) => {
        const rawUrl =
          typeof input === 'string'
            ? input
            : input instanceof URL
              ? input.toString()
              : input.url;
        return new Response(`body:${rawUrl}`, {
          status: 200,
          headers: { 'Content-Type': 'text/plain' },
        });
      })
  );

  const listeners = new Map<string, Array<(event: any) => void>>();

  const selfScope = {
    location: new URL('https://openbarrio.org/sw.js'),
    skipWaiting: skipWaitingSpy,
    clients: {
      claim: claimSpy,
    },
    addEventListener: (type: string, cb: (event: any) => void) => {
      const list = listeners.get(type) ?? [];
      list.push(cb);
      listeners.set(type, list);
    },
  };

  const ScopedRequest = function (input: RequestInfo | URL, init?: RequestInit) {
    const resolved =
      typeof input === 'string' && input.startsWith('/')
        ? new URL(input, 'https://openbarrio.org').toString()
        : input;
    return new Request(resolved, init);
  } as unknown as typeof Request;

  const runner = new Function(
    'self',
    'caches',
    'fetch',
    'Request',
    'Response',
    'URL',
    swSource
  );
  runner(selfScope, caches, fetchMock, ScopedRequest, Response, URL);

  async function runExtendable(type: string, extra: Record<string, unknown> = {}) {
    const promises: Promise<unknown>[] = [];
    const event = {
      ...extra,
      waitUntil: (p: Promise<unknown>) => {
        promises.push(Promise.resolve(p));
      },
    };
    for (const cb of listeners.get(type) ?? []) {
      cb(event);
    }
    await Promise.all(promises);
  }

  return {
    swSource,
    caches,
    fetchMock,
    skipWaitingSpy,
    claimSpy,
    dispatchInstall: () => runExtendable('install'),
    dispatchActivate: () => runExtendable('activate'),
    dispatchMessage: (data: unknown) => runExtendable('message', { data }),
    dispatchFetch: async (url: string, init = {}) => {
      const fullUrl = url.startsWith('http') ? url : `https://openbarrio.org${url}`;
      const request = {
        url: fullUrl,
        method: init.method ?? 'GET',
        mode: init.mode ?? 'cors',
      } as Request;

      let responsePromise: Promise<Response> | undefined;
      const waitUntilPromises: Promise<unknown>[] = [];

      const event = {
        request,
        respondWith: (p: Promise<Response> | Response) => {
          responsePromise = Promise.resolve(p);
        },
        waitUntil: (p: Promise<unknown>) => {
          waitUntilPromises.push(Promise.resolve(p));
        },
      };

      for (const cb of listeners.get('fetch') ?? []) {
        cb(event);
      }

      if (!responsePromise) {
        return { intercepted: false };
      }

      const response = await responsePromise;
      await Promise.allSettled(waitUntilPromises);
      return { intercepted: true, response };
    },
  };
}
