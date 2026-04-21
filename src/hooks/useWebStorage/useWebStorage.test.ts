import type { WebStorageStore } from "../../utils/webStorageStore";
import { act, renderHook } from "@testing-library/react";
import { useWebStorage } from "./useWebStorage";

/**
 * テスト用のインメモリ `WebStorageStore`。`useWebStorage` が渡されたストアへ正しく委譲しているかを
 * 確認するため、localStorage / sessionStorage を経由せず素の関数でストア契約を満たす。
 * `__listeners` は購読解除の副作用をテストから直接観測するために公開する。
 */
type MockStore = WebStorageStore & { __listeners: Set<() => void> };

function createMockStore(): MockStore {
  let value: string | null = null;
  const listeners = new Set<() => void>();
  const notify = () => {
    for (const l of listeners) {
      l();
    }
  };
  return {
    __listeners: listeners,
    read: vi.fn(() => value),
    write: vi.fn((_key: string, v: string) => {
      value = v;
      notify();
      return true;
    }),
    remove: vi.fn(() => {
      value = null;
      notify();
      return true;
    }),
    clear: vi.fn(() => {
      value = null;
      notify();
      return true;
    }),
    subscribe: vi.fn((_key: string, l: () => void) => {
      listeners.add(l);
      return vi.fn(() => {
        listeners.delete(l);
      });
    }),
  };
}

function uniqueKey() {
  return `test-key-${Math.random().toString(36).slice(2)}`;
}

describe(useWebStorage, () => {
  it("ストア未設定なら null を返す", () => {
    const store = createMockStore();
    const { result } = renderHook(() => useWebStorage(store, uniqueKey()));
    expect(result.current[0]).toBeNull();
  });

  it("渡されたストアの read で既存値を取得する", () => {
    const store = createMockStore();
    const key = uniqueKey();
    store.write(key, "stored");
    const { result } = renderHook(() => useWebStorage(store, key));
    expect(result.current[0]).toBe("stored");
    expect(store.read).toHaveBeenCalledWith(key);
  });

  it("setValue は渡されたストアの write に委譲する", () => {
    const store = createMockStore();
    const key = uniqueKey();
    const { result } = renderHook(() => useWebStorage(store, key));

    act(() => {
      result.current[1]("updated");
    });

    expect(store.write).toHaveBeenCalledWith(key, "updated");
    expect(result.current[0]).toBe("updated");
  });

  it("removeValue は渡されたストアの remove に委譲する", () => {
    const store = createMockStore();
    const key = uniqueKey();
    const { result } = renderHook(() => useWebStorage(store, key));

    act(() => {
      result.current[1]("stored");
    });
    act(() => {
      result.current[2]();
    });

    expect(store.remove).toHaveBeenCalledWith(key);
    expect(result.current[0]).toBeNull();
  });

  it("ストアの subscribe 経由で外部変更を受信して再レンダーする", () => {
    const store = createMockStore();
    const key = uniqueKey();
    const { result } = renderHook(() => useWebStorage(store, key));

    expect(store.subscribe).toHaveBeenCalledWith(key, expect.any(Function));

    act(() => {
      store.write(key, "external");
    });

    expect(result.current[0]).toBe("external");
  });

  it("関数型更新はストアの最新値に基づいて解決される", () => {
    const store = createMockStore();
    const key = uniqueKey();
    store.write(key, "");
    const { result } = renderHook(() => useWebStorage(store, key));

    act(() => {
      result.current[1]((prev) => `${prev}a`);
    });
    act(() => {
      result.current[1]((prev) => `${prev}b`);
    });

    expect(result.current[0]).toBe("ab");
    expect(store.write).toHaveBeenLastCalledWith(key, "ab");
  });

  it("関数型更新の prev は外部書き込み後のストア最新値を見る", () => {
    const store = createMockStore();
    const key = uniqueKey();
    const { result } = renderHook(() => useWebStorage(store, key));

    act(() => {
      store.write(key, "base");
      result.current[1]((prev) => `${prev}+1`);
    });

    expect(result.current[0]).toBe("base+1");
  });

  it("再レンダーで subscribe が重複呼び出しされない", () => {
    const store = createMockStore();
    const key = uniqueKey();
    const { rerender } = renderHook(() => useWebStorage(store, key));

    const initialCalls = vi.mocked(store.subscribe).mock.calls.length;
    rerender();
    rerender();

    expect(store.subscribe).toHaveBeenCalledTimes(initialCalls);
  });

  it("アンマウント時に購読が解除される", () => {
    const store = createMockStore();
    const key = uniqueKey();
    const { unmount } = renderHook(() => useWebStorage(store, key));

    expect(store.__listeners.size).toBe(1);
    const unsubscribe = vi.mocked(store.subscribe).mock.results[0]
      ?.value as ReturnType<typeof vi.fn>;

    unmount();

    expect(unsubscribe).toHaveBeenCalledTimes(1);
    expect(store.__listeners.size).toBe(0);
  });
});
