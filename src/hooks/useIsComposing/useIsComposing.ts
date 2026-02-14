import { useSyncExternalStore } from "react";

function createMode(capture: boolean) {
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
      document.addEventListener(
        "compositionstart",
        handleCompositionStart,
        capture,
      );
      document.addEventListener(
        "compositionend",
        handleCompositionEnd,
        capture,
      );
    }
    store.callbacks.add(onStoreChange);
    return () => {
      store.callbacks.delete(onStoreChange);
      if (store.callbacks.size === 0) {
        document.removeEventListener(
          "compositionstart",
          handleCompositionStart,
          capture,
        );
        document.removeEventListener(
          "compositionend",
          handleCompositionEnd,
          capture,
        );
      }
    };
  }

  function getSnapshot() {
    return store.composing;
  }

  return { subscribe, getSnapshot };
}

const captureMode = createMode(true);
const bubbleMode = createMode(false);

function getServerSnapshot() {
  return false;
}

/**
 * テキストの編集中にユーザーがテキストの作成中かどうかを判定するカスタムフック
 *
 * @param capture - キャプチャフェーズでイベントを購読するかどうか (デフォルト: true)
 */
export function useIsComposing(capture = true): boolean {
  const mode = capture ? captureMode : bubbleMode;
  return useSyncExternalStore(
    mode.subscribe,
    mode.getSnapshot,
    getServerSnapshot,
  );
}
