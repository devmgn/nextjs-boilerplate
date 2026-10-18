import { describe, expect, it, vi } from "vitest";
import { bubbleCompositionStore, captureCompositionStore } from ".";
import { createCompositionStore } from "./composition-store";

/** Placeholder until the reference is assigned. */
function noop(): void {}

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
    it("starts as false", () => {
      expect(store.getSnapshot()).toBeFalsy();
    });

    it("becomes true on compositionstart and false on compositionend", () => {
      const unsubscribe = store.subscribe(() => {});

      dispatchComposition("compositionstart");
      expect(store.getSnapshot()).toBeTruthy();

      dispatchComposition("compositionend");
      expect(store.getSnapshot()).toBeFalsy();

      unsubscribe();
    });

    it("calls subscribed listeners synchronously", () => {
      const listener = vi.fn<() => void>();
      const unsubscribe = store.subscribe(listener);

      dispatchComposition("compositionstart");
      expect(listener).toHaveBeenCalledOnce();

      dispatchComposition("compositionend");
      expect(listener).toHaveBeenCalledTimes(2);

      unsubscribe();
    });

    it("does not call the listener after unsubscribe", () => {
      const listener = vi.fn<() => void>();
      const unsubscribe = store.subscribe(listener);
      unsubscribe();

      dispatchComposition("compositionstart");
      expect(listener).not.toHaveBeenCalled();
    });

    it("registers document listeners on the first subscribe", () => {
      const addSpy = vi.spyOn(document, "addEventListener");

      const unsubscribe = store.subscribe(() => {});

      expect(addSpy).toHaveBeenCalledWith(
        "compositionstart",
        expect.any(Function),
        capture
      );
      expect(addSpy).toHaveBeenCalledWith(
        "compositionend",
        expect.any(Function),
        capture
      );

      unsubscribe();
    });

    it("removes document listeners on the last unsubscribe", () => {
      const removeSpy = vi.spyOn(document, "removeEventListener");
      const unsubscribe = store.subscribe(() => {});

      unsubscribe();

      expect(removeSpy).toHaveBeenCalledWith(
        "compositionstart",
        expect.any(Function),
        capture
      );
      expect(removeSpy).toHaveBeenCalledWith(
        "compositionend",
        expect.any(Function),
        capture
      );
    });

    it("does not remove listeners until the last of multiple subscribers leaves", () => {
      const removeSpy = vi.spyOn(document, "removeEventListener");
      const u1 = store.subscribe(() => {});
      const u2 = store.subscribe(() => {});

      u1();
      expect(removeSpy).not.toHaveBeenCalled();

      u2();
      expect(removeSpy).toHaveBeenCalledWith(
        "compositionstart",
        expect.any(Function),
        capture
      );
    });

    it("calls every listener", () => {
      const l1 = vi.fn<() => void>();
      const l2 = vi.fn<() => void>();
      const u1 = store.subscribe(l1);
      const u2 = store.subscribe(l2);

      dispatchComposition("compositionstart");

      expect(l1).toHaveBeenCalledOnce();
      expect(l2).toHaveBeenCalledOnce();

      u1();
      u2();
    });

    it("calls other listeners even if a listener unsubscribes another", () => {
      const l2 = vi.fn<() => void>();
      let unsubscribeL2: () => void = noop;

      const l1 = vi.fn<() => void>(() => {
        unsubscribeL2();
      });

      const u1 = store.subscribe(l1);
      const u2 = store.subscribe(l2);
      unsubscribeL2 = u2;

      dispatchComposition("compositionstart");

      expect(l1).toHaveBeenCalledOnce();
      expect(l2).toHaveBeenCalledOnce();

      u1();
      u2();
    });

    it("calls other listeners even if one throws", () => {
      const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      const bad = vi.fn<() => void>(() => {
        throw new Error("boom");
      });

      const good = vi.fn<() => void>();
      const u1 = store.subscribe(bad);
      const u2 = store.subscribe(good);

      dispatchComposition("compositionstart");

      expect(bad).toHaveBeenCalledOnce();
      expect(good).toHaveBeenCalledOnce();
      expect(errorSpy).toHaveBeenCalledOnce();

      u1();
      u2();
    });

    it("starts from false on the next subscribe even if unsubscribed while composing", () => {
      // Regression test for resetting composing to false on the last unsubscribe.
      // Ensures getSnapshot on the next subscribe doesn't return a stale true even if
      // compositionend was missed while unsubscribed.
      const u1 = store.subscribe(() => {});
      dispatchComposition("compositionstart");
      expect(store.getSnapshot()).toBeTruthy();

      u1();
      // The listener is not called when IME composition ends with no subscribers
      dispatchComposition("compositionend");

      const u2 = store.subscribe(() => {});
      expect(store.getSnapshot()).toBeFalsy();

      u2();
    });
  });

  describe("store independence", () => {
    it("capture and bubble manage listeners independently", () => {
      const captureListener = vi.fn<() => void>();
      const bubbleListener = vi.fn<() => void>();
      const u1 = captureCompositionStore.subscribe(captureListener);
      const u2 = bubbleCompositionStore.subscribe(bubbleListener);

      dispatchComposition("compositionstart");

      // Same document event, but it reaches both because they subscribe in the capture and bubble phases
      expect(captureListener).toHaveBeenCalledOnce();
      expect(bubbleListener).toHaveBeenCalledOnce();

      u1();
      u2();
    });

    it("unsubscribing from one store does not affect the other", () => {
      const captureListener = vi.fn<() => void>();
      const bubbleListener = vi.fn<() => void>();
      const u1 = captureCompositionStore.subscribe(captureListener);
      const u2 = bubbleCompositionStore.subscribe(bubbleListener);

      u1();

      dispatchComposition("compositionstart");

      expect(captureListener).not.toHaveBeenCalled();
      expect(bubbleListener).toHaveBeenCalledOnce();

      u2();
    });
  });

  describe("createCompositionStore (factory)", () => {
    it("returns independent instances for the same capture value", () => {
      const a = createCompositionStore(true);
      const b = createCompositionStore(true);
      const listenerA = vi.fn<() => void>();
      const listenerB = vi.fn<() => void>();

      const uA = a.subscribe(listenerA);
      const uB = b.subscribe(listenerB);

      uA();

      dispatchComposition("compositionstart");

      expect(listenerA).not.toHaveBeenCalled();
      expect(listenerB).toHaveBeenCalledOnce();
      expect(a.getSnapshot()).toBeFalsy();
      expect(b.getSnapshot()).toBeTruthy();

      uB();
    });

    it("passes the capture argument as-is to the third argument of addEventListener", () => {
      const addSpy = vi.spyOn(document, "addEventListener");
      const store = createCompositionStore(false);

      const unsubscribe = store.subscribe(() => {});

      expect(addSpy).toHaveBeenCalledWith(
        "compositionstart",
        expect.any(Function),
        false
      );
      expect(addSpy).toHaveBeenCalledWith(
        "compositionend",
        expect.any(Function),
        false
      );

      unsubscribe();
    });

    it("repeated unsubscribe calls on the same instance are idempotent", () => {
      const store = createCompositionStore(true);
      const removeSpy = vi.spyOn(document, "removeEventListener");

      const unsubscribe = store.subscribe(() => {});
      unsubscribe();
      unsubscribe();

      // removeEventListener runs only on the first unsubscribe:
      // 2 calls total, for compositionstart + compositionend
      expect(removeSpy).toHaveBeenCalledTimes(2);
    });

    it("treats each session independently when the same listener subscribes multiple times", () => {
      const store = createCompositionStore(true);
      const removeSpy = vi.spyOn(document, "removeEventListener");
      const listener = vi.fn<() => void>();

      const u1 = store.subscribe(listener);
      const u2 = store.subscribe(listener);

      // The first unsubscribe does not remove the document listeners
      u1();
      expect(removeSpy).not.toHaveBeenCalled();

      // The second session is still active, so events arrive
      dispatchComposition("compositionstart");
      expect(listener).toHaveBeenCalledOnce();

      // The last unsubscribe removes the document listeners
      u2();
      expect(removeSpy).toHaveBeenCalledWith(
        "compositionstart",
        expect.any(Function),
        true
      );
    });

    it("notifies each session when the same listener subscribes multiple times", () => {
      const store = createCompositionStore(true);
      const listener = vi.fn<() => void>();

      const u1 = store.subscribe(listener);
      const u2 = store.subscribe(listener);

      dispatchComposition("compositionstart");

      // Notified once per session, so called 2 times total
      expect(listener).toHaveBeenCalledTimes(2);

      u1();
      u2();
    });
  });
});
