import { renderHook } from "@testing-library/react";
import { act } from "react";
import { useDebouncedCallback } from "./useDebouncedCallback";

describe(useDebouncedCallback, () => {
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
    expect(callback).toHaveBeenCalledOnce();
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
    expect(callback).toHaveBeenCalledOnce();

    // その後タイマーを進めても追加で呼ばれない
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(callback).toHaveBeenCalledOnce();
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
    const { result, unmount } = renderHook(() =>
      useDebouncedCallback(callback, 500),
    );

    // 保留中の実行がある状態でアンマウント
    act(() => {
      result.current();
    });

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

    expect(callback).toHaveBeenCalledExactlyOnceWith("test", 123);
  });

  it("edges: ['leading', 'trailing'] オプションで先頭と末尾の両方で実行されること", () => {
    const callback = vi.fn();
    const { result } = renderHook(() =>
      useDebouncedCallback(callback, 500, { edges: ["leading", "trailing"] }),
    );

    act(() => {
      result.current();
    });
    expect(callback).toHaveBeenCalledOnce();

    act(() => {
      result.current();
    });
    expect(callback).toHaveBeenCalledOnce();

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it("wait が変更されると新しい debounced 関数が生成されること", () => {
    const callback = vi.fn();
    const { result, rerender } = renderHook(
      ({ wait }) => useDebouncedCallback(callback, wait),
      { initialProps: { wait: 500 } },
    );

    // 旧 wait (500ms) で呼び出し
    act(() => {
      result.current();
    });

    // wait を変更して再レンダリング → 保留中の実行はクリーンアップされる
    rerender({ wait: 1000 });

    // 旧タイマー (500ms) が発火しないことを確認
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(callback).not.toHaveBeenCalled();

    // 新しい wait (1000ms) で動作すること
    act(() => {
      result.current();
    });
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(callback).toHaveBeenCalledOnce();
  });

  it("schedule メソッドでdebounce実行をスケジュールできること", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, 500));

    act(() => {
      result.current("test");
      result.current.schedule();
    });
    expect(callback).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(callback).toHaveBeenCalledExactlyOnceWith("test");
  });
});
