import { useSyncExternalStore } from "react";

interface Store {
  composing: boolean;
  callbacks: Set<() => void>;
  onCompositionStart: () => void;
  onCompositionEnd: () => void;
}

const stores = new Map<boolean, Store>();

function getStore(capture: boolean): Store {
  const existing = stores.get(capture);
  if (existing) {
    return existing;
  }

  const store: Store = {
    composing: false,
    callbacks: new Set(),
    onCompositionStart: () => {
      store.composing = true;
      for (const notify of store.callbacks) {
        notify();
      }
    },
    onCompositionEnd: () => {
      store.composing = false;
      for (const notify of store.callbacks) {
        notify();
      }
    },
  };

  stores.set(capture, store);
  return store;
}

function subscribe(capture: boolean, onStoreChange: () => void) {
  const store = getStore(capture);

  if (store.callbacks.size === 0) {
    document.addEventListener(
      "compositionstart",
      store.onCompositionStart,
      capture,
    );
    document.addEventListener(
      "compositionend",
      store.onCompositionEnd,
      capture,
    );
  }
  store.callbacks.add(onStoreChange);
  return () => {
    store.callbacks.delete(onStoreChange);
    if (store.callbacks.size === 0) {
      document.removeEventListener(
        "compositionstart",
        store.onCompositionStart,
        capture,
      );
      document.removeEventListener(
        "compositionend",
        store.onCompositionEnd,
        capture,
      );
    }
  };
}

/**
 * テキストの編集中にユーザーがテキストの作成中かどうかを判定するカスタムフック
 *
 * @param capture - キャプチャフェーズでイベントを購読するかどうか (デフォルト: true)
 */
export function useIsComposing(capture = true): boolean {
  return useSyncExternalStore(
    (onStoreChange) => subscribe(capture, onStoreChange),
    () => getStore(capture).composing,
    () => false,
  );
}
