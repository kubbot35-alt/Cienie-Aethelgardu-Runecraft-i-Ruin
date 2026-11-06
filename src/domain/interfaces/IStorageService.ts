export interface SaveDataEnvelope<T> {
  readonly version: number;
  readonly timestamp: number;
  readonly payload: T;
  readonly checksum: string;
}

export interface IStorageService {
  save<T>(key: string, data: T): Promise<boolean>;
  load<T>(key: string): Promise<T | null>;
  remove(key: string): Promise<boolean>;
  isOffline(): boolean;
  syncWithCloud(): Promise<{ synced: boolean; count: number }>;
}
