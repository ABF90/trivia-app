import Storage from "expo-sqlite/kv-store";

/** Synchronous key-value storage (SQLite-backed, bundled with Expo Go). */
export const syncStorage = {
  get: (key: string): string | null => Storage.getItemSync(key),
  set: (key: string, value: string): void => Storage.setItemSync(key, value),
};
