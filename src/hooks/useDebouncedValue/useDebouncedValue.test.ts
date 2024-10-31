import { act, renderHook } from "@testing-library/react";
import { useDebouncedValue } from ".";
import { useIsComposing } from "../useIsComposing";

// モックの作成
vi.mock("../useIsComposing", () => ({
  useIsComposing: vi.fn(() => false),
}));

describe("useDebouncedValue", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("初期値が与えられたとき、即座にその値を返すこと", () => {
    const { result } = renderHook(() => useDebouncedValue("initial", 300));
    expect(result.current).toBe("initial");
  });

  it("値が変更されたとき、指定時間後にデバウンスされた値を返すこと", async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 300),
      { initialProps: { value: "initial" } },
    );

    // 値を変更
    rerender({ value: "changed" });

    // タイマーを進める前は元の値のまま
    expect(result.current).toBe("initial");

    // タイマーを300ms進める
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // 値が更新されている
    expect(result.current).toBe("changed");
  });

  it("isComposingがtrueのとき、値が更新されないこと", async () => {
    // isComposingをtrueに設定
    vi.mocked(useIsComposing).mockReturnValue(true);

    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 300),
      { initialProps: { value: "initial" } },
    );

    // 値を変更
    rerender({ value: "changed" });

    // タイマーを進めても値は変わらない
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe("initial");
  });

  it("コンポーネントがアンマウントされたとき、デバウンスがキャンセルされること", () => {
    const { unmount } = renderHook(() => useDebouncedValue("test", 300));

    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
