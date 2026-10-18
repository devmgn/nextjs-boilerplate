/**
 * Thin wrapper around the Web Storage API (localStorage / sessionStorage) plus
 * a same-tab subscription mechanism.
 *
 * The native `storage` event only fires from other tabs, so this module keeps
 * its own per-key subscriber Sets to deliver `write` / `remove` / `clear` calls
 * made in the same tab to subscribers.
 */

/**
 * Store that bundles Web Storage reads/writes and change subscriptions.
 * Common interface implemented by `localStorageStore` / `sessionStorageStore`.
 */
export interface WebStorageStore {
  /**
   * Reads the value for a key. Returns `null` when unset or unavailable (SSR,
   * private browsing, etc.).
   */
  read: (key: string) => string | null;
  /**
   * Writes a value for a key and notifies subscribers. On failure, returns
   * `false` and skips notification.
   */
  write: (key: string, value: string) => boolean;
  /**
   * Removes a key and notifies subscribers. On failure, returns `false` and
   * skips notification.
   */
  remove: (key: string) => boolean;
  /**
   * Removes all keys and notifies all subscribers. On failure, returns `false`
   * and skips notification.
   */
  clear: () => boolean;
  /**
   * Subscribes to changes of a key. Call the returned function to unsubscribe
   * (idempotent).
   */
  subscribe: (key: string, listener: () => void) => () => void;
}

/**
 * Discriminator for the store type.
 *
 * - `"localStorage"`: `window.localStorage` (synced via `storage` events from
 *   other tabs)
 * - `"sessionStorage"`: `window.sessionStorage` (scoped to a single tab, so no
 *   cross-tab sync is needed)
 */
type StorageType = "localStorage" | "sessionStorage";

/** Per-key subscriber registry. */
interface KeyedListeners {
  /** Synchronously calls every subscriber of a key. */
  notify: (key: string) => void;
  /** Synchronously calls every subscriber of every registered key. */
  notifyAll: () => void;
  /** Subscribes to a key. The returned unsubscribe function is idempotent. */
  subscribe: (key: string, listener: () => void) => () => void;
}

/** No-op function. Used as the storage listener setup for the session store. */
function noop(): void {
  // Intentional no-op
}

/**
 * Resolves the storage lazily. Reading from `window` every time keeps up with
 * replacements in tests (e.g. via `vi.stubGlobal`).
 *
 * @param storageType - Storage type to resolve
 * @returns The target `Storage` instance
 */
function getStorage(storageType: StorageType): Storage {
  return storageType === "localStorage"
    ? window.localStorage
    : window.sessionStorage;
}

/**
 * Returns the raw string for a key. Returns `null` when unset or when storage
 * is unavailable (SSR, private browsing, etc.), without propagating
 * exceptions.
 *
 * @param storageType - Storage type to read from
 * @param key - Key to read
 * @returns The stored string, or `null` if it cannot be read
 */
function readItem(storageType: StorageType, key: string): string | null {
  try {
    return getStorage(storageType).getItem(key);
  } catch {
    return null;
  }
}

/**
 * Runs a mutation against the storage. On failure (e.g. `QuotaExceededError`),
 * logs a warning and returns `false`. Callers notify subscribers only when it
 * returns `true` (so subscribers are not woken up for a value that was never
 * saved).
 *
 * @param storageType - Storage type to mutate
 * @param mutation - Mutation to run against the storage
 * @param failureMessage - Message to warn with on failure
 * @returns Whether the mutation succeeded
 */
function tryMutate(
  storageType: StorageType,
  mutation: (storage: Storage) => void,
  failureMessage: string
): boolean {
  try {
    mutation(getStorage(storageType));
  } catch (error) {
    console.warn(failureMessage, error);

    return false;
  }

  return true;
}

/**
 * Creates a registry mapping keys to subscriber Sets.
 *
 * Listeners are called one at a time; exceptions are swallowed and logged via
 * `console.error` so they don't block other listeners (listeners called through
 * React normally don't throw; this is defensive). Since a listener may
 * `subscribe` / `unsubscribe` or re-entrantly `write`, a snapshot is taken
 * before notifying so Set mutations don't affect the iteration.
 *
 * @param label - Store name to prefix `console.error` output with
 * @returns Per-key subscriber registry
 */
function createKeyedListeners(label: string): KeyedListeners {
  const listeners = new Map<string, Set<() => void>>();

  const invokeAll = (snapshot: (() => void)[]): void => {
    for (const listener of snapshot) {
      try {
        listener();
      } catch (error) {
        console.error(`${label} listener threw:`, error);
      }
    }
  };

  // No empty Set is created for unregistered keys, so the registry leaves nothing behind
  const notify = (key: string): void => {
    invokeAll([...(listeners.get(key) ?? [])]);
  };

  const notifyAll = (): void => {
    invokeAll(
      [...listeners.values()].flatMap((keyListeners) => [...keyListeners])
    );
  };

  const subscribe = (key: string, listener: () => void): (() => void) => {
    const keyListeners = listeners.get(key) ?? new Set<() => void>();
    listeners.set(key, keyListeners);
    keyListeners.add(listener);

    let unsubscribed = false;

    return () => {
      if (unsubscribed) {
        return;
      }

      unsubscribed = true;
      keyListeners.delete(listener);

      // Another subscribe may have replaced the Set in the Map, so only delete the entry if it is still our Set
      if (keyListeners.size === 0 && listeners.get(key) === keyListeners) {
        listeners.delete(key);
      }
    };
  };

  return { notify, notifyAll, subscribe };
}

/**
 * Returns a setup function that installs, exactly once, a window listener
 * dispatching `storage` events from other tabs to the registry. An `installed`
 * flag in the closure prevents duplicate window listeners no matter how often
 * it is called.
 *
 * @param storageType - Storage type whose `storage` events are accepted
 * @param registry - Subscriber registry to notify on events
 * @returns Setup function that installs the window listener
 */
function createStorageEventBridge(
  storageType: StorageType,
  registry: KeyedListeners
): () => void {
  let installed = false;

  return () => {
    if (installed || typeof window === "undefined") {
      return;
    }

    window.addEventListener("storage", (event) => {
      // Browser-originated storage events always set `storageArea`.
      // Ignore events from a different Storage (e.g. sessionStorage).
      if (event.storageArea !== getStorage(storageType)) {
        return;
      }

      if (event.key === null) {
        // `clear()` in another tab arrives with key=null
        registry.notifyAll();

        return;
      }

      registry.notify(event.key);
    });
    installed = true;
  };
}

/**
 * Factory that creates a Web Storage store for the given `storageType`.
 *
 * The registry is confined to this closure, so local and session stores don't
 * interfere even when key names collide (store independence is covered by
 * tests).
 *
 * Calling `window.localStorage.clear()` directly does not notify the same tab,
 * so the app must always go through `clear`.
 *
 * @param storageType - Storage type to use ({@link StorageType})
 * @returns Web Storage store targeting the given storage
 */
function createStore(storageType: StorageType): WebStorageStore {
  const registry = createKeyedListeners(storageType);

  // Only localStorage installs cross-tab sync, on the first subscribe.
  // sessionStorage is scoped to a single tab, so it has no cross-tab sync
  const ensureStorageListener: () => void =
    storageType === "localStorage"
      ? createStorageEventBridge(storageType, registry)
      : noop;

  /**
   * Notifies subscribers only when the mutation succeeds. If `key` is `null`,
   * notifies subscribers of all keys.
   *
   * @param mutation - Mutation to run against the storage
   * @param failureMessage - Message to warn with on failure
   * @param key - Key to notify, or `null` for all keys
   * @returns Whether the mutation succeeded
   */
  const mutateAndNotify = (
    mutation: (storage: Storage) => void,
    failureMessage: string,
    key: string | null
  ): boolean => {
    const succeeded = tryMutate(storageType, mutation, failureMessage);

    if (succeeded) {
      if (key === null) {
        registry.notifyAll();
      } else {
        registry.notify(key);
      }
    }

    return succeeded;
  };

  return {
    read: (key) => readItem(storageType, key),
    write: (key, value) =>
      mutateAndNotify(
        (storage) => {
          storage.setItem(key, value);
        },
        `Failed to set ${storageType} key "${key}":`,
        key
      ),
    remove: (key) =>
      mutateAndNotify(
        (storage) => {
          storage.removeItem(key);
        },
        `Failed to remove ${storageType} key "${key}":`,
        key
      ),
    clear: () =>
      mutateAndNotify(
        (storage) => {
          storage.clear();
        },
        `Failed to clear ${storageType}:`,
        null
      ),
    subscribe: (key, listener) => {
      ensureStorageListener();

      return registry.subscribe(key, listener);
    },
  };
}

/**
 * Store targeting `window.localStorage`.
 * Changes from other tabs also reach subscribers via the `storage` event.
 */
export const localStorageStore: WebStorageStore = createStore("localStorage");

/**
 * Store targeting `window.sessionStorage`. Per the Web Storage spec, session
 * storage is scoped to a single tab, so it does not sync with other tabs.
 */
export const sessionStorageStore: WebStorageStore =
  createStore("sessionStorage");
