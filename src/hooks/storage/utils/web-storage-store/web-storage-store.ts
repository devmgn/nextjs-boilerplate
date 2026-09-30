/**
 * Web Storage API（localStorage / sessionStorage）に対する薄いラッパーと、同タブ内購読機構。
 *
 * ネイティブの `storage` イベントは他タブからしか発火しないため、同一タブ内で行われた
 * `write` / `remove` / `clear` を購読者へ届ける経路として、キー単位の購読者 Set を自前で保持する。
 */

/**
 * Web Storage への読み書きと変更購読を束ねたストア。
 * `localStorageStore` / `sessionStorageStore` が実装する共通インターフェース。
 */
export interface WebStorageStore {
  /** 指定キーの値を読む。未設定または取得不可（SSR／プライベートブラウジング等）時は `null`。 */
  read: (key: string) => string | null;
  /** 指定キーに値を書き、購読者へ通知する。失敗時は `false` を返し通知はスキップする。 */
  write: (key: string, value: string) => boolean;
  /** 指定キーを削除し、購読者へ通知する。失敗時は `false` を返し通知はスキップする。 */
  remove: (key: string) => boolean;
  /** 全キーを削除し、全購読者へ通知する。失敗時は `false` を返し通知はスキップする。 */
  clear: () => boolean;
  /** 指定キーの変更を購読する。戻り値を呼ぶと解除される（複数回呼んでも冪等）。 */
  subscribe: (key: string, listener: () => void) => () => void;
}

/**
 * ストアの種類を表す discriminator。
 *
 * - `"localStorage"` → `window.localStorage`（他タブの `storage` イベントで同期）
 * - `"sessionStorage"` → `window.sessionStorage`（同一タブに閉じるため cross-tab 同期は不要）
 */
type StorageType = "localStorage" | "sessionStorage";

/** キー単位の購読者レジストリ。 */
interface KeyedListeners {
  /** 指定キーの全購読者を同期的に呼ぶ。 */
  notify: (key: string) => void;
  /** 登録中の全キーの全購読者を同期的に呼ぶ。 */
  notifyAll: () => void;
  /** 指定キーを購読する。戻り値の解除関数は冪等。 */
  subscribe: (key: string, listener: () => void) => () => void;
}

/** 何もしない関数。session store の storage listener セットアップとして使う。 */
function noop(): void {
  // 意図的な no-op
}

/**
 * ストレージを遅延取得する。毎回 `window` から引くことで、`vi.stubGlobal` 等による
 * テスト時の差し替えにも追随する。
 */
function getStorage(storageType: StorageType): Storage {
  return storageType === "localStorage"
    ? window.localStorage
    : window.sessionStorage;
}

/**
 * 指定キーの生文字列を返す。未設定またはストレージ利用不可（SSR／プライベートブラウジング等）な
 * 場合は `null` を返し、例外は外へ伝搬させない。
 */
function readItem(storageType: StorageType, key: string): string | null {
  try {
    return getStorage(storageType).getItem(key);
  } catch {
    return null;
  }
}

/**
 * ストレージへの変更操作を実行する。`QuotaExceededError` などで失敗した場合は warn を出して
 * `false` を返す。呼び出し側は `true` のときだけ購読者へ通知する
 * （保存されていない値で購読者を起こさないため）。
 */
function tryMutate(
  storageType: StorageType,
  mutation: (storage: Storage) => void,
  failureMessage: string
): boolean {
  try {
    mutation(getStorage(storageType));
  } catch (error) {
    console.warn(failureMessage, error);
    return false;
  }
  return true;
}

/**
 * キー → 購読者 Set のレジストリを生成する。
 *
 * リスナーは 1 件ずつ呼び出し、例外が出ても他のリスナーをブロックしないよう握りつぶして
 * `console.error` に記録する（React 経由では通常 throw しないが防御用）。
 * リスナー内で `subscribe` / `unsubscribe` や再入的な `write` が起こる可能性があるため、
 * 通知前にスナップショットを取って Set 変更の影響を受けないようにする。
 *
 * @param label - `console.error` に付けるストア名
 */
function createKeyedListeners(label: string): KeyedListeners {
  const listeners = new Map<string, Set<() => void>>();

  const invokeAll = (snapshot: (() => void)[]): void => {
    for (const listener of snapshot) {
      try {
        listener();
      } catch (error) {
        console.error(`${label} listener threw:`, error);
      }
    }
  };

  // 未登録キーに対しては空の Set を作らないので、レジストリに残滓が残らない
  const notify = (key: string): void => {
    invokeAll([...(listeners.get(key) ?? [])]);
  };

  const notifyAll = (): void => {
    invokeAll(
      [...listeners.values()].flatMap((keyListeners) => [...keyListeners])
    );
  };

  const subscribe = (key: string, listener: () => void): (() => void) => {
    const keyListeners = listeners.get(key) ?? new Set<() => void>();
    listeners.set(key, keyListeners);
    keyListeners.add(listener);

    let unsubscribed = false;
    return () => {
      if (unsubscribed) {
        return;
      }
      unsubscribed = true;
      keyListeners.delete(listener);
      // 別の subscribe が Map の Set を差し替えている可能性があるため、自分の Set に限って削除する
      if (keyListeners.size === 0 && listeners.get(key) === keyListeners) {
        listeners.delete(key);
      }
    };
  };

  return { notify, notifyAll, subscribe };
}

/**
 * 他タブ由来の `storage` イベントをレジストリへディスパッチする window リスナーを
 * 1 回だけ設置するためのセットアップ関数を返す。
 * クロージャに `installed` フラグを持ち、何度呼んでも window リスナーが重複しないようにする。
 */
function createStorageEventBridge(
  storageType: StorageType,
  registry: KeyedListeners
): () => void {
  let installed = false;
  return () => {
    if (installed || typeof window === "undefined") {
      return;
    }
    window.addEventListener("storage", (event) => {
      // ブラウザ由来の storage イベントでは `storageArea` が必ず設定される。
      // 異なる Storage（sessionStorage 等）由来のイベントは弾く。
      if (event.storageArea !== getStorage(storageType)) {
        return;
      }
      if (event.key === null) {
        // 他タブの `clear()` は key=null で飛んでくる
        registry.notifyAll();
        return;
      }
      registry.notify(event.key);
    });
    installed = true;
  };
}

/**
 * `storageType` に応じた Web Storage ストアを生成するファクトリ。
 *
 * レジストリはこのクロージャ内に閉じ込めるため、local/session 間でキー名が衝突しても
 * 互いに干渉しない（ストア間の独立性はテストで担保）。
 *
 * `window.localStorage.clear()` を直接呼ぶと同タブには通知が届かないため、アプリ側では
 * 必ず `clear` を経由する。
 *
 * @param storageType - 使用するストレージ種別（{@link StorageType}）
 */
function createStore(storageType: StorageType): WebStorageStore {
  const registry = createKeyedListeners(storageType);
  // LocalStorage のみ初回 subscribe 時に他タブ同期を install する。
  // SessionStorage は同一タブで完結するため cross-tab 同期が無い
  const ensureStorageListener: () => void =
    storageType === "localStorage"
      ? createStorageEventBridge(storageType, registry)
      : noop;

  /** 変更操作に成功したときだけ購読者へ通知する。`key` が `null` なら全キーの購読者へ通知する。 */
  const mutateAndNotify = (
    mutation: (storage: Storage) => void,
    failureMessage: string,
    key: string | null
  ): boolean => {
    const succeeded = tryMutate(storageType, mutation, failureMessage);
    if (succeeded) {
      if (key === null) {
        registry.notifyAll();
      } else {
        registry.notify(key);
      }
    }
    return succeeded;
  };

  return {
    read: (key) => readItem(storageType, key),
    write: (key, value) =>
      mutateAndNotify(
        (storage) => {
          storage.setItem(key, value);
        },
        `Failed to set ${storageType} key "${key}":`,
        key
      ),
    remove: (key) =>
      mutateAndNotify(
        (storage) => {
          storage.removeItem(key);
        },
        `Failed to remove ${storageType} key "${key}":`,
        key
      ),
    clear: () =>
      mutateAndNotify(
        (storage) => {
          storage.clear();
        },
        `Failed to clear ${storageType}:`,
        null
      ),
    subscribe: (key, listener) => {
      ensureStorageListener();
      return registry.subscribe(key, listener);
    },
  };
}

/**
 * `window.localStorage` を対象とするストア。
 * 他タブの変更も `storage` イベント経由で購読者へ届く。
 */
export const localStorageStore: WebStorageStore = createStore("localStorage");

/**
 * `window.sessionStorage` を対象とするストア。
 * 同一タブに閉じる Web Storage 仕様に従い、他タブとの同期は行わない。
 */
export const sessionStorageStore: WebStorageStore =
  createStore("sessionStorage");
