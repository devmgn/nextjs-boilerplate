import { act, renderHook } from "@testing-library/react";
import { StrictMode } from "react";
import { describe, expect, it, vi } from "vitest";
import { useIsComposing } from "./use-is-composing";

function dispatchComposition(type: "compositionstart" | "compositionend") {
  document.dispatchEvent(new CompositionEvent(type));
}

function countCaptureCompositionStart(
  calls: Parameters<typeof document.addEventListener>[]
): number {
  return calls.filter(
    ([type, , options]) => type === "compositionstart" && options === true
  ).length;
}

describe(useIsComposing, () => {
  describe("basic behavior", () => {
    it("re-renders with true on compositionstart and false on compositionend", () => {
      const { result } = renderHook(() => useIsComposing());
      expect(result.current).toBeFalsy();

      act(() => {
        dispatchComposition("compositionstart");
      });
      expect(result.current).toBeTruthy();

      act(() => {
        dispatchComposition("compositionend");
      });
      expect(result.current).toBeFalsy();
    });

    it("reads capture and bubble values in the same component", () => {
      const { result } = renderHook(() => ({
        capture: useIsComposing(true),
        bubble: useIsComposing(false),
      }));

      expect(result.current).toStrictEqual({ capture: false, bubble: false });

      act(() => {
        dispatchComposition("compositionstart");
      });
      expect(result.current).toStrictEqual({ capture: true, bubble: true });

      act(() => {
        dispatchComposition("compositionend");
      });
      expect(result.current).toStrictEqual({ capture: false, bubble: false });
    });
  });

  describe("store selection", () => {
    it.for([
      { capture: true, phase: "capture" },
      { capture: false, phase: "bubble" },
    ])(
      "registers a $phase phase listener when capture=$capture",
      ({ capture }) => {
        const spy = vi.spyOn(document, "addEventListener");

        renderHook(() => useIsComposing(capture));

        expect(spy).toHaveBeenCalledWith(
          "compositionstart",
          expect.any(Function),
          capture
        );
        expect(spy).toHaveBeenCalledWith(
          "compositionend",
          expect.any(Function),
          capture
        );
      }
    );

    it("returns the new store's value when capture changes", () => {
      const { result, rerender } = renderHook<boolean, { capture: boolean }>(
        ({ capture }) => useIsComposing(capture),
        { initialProps: { capture: true } }
      );

      act(() => {
        dispatchComposition("compositionstart");
      });
      expect(result.current).toBeTruthy();

      // Switching capture to bubble resets composing as the capture store loses its last subscriber,
      // and the newly subscribed bubble store also starts at false, so the result is false
      rerender({ capture: false });
      expect(result.current).toBeFalsy();

      act(() => {
        dispatchComposition("compositionstart");
      });
      expect(result.current).toBeTruthy();

      act(() => {
        dispatchComposition("compositionend");
      });
      expect(result.current).toBeFalsy();
    });

    it("removes the old phase listener and registers the new one when capture changes", () => {
      const addSpy = vi.spyOn(document, "addEventListener");
      const removeSpy = vi.spyOn(document, "removeEventListener");

      const { rerender, unmount } = renderHook<boolean, { capture: boolean }>(
        ({ capture }) => useIsComposing(capture),
        { initialProps: { capture: true } }
      );

      addSpy.mockClear();
      removeSpy.mockClear();

      rerender({ capture: false });

      expect(removeSpy).toHaveBeenCalledWith(
        "compositionstart",
        expect.any(Function),
        true
      );
      expect(removeSpy).toHaveBeenCalledWith(
        "compositionend",
        expect.any(Function),
        true
      );
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

      unmount();
    });
  });

  describe("subscription lifecycle", () => {
    it("removes document listeners on unmount and ignores later events", () => {
      const removeSpy = vi.spyOn(document, "removeEventListener");
      const { result, unmount } = renderHook(() => useIsComposing());

      unmount();

      expect(removeSpy).toHaveBeenCalledWith(
        "compositionstart",
        expect.any(Function),
        true
      );
      expect(removeSpy).toHaveBeenCalledWith(
        "compositionend",
        expect.any(Function),
        true
      );

      act(() => {
        dispatchComposition("compositionstart");
      });
      expect(result.current).toBeFalsy();
    });

    it("starts from false after remount even if unmounted while composing", () => {
      // Regression test, via the hook, for resetting composing to false when subscriptions end.
      // Ensures the initial value on the next mount doesn't carry a stale true even if
      // compositionend was missed while there were no subscribers.
      const { result: r1, unmount } = renderHook(() => useIsComposing());

      act(() => {
        dispatchComposition("compositionstart");
      });
      expect(r1.current).toBeTruthy();

      unmount();

      // compositionend does not reach the store while there are no subscribers
      act(() => {
        dispatchComposition("compositionend");
      });

      const { result: r2 } = renderHook(() => useIsComposing());
      expect(r2.current).toBeFalsy();
    });

    it("works under StrictMode without leaking listeners", () => {
      const addSpy = vi.spyOn(document, "addEventListener");
      const removeSpy = vi.spyOn(document, "removeEventListener");

      const { result, unmount } = renderHook(() => useIsComposing(), {
        wrapper: StrictMode,
      });

      // After mount, unmount, and remount, the capture listener count is a net +1
      expect(
        countCaptureCompositionStart(addSpy.mock.calls) -
          countCaptureCompositionStart(removeSpy.mock.calls)
      ).toBe(1);

      act(() => {
        dispatchComposition("compositionstart");
      });
      expect(result.current).toBeTruthy();

      act(() => {
        dispatchComposition("compositionend");
      });
      expect(result.current).toBeFalsy();

      unmount();

      // Net 0 after unmount (no listener leak)
      expect(
        countCaptureCompositionStart(addSpy.mock.calls) -
          countCaptureCompositionStart(removeSpy.mock.calls)
      ).toBe(0);
    });
  });

  describe("real-world use case", () => {
    it("picks up composition events dispatched from a child with bubbles: true", () => {
      const input = document.createElement("input");
      document.body.append(input);

      try {
        const { result: capture } = renderHook(() => useIsComposing(true));
        const { result: bubble } = renderHook(() => useIsComposing(false));

        act(() => {
          input.dispatchEvent(
            new CompositionEvent("compositionstart", { bubbles: true })
          );
        });
        expect(capture.current).toBeTruthy();
        expect(bubble.current).toBeTruthy();

        act(() => {
          input.dispatchEvent(
            new CompositionEvent("compositionend", { bubbles: true })
          );
        });
        expect(capture.current).toBeFalsy();
        expect(bubble.current).toBeFalsy();
      } finally {
        input.remove();
      }
    });
  });
});
