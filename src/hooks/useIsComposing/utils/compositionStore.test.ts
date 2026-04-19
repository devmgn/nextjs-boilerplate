import { bubbleCompositionStore, captureCompositionStore } from ".";
import { createCompositionStore } from "./compositionStore";

function dispatchComposition(type: "compositionstart" | "compositionend") {
  document.dispatchEvent(new CompositionEvent(type));
}

describe("compositionStore", () => {
  describe.for([
    {
      name: "captureCompositionStore",
      store: captureCompositionStore,
      capture: true,
    },
    {
      name: "bubbleCompositionStore",
      store: bubbleCompositionStore,
      capture: false,
    },
  ])("$name", ({ store, capture }) => {
    it("初期値はfalse", () => {
      expect(store.getSnapshot()).toBe(false);
    });

    it("compositionstartでtrue、compositionendでfalseになる", () => {
      const unsubscribe = store.subscribe(() => {});

      dispatchComposition("compositionstart");
      expect(store.getSnapshot()).toBe(true);

      dispatchComposition("compositionend");
      expect(store.getSnapshot()).toBe(false);

      unsubscribe();
    });

    it("subscribe中のリスナーが同期的に呼ばれる", () => {
      const listener = vi.fn();
      const unsubscribe = store.subscribe(listener);

      dispatchComposition("compositionstart");
      expect(listener).toHaveBeenCalledTimes(1);

      dispatchComposition("compositionend");
      expect(listener).toHaveBeenCalledTimes(2);

      unsubscribe();
    });

    it("unsubscribe後はリスナーが呼ばれない", () => {
      const listener = vi.fn();
      const unsubscribe = store.subscribe(listener);
      unsubscribe();

      dispatchComposition("compositionstart");
      expect(listener).not.toHaveBeenCalled();
    });

    it("初回subscribeでdocumentリスナーを登録する", () => {
      const addSpy = vi.spyOn(document, "addEventListener");

      const unsubscribe = store.subscribe(() => {});

      expect(addSpy).toHaveBeenCalledWith(
        "compositionstart",
        expect.any(Function),
        capture,
      );
      expect(addSpy).toHaveBeenCalledWith(
        "compositionend",
        expect.any(Function),
        capture,
      );

      unsubscribe();
    });

    it("最後のunsubscribeでdocumentリスナーを除去する", () => {
      const removeSpy = vi.spyOn(document, "removeEventListener");
      const unsubscribe = store.subscribe(() => {});

      unsubscribe();

      expect(removeSpy).toHaveBeenCalledWith(
        "compositionstart",
        expect.any(Function),
        capture,
      );
      expect(removeSpy).toHaveBeenCalledWith(
        "compositionend",
        expect.any(Function),
        capture,
      );
    });

    it("購読者が複数いる間は最後の1件まで除去しない", () => {
      const removeSpy = vi.spyOn(document, "removeEventListener");
      const u1 = store.subscribe(() => {});
      const u2 = store.subscribe(() => {});

      u1();
      expect(removeSpy).not.toHaveBeenCalled();

      u2();
      expect(removeSpy).toHaveBeenCalledWith(
        "compositionstart",
        expect.any(Function),
        capture,
      );
    });

    it("複数リスナーが全員呼ばれる", () => {
      const l1 = vi.fn();
      const l2 = vi.fn();
      const u1 = store.subscribe(l1);
      const u2 = store.subscribe(l2);

      dispatchComposition("compositionstart");

      expect(l1).toHaveBeenCalledTimes(1);
      expect(l2).toHaveBeenCalledTimes(1);

      u1();
      u2();
    });

    it("リスナー内で他のリスナーをunsubscribeしても他のリスナーは呼ばれる", () => {
      const l2 = vi.fn();
      const ref: { u2?: () => void } = {};
      const l1 = vi.fn(() => {
        ref.u2?.();
      });
      const u1 = store.subscribe(l1);
      const u2 = store.subscribe(l2);
      ref.u2 = u2;

      dispatchComposition("compositionstart");

      expect(l1).toHaveBeenCalledTimes(1);
      expect(l2).toHaveBeenCalledTimes(1);

      u1();
      u2();
    });

    it("あるリスナーがthrowしても他のリスナーは呼ばれる", () => {
      const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      const bad = vi.fn(() => {
        throw new Error("boom");
      });
      const good = vi.fn();
      const u1 = store.subscribe(bad);
      const u2 = store.subscribe(good);

      dispatchComposition("compositionstart");

      expect(bad).toHaveBeenCalledTimes(1);
      expect(good).toHaveBeenCalledTimes(1);
      expect(errorSpy).toHaveBeenCalledTimes(1);

      u1();
      u2();
    });

    it("composing中にunsubscribeしても次のsubscribeはfalseから始まる", () => {
      // 最後の unsubscribe で composing を false にリセットする挙動の回帰テスト。
      // 購読の切れ目で compositionend を取りこぼしても、次の subscribe 時の getSnapshot が
      // 古い true を返さないことを保証する。
      const u1 = store.subscribe(() => {});
      dispatchComposition("compositionstart");
      expect(store.getSnapshot()).toBe(true);

      u1();
      // 購読者が居ない間に IME が終了しても listener は呼ばれない
      dispatchComposition("compositionend");

      const u2 = store.subscribe(() => {});
      expect(store.getSnapshot()).toBe(false);

      u2();
    });
  });

  describe("ストア間の独立性", () => {
    it("captureとbubbleは独立してリスナーを管理する", () => {
      const captureListener = vi.fn();
      const bubbleListener = vi.fn();
      const u1 = captureCompositionStore.subscribe(captureListener);
      const u2 = bubbleCompositionStore.subscribe(bubbleListener);

      dispatchComposition("compositionstart");

      // 同じ document イベントだが、capture/bubble 両方のフェーズで購読されるため両者に届く
      expect(captureListener).toHaveBeenCalledTimes(1);
      expect(bubbleListener).toHaveBeenCalledTimes(1);

      u1();
      u2();
    });

    it("一方のストアのunsubscribeは他方に影響しない", () => {
      const captureListener = vi.fn();
      const bubbleListener = vi.fn();
      const u1 = captureCompositionStore.subscribe(captureListener);
      const u2 = bubbleCompositionStore.subscribe(bubbleListener);

      u1();

      dispatchComposition("compositionstart");

      expect(captureListener).not.toHaveBeenCalled();
      expect(bubbleListener).toHaveBeenCalledTimes(1);

      u2();
    });
  });

  describe("createCompositionStore (ファクトリ)", () => {
    it("同じ capture 値でも独立したインスタンスを返す", () => {
      const a = createCompositionStore(true);
      const b = createCompositionStore(true);
      const listenerA = vi.fn();
      const listenerB = vi.fn();

      const uA = a.subscribe(listenerA);
      const uB = b.subscribe(listenerB);

      uA();

      dispatchComposition("compositionstart");

      expect(listenerA).not.toHaveBeenCalled();
      expect(listenerB).toHaveBeenCalledTimes(1);
      expect(a.getSnapshot()).toBe(false);
      expect(b.getSnapshot()).toBe(true);

      uB();
    });

    it("capture 引数が addEventListener の第3引数にそのまま渡される", () => {
      const addSpy = vi.spyOn(document, "addEventListener");
      const store = createCompositionStore(false);

      const unsubscribe = store.subscribe(() => {});

      expect(addSpy).toHaveBeenCalledWith(
        "compositionstart",
        expect.any(Function),
        false,
      );
      expect(addSpy).toHaveBeenCalledWith(
        "compositionend",
        expect.any(Function),
        false,
      );

      unsubscribe();
    });

    it("同一インスタンスに対する unsubscribe の多重呼び出しは冪等", () => {
      const store = createCompositionStore(true);
      const removeSpy = vi.spyOn(document, "removeEventListener");

      const unsubscribe = store.subscribe(() => {});
      unsubscribe();
      unsubscribe();

      // removeEventListener は最初の unsubscribe の1回のみ
      // compositionstart + compositionend で計 2 回
      expect(removeSpy).toHaveBeenCalledTimes(2);
    });

    it("同一 listener を多重 subscribe しても各セッションが独立して扱われる", () => {
      const store = createCompositionStore(true);
      const removeSpy = vi.spyOn(document, "removeEventListener");
      const listener = vi.fn();

      const u1 = store.subscribe(listener);
      const u2 = store.subscribe(listener);

      // 1 回目の unsubscribe では document リスナーは外れない
      u1();
      expect(removeSpy).not.toHaveBeenCalled();

      // 2 回目のセッションはまだ有効なのでイベントが届く
      dispatchComposition("compositionstart");
      expect(listener).toHaveBeenCalledTimes(1);

      // 最後の unsubscribe で document リスナー除去
      u2();
      expect(removeSpy).toHaveBeenCalledWith(
        "compositionstart",
        expect.any(Function),
        true,
      );
    });

    it("同一 listener を多重 subscribe した場合、各セッションに対して通知される", () => {
      const store = createCompositionStore(true);
      const listener = vi.fn();

      const u1 = store.subscribe(listener);
      const u2 = store.subscribe(listener);

      dispatchComposition("compositionstart");

      // 2 セッション分通知されるので計 2 回呼ばれる
      expect(listener).toHaveBeenCalledTimes(2);

      u1();
      u2();
    });
  });
});
