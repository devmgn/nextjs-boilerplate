import { act, renderHook } from "@testing-library/react";
import { useLocalStorage } from "./useLocalStorage";

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

describe(useLocalStorage, () => {
  let mockStorage: ReturnType<typeof createMockStorage>;

  beforeEach(() => {
    mockStorage = createMockStorage();
    vi.stubGlobal("localStorage", mockStorage);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("基本動作", () => {
    it("未設定なら null を返す", () => {
      const key = uniqueKey();
      const { result } = renderHook(() => useLocalStorage(key));
      expect(result.current[0]).toBeNull();
    });

    it("localStorageの既存値を読み取る", () => {
      const key = uniqueKey();
      mockStorage.setItem(key, "stored");
      const { result } = renderHook(() => useLocalStorage(key));
      expect(result.current[0]).toBe("stored");
    });

    it("setValueで値を更新できる", () => {
      const key = uniqueKey();
      const { result } = renderHook(() => useLocalStorage(key));

      act(() => {
        result.current[1]("updated");
      });

      expect(result.current[0]).toBe("updated");
      expect(mockStorage.setItem).toHaveBeenCalledWith(key, "updated");
    });

    it("関数型更新をサポートする（prev は string | null）", () => {
      const key = uniqueKey();
      const { result } = renderHook(() => useLocalStorage(key));

      act(() => {
        result.current[1]((prev) => `${prev ?? ""}a`);
      });
      expect(result.current[0]).toBe("a");

      act(() => {
        result.current[1]((prev) => `${prev ?? ""}b`);
      });
      expect(result.current[0]).toBe("ab");
    });

    it("removeValue 後は null に戻る", () => {
      const key = uniqueKey();
      const { result } = renderHook(() => useLocalStorage(key));

      act(() => {
        result.current[1]("stored");
      });
      expect(result.current[0]).toBe("stored");

      act(() => {
        result.current[2]();
      });

      expect(result.current[0]).toBeNull();
      expect(mockStorage.removeItem).toHaveBeenCalledWith(key);
    });
  });

  describe("エラーハンドリング", () => {
    it("localStorage 利用不可時に null を返す", () => {
      const key = uniqueKey();
      mockStorage.getItem.mockImplementation(() => {
        throw new Error("localStorage unavailable");
      });

      const { result } = renderHook(() => useLocalStorage(key));
      expect(result.current[0]).toBeNull();
    });

    it("QuotaExceededError 時に console.warn を出力し状態を変更しない", () => {
      const key = uniqueKey();
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const { result } = renderHook(() => useLocalStorage(key));

      mockStorage.setItem.mockImplementation(() => {
        throw new DOMException("quota exceeded", "QuotaExceededError");
      });

      act(() => {
        result.current[1]("large-value");
      });

      expect(warnSpy).toHaveBeenCalledTimes(1);
      expect(result.current[0]).toBeNull();
      expect(mockStorage.getItem(key)).toBeNull();
    });
  });

  describe("タブ間同期", () => {
    it("storage イベントで値が更新される", () => {
      const key = uniqueKey();
      const { result } = renderHook(() => useLocalStorage(key));

      act(() => {
        mockStorage.setItem(key, "from-other-tab");
        window.dispatchEvent(
          new StorageEvent("storage", {
            key,
            newValue: "from-other-tab",
            storageArea: window.localStorage,
          }),
        );
      });

      expect(result.current[0]).toBe("from-other-tab");
    });

    it("storage イベントで削除を検知する", () => {
      const key = uniqueKey();
      const { result } = renderHook(() => useLocalStorage(key));

      act(() => {
        result.current[1]("stored");
      });
      expect(result.current[0]).toBe("stored");

      act(() => {
        mockStorage.removeItem(key);
        window.dispatchEvent(
          new StorageEvent("storage", {
            key,
            newValue: null,
            storageArea: window.localStorage,
          }),
        );
      });

      expect(result.current[0]).toBeNull();
    });

    it("無関係なキーの storage イベントを無視する", () => {
      const key = uniqueKey();
      const { result } = renderHook(() => useLocalStorage(key));

      act(() => {
        window.dispatchEvent(
          new StorageEvent("storage", {
            key: "other-key",
            newValue: "other-value",
            storageArea: window.localStorage,
          }),
        );
      });

      expect(result.current[0]).toBeNull();
    });
  });

  describe("同一タブ同期", () => {
    it("同じキーの複数インスタンスが同期する", () => {
      const key = uniqueKey();
      const { result: result1 } = renderHook(() => useLocalStorage(key));
      const { result: result2 } = renderHook(() => useLocalStorage(key));

      act(() => {
        result1.current[1]("synced");
      });

      expect(result1.current[0]).toBe("synced");
      expect(result2.current[0]).toBe("synced");
    });
  });

  describe("クリーンアップ", () => {
    it("アンマウント後は同タブの書き込みで再レンダーされない", () => {
      const key = uniqueKey();
      const renderSpy = vi.fn();
      const { unmount } = renderHook(() => {
        renderSpy();
        return useLocalStorage(key);
      });

      const renderCountBeforeUnmount = renderSpy.mock.calls.length;
      unmount();

      act(() => {
        window.localStorage.setItem(key, "after-unmount");
        window.dispatchEvent(
          new StorageEvent("storage", {
            key,
            newValue: "after-unmount",
            storageArea: window.localStorage,
          }),
        );
      });

      expect(renderSpy).toHaveBeenCalledTimes(renderCountBeforeUnmount);
    });
  });
});
