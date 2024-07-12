import { asyncDebounce } from ".";

jest.useFakeTimers();

describe("asyncDebounce", () => {
  test("debounce完了後に実行されることを確認", async () => {
    const mockFn = jest.fn((n: number) => n);
    const debouncedFn = asyncDebounce(mockFn, 1000);

    const promise = debouncedFn(2);

    // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
    let result;
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
