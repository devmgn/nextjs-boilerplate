import { act, renderHook } from "@testing-library/react";
import type { RenderHookResult } from "@testing-library/react";
import { useDebouncedValue } from ".";

describe("useDebouncedValue", () => {
  vi.useFakeTimers();

  const initialProps = {
    value: "initial value",
    delay: 1000,
    ref: { current: document.createElement("input") },
  };

  const updatePros = {
    ...initialProps,
    value: "new value",
  };

  let hookResult: RenderHookResult<string, typeof initialProps>;

  beforeEach(() => {
    vi.clearAllTimers();
    hookResult = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      {
        initialProps,
      },
    );
  });

  test("delayに設定された時間未経過のとき、更新された値が返却されないこと", () => {
    hookResult.rerender(updatePros);
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(hookResult.result.current).toBe(initialProps.value);
  });

  test("delayに設定された時間経過したとき、更新された値が返却されること", () => {
    hookResult.rerender(updatePros);
    act(() => {
      vi.advanceTimersByTime(initialProps.delay);
    });
    expect(hookResult.result.current).toBe(updatePros.value);
  });

  test("delayに設定された時間未経過、経過後それぞれ、更新、未更新の値が返却されること", () => {
    hookResult.rerender(updatePros);

    act(() => {
      vi.advanceTimersByTime(initialProps.delay - 1);
    });

    expect(hookResult.result.current).toBe(initialProps.value);

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(hookResult.result.current).toBe(updatePros.value);
  });
});
