import { useWebStorage } from "../use-web-storage";
import { sessionStorageStore } from "../utils/web-storage-store";

/**
 * SessionStorage hook. A wrapper that binds `sessionStorageStore` to
 * `useWebStorage`.
 *
 * Per the Web Storage spec, sessionStorage is scoped to a single tab and does
 * not sync with other tabs. Returns `null` when the key is unset, the read
 * fails, or during SSR.
 *
 * @param key - Storage key.
 * @returns The same 3-element tuple as `useWebStorage`.
 */
export function useSessionStorage(key: string) {
  return useWebStorage(sessionStorageStore, key);
}
