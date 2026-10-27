import { syncStorage } from "./platform/storage";

/**
 * Minimal external store over synchronous device storage, designed for
 * React's useSyncExternalStore. Reads once, then serves from memory.
 */
export interface PersistentStore<T> {
  getSnapshot: () => T;
  subscribe: (listener: () => void) => () => void;
  update: (updater: (prev: T) => T) => void;
}

export function createPersistentStore<T extends object>(key: string, defaults: T): PersistentStore<T> {
  const listeners = new Set<() => void>();
  let cache: T | undefined;

  const read = (): T => {
    if (cache) return cache;
    try {
      const raw = syncStorage.get(key);
      cache = raw ? { ...defaults, ...(JSON.parse(raw) as Partial<T>) } : defaults;
    } catch {
      cache = defaults;
    }
    return cache;
  };

  return {
    getSnapshot: read,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    update(updater) {
      cache = updater(read());
      try {
        syncStorage.set(key, JSON.stringify(cache));
      } catch {
        // Storage unavailable: keep the in-memory value.
      }
      listeners.forEach((l) => l());
    },
  };
}
