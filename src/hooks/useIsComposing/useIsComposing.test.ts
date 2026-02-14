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

  it("アンマウント後はイベントに反応しないこと", () => {
    const { result, unmount } = renderHook(() => useIsComposing());
    unmount();

    act(() => {
      dispatchComposition("compositionstart");
    });
    expect(result.current).toBe(false);
  });
});
