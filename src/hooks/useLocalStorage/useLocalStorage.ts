import { useSyncExternalStore } from "react";

const cache = new Map<string, string>();
const listeners = new Map<string, Set<() => void>>();

function getListeners(key: string) {
  const existing = listeners.get(key);
  if (existing) {
    return existing;
  }
  const created = new Set<() => void>();
  listeners.set(key, created);
  return created;
}

function notifyListeners(key: string) {
  for (const listener of getListeners(key)) {
    listener();
  }
}

function parseJSON<T>(raw: string, fallback: T): T {
  try {
    const parsed: unknown = JSON.parse(raw);
    return parsed as T; // oxlint-disable-line typescript-eslint/no-unsafe-type-assertion
  } catch {
    return fallback;
  }
}

function isFunction<T>(value: T | ((prev: T) => T)): value is (prev: T) => T {
  return typeof value === "function";
}

/** SSR対応のlocalStorageフック（useSyncExternalStoreベース） */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [
  value: T,
  setValue: (value: T | ((prev: T) => T)) => void,
  removeValue: () => void,
] {
  const serializedInitial = JSON.stringify(initialValue);

  const rawValue = useSyncExternalStore(
    (onStoreChange) => {
      const keyListeners = getListeners(key);
      keyListeners.add(onStoreChange);

      const handleStorage = (event: StorageEvent) => {
        if (event.key === key) {
          if (event.newValue === null) {
            cache.delete(key);
          } else {
            cache.set(key, event.newValue);
          }
          notifyListeners(key);
        }
      };

      window.addEventListener("storage", handleStorage);

      return () => {
        keyListeners.delete(onStoreChange);
        if (keyListeners.size === 0) {
          listeners.delete(key);
        }
        window.removeEventListener("storage", handleStorage);
      };
    },
    () => {
      const cached = cache.get(key);
      if (cached !== undefined) {
        return cached;
      }
      try {
        const item = localStorage.getItem(key);
        if (item !== null) {
          cache.set(key, item);
          return item;
        }
      } catch {
        // localStorage unavailable
      }
      return serializedInitial;
    },
    () => serializedInitial,
  );

  const value: T = parseJSON(rawValue, initialValue);

  function setValue(updater: T | ((prev: T) => T)) {
    const currentRaw = cache.get(key);
    const current: T =
      currentRaw === undefined
        ? initialValue
        : parseJSON<T>(currentRaw, initialValue);
    const next = isFunction(updater) ? updater(current) : updater;
    const serialized = JSON.stringify(next);
    try {
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.warn(`Failed to set localStorage key "${key}":`, error);
      return;
    }
    cache.set(key, serialized);
    notifyListeners(key);
  }

  function removeValue() {
    localStorage.removeItem(key);
    cache.delete(key);
    notifyListeners(key);
  }

  return [value, setValue, removeValue];
}
