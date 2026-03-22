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
    it("初期値を返すこと", () => {
      const key = uniqueKey();
      const { result } = renderHook(() => useLocalStorage(key, "default"));
      expect(result.current[0]).toBe("default");
    });

    it("localStorageの既存値を読み取ること", () => {
      const key = uniqueKey();
      mockStorage.setItem(key, JSON.stringify("stored"));
      const { result } = renderHook(() => useLocalStorage(key, "default"));
      expect(result.current[0]).toBe("stored");
    });

    it("setValueで値を更新できること", () => {
      const key = uniqueKey();
      const { result } = renderHook(() => useLocalStorage(key, "default"));

      act(() => {
        result.current[1]("updated");
      });

      expect(result.current[0]).toBe("updated");
      expect(mockStorage.setItem).toHaveBeenCalledWith(
        key,
        JSON.stringify("updated"),
      );
    });

    it("関数型更新をサポートすること", () => {
      const key = uniqueKey();
      const { result } = renderHook(() => useLocalStorage(key, 0));

      act(() => {
        result.current[1]((prev) => prev + 1);
      });

      expect(result.current[0]).toBe(1);

      act(() => {
        result.current[1]((prev) => prev + 10);
      });

      expect(result.current[0]).toBe(11);
    });

    it("removeValueで値を削除して初期値に戻ること", () => {
      const key = uniqueKey();
      const { result } = renderHook(() => useLocalStorage(key, "default"));

      act(() => {
        result.current[1]("stored");
      });
      expect(result.current[0]).toBe("stored");

      act(() => {
        result.current[2]();
      });

      expect(result.current[0]).toBe("default");
      expect(mockStorage.removeItem).toHaveBeenCalledWith(key);
    });
  });

  describe("シリアライズ", () => {
    it("オブジェクトを正しく保存・読み取りできること", () => {
      const key = uniqueKey();
      const obj = { name: "test", count: 42 };
      const { result } = renderHook(() =>
        useLocalStorage(key, { name: "", count: 0 }),
      );

      act(() => {
        result.current[1](obj);
      });

      expect(result.current[0]).toStrictEqual(obj);
    });

    it("配列を正しく保存・読み取りできること", () => {
      const key = uniqueKey();
      const arr = [1, 2, 3];
      const { result } = renderHook(() => useLocalStorage<number[]>(key, []));

      act(() => {
        result.current[1](arr);
      });

      expect(result.current[0]).toStrictEqual(arr);
    });

    it("数値を正しく処理すること", () => {
      const key = uniqueKey();
      const { result } = renderHook(() => useLocalStorage(key, 0));

      act(() => {
        result.current[1](42);
      });

      expect(result.current[0]).toBe(42);
    });

    it("nullを正しく処理すること", () => {
      const key = uniqueKey();
      const { result } = renderHook(() =>
        useLocalStorage<string | null>(key, null),
      );

      expect(result.current[0]).toBeNull();

      act(() => {
        result.current[1]("value");
      });
      expect(result.current[0]).toBe("value");

      act(() => {
        result.current[1](null);
      });
      expect(result.current[0]).toBeNull();
    });
  });

  describe("エラーハンドリング", () => {
    it("localStorage利用不可時に初期値を返すこと", () => {
      const key = uniqueKey();
      mockStorage.getItem.mockImplementation(() => {
        throw new Error("localStorage unavailable");
      });

      const { result } = renderHook(() => useLocalStorage(key, "fallback"));
      expect(result.current[0]).toBe("fallback");
    });

    it("破損JSONの場合に初期値を返すこと", () => {
      const key = uniqueKey();
      mockStorage.setItem(key, "invalid-json{{{");

      const { result } = renderHook(() => useLocalStorage(key, "fallback"));
      expect(result.current[0]).toBe("fallback");
    });

    it("QuotaExceededError時にconsole.warnを出力し状態を変更しないこと", () => {
      const key = uniqueKey();
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const { result } = renderHook(() => useLocalStorage(key, "default"));

      mockStorage.setItem.mockImplementation(() => {
        throw new DOMException("quota exceeded", "QuotaExceededError");
      });

      act(() => {
        result.current[1]("large-value");
      });

      expect(warnSpy).toHaveBeenCalledTimes(1);
      expect(result.current[0]).toBe("default");
      // localStorage に書き込まれていないことを確認
      expect(mockStorage.getItem(key)).toBeNull();
    });
  });

  describe("タブ間同期", () => {
    it("storageイベントで値が更新されること", () => {
      const key = uniqueKey();
      const { result } = renderHook(() => useLocalStorage(key, "default"));

      act(() => {
        window.dispatchEvent(
          new StorageEvent("storage", {
            key,
            newValue: JSON.stringify("from-other-tab"),
          }),
        );
      });

      expect(result.current[0]).toBe("from-other-tab");
    });

    it("storageイベントで削除を検知すること", () => {
      const key = uniqueKey();
      const { result } = renderHook(() => useLocalStorage(key, "default"));

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
          }),
        );
      });

      expect(result.current[0]).toBe("default");
    });

    it("無関係なキーのstorageイベントを無視すること", () => {
      const key = uniqueKey();
      const { result } = renderHook(() => useLocalStorage(key, "default"));

      act(() => {
        window.dispatchEvent(
          new StorageEvent("storage", {
            key: "other-key",
            newValue: JSON.stringify("other-value"),
          }),
        );
      });

      expect(result.current[0]).toBe("default");
    });
  });

  describe("同一タブ同期", () => {
    it("同じキーの複数インスタンスが同期すること", () => {
      const key = uniqueKey();
      const { result: result1 } = renderHook(() =>
        useLocalStorage(key, "default"),
      );
      const { result: result2 } = renderHook(() =>
        useLocalStorage(key, "default"),
      );

      act(() => {
        result1.current[1]("synced");
      });

      expect(result1.current[0]).toBe("synced");
      expect(result2.current[0]).toBe("synced");
    });
  });

  describe("クリーンアップ", () => {
    it("アンマウント時にリスナーが解除されること", () => {
      const key = uniqueKey();
      const addSpy = vi.spyOn(window, "addEventListener");
      const removeSpy = vi.spyOn(window, "removeEventListener");

      const { unmount } = renderHook(() => useLocalStorage(key, "default"));

      expect(addSpy).toHaveBeenCalledWith("storage", expect.any(Function));

      unmount();

      expect(removeSpy).toHaveBeenCalledWith("storage", expect.any(Function));
    });
  });
});
