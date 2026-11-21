export type InMemoryIdbFailure = 'SecurityError' | 'QuotaExceededError';

function cloneValue<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function createDomError(name: string, message: string): DOMException {
  return new DOMException(message, name);
}

/**
 * Spec-faithful in-memory IDBFactory mock for deterministic Vitest testing
 * of IndexedDB LRU persistence and private-browsing / quota failure modes.
 */
export class InMemoryIdbFactory {
  private readonly databases = new Map<
    string,
    { version: number; stores: Map<string, Map<string, Record<string, unknown>>> }
  >();
  private failWith?: InMemoryIdbFailure;

  setFailWith(failure?: InMemoryIdbFailure): void {
    this.failWith = failure;
  }

  clearAll(): void {
    this.databases.clear();
  }

  open(name: string, version = 1): IDBOpenDBRequest {
    const req: Record<string, any> = {
      result: null,
      error: null,
      onupgradeneeded: null,
      onsuccess: null,
      onerror: null,
      onblocked: null,
    };

    queueMicrotask(() => {
      if (this.failWith === 'SecurityError') {
        req.error = createDomError('SecurityError', 'IndexedDB blocked in private mode');
        req.onerror?.({ target: req });
        return;
      }

      let dbRecord = this.databases.get(name);
      const needsUpgrade = !dbRecord || version > dbRecord.version;
      if (!dbRecord) {
        dbRecord = { version, stores: new Map() };
        this.databases.set(name, dbRecord);
      } else if (version > dbRecord.version) {
        dbRecord.version = version;
      }

      const dbApi: Record<string, any> = {
        name,
        version: dbRecord.version,
        objectStoreNames: {
          contains: (storeName: string) => dbRecord!.stores.has(storeName),
        },
        createObjectStore: (storeName: string) => {
          if (!dbRecord!.stores.has(storeName)) {
            dbRecord!.stores.set(storeName, new Map());
          }
          return {};
        },
        close: () => {},
        transaction: (storeName: string, _mode: IDBTransactionMode = 'readonly') => {
          const storeMap = dbRecord!.stores.get(storeName);
          if (!storeMap) {
            throw createDomError('NotFoundError', `Store ${storeName} not found`);
          }

          const tx: Record<string, any> = {
            error: null,
            oncomplete: null,
            onerror: null,
            onabort: null,
            objectStore: () => storeApi,
          };

          let pendingOps = 0;
          let failed = false;

          const finishOp = () => {
            pendingOps -= 1;
            if (pendingOps === 0 && !failed) {
              queueMicrotask(() => {
                if (!failed) {
                  tx.oncomplete?.({ target: tx });
                }
              });
            }
          };

          const makeRequest = (executor: (innerReq: Record<string, any>) => void) => {
            pendingOps += 1;
            const innerReq: Record<string, any> = {
              result: undefined,
              error: null,
              onsuccess: null,
              onerror: null,
            };
            queueMicrotask(() => {
              if (failed) return;
              try {
                executor(innerReq);
                innerReq.onsuccess?.({ target: innerReq });
                finishOp();
              } catch (err) {
                failed = true;
                innerReq.error = err;
                tx.error = err;
                innerReq.onerror?.({ target: innerReq });
                tx.onerror?.({ target: tx });
              }
            });
            return innerReq as unknown as IDBRequest;
          };

          const storeApi = {
            put: (val: Record<string, unknown>) =>
              makeRequest((innerReq) => {
                if (this.failWith === 'QuotaExceededError') {
                  throw createDomError('QuotaExceededError', 'Storage quota exceeded');
                }
                const key = String(val.id);
                storeMap.set(key, cloneValue(val));
                innerReq.result = key;
              }),
            get: (key: string) =>
              makeRequest((innerReq) => {
                const found = storeMap.get(String(key));
                innerReq.result = found ? cloneValue(found) : undefined;
              }),
            getAll: () =>
              makeRequest((innerReq) => {
                innerReq.result = Array.from(storeMap.values()).map((v) => cloneValue(v));
              }),
            delete: (key: string) =>
              makeRequest((innerReq) => {
                storeMap.delete(String(key));
                innerReq.result = undefined;
              }),
            clear: () =>
              makeRequest((innerReq) => {
                storeMap.clear();
                innerReq.result = undefined;
              }),
          };

          return tx as unknown as IDBTransaction;
        },
      };

      req.result = dbApi;
      if (needsUpgrade) {
        req.onupgradeneeded?.({ target: req });
      }
      req.onsuccess?.({ target: req });
    });

    return req as unknown as IDBOpenDBRequest;
  }
}
