import { asyncDebounce } from "./asyncDebounce";

describe(asyncDebounce, () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("関数が複数回呼び出されたとき、デバウンスされること", async () => {
    vi.useFakeTimers();
    const mockFn = vi.fn().mockResolvedValue("result");
    const debouncedFn = asyncDebounce(mockFn, 100);

    void debouncedFn();
    void debouncedFn();
    void debouncedFn();

    expect(mockFn).not.toHaveBeenCalled();

    await vi.runAllTimersAsync();

    expect(mockFn).toHaveBeenCalledWith();
    vi.useRealTimers();
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
});
