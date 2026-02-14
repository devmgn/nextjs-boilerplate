import { useSyncExternalStore } from "react";

const store = { composing: false, callbacks: new Set<() => void>() };

function handleCompositionStart() {
  store.composing = true;
  for (const notify of store.callbacks) {
    notify();
  }
}

function handleCompositionEnd() {
  store.composing = false;
  for (const notify of store.callbacks) {
    notify();
  }
}

function subscribe(onStoreChange: () => void) {
  if (store.callbacks.size === 0) {
    document.addEventListener("compositionstart", handleCompositionStart);
    document.addEventListener("compositionend", handleCompositionEnd);
  }
  store.callbacks.add(onStoreChange);
  return () => {
    store.callbacks.delete(onStoreChange);
    if (store.callbacks.size === 0) {
      document.removeEventListener("compositionstart", handleCompositionStart);
      document.removeEventListener("compositionend", handleCompositionEnd);
    }
  };
}

function getSnapshot() {
  return store.composing;
}

function getServerSnapshot() {
  return false;
}

/**
 * テキストの編集中にユーザーがテキストの作成中かどうかを判定するカスタムフック
 */
export function useIsComposing(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
