import { localStorageStore, sessionStorageStore } from "./webStorageStore";

function uniqueKey() {
  return `test-${Math.random().toString(36).slice(2)}`;
}

/** 実ブラウザ同様 `storageArea` を必ず設定したうえで `storage` イベントを発火する。 */
function dispatchLocalStorageEvent(
  init: Omit<StorageEventInit, "storageArea">,
) {
  window.dispatchEvent(
    new StorageEvent("storage", {
      storageArea: window.localStorage,
      ...init,
    }),
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
      it("未設定のキーはnullを返す", () => {
        expect(read(uniqueKey())).toBeNull();
      });

      it("ストレージが例外を投げてもnullを返す", () => {
        vi.stubGlobal(storageKey, {
          getItem: () => {
            throw new Error("unavailable");
          },
        });
        expect(read(uniqueKey())).toBeNull();
      });
    });

    describe(write, () => {
      it("書き込んだ値がreadで取得できる", () => {
        const key = uniqueKey();
        write(key, "hello");
        expect(read(key)).toBe("hello");
      });

      it("成功時にtrueを返す", () => {
        expect(write(uniqueKey(), "hello")).toBe(true);
      });

      it("QuotaExceededError時にfalseを返しwarnを出す", () => {
        const warnSpy = silenceWarn();
        vi.stubGlobal(storageKey, {
          setItem: () => {
            throw new DOMException("quota", "QuotaExceededError");
          },
        });
        expect(write(uniqueKey(), "hello")).toBe(false);
        expect(warnSpy).toHaveBeenCalledTimes(1);
      });

      it("失敗時は購読者に通知しない", () => {
        silenceWarn();
        const key = uniqueKey();
        const listener = vi.fn();
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
      it("書き込んだ値を削除する", () => {
        const key = uniqueKey();
        write(key, "hello");
        remove(key);
        expect(read(key)).toBeNull();
      });

      it("成功時にtrueを返す", () => {
        expect(remove(uniqueKey())).toBe(true);
      });

      it("ストレージが例外を投げた時にfalseを返す", () => {
        silenceWarn();
        vi.stubGlobal(storageKey, {
          removeItem: () => {
            throw new Error("unavailable");
          },
        });
        expect(remove(uniqueKey())).toBe(false);
      });

      it("失敗時は購読者に通知しない", () => {
        silenceWarn();
        const key = uniqueKey();
        const listener = vi.fn();
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
      it("全キーを削除する", () => {
        const k1 = uniqueKey();
        const k2 = uniqueKey();
        write(k1, "a");
        write(k2, "b");

        clear();

        expect(read(k1)).toBeNull();
        expect(read(k2)).toBeNull();
      });

      it("全購読者へ通知する", () => {
        const k1 = uniqueKey();
        const k2 = uniqueKey();
        const l1 = vi.fn();
        const l2 = vi.fn();
        const u1 = subscribe(k1, l1);
        const u2 = subscribe(k2, l2);

        clear();

        expect(l1).toHaveBeenCalledTimes(1);
        expect(l2).toHaveBeenCalledTimes(1);
        u1();
        u2();
      });

      it("成功時にtrueを返す", () => {
        expect(clear()).toBe(true);
      });

      it("ストレージが例外を投げた時にfalseを返し通知をスキップする", () => {
        silenceWarn();
        vi.stubGlobal(storageKey, {
          clear: () => {
            throw new DOMException("security", "SecurityError");
          },
        });
        const key = uniqueKey();
        const listener = vi.fn();
        const unsubscribe = subscribe(key, listener);

        expect(clear()).toBe(false);
        expect(listener).not.toHaveBeenCalled();

        unsubscribe();
      });
    });

    describe(subscribe, () => {
      it("同じキーへのwriteでリスナーが呼ばれる", () => {
        const key = uniqueKey();
        const listener = vi.fn();
        const unsubscribe = subscribe(key, listener);

        write(key, "hello");

        expect(listener).toHaveBeenCalledTimes(1);
        unsubscribe();
      });

      it("同じキーへのremoveでリスナーが呼ばれる", () => {
        const key = uniqueKey();
        write(key, "hello");
        const listener = vi.fn();
        const unsubscribe = subscribe(key, listener);

        remove(key);

        expect(listener).toHaveBeenCalledTimes(1);
        unsubscribe();
      });

      it("unsubscribe後はリスナーが呼ばれない", () => {
        const key = uniqueKey();
        const listener = vi.fn();
        const unsubscribe = subscribe(key, listener);

        unsubscribe();
        write(key, "hello");

        expect(listener).not.toHaveBeenCalled();
      });

      it("異なるキーへのwriteでリスナーが呼ばれない", () => {
        const key = uniqueKey();
        const listener = vi.fn();
        const unsubscribe = subscribe(key, listener);

        write(uniqueKey(), "hello");

        expect(listener).not.toHaveBeenCalled();
        unsubscribe();
      });

      it("あるリスナーがthrowしても他のリスナーは呼ばれる", () => {
        silenceError();
        const key = uniqueKey();
        const bad = vi.fn(() => {
          throw new Error("boom");
        });
        const good = vi.fn();
        const u1 = subscribe(key, bad);
        const u2 = subscribe(key, good);

        write(key, "x");

        expect(bad).toHaveBeenCalledTimes(1);
        expect(good).toHaveBeenCalledTimes(1);
        u1();
        u2();
      });

      it("clearでもthrowしたリスナーが他をブロックしない", () => {
        silenceError();
        const k1 = uniqueKey();
        const k2 = uniqueKey();
        const bad = vi.fn(() => {
          throw new Error("boom");
        });
        const good = vi.fn();
        const u1 = subscribe(k1, bad);
        const u2 = subscribe(k2, good);

        clear();

        expect(bad).toHaveBeenCalledTimes(1);
        expect(good).toHaveBeenCalledTimes(1);
        u1();
        u2();
      });

      it("同一リスナーを重複subscribeしてもwriteで一度しか呼ばれない", () => {
        const key = uniqueKey();
        const listener = vi.fn();
        const u1 = subscribe(key, listener);
        const u2 = subscribe(key, listener);

        write(key, "x");

        expect(listener).toHaveBeenCalledTimes(1);
        u1();
        u2();
      });

      it("リスナー内で同キーにsubscribeしても今回のnotifyでは呼ばれない", () => {
        const key = uniqueKey();
        const lateListener = vi.fn();
        let lateUnsubscribe: (() => void) | undefined;
        const firstListener = vi.fn(() => {
          lateUnsubscribe = subscribe(key, lateListener);
        });
        const u1 = subscribe(key, firstListener);

        write(key, "x");

        expect(firstListener).toHaveBeenCalledTimes(1);
        expect(lateListener).not.toHaveBeenCalled();
        u1();
        lateUnsubscribe?.();
      });

      it("リスナー内で他のリスナーをunsubscribeしても他のリスナーは呼ばれる", () => {
        const key = uniqueKey();
        const l2 = vi.fn();
        // l1 を先に subscribe しつつ l1 から l2 の unsubscribe (u2) を呼ぶため、
        // 参照を箱渡しして const を維持する。
        const ref: { u2?: () => void } = {};
        const l1 = vi.fn(() => {
          ref.u2?.();
        });
        const u1 = subscribe(key, l1);
        const u2 = subscribe(key, l2);
        ref.u2 = u2;

        write(key, "x");

        expect(l1).toHaveBeenCalledTimes(1);
        expect(l2).toHaveBeenCalledTimes(1);
        u1();
        u2();
      });

      it("unsubscribeを複数回呼んでも後続のsubscribeが壊れない", () => {
        const key = uniqueKey();
        const l1 = vi.fn();
        const l2 = vi.fn();
        const u1 = subscribe(key, l1);
        u1();
        const u2 = subscribe(key, l2);
        u1();

        write(key, "x");

        expect(l1).not.toHaveBeenCalled();
        expect(l2).toHaveBeenCalledTimes(1);
        u2();
      });
    });
  });

  describe("localStorageStore 他タブ連携", () => {
    const { subscribe } = localStorageStore;

    beforeEach(() => {
      localStorage.clear();
    });

    it("同じキーのstorageイベントでリスナーが呼ばれる", () => {
      const key = uniqueKey();
      const listener = vi.fn();
      const unsubscribe = subscribe(key, listener);

      dispatchLocalStorageEvent({ key, newValue: "from-other-tab" });

      expect(listener).toHaveBeenCalledTimes(1);
      unsubscribe();
    });

    it("異なるキーのstorageイベントでは呼ばれない", () => {
      const key = uniqueKey();
      const listener = vi.fn();
      const unsubscribe = subscribe(key, listener);

      dispatchLocalStorageEvent({ key: "other-key", newValue: "x" });

      expect(listener).not.toHaveBeenCalled();
      unsubscribe();
    });

    it("他タブのclearに伴うstorageイベント（key=null）でリスナーが呼ばれる", () => {
      const key = uniqueKey();
      const listener = vi.fn();
      const unsubscribe = subscribe(key, listener);

      dispatchLocalStorageEvent({ key: null, newValue: null });

      expect(listener).toHaveBeenCalledTimes(1);
      unsubscribe();
    });

    it("同一リスナーを重複subscribeしてもstorageイベントで一度しか呼ばれない", () => {
      const key = uniqueKey();
      const listener = vi.fn();
      const u1 = subscribe(key, listener);
      const u2 = subscribe(key, listener);

      dispatchLocalStorageEvent({ key, newValue: "x" });

      expect(listener).toHaveBeenCalledTimes(1);
      u1();
      u2();
    });

    it("unsubscribeでstorageイベントの購読も解除される", () => {
      const key = uniqueKey();
      const listener = vi.fn();
      const unsubscribe = subscribe(key, listener);
      unsubscribe();

      dispatchLocalStorageEvent({ key, newValue: "x" });

      expect(listener).not.toHaveBeenCalled();
    });

    it("storageAreaがsessionStorageのイベントは無視する", () => {
      const key = uniqueKey();
      const listener = vi.fn();
      const unsubscribe = subscribe(key, listener);

      window.dispatchEvent(
        new StorageEvent("storage", {
          key,
          newValue: "x",
          storageArea: window.sessionStorage,
        }),
      );

      expect(listener).not.toHaveBeenCalled();
      unsubscribe();
    });
  });

  describe("sessionStorageStore 単一タブ", () => {
    beforeEach(() => {
      sessionStorage.clear();
    });

    it("他タブ由来のstorageイベントには反応しない", () => {
      const key = uniqueKey();
      const listener = vi.fn();
      const unsubscribe = sessionStorageStore.subscribe(key, listener);

      window.dispatchEvent(new StorageEvent("storage", { key, newValue: "x" }));

      expect(listener).not.toHaveBeenCalled();
      unsubscribe();
    });
  });

  describe("ストア間の独立性", () => {
    beforeEach(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    it("localStorageStore.writeはsessionStorageStoreの購読者に通知しない", () => {
      const key = uniqueKey();
      const sessionListener = vi.fn();
      const unsubscribe = sessionStorageStore.subscribe(key, sessionListener);

      localStorageStore.write(key, "x");

      expect(sessionListener).not.toHaveBeenCalled();
      unsubscribe();
    });

    it("sessionStorageStore.writeはlocalStorageStoreの購読者に通知しない", () => {
      const key = uniqueKey();
      const localListener = vi.fn();
      const unsubscribe = localStorageStore.subscribe(key, localListener);

      sessionStorageStore.write(key, "x");

      expect(localListener).not.toHaveBeenCalled();
      unsubscribe();
    });

    it("同じキーでも両ストアは独立した値を保持する", () => {
      const key = uniqueKey();
      localStorageStore.write(key, "local-value");
      sessionStorageStore.write(key, "session-value");

      expect(localStorageStore.read(key)).toBe("local-value");
      expect(sessionStorageStore.read(key)).toBe("session-value");
    });

    it("localStorageStore.clearはsessionStorageStoreに影響しない", () => {
      const key = uniqueKey();
      sessionStorageStore.write(key, "keep");

      localStorageStore.clear();

      expect(sessionStorageStore.read(key)).toBe("keep");
    });

    it("sessionStorageStore.clearはlocalStorageStoreに影響しない", () => {
      const key = uniqueKey();
      localStorageStore.write(key, "keep");

      sessionStorageStore.clear();

      expect(localStorageStore.read(key)).toBe("keep");
    });
  });

  describe("複数購読者", () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it("同じキーの複数リスナーが全員呼ばれる", () => {
      const key = uniqueKey();
      const l1 = vi.fn();
      const l2 = vi.fn();
      const l3 = vi.fn();
      const u1 = localStorageStore.subscribe(key, l1);
      const u2 = localStorageStore.subscribe(key, l2);
      const u3 = localStorageStore.subscribe(key, l3);

      localStorageStore.write(key, "x");

      expect(l1).toHaveBeenCalledTimes(1);
      expect(l2).toHaveBeenCalledTimes(1);
      expect(l3).toHaveBeenCalledTimes(1);
      u1();
      u2();
      u3();
    });
  });
});
