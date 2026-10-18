import { beforeEach, describe, expect, it, vi } from "vitest";
import { localStorageStore, sessionStorageStore } from "./web-storage-store";

/** Placeholder until the reference is assigned. */
function noop(): void {}

let keySequence = 0;

// Sequence number to avoid key collisions between tests.
function uniqueKey() {
  keySequence += 1;

  return `test-${keySequence}`;
}

/**
 * Dispatches a `storage` event, always setting `storageArea` as real browsers
 * do.
 *
 * @param init - Event init values other than `storageArea`
 */
function dispatchLocalStorageEvent(
  init: Omit<StorageEventInit, "storageArea">
) {
  window.dispatchEvent(
    new StorageEvent("storage", {
      storageArea: window.localStorage,
      ...init,
    })
  );
}

function silenceWarn() {
  return vi.spyOn(console, "warn").mockImplementation(() => {});
}

function silenceError() {
  return vi.spyOn(console, "error").mockImplementation(() => {});
}

describe("webStorageStore", () => {
  describe.for([
    {
      name: "localStorageStore",
      store: localStorageStore,
      storageKey: "localStorage" as const,
    },
    {
      name: "sessionStorageStore",
      store: sessionStorageStore,
      storageKey: "sessionStorage" as const,
    },
  ])("$name", ({ store, storageKey }) => {
    const { read, write, remove, clear, subscribe } = store;

    beforeEach(() => {
      window[storageKey].clear();
    });

    describe(read, () => {
      it("returns null for an unset key", () => {
        expect(read(uniqueKey())).toBeNull();
      });

      it("returns null even if the storage throws", () => {
        vi.stubGlobal(storageKey, {
          getItem: () => {
            throw new Error("unavailable");
          },
        });
        expect(read(uniqueKey())).toBeNull();
      });
    });

    describe(write, () => {
      it("reads back the written value", () => {
        const key = uniqueKey();
        write(key, "hello");
        expect(read(key)).toBe("hello");
      });

      it("returns true on success", () => {
        expect(write(uniqueKey(), "hello")).toBeTruthy();
      });

      it("returns false and warns on QuotaExceededError", () => {
        const warnSpy = silenceWarn();
        vi.stubGlobal(storageKey, {
          setItem: () => {
            throw new DOMException("quota", "QuotaExceededError");
          },
        });
        expect(write(uniqueKey(), "hello")).toBeFalsy();
        expect(warnSpy).toHaveBeenCalledOnce();
      });

      it("does not notify subscribers on failure", () => {
        silenceWarn();
        const key = uniqueKey();
        const listener = vi.fn<() => void>();
        const unsubscribe = subscribe(key, listener);
        vi.stubGlobal(storageKey, {
          setItem: () => {
            throw new DOMException("quota", "QuotaExceededError");
          },
        });

        write(key, "x");

        expect(listener).not.toHaveBeenCalled();
        unsubscribe();
      });
    });

    describe(remove, () => {
      it("removes the written value", () => {
        const key = uniqueKey();
        write(key, "hello");
        remove(key);
        expect(read(key)).toBeNull();
      });

      it("returns true on success", () => {
        expect(remove(uniqueKey())).toBeTruthy();
      });

      it("returns false when the storage throws", () => {
        silenceWarn();
        vi.stubGlobal(storageKey, {
          removeItem: () => {
            throw new Error("unavailable");
          },
        });
        expect(remove(uniqueKey())).toBeFalsy();
      });

      it("does not notify subscribers on failure", () => {
        silenceWarn();
        const key = uniqueKey();
        const listener = vi.fn<() => void>();
        const unsubscribe = subscribe(key, listener);
        vi.stubGlobal(storageKey, {
          removeItem: () => {
            throw new Error("unavailable");
          },
        });

        remove(key);

        expect(listener).not.toHaveBeenCalled();
        unsubscribe();
      });
    });

    describe(clear, () => {
      it("removes all keys", () => {
        const k1 = uniqueKey();
        const k2 = uniqueKey();
        write(k1, "a");
        write(k2, "b");

        clear();

        expect(read(k1)).toBeNull();
        expect(read(k2)).toBeNull();
      });

      it("notifies all subscribers", () => {
        const k1 = uniqueKey();
        const k2 = uniqueKey();
        const l1 = vi.fn<() => void>();
        const l2 = vi.fn<() => void>();
        const u1 = subscribe(k1, l1);
        const u2 = subscribe(k2, l2);

        clear();

        expect(l1).toHaveBeenCalledOnce();
        expect(l2).toHaveBeenCalledOnce();
        u1();
        u2();
      });

      it("returns true on success", () => {
        expect(clear()).toBeTruthy();
      });

      it("returns false and skips notification when the storage throws", () => {
        silenceWarn();
        vi.stubGlobal(storageKey, {
          clear: () => {
            throw new DOMException("security", "SecurityError");
          },
        });
        const key = uniqueKey();
        const listener = vi.fn<() => void>();
        const unsubscribe = subscribe(key, listener);

        expect(clear()).toBeFalsy();
        expect(listener).not.toHaveBeenCalled();

        unsubscribe();
      });
    });

    describe(subscribe, () => {
      it("calls the listener on write to the same key", () => {
        const key = uniqueKey();
        const listener = vi.fn<() => void>();
        const unsubscribe = subscribe(key, listener);

        write(key, "hello");

        expect(listener).toHaveBeenCalledOnce();
        unsubscribe();
      });

      it("calls the listener on remove of the same key", () => {
        const key = uniqueKey();
        write(key, "hello");
        const listener = vi.fn<() => void>();
        const unsubscribe = subscribe(key, listener);

        remove(key);

        expect(listener).toHaveBeenCalledOnce();
        unsubscribe();
      });

      it("does not call the listener after unsubscribe", () => {
        const key = uniqueKey();
        const listener = vi.fn<() => void>();
        const unsubscribe = subscribe(key, listener);

        unsubscribe();
        write(key, "hello");

        expect(listener).not.toHaveBeenCalled();
      });

      it("does not call the listener on write to a different key", () => {
        const key = uniqueKey();
        const listener = vi.fn<() => void>();
        const unsubscribe = subscribe(key, listener);

        write(uniqueKey(), "hello");

        expect(listener).not.toHaveBeenCalled();
        unsubscribe();
      });

      it("calls other listeners even if one throws", () => {
        silenceError();
        const key = uniqueKey();

        const bad = vi.fn<() => void>(() => {
          throw new Error("boom");
        });

        const good = vi.fn<() => void>();
        const u1 = subscribe(key, bad);
        const u2 = subscribe(key, good);

        write(key, "x");

        expect(bad).toHaveBeenCalledOnce();
        expect(good).toHaveBeenCalledOnce();
        u1();
        u2();
      });

      it("a throwing listener does not block others on clear", () => {
        silenceError();
        const k1 = uniqueKey();
        const k2 = uniqueKey();

        const bad = vi.fn<() => void>(() => {
          throw new Error("boom");
        });

        const good = vi.fn<() => void>();
        const u1 = subscribe(k1, bad);
        const u2 = subscribe(k2, good);

        clear();

        expect(bad).toHaveBeenCalledOnce();
        expect(good).toHaveBeenCalledOnce();
        u1();
        u2();
      });

      it("calls a listener subscribed twice only once on write", () => {
        const key = uniqueKey();
        const listener = vi.fn<() => void>();
        const u1 = subscribe(key, listener);
        const u2 = subscribe(key, listener);

        write(key, "x");

        expect(listener).toHaveBeenCalledOnce();
        u1();
        u2();
      });

      it("a listener subscribed to the same key inside a listener is not called in the current notify", () => {
        const key = uniqueKey();
        const lateListener = vi.fn<() => void>();
        let lateUnsubscribe: (() => void) | undefined;

        const firstListener = vi.fn<() => void>(() => {
          lateUnsubscribe = subscribe(key, lateListener);
        });

        const u1 = subscribe(key, firstListener);

        write(key, "x");

        expect(firstListener).toHaveBeenCalledOnce();
        expect(lateListener).not.toHaveBeenCalled();
        u1();
        lateUnsubscribe?.();
      });

      it("calls other listeners even if a listener unsubscribes another", () => {
        const key = uniqueKey();
        const l2 = vi.fn<() => void>();
        // l1's closure is built before l2's unsubscribe exists,
        // so initialize it with a no-op and assign the reference later.
        let unsubscribeL2: () => void = noop;

        const l1 = vi.fn<() => void>(() => {
          unsubscribeL2();
        });

        const u1 = subscribe(key, l1);
        const u2 = subscribe(key, l2);
        unsubscribeL2 = u2;

        write(key, "x");

        expect(l1).toHaveBeenCalledOnce();
        expect(l2).toHaveBeenCalledOnce();
        u1();
        u2();
      });

      it("calling unsubscribe multiple times does not break later subscribes", () => {
        const key = uniqueKey();
        const l1 = vi.fn<() => void>();
        const l2 = vi.fn<() => void>();
        const u1 = subscribe(key, l1);
        u1();
        const u2 = subscribe(key, l2);
        u1();

        write(key, "x");

        expect(l1).not.toHaveBeenCalled();
        expect(l2).toHaveBeenCalledOnce();
        u2();
      });
    });
  });

  describe("localStorageStore cross-tab sync", () => {
    const { subscribe } = localStorageStore;

    beforeEach(() => {
      localStorage.clear();
    });

    it("calls the listener on a storage event for the same key", () => {
      const key = uniqueKey();
      const listener = vi.fn<() => void>();
      const unsubscribe = subscribe(key, listener);

      dispatchLocalStorageEvent({ key, newValue: "from-other-tab" });

      expect(listener).toHaveBeenCalledOnce();
      unsubscribe();
    });

    it("does not call the listener on a storage event for a different key", () => {
      const key = uniqueKey();
      const listener = vi.fn<() => void>();
      const unsubscribe = subscribe(key, listener);

      dispatchLocalStorageEvent({ key: "other-key", newValue: "x" });

      expect(listener).not.toHaveBeenCalled();
      unsubscribe();
    });

    it("calls the listener on a storage event from clear in another tab (key=null)", () => {
      const key = uniqueKey();
      const listener = vi.fn<() => void>();
      const unsubscribe = subscribe(key, listener);

      dispatchLocalStorageEvent({ key: null, newValue: null });

      expect(listener).toHaveBeenCalledOnce();
      unsubscribe();
    });

    it("calls a listener subscribed twice only once on a storage event", () => {
      const key = uniqueKey();
      const listener = vi.fn<() => void>();
      const u1 = subscribe(key, listener);
      const u2 = subscribe(key, listener);

      dispatchLocalStorageEvent({ key, newValue: "x" });

      expect(listener).toHaveBeenCalledOnce();
      u1();
      u2();
    });

    it("unsubscribe also stops storage event notifications", () => {
      const key = uniqueKey();
      const listener = vi.fn<() => void>();
      const unsubscribe = subscribe(key, listener);
      unsubscribe();

      dispatchLocalStorageEvent({ key, newValue: "x" });

      expect(listener).not.toHaveBeenCalled();
    });

    it("ignores events whose storageArea is sessionStorage", () => {
      const key = uniqueKey();
      const listener = vi.fn<() => void>();
      const unsubscribe = subscribe(key, listener);

      window.dispatchEvent(
        new StorageEvent("storage", {
          key,
          newValue: "x",
          storageArea: window.sessionStorage,
        })
      );

      expect(listener).not.toHaveBeenCalled();
      unsubscribe();
    });
  });

  describe("sessionStorageStore single tab", () => {
    beforeEach(() => {
      sessionStorage.clear();
    });

    it("does not react to storage events from other tabs", () => {
      const key = uniqueKey();
      const listener = vi.fn<() => void>();
      const unsubscribe = sessionStorageStore.subscribe(key, listener);

      window.dispatchEvent(new StorageEvent("storage", { key, newValue: "x" }));

      expect(listener).not.toHaveBeenCalled();
      unsubscribe();
    });
  });

  describe("store independence", () => {
    beforeEach(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    it("localStorageStore.write does not notify sessionStorageStore subscribers", () => {
      const key = uniqueKey();
      const sessionListener = vi.fn<() => void>();
      const unsubscribe = sessionStorageStore.subscribe(key, sessionListener);

      localStorageStore.write(key, "x");

      expect(sessionListener).not.toHaveBeenCalled();
      unsubscribe();
    });

    it("sessionStorageStore.write does not notify localStorageStore subscribers", () => {
      const key = uniqueKey();
      const localListener = vi.fn<() => void>();
      const unsubscribe = localStorageStore.subscribe(key, localListener);

      sessionStorageStore.write(key, "x");

      expect(localListener).not.toHaveBeenCalled();
      unsubscribe();
    });

    it("both stores hold independent values for the same key", () => {
      const key = uniqueKey();
      localStorageStore.write(key, "local-value");
      sessionStorageStore.write(key, "session-value");

      expect(localStorageStore.read(key)).toBe("local-value");
      expect(sessionStorageStore.read(key)).toBe("session-value");
    });

    it("localStorageStore.clear does not affect sessionStorageStore", () => {
      const key = uniqueKey();
      sessionStorageStore.write(key, "keep");

      localStorageStore.clear();

      expect(sessionStorageStore.read(key)).toBe("keep");
    });

    it("sessionStorageStore.clear does not affect localStorageStore", () => {
      const key = uniqueKey();
      localStorageStore.write(key, "keep");

      sessionStorageStore.clear();

      expect(localStorageStore.read(key)).toBe("keep");
    });
  });

  describe("multiple subscribers", () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it("calls every listener for the same key", () => {
      const key = uniqueKey();
      const l1 = vi.fn<() => void>();
      const l2 = vi.fn<() => void>();
      const l3 = vi.fn<() => void>();
      const u1 = localStorageStore.subscribe(key, l1);
      const u2 = localStorageStore.subscribe(key, l2);
      const u3 = localStorageStore.subscribe(key, l3);

      localStorageStore.write(key, "x");

      expect(l1).toHaveBeenCalledOnce();
      expect(l2).toHaveBeenCalledOnce();
      expect(l3).toHaveBeenCalledOnce();
      u1();
      u2();
      u3();
    });
  });
});
