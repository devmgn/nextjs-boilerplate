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

    const { unmount } = renderHook(() => useIsComposing());

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

    unmount();
    spy.mockRestore();
  });

  it("capture=false でバブルフェーズでイベントを購読すること", () => {
    const spy = vi.spyOn(document, "addEventListener");

    const { unmount } = renderHook(() => useIsComposing(false));

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

    unmount();
    spy.mockRestore();
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

  it("アンマウント後はイベントに反応しないこと", () => {
    const { result, unmount } = renderHook(() => useIsComposing());
    unmount();

    act(() => {
      dispatchComposition("compositionstart");
    });
    expect(result.current).toBe(false);
  });
});
