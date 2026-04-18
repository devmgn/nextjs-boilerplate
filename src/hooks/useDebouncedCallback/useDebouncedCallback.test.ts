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
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("schedule メソッドで保留中のタイマーが延長され lastArgs が保持されること", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, 500));

    act(() => {
      result.current("test");
    });

    // 発火直前まで進める
    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(callback).not.toHaveBeenCalled();

    // schedule でタイマーを再スタート
    act(() => {
      result.current.schedule();
    });

    // 旧タイマーが発火するはずの時間を過ぎても未発火
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(callback).not.toHaveBeenCalled();

    // 新タイマー分の経過で lastArgs を保持したまま発火
    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(callback).toHaveBeenCalledExactlyOnceWith("test");
  });

  it("edges: ['leading'] オプションで先頭のみ実行され trailing は発火しないこと", () => {
    const callback = vi.fn();
    const { result } = renderHook(() =>
      useDebouncedCallback(callback, 500, { edges: ["leading"] }),
    );

    act(() => {
      result.current();
    });
    expect(callback).toHaveBeenCalledTimes(1);

    // クールダウン中の呼び出しは発火しない
    act(() => {
      result.current();
    });
    expect(callback).toHaveBeenCalledTimes(1);

    // trailing 無効なのでタイマー経過後も追加発火なし
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("AbortSignal が abort されると保留中および以降の呼び出しが無効化されること", () => {
    const callback = vi.fn();
    const controller = new AbortController();
    const { result } = renderHook(() =>
      useDebouncedCallback(callback, 500, { signal: controller.signal }),
    );

    act(() => {
      result.current();
    });

    // abort で保留中の実行がキャンセルされる
    act(() => {
      controller.abort();
      vi.advanceTimersByTime(500);
    });
    expect(callback).not.toHaveBeenCalled();

    // abort 後の呼び出しも無効
    act(() => {
      result.current();
      vi.advanceTimersByTime(500);
    });
    expect(callback).not.toHaveBeenCalled();
  });

  it("依存が変化しない再レンダリングで同一の debounced 関数が返されること", () => {
    const callback = vi.fn();
    const { result, rerender } = renderHook(
      ({ wait }) => useDebouncedCallback(callback, wait),
      { initialProps: { wait: 500 } },
    );

    const prev = result.current;
    rerender({ wait: 500 });
    expect(result.current).toBe(prev);
  });

  it("毎レンダリングで新しいアロー関数を渡しても保留中のタイマーと引数が失われず、最新のコールバックで発火すること", () => {
    const spy = vi.fn();
    let current = 0;
    const { result, rerender } = renderHook(
      ({ value }) =>
        useDebouncedCallback((arg: string) => {
          spy(value, arg);
        }, 500),
      { initialProps: { value: current } },
    );

    // 最初の呼び出しでタイマー開始
    const first = result.current;
    act(() => {
      first("args");
    });

    // value を更新して再レンダリング。ここで debounced が再生成されると
    // タイマーが失われてしまう。
    current = 1;
    rerender({ value: current });

    // 同一の debounced 関数が返り続けること
    expect(result.current).toBe(first);

    act(() => {
      vi.advanceTimersByTime(500);
    });

    // 最新の callback (value=1) で、保持された引数 "args" で発火する
    expect(spy).toHaveBeenCalledExactlyOnceWith(1, "args");
  });

  it("options.edges の配列参照が毎レンダリング変わっても、内容が同じなら同一 debounced 関数が返ること", () => {
    const callback = vi.fn();
    const { result, rerender } = renderHook(
      ({ edges }) =>
        useDebouncedCallback(callback, 500, {
          edges,
        }),
      { initialProps: { edges: ["leading"] as Array<"leading" | "trailing"> } },
    );

    const prev = result.current;
    // 内容は同じで新しい配列参照を渡す
    rerender({
      edges: ["leading"] as Array<"leading" | "trailing">,
    });

    expect(result.current).toBe(prev);
  });

  it("edges が undefined と ['trailing'] (default 相当) で同一 debounced を返すこと", () => {
    const callback = vi.fn();
    const { result, rerender } = renderHook(
      ({ edges }: { edges: Array<"leading" | "trailing"> | undefined }) =>
        useDebouncedCallback(callback, 500, { edges }),
      {
        initialProps: {
          edges: undefined as Array<"leading" | "trailing"> | undefined,
        },
      },
    );

    const prev = result.current;
    rerender({ edges: ["trailing"] });
    expect(result.current).toBe(prev);
  });

  it("edges の順序が異なっても内容が同じなら同一 debounced を返すこと", () => {
    const callback = vi.fn();
    const { result, rerender } = renderHook(
      ({ edges }) => useDebouncedCallback(callback, 500, { edges }),
      {
        initialProps: {
          edges: ["leading", "trailing"] as Array<"leading" | "trailing">,
        },
      },
    );

    const prev = result.current;
    rerender({ edges: ["trailing", "leading"] });
    expect(result.current).toBe(prev);
  });
});
