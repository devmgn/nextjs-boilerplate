/**
 * `document` の composition イベントを購読し、IME 変換中状態を共有するストア。
 * `useSyncExternalStore` にそのまま渡せる `subscribe` / `getSnapshot` を返す。
 */

import { createListenerSet } from "../../../../utils/listener-set";

interface CompositionStore {
  getSnapshot: () => boolean;
  subscribe: (listener: () => void) => () => void;
}

/** Document に composition イベントのリスナーを install し、remove する関数を返す。 */
function listenComposition(
  capture: boolean,
  onChange: (composing: boolean) => void
): () => void {
  const onCompositionStart = (): void => {
    onChange(true);
  };
  const onCompositionEnd = (): void => {
    onChange(false);
  };
  document.addEventListener("compositionstart", onCompositionStart, capture);
  document.addEventListener("compositionend", onCompositionEnd, capture);
  return () => {
    document.removeEventListener(
      "compositionstart",
      onCompositionStart,
      capture
    );
    document.removeEventListener("compositionend", onCompositionEnd, capture);
  };
}

/**
 * 初回 subscribe で document リスナーを install、最後の subscriber が抜けた
 * タイミングで remove する参照カウント方式のストアを生成する。
 */
export function createCompositionStore(capture: boolean): CompositionStore {
  let composing = false;
  let unlisten: (() => void) | null = null;

  const listenerSet = createListenerSet("compositionStore", {
    onFirstSubscribe: () => {
      unlisten = listenComposition(capture, (next) => {
        composing = next;
        listenerSet.notify();
      });
    },
    onLastUnsubscribe: () => {
      // 購読切れ目の compositionend を取りこぼしても次回 subscribe 時に
      // 古い true を引きずらないよう、ここでフラグを初期化する
      composing = false;
      unlisten?.();
      unlisten = null;
    },
  });

  return {
    getSnapshot: () => composing,
    subscribe: listenerSet.subscribe,
  };
}
