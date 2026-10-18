import type { WebStorageStore } from "../utils/web-storage-store";
import { useSyncExternalStore } from "react";
import { isFunction } from "../../../utils/is/is-function";

/**
 * Generic hook that syncs Web Storage (localStorage / sessionStorage) with
 * React state.
 *
 * Reads, writes, and subscriptions are delegated to the given store, so values
 * stay in sync across multiple instances in the same tab (a localStorage store
 * also reacts to `storage` events from other tabs). Values are kept as strings;
 * serialize/deserialize on the caller side to store structured data.
 *
 * Returns `null` when the key is unset, the read fails, or during SSR (matching
 * the native Web Storage `getItem`).
 *
 * Normally use `useLocalStorage` / `useSessionStorage`; call this directly only
 * to plug in a custom store.
 *
 * @param store - {@link WebStorageStore} that handles reads, writes, and
 *   subscriptions.
 * @param key - Storage key.
 * @returns A 3-element tuple:
 *
 *   - `value`: The current value. `null` when unset, the read fails, or during
 *     SSR.
 *   - `setValue`: Writes a value. Like `React.useState`, accepts a functional
 *     update; `prev` receives the store's latest value. Returns whether the
 *     write succeeded (`false` on failures such as `QuotaExceededError`).
 *   - `removeValue`: Removes the value. Returns whether the removal succeeded.
 */
export function useWebStorage(
  store: WebStorageStore,
  key: string
): [
  value: string | null,
  setValue: (value: string | ((prev: string | null) => string)) => boolean,
  removeValue: () => boolean,
] {
  const value = useSyncExternalStore(
    (onStoreChange) => store.subscribe(key, onStoreChange),
    () => store.read(key),
    () => null
  );

  const setValue = (updater: string | ((prev: string | null) => string)) => {
    const next = isFunction(updater) ? updater(store.read(key)) : updater;

    return store.write(key, next);
  };

  const removeValue = () => store.remove(key);

  return [value, setValue, removeValue];
}
