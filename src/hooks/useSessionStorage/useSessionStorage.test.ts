import { act, renderHook } from "@testing-library/react";
import { useSessionStorage } from "./useSessionStorage";

function createMockStorage() {
  const store = new Map<string, string>();
  return {
    getItem: vi.fn((key: string) => store.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store.set(key, value);
    }),
    removeItem: vi.fn((key: string) => {
      store.delete(key);
    }),
  };
}

function uniqueKey() {
  return `test-key-${Math.random().toString(36).slice(2)}`;
}

describe(useSessionStorage, () => {
  let sessionMock: ReturnType<typeof createMockStorage>;
  let localMock: ReturnType<typeof createMockStorage>;

  beforeEach(() => {
    sessionMock = createMockStorage();
    localMock = createMockStorage();
    vi.stubGlobal("sessionStorage", sessionMock);
    vi.stubGlobal("localStorage", localMock);
  });

  it("setValue は sessionStorage に書き込み localStorage には触らない", () => {
    const key = uniqueKey();
    const { result } = renderHook(() => useSessionStorage(key));

    act(() => {
      result.current[1]("stored");
    });

    expect(result.current[0]).toBe("stored");
    expect(sessionMock.setItem).toHaveBeenCalledWith(key, "stored");
    expect(localMock.setItem).not.toHaveBeenCalled();
  });

  it("sessionStorage の既存値を読み取る", () => {
    const key = uniqueKey();
    sessionMock.setItem(key, "stored");
    const { result } = renderHook(() => useSessionStorage(key));
    expect(result.current[0]).toBe("stored");
  });

  it("removeValue は sessionStorage のみから削除する", () => {
    const key = uniqueKey();
    const { result } = renderHook(() => useSessionStorage(key));

    act(() => {
      result.current[1]("stored");
    });
    act(() => {
      result.current[2]();
    });

    expect(result.current[0]).toBeNull();
    expect(sessionMock.removeItem).toHaveBeenCalledWith(key);
    expect(localMock.removeItem).not.toHaveBeenCalled();
  });
});
