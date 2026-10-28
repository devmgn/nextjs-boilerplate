import { afterEach, describe, expect, it, vi } from "vitest";
import { loadingStore } from ".";
import { createLoadingStore } from "./loading-store";

/** Placeholder until the reference is assigned. */
function noop(): void {}

describe("loadingStore (singleton)", () => {
  afterEach(() => {
    loadingStore.reset();
  });

  it("getSnapshot and getServerSnapshot are both false initially", () => {
    expect(loadingStore.getSnapshot()).toBeFalsy();
    expect(loadingStore.getServerSnapshot()).toBeFalsy();
  });

  it("becomes true on show() and false again on hide()", () => {
    loadingStore.show();
    expect(loadingStore.getSnapshot()).toBeTruthy();

    loadingStore.hide();
    expect(loadingStore.getSnapshot()).toBeFalsy();
  });

  it("getServerSnapshot stays false even while shown (SSR contract)", () => {
    // Pins the assumption that SSR renders no loading UI and getSnapshot takes over
    // after subscribe runs in the client's useEffect.
    loadingStore.show();
    expect(loadingStore.getSnapshot()).toBeTruthy();
    expect(loadingStore.getServerSnapshot()).toBeFalsy();
  });
});

describe("createLoadingStore", () => {
  describe("reference counting", () => {
    it("stays true after show×N → hide×M (M<N), false when M=N", () => {
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

    it("clamps extra hide() calls without calling listeners", () => {
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
    it("reset() while shown sets false at once", () => {
      const store = createLoadingStore();
      store.show();
      store.show();
      store.show();
      expect(store.getSnapshot()).toBeTruthy();

      store.reset();
      expect(store.getSnapshot()).toBeFalsy();
    });

    it("reset() when empty does not call listeners", () => {
      const store = createLoadingStore();
      const listener = vi.fn<() => void>();
      const unsubscribe = store.subscribe(listener);

      store.reset();

      expect(listener).not.toHaveBeenCalled();
      unsubscribe();
    });
  });

  describe("subscribe / listener", () => {
    it("calls subscribed listeners synchronously on show / hide", () => {
      const store = createLoadingStore();
      const listener = vi.fn<() => void>();
      const unsubscribe = store.subscribe(listener);

      store.show();
      expect(listener).toHaveBeenCalledOnce();

      store.hide();
      expect(listener).toHaveBeenCalledTimes(2);

      unsubscribe();
    });

    it("does not call listeners after unsubscribe", () => {
      const store = createLoadingStore();
      const listener = vi.fn<() => void>();
      const unsubscribe = store.subscribe(listener);
      unsubscribe();

      store.show();
      expect(listener).not.toHaveBeenCalled();
    });

    it("calls all listeners", () => {
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

    it("still calls other listeners when one unsubscribes another", () => {
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

    it("still calls other listeners when one throws", () => {
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

    it("notifies each subscription when the same listener subscribes multiple times", () => {
      const store = createLoadingStore();
      const listener = vi.fn<() => void>();
      const u1 = store.subscribe(listener);
      const u2 = store.subscribe(listener);

      store.show();

      expect(listener).toHaveBeenCalledTimes(2);

      u1();
      u2();
    });

    it("unsubscribe is idempotent", () => {
      const store = createLoadingStore();
      const listener = vi.fn<() => void>();
      const unsubscribe = store.subscribe(listener);

      unsubscribe();
      unsubscribe();

      store.show();
      expect(listener).not.toHaveBeenCalled();
    });

    it("a listener subscribed during notify is called from the next notify on", () => {
      // Regression test for notify() taking a [...listeners] snapshot.
      // A listener subscribed mid-notify is not picked up in that iteration.
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

    it("show / hide inside a listener is reentrant-safe and sees the latest snapshot", () => {
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

    it("calls listeners in subscription order", () => {
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
    it("passes through the resolved value and returns to false after settling", async () => {
      const store = createLoadingStore();
      const result = await store.promise(Promise.resolve("ok"));

      expect(result).toBe("ok");
      expect(store.getSnapshot()).toBeFalsy();
    });

    it("shows as soon as the promise is passed", () => {
      const store = createLoadingStore();
      const pending = store.promise(Promise.withResolvers<undefined>().promise);
      expect(store.getSnapshot()).toBeTruthy();
      expect(pending).toBeInstanceOf(Promise);
    });

    it("calls hide on reject too", async () => {
      const store = createLoadingStore();
      const error = new Error("nope");

      await expect(store.promise(Promise.reject(error))).rejects.toBe(error);
      expect(store.getSnapshot()).toBeFalsy();
    });

    it("keeps the reference count correct with concurrent promises", async () => {
      const store = createLoadingStore();
      const taskA = Promise.withResolvers<undefined>();
      const taskB = Promise.withResolvers<undefined>();
      const a = store.promise(taskA.promise);
      const b = store.promise(taskB.promise);

      expect(store.getSnapshot()).toBeTruthy();

      // resolve of Promise.withResolvers<undefined> requires an argument
      taskA.resolve(undefined);
      await a;
      expect(store.getSnapshot()).toBeTruthy();

      // resolve of Promise.withResolvers<undefined> requires an argument
      taskB.resolve(undefined);
      await b;
      expect(store.getSnapshot()).toBeFalsy();
    });

    it("count returns to 0 when concurrent promises both reject", async () => {
      const store = createLoadingStore();
      const e1 = new Error("a");
      const e2 = new Error("b");
      const a = store.promise(Promise.reject(e1));
      const b = store.promise(Promise.reject(e2));

      await expect(a).rejects.toBe(e1);
      await expect(b).rejects.toBe(e2);
      expect(store.getSnapshot()).toBeFalsy();
    });

    it("count returns to 0 with mixed resolve and reject", async () => {
      const store = createLoadingStore();
      const err = new Error("x");
      const ok = store.promise(Promise.resolve(1));
      const ng = store.promise(Promise.reject(err));

      await expect(ok).resolves.toBe(1);
      await expect(ng).rejects.toBe(err);
      expect(store.getSnapshot()).toBeFalsy();
    });
  });

  describe("factory independence", () => {
    it("two createLoadingStore() instances do not share counters or listeners", () => {
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
