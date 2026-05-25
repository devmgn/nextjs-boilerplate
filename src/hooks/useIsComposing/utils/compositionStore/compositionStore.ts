/**
 * `document` の composition イベントを購読し、IME 変換中状態を共有するストア。
 * `useSyncExternalStore` にそのまま渡せる `subscribe` / `getSnapshot` を返す。
 */

interface CompositionStore {
  getSnapshot: () => boolean;
  subscribe: (listener: () => void) => () => void;
}

/** Listener の throw が他セッションへの通知を止めないよう握りつぶす。 */
function invoke(listener: () => void): void {
  try {
    listener();
  } catch (error) {
    console.error("compositionStore listener threw:", error);
  }
}

/**
 * 初回 subscribe で document リスナーを install、最後の subscriber が抜けた
 * タイミングで remove する参照カウント方式のストアを生成する。
 */
export function createCompositionStore(capture: boolean): CompositionStore {
  let composing = false;
  const listeners = new Set<() => void>();

  const notify = (): void => {
    // リスナー内で subscribe/unsubscribe が起きても安全なようスナップショットを取る
    const snapshot = [...listeners];
    for (const sessionListener of snapshot) {
      sessionListener();
    }
  };

  const onCompositionStart = (): void => {
    composing = true;
    notify();
  };

  const onCompositionEnd = (): void => {
    composing = false;
    notify();
  };

  const subscribe = (listener: () => void): (() => void) => {
    if (listeners.size === 0) {
      document.addEventListener(
        "compositionstart",
        onCompositionStart,
        capture,
      );
      document.addEventListener("compositionend", onCompositionEnd, capture);
    }
    // 同一 listener 参照を多重 subscribe しても Set の重複排除で潰されないよう、
    // セッションごとに一意のラッパーを登録する
    const sessionListener = (): void => {
      invoke(listener);
    };
    listeners.add(sessionListener);

    let unsubscribed = false;
    return () => {
      if (unsubscribed) {
        return;
      }
      unsubscribed = true;
      listeners.delete(sessionListener);
      if (listeners.size === 0) {
        // 購読切れ目の compositionend を取りこぼしても次回 subscribe 時に
        // 古い true を引きずらないよう、ここでフラグを初期化する
        composing = false;
        document.removeEventListener(
          "compositionstart",
          onCompositionStart,
          capture,
        );
        document.removeEventListener(
          "compositionend",
          onCompositionEnd,
          capture,
        );
      }
    };
  };

  return {
    getSnapshot: () => composing,
    subscribe,
  };
}
