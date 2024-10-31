import { act, renderHook } from "@testing-library/react";
import { useIsComposing } from ".";

describe("useIsComposing", () => {
  let mockElement: HTMLElement;

  beforeEach(() => {
    mockElement = document.createElement("div");
    vi.spyOn(document, "activeElement", "get").mockReturnValue(mockElement);
    vi.spyOn(mockElement, "addEventListener");
    vi.spyOn(mockElement, "removeEventListener");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("初期化時、isComposingがfalseとなること", () => {
    const { result } = renderHook(() => useIsComposing());
    expect(result.current).toBe(false);
  });

  it("マウント時、イベントリスナーが追加されること", () => {
    renderHook(() => useIsComposing());
    expect(mockElement.addEventListener).toHaveBeenCalledTimes(3);
    expect(mockElement.addEventListener).toHaveBeenCalledWith(
      "compositionstart",
      expect.any(Function),
    );
    expect(mockElement.addEventListener).toHaveBeenCalledWith(
      "compositionupdate",
      expect.any(Function),
    );
    expect(mockElement.addEventListener).toHaveBeenCalledWith(
      "compositionend",
      expect.any(Function),
    );
  });

  it("アンマウント時、イベントリスナーが削除されること", () => {
    const { unmount } = renderHook(() => useIsComposing());
    unmount();
    expect(mockElement.removeEventListener).toHaveBeenCalledTimes(3);
    expect(mockElement.removeEventListener).toHaveBeenCalledWith(
      "compositionstart",
      expect.any(Function),
    );
    expect(mockElement.removeEventListener).toHaveBeenCalledWith(
      "compositionupdate",
      expect.any(Function),
    );
    expect(mockElement.removeEventListener).toHaveBeenCalledWith(
      "compositionend",
      expect.any(Function),
    );
  });

  it("コンポジションイベントの発生時、isComposingが適切に更新されること", () => {
    const { result } = renderHook(() => useIsComposing());

    const dispatchCompositionEvent = (type: string) => {
      const event = new CompositionEvent(type);
      mockElement.dispatchEvent(event);
    };

    act(() => {
      dispatchCompositionEvent("compositionstart");
    });
    expect(result.current).toBe(true);

    act(() => {
      dispatchCompositionEvent("compositionupdate");
    });
    expect(result.current).toBe(true);

    act(() => {
      dispatchCompositionEvent("compositionend");
    });
    expect(result.current).toBe(false);
  });
});
