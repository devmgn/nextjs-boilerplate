import { act, renderHook } from "@testing-library/react";
import { useIsComposing } from "./useIsComposing";

function dispatchComposition(type: "compositionstart" | "compositionend") {
  document.dispatchEvent(new CompositionEvent(type));
}

describe(useIsComposing, () => {
  it("初期値がfalseであること", () => {
    const { result } = renderHook(() => useIsComposing());
    expect(result.current).toBe(false);
  });

  it("compositionstart でtrue、compositionend でfalseになること", () => {
    const { result } = renderHook(() => useIsComposing());

    act(() => {
      dispatchComposition("compositionstart");
    });
    expect(result.current).toBe(true);

    act(() => {
      dispatchComposition("compositionend");
    });
    expect(result.current).toBe(false);
  });

  it("複数インスタンスが同じ状態を共有すること", () => {
    const { result: result1 } = renderHook(() => useIsComposing());
    const { result: result2 } = renderHook(() => useIsComposing());

    act(() => {
      dispatchComposition("compositionstart");
    });
    expect(result1.current).toBe(true);
    expect(result2.current).toBe(true);

    act(() => {
      dispatchComposition("compositionend");
    });
    expect(result1.current).toBe(false);
    expect(result2.current).toBe(false);
  });

  it("デフォルトでキャプチャフェーズでイベントを購読すること", () => {
    const spy = vi.spyOn(document, "addEventListener");

    renderHook(() => useIsComposing());

    expect(spy).toHaveBeenCalledWith(
      "compositionstart",
      expect.any(Function),
      true,
    );
    expect(spy).toHaveBeenCalledWith(
      "compositionend",
      expect.any(Function),
      true,
    );
  });

  it("capture=false でバブルフェーズでイベントを購読すること", () => {
    const spy = vi.spyOn(document, "addEventListener");

    renderHook(() => useIsComposing(false));

    expect(spy).toHaveBeenCalledWith(
      "compositionstart",
      expect.any(Function),
      false,
    );
    expect(spy).toHaveBeenCalledWith(
      "compositionend",
      expect.any(Function),
      false,
    );
  });

  it("capture が異なるインスタンスは独立したstoreを持つこと", () => {
    const { result: capture } = renderHook(() => useIsComposing(true));
    const { result: bubble } = renderHook(() => useIsComposing(false));

    act(() => {
      dispatchComposition("compositionstart");
    });
    expect(capture.current).toBe(true);
    expect(bubble.current).toBe(true);

    act(() => {
      dispatchComposition("compositionend");
    });
    expect(capture.current).toBe(false);
    expect(bubble.current).toBe(false);
  });

  it("capture が変更されたとき、新しいストアの値を返すこと", () => {
    // capture ストアのリスナーを維持してクリーンアップ可能にする
    const helper = renderHook(() => useIsComposing(true));

    const { result, rerender } = renderHook(
      ({ capture }) => useIsComposing(capture),
      { initialProps: { capture: true as boolean } },
    );

    act(() => {
      dispatchComposition("compositionstart");
    });
    expect(result.current).toBe(true);

    rerender({ capture: false });
    // bubble ストアは composing されていないので false
    expect(result.current).toBe(false);

    // bubble ストアで compositionstart を発火すると true に戻る
    act(() => {
      dispatchComposition("compositionstart");
    });
    expect(result.current).toBe(true);

    // 両ストアの composing 状態をリセット
    act(() => {
      dispatchComposition("compositionend");
    });
    helper.unmount();
  });

  it("capture 変更時にリスナーが適切に付け替えられること", () => {
    const addSpy = vi.spyOn(document, "addEventListener");
    const removeSpy = vi.spyOn(document, "removeEventListener");

    const { rerender, unmount } = renderHook(
      ({ capture }) => useIsComposing(capture),
      { initialProps: { capture: true as boolean } },
    );

    expect(addSpy).toHaveBeenCalledWith(
      "compositionstart",
      expect.any(Function),
      true,
    );
    expect(addSpy).toHaveBeenCalledWith(
      "compositionend",
      expect.any(Function),
      true,
    );

    addSpy.mockClear();
    removeSpy.mockClear();

    rerender({ capture: false });

    // capture リスナーが除去される
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

    // bubble リスナーが追加される
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

  it("アンマウント後はイベントに反応しないこと", () => {
    const { result, unmount } = renderHook(() => useIsComposing());
    unmount();

    act(() => {
      dispatchComposition("compositionstart");
    });
    expect(result.current).toBe(false);
  });
});
