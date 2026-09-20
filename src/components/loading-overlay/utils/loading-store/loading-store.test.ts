import { afterEach, describe, expect, it, vi } from "vitest";
import { loadingStore } from ".";
import { createLoadingStore } from "./loading-store";

/** 差し込み前のプレースホルダ。 */
function noop(): void {
  // 差し込み前は何もしない
}

describe("loadingStore (singleton)", () => {
  afterEach(() => {
    loadingStore.reset();
  });

  it("初期状態では getSnapshot / getServerSnapshot ともに false", () => {
    expect(loadingStore.getSnapshot()).toBeFalsy();
    expect(loadingStore.getServerSnapshot()).toBeFalsy();
  });

  it("show() で true、hide() で false に戻る", () => {
    loadingStore.show();
    expect(loadingStore.getSnapshot()).toBeTruthy();

    loadingStore.hide();
    expect(loadingStore.getSnapshot()).toBeFalsy();
  });

  it("show 中でも getServerSnapshot は常に false (SSR 契約)", () => {
    // SSR では loading UI を描画せず、クライアントの useEffect で
    // subscribe が走った後に getSnapshot が採用される前提を固定する。
    loadingStore.show();
    expect(loadingStore.getSnapshot()).toBeTruthy();
    expect(loadingStore.getServerSnapshot()).toBeFalsy();
  });
});

describe("createLoadingStore", () => {
  describe("参照カウント", () => {
    it("show×N → hide×M (M<N) では true のまま、M=N で false に戻る", () => {
      const store = createLoadingStore();
      store.show();
      store.show();
      store.show();

      store.hide();
      expect(store.getSnapshot()).toBeTruthy();

      store.hide();
      expect(store.getSnapshot()).toBeTruthy();

      store.hide();
      expect(store.getSnapshot()).toBeFalsy();
    });

    it("過剰な hide() は clamp され listener を呼ばない", () => {
      const store = createLoadingStore();
      const listener = vi.fn<() => void>();
      const unsubscribe = store.subscribe(listener);

      store.hide();
      store.hide();

      expect(store.getSnapshot()).toBeFalsy();
      expect(listener).not.toHaveBeenCalled();
      unsubscribe();
    });
  });

  describe("reset", () => {
    it("表示中に reset() すると一発で false になる", () => {
      const store = createLoadingStore();
      store.show();
      store.show();
      store.show();
      expect(store.getSnapshot()).toBeTruthy();

      store.reset();
      expect(store.getSnapshot()).toBeFalsy();
    });

    it("空状態での reset() は listener を呼ばない", () => {
      const store = createLoadingStore();
      const listener = vi.fn<() => void>();
      const unsubscribe = store.subscribe(listener);

      store.reset();

      expect(listener).not.toHaveBeenCalled();
      unsubscribe();
    });
  });

  describe("subscribe / listener", () => {
    it("subscribe 中のリスナーは show / hide で同期的に呼ばれる", () => {
      const store = createLoadingStore();
      const listener = vi.fn<() => void>();
      const unsubscribe = store.subscribe(listener);

      store.show();
      expect(listener).toHaveBeenCalledOnce();

      store.hide();
      expect(listener).toHaveBeenCalledTimes(2);

      unsubscribe();
    });

    it("unsubscribe 後のリスナーは呼ばれない", () => {
      const store = createLoadingStore();
      const listener = vi.fn<() => void>();
      const unsubscribe = store.subscribe(listener);
      unsubscribe();

      store.show();
      expect(listener).not.toHaveBeenCalled();
    });

    it("複数リスナーが全員呼ばれる", () => {
      const store = createLoadingStore();
      const l1 = vi.fn<() => void>();
      const l2 = vi.fn<() => void>();
      const u1 = store.subscribe(l1);
      const u2 = store.subscribe(l2);

      store.show();

      expect(l1).toHaveBeenCalledOnce();
      expect(l2).toHaveBeenCalledOnce();

      u1();
      u2();
    });

    it("リスナー内で他のリスナーを unsubscribe しても他のリスナーは呼ばれる", () => {
      const store = createLoadingStore();
      const l2 = vi.fn<() => void>();
      let unsubscribeL2: () => void = noop;
      const l1 = vi.fn<() => void>(() => {
        unsubscribeL2();
      });
      const u1 = store.subscribe(l1);
      const u2 = store.subscribe(l2);
      unsubscribeL2 = u2;

      store.show();

      expect(l1).toHaveBeenCalledOnce();
      expect(l2).toHaveBeenCalledOnce();

      u1();
      u2();
    });

    it("あるリスナーが throw しても他のリスナーは呼ばれる", () => {
      const store = createLoadingStore();
      const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      const bad = vi.fn<() => void>(() => {
        throw new Error("boom");
      });
      const good = vi.fn<() => void>();
      const u1 = store.subscribe(bad);
      const u2 = store.subscribe(good);

      store.show();

      expect(bad).toHaveBeenCalledOnce();
      expect(good).toHaveBeenCalledOnce();
      expect(errorSpy).toHaveBeenCalledOnce();

      u1();
      u2();
    });

    it("同一 listener を多重 subscribe した場合、各セッションに対して通知される", () => {
      const store = createLoadingStore();
      const listener = vi.fn<() => void>();
      const u1 = store.subscribe(listener);
      const u2 = store.subscribe(listener);

      store.show();

      expect(listener).toHaveBeenCalledTimes(2);

      u1();
      u2();
    });

    it("unsubscribe の多重呼び出しは冪等", () => {
      const store = createLoadingStore();
      const listener = vi.fn<() => void>();
      const unsubscribe = store.subscribe(listener);

      unsubscribe();
      unsubscribe();

      store.show();
      expect(listener).not.toHaveBeenCalled();
    });

    it("通知中に subscribe された listener は当該通知では呼ばれず、次回から呼ばれる", () => {
      // notify() 内で [...listeners] スナップショットを取る挙動の回帰テスト。
      // 通知の途中で subscribe された listener は、そのイテレーションでは拾われない。
      const store = createLoadingStore();
      const late = vi.fn<() => void>();
      let lateUnsub: (() => void) | undefined;
      const early = vi.fn<() => void>(() => {
        lateUnsub = store.subscribe(late);
      });
      const uEarly = store.subscribe(early);

      store.show();
      expect(early).toHaveBeenCalledOnce();
      expect(late).not.toHaveBeenCalled();

      store.hide();
      expect(late).toHaveBeenCalledOnce();

      uEarly();
      lateUnsub?.();
    });

    it("listener 内で show / hide を呼んでも再入が安全で、観測される snapshot は最新状態", () => {
      const store = createLoadingStore();
      const log: boolean[] = [];
      const unsub = store.subscribe(() => {
        log.push(store.getSnapshot());
      });

      store.show();
      store.hide();

      expect(log).toStrictEqual([true, false]);
      unsub();
    });

    it("複数 listener は subscribe 順に呼ばれる", () => {
      const store = createLoadingStore();
      const order: number[] = [];
      const u1 = store.subscribe(() => {
        order.push(1);
      });
      const u2 = store.subscribe(() => {
        order.push(2);
      });
      const u3 = store.subscribe(() => {
        order.push(3);
      });

      store.show();

      expect(order).toStrictEqual([1, 2, 3]);

      u1();
      u2();
      u3();
    });
  });

  describe("promise", () => {
    it("resolve 時に値が透過し、settle 後は false に戻る", async () => {
      const store = createLoadingStore();
      const result = await store.promise(Promise.resolve("ok"));

      expect(result).toBe("ok");
      expect(store.getSnapshot()).toBeFalsy();
    });

    it("渡した時点で表示される", () => {
      const store = createLoadingStore();
      const pending = store.promise(Promise.withResolvers<undefined>().promise);
      expect(store.getSnapshot()).toBeTruthy();
      expect(pending).toBeInstanceOf(Promise);
    });

    it("reject 時も hide が呼ばれる", async () => {
      const store = createLoadingStore();
      const error = new Error("nope");

      await expect(store.promise(Promise.reject(error))).rejects.toBe(error);
      expect(store.getSnapshot()).toBeFalsy();
    });

    it("並行 promise で参照カウントが正しい", async () => {
      const store = createLoadingStore();
      const taskA = Promise.withResolvers<undefined>();
      const taskB = Promise.withResolvers<undefined>();
      const a = store.promise(taskA.promise);
      const b = store.promise(taskB.promise);

      expect(store.getSnapshot()).toBeTruthy();

      taskA.resolve(undefined);
      await a;
      expect(store.getSnapshot()).toBeTruthy();

      taskB.resolve(undefined);
      await b;
      expect(store.getSnapshot()).toBeFalsy();
    });

    it("並行 promise が両方 reject でも count は 0 に戻る", async () => {
      const store = createLoadingStore();
      const e1 = new Error("a");
      const e2 = new Error("b");
      const a = store.promise(Promise.reject(e1));
      const b = store.promise(Promise.reject(e2));

      await expect(a).rejects.toBe(e1);
      await expect(b).rejects.toBe(e2);
      expect(store.getSnapshot()).toBeFalsy();
    });

    it("resolve と reject が混在しても count は 0 に戻る", async () => {
      const store = createLoadingStore();
      const err = new Error("x");
      const ok = store.promise(Promise.resolve(1));
      const ng = store.promise(Promise.reject(err));

      await expect(ok).resolves.toBe(1);
      await expect(ng).rejects.toBe(err);
      expect(store.getSnapshot()).toBeFalsy();
    });
  });

  describe("ファクトリ独立性", () => {
    it("createLoadingStore() を 2 つ作ってもカウンタ・listener が混ざらない", () => {
      const a = createLoadingStore();
      const b = createLoadingStore();
      const listenerA = vi.fn<() => void>();
      const listenerB = vi.fn<() => void>();
      const uA = a.subscribe(listenerA);
      const uB = b.subscribe(listenerB);

      a.show();

      expect(a.getSnapshot()).toBeTruthy();
      expect(b.getSnapshot()).toBeFalsy();
      expect(listenerA).toHaveBeenCalledOnce();
      expect(listenerB).not.toHaveBeenCalled();

      uA();
      uB();
    });
  });
});
