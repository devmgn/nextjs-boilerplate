import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useLocalStorage } from "./use-local-storage";

function createMockStorage() {
  const store = new Map<string, string>();

  return {
    getItem: vi.fn<(key: string) => string | null>(
      (key: string) => store.get(key) ?? null
    ),
    setItem: vi.fn<(key: string, value: string) => void>(
      (key: string, value: string) => {
        store.set(key, value);
      }
    ),
    removeItem: vi.fn<(key: string) => void>((key: string) => {
      store.delete(key);
    }),
  };
}

let keySequence = 0;

// Sequence number to avoid key collisions between tests.
function uniqueKey() {
  keySequence += 1;

  return `test-key-${keySequence}`;
}

describe(useLocalStorage, () => {
  let mockStorage: ReturnType<typeof createMockStorage>;

  beforeEach(() => {
    mockStorage = createMockStorage();
    vi.stubGlobal("localStorage", mockStorage);
  });

  describe("basic behavior", () => {
    it("returns null when unset", () => {
      const key = uniqueKey();
      const { result } = renderHook(() => useLocalStorage(key));
      expect(result.current[0]).toBeNull();
    });

    it("reads an existing value from localStorage", () => {
      const key = uniqueKey();
      mockStorage.setItem(key, "stored");
      const { result } = renderHook(() => useLocalStorage(key));
      expect(result.current[0]).toBe("stored");
    });

    it("updates the value with setValue", () => {
      const key = uniqueKey();
      const { result } = renderHook(() => useLocalStorage(key));

      act(() => {
        result.current[1]("updated");
      });

      expect(result.current[0]).toBe("updated");
      expect(mockStorage.setItem).toHaveBeenCalledWith(key, "updated");
    });

    it("functional update - passes null as prev the first time", () => {
      const key = uniqueKey();
      const { result } = renderHook(() => useLocalStorage(key));
      const updater = vi.fn<(prev: string | null) => string>(() => "a");

      act(() => {
        result.current[1](updater);
      });

      expect(updater).toHaveBeenCalledWith(null);
      expect(result.current[0]).toBe("a");
    });

    it("functional update - passes the previous value as prev on subsequent calls", () => {
      const key = uniqueKey();
      const { result } = renderHook(() => useLocalStorage(key));

      act(() => {
        result.current[1]("a");
      });

      act(() => {
        result.current[1]((prev) => `${prev}b`);
      });

      expect(result.current[0]).toBe("ab");
    });

    it("returns to null after removeValue", () => {
      const key = uniqueKey();
      const { result } = renderHook(() => useLocalStorage(key));

      act(() => {
        result.current[1]("stored");
      });
      expect(result.current[0]).toBe("stored");

      act(() => {
        result.current[2]();
      });

      expect(result.current[0]).toBeNull();
      expect(mockStorage.removeItem).toHaveBeenCalledWith(key);
    });
  });

  describe("error handling", () => {
    it("returns null when localStorage is unavailable", () => {
      const key = uniqueKey();
      mockStorage.getItem.mockImplementation(() => {
        throw new Error("localStorage unavailable");
      });

      const { result } = renderHook(() => useLocalStorage(key));
      expect(result.current[0]).toBeNull();
    });

    it("logs console.warn and keeps the state on QuotaExceededError", () => {
      const key = uniqueKey();
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const { result } = renderHook(() => useLocalStorage(key));

      mockStorage.setItem.mockImplementation(() => {
        throw new DOMException("quota exceeded", "QuotaExceededError");
      });

      act(() => {
        result.current[1]("large-value");
      });

      expect(warnSpy).toHaveBeenCalledOnce();
      expect(result.current[0]).toBeNull();
      expect(mockStorage.getItem(key)).toBeNull();
    });
  });

  describe("cross-tab sync", () => {
    it("updates the value on a storage event", () => {
      const key = uniqueKey();
      const { result } = renderHook(() => useLocalStorage(key));

      act(() => {
        mockStorage.setItem(key, "from-other-tab");
        window.dispatchEvent(
          new StorageEvent("storage", {
            key,
            newValue: "from-other-tab",
            storageArea: window.localStorage,
          })
        );
      });

      expect(result.current[0]).toBe("from-other-tab");
    });

    it("detects removal via a storage event", () => {
      const key = uniqueKey();
      const { result } = renderHook(() => useLocalStorage(key));

      act(() => {
        result.current[1]("stored");
      });
      expect(result.current[0]).toBe("stored");

      act(() => {
        mockStorage.removeItem(key);
        window.dispatchEvent(
          new StorageEvent("storage", {
            key,
            newValue: null,
            storageArea: window.localStorage,
          })
        );
      });

      expect(result.current[0]).toBeNull();
    });

    it("ignores storage events for unrelated keys", () => {
      const key = uniqueKey();
      const { result } = renderHook(() => useLocalStorage(key));

      act(() => {
        window.dispatchEvent(
          new StorageEvent("storage", {
            key: "other-key",
            newValue: "other-value",
            storageArea: window.localStorage,
          })
        );
      });

      expect(result.current[0]).toBeNull();
    });
  });

  describe("same-tab sync", () => {
    it("syncs multiple instances with the same key", () => {
      const key = uniqueKey();
      const { result: result1 } = renderHook(() => useLocalStorage(key));
      const { result: result2 } = renderHook(() => useLocalStorage(key));

      act(() => {
        result1.current[1]("synced");
      });

      expect(result1.current[0]).toBe("synced");
      expect(result2.current[0]).toBe("synced");
    });
  });

  describe("cleanup", () => {
    it("does not re-render on same-tab writes after unmount", () => {
      const key = uniqueKey();
      const renderSpy = vi.fn<() => void>();

      const { unmount } = renderHook(() => {
        renderSpy();

        return useLocalStorage(key);
      });

      const renderCountBeforeUnmount = renderSpy.mock.calls.length;
      unmount();

      act(() => {
        window.localStorage.setItem(key, "after-unmount");
        window.dispatchEvent(
          new StorageEvent("storage", {
            key,
            newValue: "after-unmount",
            storageArea: window.localStorage,
          })
        );
      });

      expect(renderSpy).toHaveBeenCalledTimes(renderCountBeforeUnmount);
    });
  });
});
