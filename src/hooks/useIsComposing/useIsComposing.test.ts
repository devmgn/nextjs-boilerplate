import { act, renderHook } from "@testing-library/react";
import { StrictMode } from "react";
import { useIsComposing } from "./useIsComposing";

function dispatchComposition(type: "compositionstart" | "compositionend") {
  document.dispatchEvent(new CompositionEvent(type));
}

function countCaptureCompositionStart(
  calls: Array<Parameters<typeof document.addEventListener>>,
): number {
  return calls.filter(
    ([type, , options]) => type === "compositionstart" && options === true,
  ).length;
}

describe(useIsComposing, () => {
  describe("基本動作", () => {
    it("compositionstart で true、compositionend で false に再レンダーされること", () => {
      const { result } = renderHook(() => useIsComposing());
      expect(result.current).toBe(false);

      act(() => {
        dispatchComposition("compositionstart");
      });
      expect(result.current).toBe(true);

      act(() => {
        dispatchComposition("compositionend");
      });
      expect(result.current).toBe(false);
    });

    it("同一コンポーネント内で capture と bubble の値を同時に取得できること", () => {
      const { result } = renderHook(() => ({
        capture: useIsComposing(true),
        bubble: useIsComposing(false),
      }));

      expect(result.current).toEqual({ capture: false, bubble: false });

      act(() => {
        dispatchComposition("compositionstart");
      });
      expect(result.current).toEqual({ capture: true, bubble: true });

      act(() => {
        dispatchComposition("compositionend");
      });
      expect(result.current).toEqual({ capture: false, bubble: false });
    });
  });

  describe("ストア選択", () => {
    it.for([
      { capture: true, phase: "キャプチャ" },
      { capture: false, phase: "バブル" },
    ])(
      "capture=$capture で $phase フェーズのリスナーを登録すること",
      ({ capture }) => {
        const spy = vi.spyOn(document, "addEventListener");

        renderHook(() => useIsComposing(capture));

        expect(spy).toHaveBeenCalledWith(
          "compositionstart",
          expect.any(Function),
          capture,
        );
        expect(spy).toHaveBeenCalledWith(
          "compositionend",
          expect.any(Function),
          capture,
        );
      },
    );

    it("capture が変更されたとき、新しいストアの値を返すこと", () => {
      const { result, rerender } = renderHook(
        ({ capture }) => useIsComposing(capture),
        { initialProps: { capture: true as boolean } },
      );

      act(() => {
        dispatchComposition("compositionstart");
      });
      expect(result.current).toBe(true);

      // capture→bubble に切り替わると、capture ストアは最後の購読者が抜けて composing がリセットされ、
      // 新たに購読する bubble ストアも初期値 false なので結果は false になる
      rerender({ capture: false });
      expect(result.current).toBe(false);

      act(() => {
        dispatchComposition("compositionstart");
      });
      expect(result.current).toBe(true);

      act(() => {
        dispatchComposition("compositionend");
      });
      expect(result.current).toBe(false);
    });

    it("capture 変更時に旧フェーズのリスナーを除去し新フェーズのリスナーを登録すること", () => {
      const addSpy = vi.spyOn(document, "addEventListener");
      const removeSpy = vi.spyOn(document, "removeEventListener");

      const { rerender, unmount } = renderHook(
        ({ capture }) => useIsComposing(capture),
        { initialProps: { capture: true as boolean } },
      );

      addSpy.mockClear();
      removeSpy.mockClear();

      rerender({ capture: false });

      expect(removeSpy).toHaveBeenCalledWith(
        "compositionstart",
        expect.any(Function),
        true,
      );
      expect(removeSpy).toHaveBeenCalledWith(
        "compositionend",
        expect.any(Function),
        true,
      );
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

      unmount();
    });
  });

  describe("購読ライフサイクル", () => {
    it("アンマウント時に document リスナーを除去し、以後のイベントに反応しないこと", () => {
      const removeSpy = vi.spyOn(document, "removeEventListener");
      const { result, unmount } = renderHook(() => useIsComposing());

      unmount();

      expect(removeSpy).toHaveBeenCalledWith(
        "compositionstart",
        expect.any(Function),
        true,
      );
      expect(removeSpy).toHaveBeenCalledWith(
        "compositionend",
        expect.any(Function),
        true,
      );

      act(() => {
        dispatchComposition("compositionstart");
      });
      expect(result.current).toBe(false);
    });

    it("composing 中にアンマウントしても、再マウント後は false から始まること", () => {
      // 購読切れ目で composing が false にリセットされる挙動のフック経由回帰テスト。
      // 購読者不在中に compositionend を取りこぼしても、次回マウント時の初期値に
      // 古い true を引きずらないことを保証する。
      const { result: r1, unmount } = renderHook(() => useIsComposing());

      act(() => {
        dispatchComposition("compositionstart");
      });
      expect(r1.current).toBe(true);

      unmount();

      // 購読者がいない間の compositionend はストアに届かない
      act(() => {
        dispatchComposition("compositionend");
      });

      const { result: r2 } = renderHook(() => useIsComposing());
      expect(r2.current).toBe(false);
    });

    it("StrictMode 下でも正しく動作しリスナーリークが起きないこと", () => {
      const addSpy = vi.spyOn(document, "addEventListener");
      const removeSpy = vi.spyOn(document, "removeEventListener");

      const { result, unmount } = renderHook(() => useIsComposing(), {
        wrapper: StrictMode,
      });

      // mount→unmount→再mount を経ても capture リスナーは純増 1 の状態
      expect(
        countCaptureCompositionStart(addSpy.mock.calls) -
          countCaptureCompositionStart(removeSpy.mock.calls),
      ).toBe(1);

      act(() => {
        dispatchComposition("compositionstart");
      });
      expect(result.current).toBe(true);

      act(() => {
        dispatchComposition("compositionend");
      });
      expect(result.current).toBe(false);

      unmount();

      // unmount 後は純増 0 (リスナーリークなし)
      expect(
        countCaptureCompositionStart(addSpy.mock.calls) -
          countCaptureCompositionStart(removeSpy.mock.calls),
      ).toBe(0);
    });
  });

  describe("実ユースケース", () => {
    it("子要素から bubbles:true で発火した composition イベントを拾うこと", () => {
      const input = document.createElement("input");
      document.body.append(input);

      try {
        const { result: capture } = renderHook(() => useIsComposing(true));
        const { result: bubble } = renderHook(() => useIsComposing(false));

        act(() => {
          input.dispatchEvent(
            new CompositionEvent("compositionstart", { bubbles: true }),
          );
        });
        expect(capture.current).toBe(true);
        expect(bubble.current).toBe(true);

        act(() => {
          input.dispatchEvent(
            new CompositionEvent("compositionend", { bubbles: true }),
          );
        });
        expect(capture.current).toBe(false);
        expect(bubble.current).toBe(false);
      } finally {
        input.remove();
      }
    });
  });
});
