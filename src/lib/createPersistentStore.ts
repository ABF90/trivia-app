/**
 * Minimal external store backed by localStorage, designed for React's
 * useSyncExternalStore. The server snapshot is always `defaults`, so SSR
 * output is stable and the stored value is applied right after hydration.
 */
export interface PersistentStore<T> {
  getSnapshot: () => T;
  getServerSnapshot: () => T;
  subscribe: (listener: () => void) => () => void;
  update: (updater: (prev: T) => T) => void;
}

export function createPersistentStore<T extends object>(key: string, defaults: T): PersistentStore<T> {
  const listeners = new Set<() => void>();
  let cache: T | undefined;

  const read = (): T => {
    if (cache) return cache;
    try {
      const raw = window.localStorage.getItem(key);
      cache = raw ? { ...defaults, ...(JSON.parse(raw) as Partial<T>) } : defaults;
    } catch {
      cache = defaults;
    }
    return cache;
  };

  const emit = () => listeners.forEach((l) => l());

  const onStorage = (event: StorageEvent) => {
    if (event.key !== key) return;
    cache = undefined;
    emit();
  };

  return {
    getSnapshot: () => (typeof window === "undefined" ? defaults : read()),
    getServerSnapshot: () => defaults,
    subscribe(listener) {
      if (listeners.size === 0) window.addEventListener("storage", onStorage);
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) window.removeEventListener("storage", onStorage);
      };
    },
    update(updater) {
      cache = updater(read());
      try {
        window.localStorage.setItem(key, JSON.stringify(cache));
      } catch {
        // Private mode / quota: keep the in-memory value.
      }
      emit();
    },
  };
}
