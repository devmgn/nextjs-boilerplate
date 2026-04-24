/**
 * 全画面 LoadingOverlay の表示状態を保持する外部ストア。
 * `useSyncExternalStore` にそのまま渡せる `subscribe` / `getSnapshot` と、
 * 呼び出し側から参照カウントで表示制御するための show / hide / promise / reset を公開する。
 */

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

/** Listener の throw が他セッションへの通知を止めないよう握りつぶす。 */
function invoke(listener: () => void): void {
  try {
    listener();
  } catch (error) {
    console.error("loadingStore listener threw:", error);
  }
}

export function createLoadingStore(): LoadingStore {
  const listeners = new Set<() => void>();
  let count = 0;

  const notify = (): void => {
    // リスナー内で subscribe/unsubscribe が起きても安全なようスナップショットを取る
    const snapshot = [...listeners];
    for (const sessionListener of snapshot) {
      sessionListener();
    }
  };

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

  const subscribe = (listener: () => void): (() => void) => {
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
    };
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
