import { renderHook } from "@testing-library/react";
import { act } from "react";
import { useDebouncedCallback } from ".";

describe("useDebouncedCallback", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("callback の実行が指定時間遅延されること", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, 500));

    // 複数回呼んでも直ちに実行されない
    act(() => {
      result.current();
      result.current();
      result.current();
    });
    expect(callback).not.toHaveBeenCalled();

    // 500ms 後に実行される（複数回呼んでも最後の1回のみ）
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("flush を呼び出すと即時実行されること", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, 500));

    act(() => {
      result.current();
      result.current();
      // flush で即実行
      result.current.flush();
    });
    expect(callback).toHaveBeenCalledTimes(1);

    // その後タイマーを進めても追加で呼ばれない
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("cancel を呼び出すと保留中の実行がキャンセルされること", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, 500));

    act(() => {
      result.current();
      // cancel で保留中の実行をキャンセル
      result.current.cancel();
      vi.advanceTimersByTime(500);
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it("コンポーネントのアンマウント時にdebouncedFnがキャンセルされること", () => {
    const callback = vi.fn();
    const { unmount } = renderHook(() => useDebouncedCallback(callback, 500));

    unmount();
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(callback).not.toHaveBeenCalled();
  });

  it("コールバック関数に引数が正しく渡されること", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, 500));

    act(() => {
      result.current("test", 123);
    });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(callback).toHaveBeenCalledWith("test", 123);
  });

  it("異なるwait時間で正しく動作すること", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, 1000));

    act(() => {
      result.current();
    });

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(callback).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("leading: true オプションで最初の呼び出しが即時実行されること", () => {
    const callback = vi.fn();
    const { result } = renderHook(() =>
      useDebouncedCallback(callback, 500, { leading: true }),
    );

    act(() => {
      result.current();
    });
    expect(callback).toHaveBeenCalledTimes(1);

    act(() => {
      result.current();
    });
    expect(callback).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(callback).toHaveBeenCalledTimes(2);
  });
});
