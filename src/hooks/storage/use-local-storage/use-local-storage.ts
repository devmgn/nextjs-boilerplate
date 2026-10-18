import { useWebStorage } from "../use-web-storage";
import { localStorageStore } from "../utils/web-storage-store";

/**
 * LocalStorage hook. A wrapper that binds `localStorageStore` to
 * `useWebStorage`.
 *
 * Changes from other tabs are reflected via the `storage` event. Returns `null`
 * when the key is unset, the read fails, or during SSR.
 *
 * @param key - Storage key.
 * @returns The same 3-element tuple as `useWebStorage`.
 */
export function useLocalStorage(key: string) {
  return useWebStorage(localStorageStore, key);
}
