// src/core/services/cache/IndexedDBCacheService.ts
import { openDB, DBSchema } from 'idb';

// src/core/services/cache/ICacheService.ts
export interface ICacheService {
  set<T>(key: string, value: T): Promise<void>;
  get<T>(key: string): Promise<T | null>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
}


interface CacheDB extends DBSchema {
  cache: {
    key: string;
    value: any;
  };
}

export class IndexedDBCacheService implements ICacheService {
  private static dbPromise = openDB<CacheDB>('app-cache', 1, {
    upgrade(db) {
      db.createObjectStore('cache');
    },
  });

  async set<T>(key: string, value: T): Promise<void> {
    try {
      const db = await IndexedDBCacheService.dbPromise;
      await db.put('cache', value, key);
    } catch (error) {
      throw new Error('Erro ao salvar dados no cache local.');
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const db = await IndexedDBCacheService.dbPromise;
      return (await db.get('cache', key)) ?? null;
    } catch (error) {
      throw new Error('Erro ao ler dados do cache local.');
    }
  }

  async remove(key: string): Promise<void> {
    try {
      const db = await IndexedDBCacheService.dbPromise;
      await db.delete('cache', key);
    } catch (error) {
      throw new Error('Erro ao remover dados do cache local.');
    }
  }

  async clear(): Promise<void> {
    try {
      const db = await IndexedDBCacheService.dbPromise;
      await db.clear('cache');
    } catch (error) {
      throw new Error('Erro ao limpar o cache local.');
    }
  }
}  

export const cacheService = new IndexedDBCacheService();