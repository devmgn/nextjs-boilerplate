import { describe, expect, it, vi } from "vitest";
import { createListenerSet } from "./listener-set";

/** 参照を差し込むまでのプレースホルダ。 */
function noop(): void {}

describe(createListenerSet, () => {
  describe("notify", () => {
    it("subscribe 中の listener が同期的に呼ばれる", () => {
      const set = createListenerSet("test");
      const listener = vi.fn<() => void>();
      const unsubscribe = set.subscribe(listener);

      set.notify();
      expect(listener).toHaveBeenCalledOnce();

      unsubscribe();
    });

    it("複数 listener は subscribe 順に呼ばれる", () => {
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

    it("同一 listener を多重 subscribe した場合、各セッションに対して通知される", () => {
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

    it("listener 内で他の listener を unsubscribe しても当該通知では呼ばれる", () => {
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

    it("通知中に subscribe された listener は当該通知では呼ばれず、次回から呼ばれる", () => {
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

    it("listener が throw してもラベル付きで console.error に記録し、他の listener は呼ばれる", () => {
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
    it("unsubscribe 後の listener は呼ばれない", () => {
      const set = createListenerSet("test");
      const listener = vi.fn<() => void>();
      set.subscribe(listener)();

      set.notify();
      expect(listener).not.toHaveBeenCalled();
    });

    it("多重呼び出しは冪等で、他セッションを巻き込まない", () => {
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

  describe("ライフサイクルフック", () => {
    it("onFirstSubscribe は購読者 0 → 1 のときだけ呼ばれる", () => {
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

    it("onLastUnsubscribe は購読者 1 → 0 のときだけ呼ばれる", () => {
      const onLastUnsubscribe = vi.fn<() => void>();
      const set = createListenerSet("test", { onLastUnsubscribe });
      const u1 = set.subscribe(noop);
      const u2 = set.subscribe(noop);

      u1();
      expect(onLastUnsubscribe).not.toHaveBeenCalled();

      u2();
      expect(onLastUnsubscribe).toHaveBeenCalledOnce();
    });

    it("unsubscribe の多重呼び出しで onLastUnsubscribe は再度呼ばれない", () => {
      const onLastUnsubscribe = vi.fn<() => void>();
      const set = createListenerSet("test", { onLastUnsubscribe });
      const unsubscribe = set.subscribe(noop);

      unsubscribe();
      unsubscribe();

      expect(onLastUnsubscribe).toHaveBeenCalledOnce();
    });
  });

  it("インスタンス間で listener が混ざらない", () => {
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
