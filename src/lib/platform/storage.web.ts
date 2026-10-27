/** Web build: localStorage avoids the WASM/cross-origin setup expo-sqlite needs on web. */
export const syncStorage = {
  get: (key: string): string | null => {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set: (key: string, value: string): void => {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // Private mode / quota: keep the in-memory value.
    }
  },
};
