import { asyncDebounce } from "./asyncDebounce";

describe(asyncDebounce, () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("関数が複数回呼び出されたとき、デバウンスされること", async () => {
    const mockFn = vi.fn().mockResolvedValue("result");
    const debouncedFn = asyncDebounce(mockFn, 100);

    void debouncedFn();
    void debouncedFn();
    void debouncedFn();

    expect(mockFn).not.toHaveBeenCalled();

    await vi.runAllTimersAsync();

    expect(mockFn).toHaveBeenCalledOnce();
  });

  it("デバウンスされた関数が呼び出されたとき、正しい結果を返すこと", async () => {
    const mockFn = vi.fn().mockResolvedValue("result");
    const debouncedFn = asyncDebounce(mockFn, 100);

    const promise = debouncedFn();
    vi.advanceTimersByTime(100);
    const result = await promise;

    expect(result).toBe("result");
  });

  it("エラーが発生したとき、適切に処理されること", async () => {
    const mockFn = vi.fn().mockRejectedValue(new Error("Test error"));
    const debouncedFn = asyncDebounce(mockFn, 100);

    const promise = debouncedFn();
    vi.advanceTimersByTime(100);

    await expect(promise).rejects.toThrow("Test error");
  });

  it("同期関数が渡されたとき、正しく動作すること", async () => {
    const mockFn = vi.fn().mockReturnValue("sync result");
    const debouncedFn = asyncDebounce(mockFn, 100);

    const promise = debouncedFn();
    vi.advanceTimersByTime(100);
    const result = await promise;

    expect(result).toBe("sync result");
  });

  it("引数が渡されたとき、正しく処理されること", async () => {
    const mockFn = vi.fn((a: number, b: string) => `${a}-${b}`);
    const debouncedFn = asyncDebounce(mockFn, 100);

    const promise = debouncedFn(1, "test");
    vi.advanceTimersByTime(100);
    const result = await promise;

    expect(result).toBe("1-test");
    expect(mockFn).toHaveBeenCalledExactlyOnceWith(1, "test");
  });

  it("複数回呼び出されたとき、全てのPromiseが同じ結果でresolveされること", async () => {
    const mockFn = vi.fn().mockResolvedValue("result");
    const debouncedFn = asyncDebounce(mockFn, 100);

    const p1 = debouncedFn();
    const p2 = debouncedFn();
    const p3 = debouncedFn();

    await vi.runAllTimersAsync();

    await expect(p1).resolves.toBe("result");
    await expect(p2).resolves.toBe("result");
    await expect(p3).resolves.toBe("result");
    expect(mockFn).toHaveBeenCalledOnce();
  });

  it("複数回呼び出されてエラーが発生したとき、全てのPromiseがrejectされること", async () => {
    const mockFn = vi.fn().mockRejectedValue(new Error("Test error"));
    const debouncedFn = asyncDebounce(mockFn, 100);

    const p1 = debouncedFn();
    const p2 = debouncedFn();

    // oxlint-disable-next-line promise/prefer-await-to-then -- タイマー発火前にrejectionハンドラを設定する必要がある
    const settled = Promise.allSettled([p1, p2]);

    await vi.runAllTimersAsync();

    const results = await settled;
    expect(results).toStrictEqual([
      { status: "rejected", reason: new Error("Test error") },
      { status: "rejected", reason: new Error("Test error") },
    ]);
  });
});
