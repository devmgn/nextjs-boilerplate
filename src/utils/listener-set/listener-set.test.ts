import { describe, expect, it, vi } from "vitest";
import { createListenerSet } from "./listener-set";

/** Placeholder until the reference is injected. */
function noop(): void {}

describe(createListenerSet, () => {
  describe("notify", () => {
    it("calls subscribed listeners synchronously", () => {
      const set = createListenerSet("test");
      const listener = vi.fn<() => void>();
      const unsubscribe = set.subscribe(listener);

      set.notify();
      expect(listener).toHaveBeenCalledOnce();

      unsubscribe();
    });

    it("calls multiple listeners in subscription order", () => {
      const set = createListenerSet("test");
      const order: number[] = [];

      const u1 = set.subscribe(() => {
        order.push(1);
      });

      const u2 = set.subscribe(() => {
        order.push(2);
      });

      set.notify();

      expect(order).toStrictEqual([1, 2]);
      u1();
      u2();
    });

    it("notifies each session when the same listener is subscribed multiple times", () => {
      const set = createListenerSet("test");
      const listener = vi.fn<() => void>();
      const u1 = set.subscribe(listener);
      const u2 = set.subscribe(listener);

      set.notify();
      expect(listener).toHaveBeenCalledTimes(2);

      u1();
      set.notify();
      expect(listener).toHaveBeenCalledTimes(3);

      u2();
    });

    it("still calls a listener in the current notification even if another listener unsubscribes it", () => {
      const set = createListenerSet("test");
      const l2 = vi.fn<() => void>();
      let unsubscribeL2: () => void = noop;

      const u1 = set.subscribe(() => {
        unsubscribeL2();
      });

      unsubscribeL2 = set.subscribe(l2);

      set.notify();

      expect(l2).toHaveBeenCalledOnce();
      u1();
    });

    it("does not call a listener subscribed during a notification until the next one", () => {
      const set = createListenerSet("test");
      const late = vi.fn<() => void>();
      let lateUnsub: () => void = noop;

      const uEarly = set.subscribe(() => {
        lateUnsub();
        lateUnsub = set.subscribe(late);
      });

      set.notify();
      expect(late).not.toHaveBeenCalled();

      set.notify();
      expect(late).toHaveBeenCalledOnce();

      uEarly();
      lateUnsub();
    });

    it("logs a throwing listener to console.error with the label and still calls the others", () => {
      const set = createListenerSet("myStore");
      const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      const error = new Error("boom");
      const good = vi.fn<() => void>();

      const u1 = set.subscribe(() => {
        throw error;
      });

      const u2 = set.subscribe(good);

      set.notify();

      expect(good).toHaveBeenCalledOnce();
      expect(errorSpy).toHaveBeenCalledExactlyOnceWith(
        "myStore listener threw:",
        error
      );
      u1();
      u2();
    });
  });

  describe("unsubscribe", () => {
    it("does not call a listener after unsubscribe", () => {
      const set = createListenerSet("test");
      const listener = vi.fn<() => void>();
      set.subscribe(listener)();

      set.notify();
      expect(listener).not.toHaveBeenCalled();
    });

    it("is idempotent on repeated calls and does not affect other sessions", () => {
      const set = createListenerSet("test");
      const listener = vi.fn<() => void>();
      const u1 = set.subscribe(listener);
      const u2 = set.subscribe(listener);

      u1();
      u1();

      set.notify();
      expect(listener).toHaveBeenCalledOnce();
      u2();
    });
  });

  describe("lifecycle hooks", () => {
    it("calls onFirstSubscribe only when subscribers go from 0 to 1", () => {
      const onFirstSubscribe = vi.fn<() => void>();
      const set = createListenerSet("test", { onFirstSubscribe });

      const u1 = set.subscribe(noop);
      const u2 = set.subscribe(noop);
      expect(onFirstSubscribe).toHaveBeenCalledOnce();

      u1();
      u2();
      const u3 = set.subscribe(noop);
      expect(onFirstSubscribe).toHaveBeenCalledTimes(2);
      u3();
    });

    it("calls onLastUnsubscribe only when subscribers go from 1 to 0", () => {
      const onLastUnsubscribe = vi.fn<() => void>();
      const set = createListenerSet("test", { onLastUnsubscribe });
      const u1 = set.subscribe(noop);
      const u2 = set.subscribe(noop);

      u1();
      expect(onLastUnsubscribe).not.toHaveBeenCalled();

      u2();
      expect(onLastUnsubscribe).toHaveBeenCalledOnce();
    });

    it("does not call onLastUnsubscribe again on repeated unsubscribe", () => {
      const onLastUnsubscribe = vi.fn<() => void>();
      const set = createListenerSet("test", { onLastUnsubscribe });
      const unsubscribe = set.subscribe(noop);

      unsubscribe();
      unsubscribe();

      expect(onLastUnsubscribe).toHaveBeenCalledOnce();
    });
  });

  it("keeps listeners separate between instances", () => {
    const a = createListenerSet("a");
    const b = createListenerSet("b");
    const listenerB = vi.fn<() => void>();
    const uA = a.subscribe(noop);
    const uB = b.subscribe(listenerB);

    a.notify();

    expect(listenerB).not.toHaveBeenCalled();
    uA();
    uB();
  });
});
