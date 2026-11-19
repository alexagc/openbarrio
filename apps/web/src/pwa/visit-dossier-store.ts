import {
  PropertyAuditReport,
  SavedVisitDossier,
  SavedVisitDossierSummary,
  VISIT_MODE_DOSSIER_DB_NAME,
  VISIT_MODE_DOSSIER_STORE_NAME,
  VISIT_MODE_MAX_DOSSIERS,
  VISIT_MODE_SCHEMA_VERSION,
  computeLruEvictionIds,
  normalizeVisitDossierId,
} from '@openbarrio/core';

export type VisitStorageErrorReason = 'unavailable' | 'quota_exceeded';

export class VisitStorageUnavailableError extends Error {
  public readonly reason: VisitStorageErrorReason;

  constructor(reason: VisitStorageErrorReason, message: string) {
    super(message);
    this.name = 'VisitStorageUnavailableError';
    this.reason = reason;
  }
}

export interface VisitDossierStorageOptions {
  idbFactory?: IDBFactory;
  now?: () => Date;
  maxEntries?: number;
}

export interface SaveVisitDossierOptions {
  profileId?: string | null;
  checklist?: unknown | null;
  now?: Date;
}

export interface SaveVisitDossierResult {
  saved: SavedVisitDossier;
  evictedIds: string[];
}

function cloneReport(report: PropertyAuditReport): PropertyAuditReport {
  try {
    return JSON.parse(JSON.stringify(report)) as PropertyAuditReport;
  } catch {
    return report;
  }
}

function toSummary(entry: SavedVisitDossier): SavedVisitDossierSummary {
  return {
    id: entry.id,
    savedAt: entry.savedAt,
    lastAccessedAt: entry.lastAccessedAt,
    label: entry.label,
    municipality: entry.municipality,
    overallScore: entry.overallScore,
    ...(entry.trafficLight ? { trafficLight: entry.trafficLight } : {}),
  };
}

function mapDomError(err: unknown): VisitStorageUnavailableError {
  const errName = (err as { name?: string } | undefined)?.name || '';
  if (errName === 'QuotaExceededError' || errName === 'NS_ERROR_DOM_QUOTA_REACHED') {
    return new VisitStorageUnavailableError(
      'quota_exceeded',
      'Local visit storage quota exceeded.'
    );
  }
  return new VisitStorageUnavailableError(
    'unavailable',
    'IndexedDB storage is unavailable in this browsing context.'
  );
}

/**
 * Local-only IndexedDB persistence for Visit Mode dossiers (`ob-dossier-v1`).
 * Never syncs to servers and enforces a deterministic LRU cap of 10 dossiers.
 */
export class VisitDossierStorage {
  private idbFactory?: IDBFactory;
  private now: () => Date;
  private readonly maxEntries: number;

  constructor(options: VisitDossierStorageOptions = {}) {
    this.idbFactory = options.idbFactory;
    this.now = options.now ?? (() => new Date());
    this.maxEntries = options.maxEntries ?? VISIT_MODE_MAX_DOSSIERS;
  }

  setIdbFactory(factory?: IDBFactory): void {
    this.idbFactory = factory;
  }

  setNow(nowFn: () => Date): void {
    this.now = nowFn;
  }

  isSupported(): boolean {
    const factory =
      this.idbFactory ??
      (typeof globalThis !== 'undefined' ? globalThis.indexedDB : undefined);
    return Boolean(factory && typeof factory.open === 'function');
  }

  private getFactory(): IDBFactory {
    const factory =
      this.idbFactory ??
      (typeof globalThis !== 'undefined' ? globalThis.indexedDB : undefined);
    if (!factory || typeof factory.open !== 'function') {
      throw new VisitStorageUnavailableError(
        'unavailable',
        'IndexedDB is not supported in this browser.'
      );
    }
    return factory;
  }

  private openDatabase(): Promise<IDBDatabase> {
    const factory = this.getFactory();

    return new Promise<IDBDatabase>((resolve, reject) => {
      let req: IDBOpenDBRequest;
      try {
        req = factory.open(VISIT_MODE_DOSSIER_DB_NAME, VISIT_MODE_SCHEMA_VERSION);
      } catch (err) {
        reject(mapDomError(err));
        return;
      }

      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(VISIT_MODE_DOSSIER_STORE_NAME)) {
          db.createObjectStore(VISIT_MODE_DOSSIER_STORE_NAME, { keyPath: 'id' });
        }
      };

      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(mapDomError(req.error));
      req.onblocked = () =>
        reject(
          new VisitStorageUnavailableError(
            'unavailable',
            'IndexedDB connection blocked.'
          )
        );
    });
  }

  async saveDossierForVisit(
    report: PropertyAuditReport,
    options: SaveVisitDossierOptions = {}
  ): Promise<SaveVisitDossierResult> {
    const id = normalizeVisitDossierId(report.property.cadastralReference);
    if (!id) {
      throw new Error('Cannot save visit dossier without a cadastral reference.');
    }

    const currentNow = options.now ?? this.now();
    const nowIso = currentNow.toISOString();

    const streetLine = [report.property.address.street, report.property.address.number]
      .filter(Boolean)
      .join(' ')
      .trim();

    const record: SavedVisitDossier = {
      id,
      schemaVersion: VISIT_MODE_SCHEMA_VERSION,
      savedAt: nowIso,
      lastAccessedAt: nowIso,
      label: streetLine || id,
      municipality: report.property.address.municipality || '',
      overallScore: report.score.overallScore,
      ...(report.score.trafficLight ? { trafficLight: report.score.trafficLight } : {}),
      report: cloneReport(report),
      sourcesSnapshotAtSave: report.layers ? { ...report.layers } : {},
      profileId: options.profileId ?? null,
      checklist: options.checklist ?? null,
    };

    const db = await this.openDatabase();
    let evictedIds: string[] = [];

    try {
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(VISIT_MODE_DOSSIER_STORE_NAME, 'readwrite');
        const store = tx.objectStore(VISIT_MODE_DOSSIER_STORE_NAME);

        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(mapDomError(tx.error));
        tx.onabort = () => reject(mapDomError(tx.error));

        const putReq = store.put(record);
        putReq.onerror = () => reject(mapDomError(putReq.error));
        putReq.onsuccess = () => {
          const getAllReq = store.getAll();
          getAllReq.onerror = () => reject(mapDomError(getAllReq.error));
          getAllReq.onsuccess = () => {
            const allEntries = (getAllReq.result || []) as SavedVisitDossier[];
            evictedIds = computeLruEvictionIds(allEntries, this.maxEntries);
            for (const evictId of evictedIds) {
              store.delete(evictId);
            }
          };
        };
      });
    } finally {
      db.close();
    }

    if (
      typeof navigator !== 'undefined' &&
      navigator.storage &&
      typeof navigator.storage.persist === 'function'
    ) {
      navigator.storage.persist().catch(() => false);
    }

    return { saved: record, evictedIds };
  }

  async getSavedDossier(
    refcat: string,
    options: { touch?: boolean; now?: Date } = {}
  ): Promise<SavedVisitDossier | null> {
    const id = normalizeVisitDossierId(refcat);
    if (!id) return null;

    const shouldTouch = options.touch !== false;
    const db = await this.openDatabase();

    try {
      return await new Promise<SavedVisitDossier | null>((resolve, reject) => {
        const mode: IDBTransactionMode = shouldTouch ? 'readwrite' : 'readonly';
        const tx = db.transaction(VISIT_MODE_DOSSIER_STORE_NAME, mode);
        const store = tx.objectStore(VISIT_MODE_DOSSIER_STORE_NAME);
        let result: SavedVisitDossier | null = null;

        tx.oncomplete = () => resolve(result);
        tx.onerror = () => reject(mapDomError(tx.error));
        tx.onabort = () => reject(mapDomError(tx.error));

        const getReq = store.get(id);
        getReq.onerror = () => reject(mapDomError(getReq.error));
        getReq.onsuccess = () => {
          const found = (getReq.result as SavedVisitDossier | undefined) || null;
          if (!found) {
            result = null;
            return;
          }
          if (shouldTouch) {
            const updated: SavedVisitDossier = {
              ...found,
              lastAccessedAt: (options.now ?? this.now()).toISOString(),
            };
            result = updated;
            store.put(updated);
          } else {
            result = found;
          }
        };
      });
    } finally {
      db.close();
    }
  }

  async listSavedDossiers(): Promise<SavedVisitDossierSummary[]> {
    const db = await this.openDatabase();

    try {
      const entries = await new Promise<SavedVisitDossier[]>((resolve, reject) => {
        const tx = db.transaction(VISIT_MODE_DOSSIER_STORE_NAME, 'readonly');
        const store = tx.objectStore(VISIT_MODE_DOSSIER_STORE_NAME);
        const getAllReq = store.getAll();

        getAllReq.onerror = () => reject(mapDomError(getAllReq.error));
        getAllReq.onsuccess = () =>
          resolve((getAllReq.result || []) as SavedVisitDossier[]);
        tx.onerror = () => reject(mapDomError(tx.error));
      });

      return entries
        .sort((a, b) => {
          const tA = Date.parse(a.lastAccessedAt);
          const tB = Date.parse(b.lastAccessedAt);
          return (Number.isNaN(tB) ? 0 : tB) - (Number.isNaN(tA) ? 0 : tA);
        })
        .map(toSummary);
    } finally {
      db.close();
    }
  }

  async removeSavedDossier(refcat: string): Promise<void> {
    const id = normalizeVisitDossierId(refcat);
    if (!id) return;

    const db = await this.openDatabase();
    try {
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(VISIT_MODE_DOSSIER_STORE_NAME, 'readwrite');
        const store = tx.objectStore(VISIT_MODE_DOSSIER_STORE_NAME);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(mapDomError(tx.error));
        tx.onabort = () => reject(mapDomError(tx.error));
        store.delete(id);
      });
    } finally {
      db.close();
    }
  }

  async clearSavedDossiers(): Promise<void> {
    const db = await this.openDatabase();
    try {
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(VISIT_MODE_DOSSIER_STORE_NAME, 'readwrite');
        const store = tx.objectStore(VISIT_MODE_DOSSIER_STORE_NAME);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(mapDomError(tx.error));
        tx.onabort = () => reject(mapDomError(tx.error));
        store.clear();
      });
    } finally {
      db.close();
    }
  }
}

export const defaultVisitDossierStorage = new VisitDossierStorage();
