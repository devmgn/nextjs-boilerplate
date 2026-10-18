import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { debounce } from "./debounce";

describe(debounce, () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  describe("basic behavior (trailing)", () => {
    it("runs once after the wait time", () => {
      const fn = vi.fn<() => void>();
      const debounced = debounce(fn, 100);

      debounced();
      debounced();
      debounced();
      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledOnce();
    });

    it("runs with the arguments of the last call", () => {
      const fn = vi.fn<(x: string) => void>();
      const debounced = debounce(fn, 100);

      debounced("a");
      debounced("b");
      debounced("c");

      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledExactlyOnceWith("c");
    });

    it("resets the timer when called again while waiting", () => {
      const fn = vi.fn<() => void>();
      const debounced = debounce(fn, 100);

      // 80ms + 80ms spans the 100ms wait, but the timer reset prevents firing; it fires after the remaining 20ms
      debounced();
      vi.advanceTimersByTime(80);
      expect(fn).not.toHaveBeenCalled();

      debounced();
      vi.advanceTimersByTime(80);
      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(20);
      expect(fn).toHaveBeenCalledOnce();
    });

    it("passes multiple arguments correctly", () => {
      const fn = vi.fn<(a: number, b: string, c: { three: number }) => void>();
      const debounced = debounce(fn, 100);

      debounced(1, "two", { three: 3 });
      vi.advanceTimersByTime(100);

      expect(fn).toHaveBeenCalledExactlyOnceWith(1, "two", { three: 3 });
    });

    it("handles consecutive bursts independently", () => {
      const fn = vi.fn<(x: string) => void>();
      const debounced = debounce(fn, 100);

      debounced("first");
      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledExactlyOnceWith("first");

      debounced("second");
      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).toHaveBeenNthCalledWith(2, "second");
    });
  });

  describe("wait: 0", () => {
    it("runs when the timer fires", () => {
      const fn = vi.fn<(x: string) => void>();
      const debounced = debounce(fn, 0);

      debounced("zero");
      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(0);
      expect(fn).toHaveBeenCalledExactlyOnceWith("zero");
    });
  });

  describe("cancel", () => {
    it("cancels the pending invocation", () => {
      const fn = vi.fn<() => void>();
      const debounced = debounce(fn, 100);

      debounced();
      debounced.cancel();
      vi.advanceTimersByTime(100);

      expect(fn).not.toHaveBeenCalled();
    });

    it("can be called again after cancel", () => {
      const fn = vi.fn<(x: string) => void>();
      const debounced = debounce(fn, 100);

      debounced("a");
      debounced.cancel();

      debounced("b");
      vi.advanceTimersByTime(100);

      expect(fn).toHaveBeenCalledExactlyOnceWith("b");
    });

    it("is safe to cancel when nothing is pending", () => {
      const fn = vi.fn<() => void>();
      const debounced = debounce(fn, 100);

      expect(() => {
        debounced.cancel();
      }).not.toThrow();
    });
  });

  describe("flush", () => {
    it("runs the pending function immediately", () => {
      const fn = vi.fn<(x: string) => void>();
      const debounced = debounce(fn, 100);

      debounced("flushed");
      debounced.flush();

      expect(fn).toHaveBeenCalledExactlyOnceWith("flushed");
    });

    it("does not run again via the timer after flush", () => {
      const fn = vi.fn<() => void>();
      const debounced = debounce(fn, 100);

      debounced();
      debounced.flush();
      vi.advanceTimersByTime(100);

      expect(fn).toHaveBeenCalledOnce();
    });

    it("can start a new cycle after flush", () => {
      const fn = vi.fn<(x: string) => void>();
      const debounced = debounce(fn, 100);

      debounced("first");
      debounced.flush();
      expect(fn).toHaveBeenCalledOnce();

      debounced("second");
      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).toHaveBeenNthCalledWith(2, "second");
    });

    it.for<{
      state: string;
      setup: (
        d: ReturnType<typeof debounce<[string]>>,
        fn: ReturnType<typeof vi.fn>
      ) => number;
    }>([
      { state: "the initial state (nothing pending)", setup: () => 0 },
      {
        state: "after flush",
        setup: (d) => {
          d("data");
          d.flush();

          return 1;
        },
      },
      {
        state: "after calling flush twice in a row",
        setup: (d) => {
          d("data");
          d.flush();
          d.flush();

          return 1;
        },
      },
      {
        state: "after cancel",
        setup: (d) => {
          d("data");
          d.cancel();

          return 0;
        },
      },
      {
        state: "after a cycle completes naturally",
        setup: (d) => {
          d("data");
          vi.advanceTimersByTime(100);

          return 1;
        },
      },
    ])("flush from $state causes no extra invocation", ({ setup }) => {
      const fn = vi.fn<(x: string) => void>();
      const debounced = debounce(fn, 100);
      const expectedBefore = setup(debounced, fn);
      expect(fn).toHaveBeenCalledTimes(expectedBefore);

      expect(() => {
        debounced.flush();
      }).not.toThrow();
      expect(fn).toHaveBeenCalledTimes(expectedBefore);
    });
  });

  describe("reentrant calls", () => {
    it("runs arguments from a reentrant call inside the callback in the next cycle", () => {
      const calls: string[] = [];

      const callback = vi.fn<(x: string) => void>((x) => {
        calls.push(x);
      });

      const debounced = debounce(callback, 100);

      // Make a reentrant call only on the first invocation
      callback.mockImplementationOnce((x) => {
        calls.push(x);
        debounced("re-entry");
      });

      debounced("a");
      vi.advanceTimersByTime(100);
      expect(calls).toStrictEqual(["a"]);

      // The "re-entry" scheduled by the reentrant call fires in the next cycle
      vi.advanceTimersByTime(100);
      expect(calls).toStrictEqual(["a", "re-entry"]);
    });
  });

  describe("error recovery", () => {
    it("keeps working in the next cycle after the callback throws", () => {
      const fn = vi.fn<(x: string) => void>().mockImplementationOnce(() => {
        throw new Error("boom");
      });

      const debounced = debounce(fn, 100);

      debounced("a");
      expect(() => {
        vi.advanceTimersByTime(100);
      }).toThrow("boom");

      debounced("b");
      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).toHaveBeenNthCalledWith(2, "b");
    });
  });

  describe("edge cases", () => {
    it("runs with the latest arguments when flushed after many calls", () => {
      const fn = vi.fn<(x: string) => void>();
      const debounced = debounce(fn, 100);

      debounced("a");
      debounced("b");
      debounced("c");
      debounced.flush();

      expect(fn).toHaveBeenCalledExactlyOnceWith("c");
    });

    it("runs once with the last arguments on the trailing edge for rapid calls with wait: 0", () => {
      const fn = vi.fn<(x: string) => void>();
      const debounced = debounce(fn, 0);

      debounced("a");
      debounced("b");
      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(0);
      expect(fn).toHaveBeenCalledExactlyOnceWith("b");
    });

    it("calling flush inside the callback causes no double run or error", () => {
      const calls: string[] = [];

      const fn = vi.fn<(x: string) => void>((x) => {
        calls.push(x);
      });

      const debounced = debounce(fn, 100);

      fn.mockImplementationOnce((x) => {
        calls.push(x);
        // run() has already cleared lastArgs, so flush is a no-op
        debounced.flush();
      });

      debounced("a");
      expect(() => {
        vi.advanceTimersByTime(100);
      }).not.toThrow();
      expect(calls).toStrictEqual(["a"]);

      // No pending timer remains either
      vi.advanceTimersByTime(100);
      expect(calls).toStrictEqual(["a"]);
    });

    it("calling cancel inside the callback is safe and later cycles still work", () => {
      const fn = vi.fn<(x: string) => void>();
      const debounced = debounce(fn, 100);

      fn.mockImplementationOnce(() => {
        // Verify that cancelling itself during the first run is safe
        expect(fn).toHaveBeenCalledOnce();
        debounced.cancel();
      });

      debounced("a");
      expect(() => {
        vi.advanceTimersByTime(100);
      }).not.toThrow();
      expect(fn).toHaveBeenCalledExactlyOnceWith("a");

      debounced("b");
      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).toHaveBeenNthCalledWith(2, "b");
    });

    it("keeps working in the next cycle after the callback throws during flush", () => {
      const fn = vi.fn<(x: string) => void>().mockImplementationOnce(() => {
        throw new Error("boom");
      });

      const debounced = debounce(fn, 100);

      debounced("a");
      expect(() => {
        debounced.flush();
      }).toThrow("boom");

      // State stays intact after the error and the next cycle works
      debounced("b");
      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).toHaveBeenNthCalledWith(2, "b");
    });

    it("runs nothing when flushed after cancel", () => {
      const fn = vi.fn<(x: string) => void>();
      const debounced = debounce(fn, 100);

      debounced("a");
      debounced.cancel();
      debounced.flush();
      vi.advanceTimersByTime(100);

      expect(fn).not.toHaveBeenCalled();
    });

    it("returns a callable with cancel/flush methods", () => {
      const debounced = debounce(() => {}, 100);

      expect(debounced).toBeTypeOf("function");
      expect(debounced.cancel).toBeTypeOf("function");
      expect(debounced.flush).toBeTypeOf("function");
    });
  });

  describe("validation", () => {
    it.for<{ label: string; create: () => void }>([
      {
        label: "wait is negative",
        create: () => {
          debounce(() => {}, -1);
        },
      },
      {
        label: "wait is NaN",
        create: () => {
          debounce(() => {}, Number.NaN);
        },
      },
      {
        label: "wait is Infinity",
        create: () => {
          debounce(() => {}, Number.POSITIVE_INFINITY);
        },
      },
    ])("throws TypeError when $label", ({ create }) => {
      expect(create).toThrow(TypeError);
    });
  });
});
