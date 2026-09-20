import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { delay } from "./delay";

describe(delay, () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("指定時間が経過するまで解決しないこと", async () => {
    const onResolved = vi.fn<() => void>();
    const pending = (async () => {
      await delay(100);
      onResolved();
    })();

    await vi.advanceTimersByTimeAsync(99);
    expect(onResolved).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1);
    await pending;
    expect(onResolved).toHaveBeenCalledOnce();
  });
});
