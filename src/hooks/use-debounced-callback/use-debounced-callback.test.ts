import { renderHook } from "@testing-library/react";
import { act } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useDebouncedCallback } from "./use-debounced-callback";

describe(useDebouncedCallback, () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("delays the callback by the given time", () => {
    const callback = vi.fn<() => void>();
    const { result } = renderHook(() => useDebouncedCallback(callback, 500));

    // Not run immediately even when called multiple times
    act(() => {
      result.current();
      result.current();
      result.current();
    });
    expect(callback).not.toHaveBeenCalled();

    // Runs after 500ms (only the last of multiple calls)
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(callback).toHaveBeenCalledOnce();
  });

  it("runs immediately when flush is called", () => {
    const callback = vi.fn<() => void>();
    const { result } = renderHook(() => useDebouncedCallback(callback, 500));

    act(() => {
      result.current();
      result.current();
      // flush runs it immediately
      result.current.flush();
    });
    expect(callback).toHaveBeenCalledOnce();

    // Not called again when timers advance afterwards
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(callback).toHaveBeenCalledOnce();
  });

  it("cancels the pending call when cancel is called", () => {
    const callback = vi.fn<() => void>();
    const { result } = renderHook(() => useDebouncedCallback(callback, 500));

    act(() => {
      result.current();
      // cancel discards the pending call
      result.current.cancel();
      vi.advanceTimersByTime(500);
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it("cancels the pending call on unmount", () => {
    const callback = vi.fn<() => void>();

    const { result, unmount } = renderHook(() =>
      useDebouncedCallback(callback, 500)
    );

    // Unmount while a call is pending
    act(() => {
      result.current();
    });

    unmount();
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(callback).not.toHaveBeenCalled();
  });

  it("passes arguments to the callback", () => {
    const callback = vi.fn<(a: string, b: number) => void>();
    const { result } = renderHook(() => useDebouncedCallback(callback, 500));

    act(() => {
      result.current("test", 123);
    });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(callback).toHaveBeenCalledExactlyOnceWith("test", 123);
  });

  it("creates a new debounced function when wait changes", () => {
    const callback = vi.fn<() => void>();

    const { result, rerender } = renderHook(
      ({ wait }) => useDebouncedCallback(callback, wait),
      { initialProps: { wait: 500 } }
    );

    // Call with the old wait (500ms)
    act(() => {
      result.current();
    });

    // Re-render with a new wait: the pending call is cleaned up
    rerender({ wait: 1000 });

    // Verify the old timer (500ms) does not fire
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(callback).not.toHaveBeenCalled();

    // Works with the new wait (1000ms)
    act(() => {
      result.current();
    });
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(callback).toHaveBeenCalledOnce();
  });

  it("returns the same debounced function on re-render with unchanged deps", () => {
    const callback = vi.fn<() => void>();

    const { result, rerender } = renderHook(
      ({ wait }) => useDebouncedCallback(callback, wait),
      { initialProps: { wait: 500 } }
    );

    const prev = result.current;
    rerender({ wait: 500 });
    expect(result.current).toBe(prev);
  });

  it("keeps the pending timer and arguments and fires the latest callback when a new arrow function is passed every render", () => {
    const spy = vi.fn<(value: number, arg: string) => void>();
    let current = 0;

    const { result, rerender } = renderHook(
      ({ value }) =>
        useDebouncedCallback((arg: string) => {
          spy(value, arg);
        }, 500),
      { initialProps: { value: current } }
    );

    // The first call starts the timer
    const first = result.current;
    act(() => {
      first("args");
    });

    // Re-render with an updated value. If debounced were recreated here,
    // the timer would be lost.
    current = 1;
    rerender({ value: current });

    // The same debounced function keeps being returned
    expect(result.current).toBe(first);

    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Fires with the latest callback (value=1) and the retained argument "args"
    expect(spy).toHaveBeenCalledExactlyOnceWith(1, "args");
  });

  it("flush runs with the last passed arguments", () => {
    const callback = vi.fn<(x: string) => void>();
    const { result } = renderHook(() => useDebouncedCallback(callback, 500));

    act(() => {
      result.current("first");
      result.current("second");
      result.current.flush();
    });

    expect(callback).toHaveBeenCalledExactlyOnceWith("second");
  });

  it("uses the latest callback via flush as well", () => {
    const spy = vi.fn<(value: number, arg: string) => void>();

    const { result, rerender } = renderHook(
      ({ value }) =>
        useDebouncedCallback((arg: string) => {
          spy(value, arg);
        }, 500),
      { initialProps: { value: 0 } }
    );

    act(() => {
      result.current("args");
    });

    // Swap the callback, then flush
    rerender({ value: 1 });
    act(() => {
      result.current.flush();
    });

    expect(spy).toHaveBeenCalledExactlyOnceWith(1, "args");
  });
});
