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
 * - `"localStorage"` → `window.localStorage`（他タブの `storage` イベントで同期）
 * - `"sessionStorage"` → `window.sessionStorage`（同一タブに閉じるため cross-tab 同期は不要）
 */
type StorageType = "localStorage" | "sessionStorage";

/** 何もしない関数。session store の storage listener セットアップとして使う。 */
function noop(): void {
  // 意図的な no-op
}

/**
 * `storageType` に応じた Web Storage ストアを生成するファクトリ。
 *
 * `listeners` Map はこのクロージャ内に閉じ込めるため、local/session 間でキー名が衝突しても
 * 互いに干渉しない（ストア間の独立性はテストで担保）。
 *
 * @param storageType - 使用するストレージ種別（{@link StorageType}）
 */
function createStore(storageType: StorageType): WebStorageStore {
  const isLocalStorage = storageType === "localStorage";

  /**
   * ストレージを遅延取得する。毎回 `window` から引くことで、`vi.stubGlobal` 等による
   * テスト時の差し替えにも追随する。
   */
  const getStorage = (): Storage =>
    isLocalStorage ? window.localStorage : window.sessionStorage;
  /** キー → そのキーを購読しているリスナー集合。 */
  const listeners = new Map<string, Set<() => void>>();

  /** 指定キーの購読者 Set を取得する。未作成なら空の Set を作って登録し、以降は同じ参照を返す。 */
  function getListeners(key: string): Set<() => void> {
    const existing = listeners.get(key);
    if (existing) {
      return existing;
    }
    const created = new Set<() => void>();
    listeners.set(key, created);
    return created;
  }

  /**
   * リスナーを 1 件呼び出す。例外が出ても他のリスナーをブロックしないよう握りつぶし、
   * `console.error` に記録する（React 経由では通常 throw しないが防御用）。
   */
  function invoke(listener: () => void): void {
    try {
      listener();
    } catch (error) {
      console.error(`${storageType} listener threw:`, error);
    }
  }

  /**
   * 指定キーの全購読者を同期的に呼ぶ。未登録キーに対しては何もしない
   * （`getListeners` と違い、空の Set を作らないのでレジストリに残滓が残らない）。
   *
   * リスナー内で同キーの `subscribe` / `unsubscribe` や再入的な `write` が起こる可能性があるため、
   * イテレーション前にスナップショットを取って Set 変更の影響を受けないようにする。
   */
  function notify(key: string): void {
    const keyListeners = listeners.get(key);
    if (!keyListeners) {
      return;
    }
    const snapshot = [...keyListeners];
    for (const listener of snapshot) {
      invoke(listener);
    }
  }

  /**
   * 登録中の全キーの全購読者を同期的に呼ぶ。
   * 自タブの `clear` および他タブの `clear` に伴う `storage` イベント（key=null）の伝搬に使う。
   *
   * `notify` と同じ理由でスナップショットを取ってからイテレートする。
   */
  function notifyAll(): void {
    const snapshot: Array<() => void> = [];
    for (const keyListeners of listeners.values()) {
      for (const listener of keyListeners) {
        snapshot.push(listener);
      }
    }
    for (const listener of snapshot) {
      invoke(listener);
    }
  }

  /**
   * 指定キーの生文字列を返す。未設定またはストレージ利用不可（SSR／プライベートブラウジング等）な
   * 場合は `null` を返し、例外は外へ伝搬させない。
   *
   * @param key - 読み取るキー
   * @returns 保存されている文字列。未設定または取得失敗時は `null`
   */
  function read(key: string): string | null {
    try {
      return getStorage().getItem(key);
    } catch {
      return null;
    }
  }

  /**
   * 指定キーに生文字列を書き込み、同一タブの購読者へ通知する。
   * `QuotaExceededError` などで失敗した場合は warn を出して `false` を返し、通知はスキップする
   * （保存されていない値で購読者を起こさないため）。
   *
   * @param key - 書き込むキー
   * @param value - 書き込む文字列
   * @returns 書き込みに成功したら `true`、失敗なら `false`
   */
  function write(key: string, value: string): boolean {
    try {
      getStorage().setItem(key, value);
    } catch (error) {
      console.warn(`Failed to set ${storageType} key "${key}":`, error);
      return false;
    }
    notify(key);
    return true;
  }

  /**
   * 指定キーを削除し、同一タブの購読者へ通知する。
   * 失敗した場合は warn を出して `false` を返し、通知はスキップする。
   *
   * @param key - 削除するキー
   * @returns 削除に成功したら `true`、失敗なら `false`
   */
  function remove(key: string): boolean {
    try {
      getStorage().removeItem(key);
    } catch (error) {
      console.warn(`Failed to remove ${storageType} key "${key}":`, error);
      return false;
    }
    notify(key);
    return true;
  }

  /**
   * ストレージ全体をクリアし、登録中の全購読者へ通知する。
   * `window.localStorage.clear()` を直接呼ぶと同タブには通知が届かないため、アプリ側では
   * 必ずこちらを経由する。失敗した場合は warn を出して `false` を返し、通知はスキップする。
   *
   * @returns クリアに成功したら `true`、失敗なら `false`
   */
  function clear(): boolean {
    try {
      getStorage().clear();
    } catch (error) {
      console.warn(`Failed to clear ${storageType}:`, error);
      return false;
    }
    notifyAll();
    return true;
  }

  /**
   * 他タブ由来の `storage` イベントを `listeners` レジストリへディスパッチする
   * window リスナーを 1 回だけ設置するためのセットアップ関数を返す。
   * クロージャに `installed` フラグを持ち、何度呼んでも window リスナーが重複しないようにする。
   */
  function createLocalStorageListenerSetup(): () => void {
    let installed = false;
    return () => {
      if (installed || typeof window === "undefined") {
        return;
      }
      window.addEventListener("storage", (event) => {
        // ブラウザ由来の storage イベントでは `storageArea` が必ず設定される。
        // 異なる Storage（sessionStorage 等）由来のイベントは弾く。
        if (event.storageArea !== getStorage()) {
          return;
        }
        if (event.key === null) {
          // 他タブの `clear()` は key=null で飛んでくる
          notifyAll();
          return;
        }
        notify(event.key);
      });
      installed = true;
    };
  }

  /**
   * `storage` イベントの購読セットアップ関数。
   * - localStorage: 初回 subscribe 時に window リスナーを 1 度だけ install する
   * - sessionStorage: 同一タブで完結するため何もしない（cross-tab 同期が無い）
   *
   * ファクトリ時点で関数自体を分岐させることで、呼び出し側は `isLocal` を気にしない。
   */
  const ensureStorageListener: () => void = isLocalStorage
    ? createLocalStorageListenerSetup()
    : noop;

  /**
   * 指定キーの変更を購読する。同一タブの `write` / `remove` / `clear` と、他タブで発火する
   * `storage` イベント（localStorage のみ）の両方でリスナーが同期的に呼ばれる。
   *
   * 戻り値の解除関数は複数回呼び出しても安全（冪等）で、後から別の `subscribe` が Map 上に
   * 作り直した Set を誤って削除しないよう、解除時に自身の Set であることを確認してから除去する。
   *
   * @param key - 購読対象のキー
   * @param listener - 変更通知で同期的に呼ばれるコールバック
   * @returns 購読解除関数
   */
  function subscribe(key: string, listener: () => void): () => void {
    ensureStorageListener();
    const keyListeners = getListeners(key);
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
  }

  return { read, write, remove, clear, subscribe };
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
