/**
 * 全画面 LoadingOverlay の表示状態を保持する外部ストア。
 * `useSyncExternalStore` にそのまま渡せる `subscribe` / `getSnapshot` と、
 * 呼び出し側から参照カウントで表示制御するための show / hide / promise / reset を公開する。
 */

import { createListenerSet } from "../../../../utils/listener-set";

interface LoadingStore {
  /** 現在表示中かどうか (count > 0)。`useSyncExternalStore` の getSnapshot として渡す想定。 */
  getSnapshot: () => boolean;
  /** SSR では常に非表示。ハイドレーション時に useSyncExternalStore が差し替える。 */
  getServerSnapshot: () => boolean;
  /**
   * Listener を登録。同一 listener 参照でもセッション毎に独立して扱う。
   * 返り値の unsubscribe は冪等で、複数回呼んでも副作用はない。
   */
  subscribe: (listener: () => void) => () => void;

  /**
   * カウンタを +1 して listener に通知する。
   * boolean 状態 (count > 0) の境界に限らず、呼ばれるたびに通知する契約。
   */
  show: () => void;
  /**
   * カウンタを -1 して listener に通知する。
   * count === 0 の場合は no-op (listener を呼ばない)。
   */
  hide: () => void;
  /**
   * `show()` してから promise を await、settle 時 (resolve / reject 双方) に `hide()` する。
   * 返り値は元の promise と同じ settle 結果を透過する。
   */
  promise: <T>(promise: Promise<T>) => Promise<T>;
  /** カウンタを即 0 にして listener に通知する。count === 0 の場合は no-op。 */
  reset: () => void;
}

export function createLoadingStore(): LoadingStore {
  const { subscribe, notify } = createListenerSet("loadingStore");
  let count = 0;

  const show = (): void => {
    count += 1;
    notify();
  };

  const hide = (): void => {
    if (count === 0) {
      return;
    }
    count -= 1;
    notify();
  };

  const reset = (): void => {
    if (count === 0) {
      return;
    }
    count = 0;
    notify();
  };

  const promise = async <T>(target: Promise<T>): Promise<T> => {
    show();
    try {
      return await target;
    } finally {
      hide();
    }
  };

  return {
    getSnapshot: () => count > 0,
    getServerSnapshot: () => false,
    subscribe,
    show,
    hide,
    promise,
    reset,
  };
}
