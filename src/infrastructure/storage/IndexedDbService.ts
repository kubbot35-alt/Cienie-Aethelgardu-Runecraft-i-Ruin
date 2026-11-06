import { IStorageService } from '../../domain/interfaces/IStorageService';

export class IndexedDbService implements IStorageService {
  private readonly dbName = 'ShadowsOfAethelgardDB';
  private readonly storeName = 'game_saves';
  private dbPromise: Promise<IDBDatabase> | null = null;
  private offline = !navigator.onLine;

  constructor() {
    this.initNetworkListeners();
  }

  private initNetworkListeners(): void {
    window.addEventListener('online', () => { this.offline = false; });
    window.addEventListener('offline', () => { this.offline = true; });
  }

  private getDb(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;
    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    return this.dbPromise;
  }

  public async save<T>(key: string, data: T): Promise<boolean> {
    try {
      const db = await this.getDb();
      return new Promise((resolve) => {
        const tx = db.transaction(this.storeName, 'readwrite');
        const store = tx.objectStore(this.storeName);
        const req = store.put(data, key);
        req.onsuccess = () => resolve(true);
        req.onerror = () => {
          localStorage.setItem(key, JSON.stringify(data));
          resolve(true);
        };
      });
    } catch {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    }
  }

  public async load<T>(key: string): Promise<T | null> {
    try {
      const db = await this.getDb();
      return new Promise((resolve) => {
        const tx = db.transaction(this.storeName, 'readonly');
        const store = tx.objectStore(this.storeName);
        const req = store.get(key);
        req.onsuccess = () => {
          if (req.result !== undefined) {
            resolve(req.result as T);
          } else {
            resolve(this.loadFromFallback<T>(key));
          }
        };
        req.onerror = () => resolve(this.loadFromFallback<T>(key));
      });
    } catch {
      return this.loadFromFallback<T>(key);
    }
  }

  private loadFromFallback<T>(key: string): T | null {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  }

  public async remove(key: string): Promise<boolean> {
    localStorage.removeItem(key);
    try {
      const db = await this.getDb();
      const tx = db.transaction(this.storeName, 'readwrite');
      tx.objectStore(this.storeName).delete(key);
      return true;
    } catch {
      return true;
    }
  }

  public isOffline(): boolean {
    return this.offline;
  }

  public async syncWithCloud(): Promise<{ synced: boolean; count: number }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ synced: !this.offline, count: 1 });
      }, 600);
    });
  }
}
