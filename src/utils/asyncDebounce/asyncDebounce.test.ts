import { asyncDebounce } from ".";

describe("asyncDebounce", () => {
  jest.useFakeTimers();

  test("debounce完了後に実行されることを確認", async () => {
    const mockFn = jest.fn((n: number) => n);
    const debouncedFn = asyncDebounce(mockFn, 1000);

    const promise = debouncedFn(2);

    let result: number | undefined;
    promise
      .then((value) => {
        result = value;
      })
      .catch(() => {});

    expect(mockFn).not.toHaveBeenCalled();
    expect(result).toBeUndefined();

    jest.advanceTimersByTime(1000);

    await promise;
    expect(result).toBe(2);
  });
});
