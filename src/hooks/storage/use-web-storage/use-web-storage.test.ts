import type { WebStorageStore } from "../utils/web-storage-store";
import type { Mock } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useWebStorage } from "./use-web-storage";

/**
 * In-memory `WebStorageStore` for tests. To verify that `useWebStorage`
 * delegates correctly to the given store, it satisfies the store contract with
 * plain functions instead of going through localStorage / sessionStorage.
 * `__listeners` is exposed so tests can directly observe the side effects of
 * unsubscribing.
 */
type MockStore = WebStorageStore & { __listeners: Set<() => void> };

function createMockStore(): MockStore {
  let value: string | null = null;
  const listeners = new Set<() => void>();

  const notify = () => {
    for (const l of listeners) {
      l();
    }
  };

  return {
    __listeners: listeners,
    read: vi.fn<(key: string) => string | null>(() => value),
    write: vi.fn<(key: string, value: string) => boolean>(
      (_key: string, v: string) => {
        value = v;
        notify();

        return true;
      }
    ),
    remove: vi.fn<(key: string) => boolean>(() => {
      value = null;
      notify();

      return true;
    }),
    clear: vi.fn<() => boolean>(() => {
      value = null;
      notify();

      return true;
    }),
    subscribe: vi.fn<(key: string, listener: () => void) => Mock<() => void>>(
      (_key: string, l: () => void) => {
        listeners.add(l);

        return vi.fn<() => void>(() => {
          listeners.delete(l);
        });
      }
    ),
  };
}

let keySequence = 0;

// Sequence number to avoid key collisions between tests.
function uniqueKey() {
  keySequence += 1;

  return `test-key-${keySequence}`;
}

describe(useWebStorage, () => {
  it("returns null when unset in the store", () => {
    const store = createMockStore();
    const { result } = renderHook(() => useWebStorage(store, uniqueKey()));
    expect(result.current[0]).toBeNull();
  });

  it("gets an existing value via the given store's read", () => {
    const store = createMockStore();
    const key = uniqueKey();
    store.write(key, "stored");
    const { result } = renderHook(() => useWebStorage(store, key));
    expect(result.current[0]).toBe("stored");
    expect(store.read).toHaveBeenCalledWith(key);
  });

  it("setValue delegates to the given store's write", () => {
    const store = createMockStore();
    const key = uniqueKey();
    const { result } = renderHook(() => useWebStorage(store, key));

    act(() => {
      result.current[1]("updated");
    });

    expect(store.write).toHaveBeenCalledWith(key, "updated");
    expect(result.current[0]).toBe("updated");
  });

  it("removeValue delegates to the given store's remove", () => {
    const store = createMockStore();
    const key = uniqueKey();
    const { result } = renderHook(() => useWebStorage(store, key));

    act(() => {
      result.current[1]("stored");
    });
    act(() => {
      result.current[2]();
    });

    expect(store.remove).toHaveBeenCalledWith(key);
    expect(result.current[0]).toBeNull();
  });

  it("re-renders on external changes received via the store's subscribe", () => {
    const store = createMockStore();
    const key = uniqueKey();
    const { result } = renderHook(() => useWebStorage(store, key));

    expect(store.subscribe).toHaveBeenCalledWith(key, expect.any(Function));

    act(() => {
      store.write(key, "external");
    });

    expect(result.current[0]).toBe("external");
  });

  it("resolves functional updates against the store's latest value", () => {
    const store = createMockStore();
    const key = uniqueKey();
    store.write(key, "");
    const { result } = renderHook(() => useWebStorage(store, key));

    act(() => {
      result.current[1]((prev) => `${prev}a`);
    });
    act(() => {
      result.current[1]((prev) => `${prev}b`);
    });

    expect(result.current[0]).toBe("ab");
    expect(store.write).toHaveBeenLastCalledWith(key, "ab");
  });

  it("functional update prev sees the latest store value after an external write", () => {
    const store = createMockStore();
    const key = uniqueKey();
    const { result } = renderHook(() => useWebStorage(store, key));

    act(() => {
      store.write(key, "base");
      result.current[1]((prev) => `${prev}+1`);
    });

    expect(result.current[0]).toBe("base+1");
  });

  it("does not call subscribe again on re-render", () => {
    const store = createMockStore();
    const key = uniqueKey();
    const { rerender } = renderHook(() => useWebStorage(store, key));

    const initialCalls = vi.mocked(store.subscribe).mock.calls.length;
    rerender();
    rerender();

    expect(store.subscribe).toHaveBeenCalledTimes(initialCalls);
  });

  it("unsubscribes on unmount", () => {
    const store = createMockStore();
    const key = uniqueKey();
    const { unmount } = renderHook(() => useWebStorage(store, key));

    expect(store.__listeners.size).toBe(1);
    const [subscribeResult] = vi.mocked(store.subscribe).mock.results;

    if (subscribeResult?.type !== "return") {
      throw new Error("subscribe did not return a value");
    }

    const unsubscribe = subscribeResult.value;

    unmount();

    expect(unsubscribe).toHaveBeenCalledOnce();
    expect(store.__listeners.size).toBe(0);
  });
});
