/**
 * `useSyncExternalStore` 向け外部ストアの購読者管理。
 * セッション単位の購読・冪等な解除・例外に強い通知をまとめて提供する。
 */

export interface ListenerSet {
  /**
   * Listener を登録。同一 listener 参照でもセッション毎に独立して扱う。
   * 返り値の unsubscribe は冪等で、複数回呼んでも副作用はない。
   */
  subscribe: (listener: () => void) => () => void;
  /** 登録中の全 listener を subscribe 順に同期的に呼ぶ。 */
  notify: () => void;
}

interface ListenerSetOptions {
  /** 購読者が 0 → 1 になる直前に呼ばれる。 */
  onFirstSubscribe?: () => void;
  /** 購読者が 1 → 0 になった直後に呼ばれる。 */
  onLastUnsubscribe?: () => void;
}

/** @param label - Listener が throw した際の `console.error` に付けるストア名 */
export function createListenerSet(
  label: string,
  { onFirstSubscribe, onLastUnsubscribe }: ListenerSetOptions = {}
): ListenerSet {
  const listeners = new Set<() => void>();

  /** Listener の throw が他セッションへの通知を止めないよう握りつぶす。 */
  const invoke = (listener: () => void): void => {
    try {
      listener();
    } catch (error) {
      console.error(`${label} listener threw:`, error);
    }
  };

  const notify = (): void => {
    // リスナー内で subscribe/unsubscribe が起きても安全なようスナップショットを取る
    const snapshot = [...listeners];
    for (const sessionListener of snapshot) {
      sessionListener();
    }
  };

  const subscribe = (listener: () => void): (() => void) => {
    if (listeners.size === 0) {
      onFirstSubscribe?.();
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
        onLastUnsubscribe?.();
      }
    };
  };

  return { subscribe, notify };
}
