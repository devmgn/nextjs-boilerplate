import type { WebStorageStore } from "../../utils/webStorageStore";
import { useSyncExternalStore } from "react";
import { isFunction } from "../../utils/isFunction";

/**
 * Web Storage（localStorage / sessionStorage）を React 状態に同期させる汎用フック。
 *
 * 渡されたストアに読み書き・購読を委譲するため、同一タブの複数インスタンス間で値が自動同期する
 * （localStorage ストアの場合は他タブの `storage` イベントにも反応する）。値は文字列のまま扱い、
 * 構造化データを保存したい場合は呼び出し側でシリアライズ/デシリアライズする。
 *
 * ストレージが未設定・取得失敗・SSR のいずれの場合も `null` を返す（Web Storage ネイティブの
 * `getItem` と揃える）。
 *
 * 通常は `useLocalStorage` / `useSessionStorage` を使い、カスタムストアを挿したいときのみ直接呼ぶ。
 *
 * @param store - 読み書きと購読を担う {@link WebStorageStore}。
 * @param key - ストレージキー。
 * @returns 3 要素タプル:
 *
 *   - `value`: 現在の値。未設定・取得失敗・SSR 時は `null`。
 *   - `setValue`: 値を書き込む。`React.useState` と同様に関数型更新も可能で、`prev` にはストアの
 *     最新値が渡される。戻り値はストアへの書き込み成否（`QuotaExceededError` 等で失敗時は `false`）。
 *   - `removeValue`: 値を削除する。戻り値はストアでの削除成否。
 */
export function useWebStorage(
  store: WebStorageStore,
  key: string,
): [
  value: string | null,
  setValue: (value: string | ((prev: string | null) => string)) => boolean,
  removeValue: () => boolean,
] {
  const value = useSyncExternalStore(
    (onStoreChange) => store.subscribe(key, onStoreChange),
    () => store.read(key),
    () => null,
  );

  const setValue = (updater: string | ((prev: string | null) => string)) => {
    const next = isFunction(updater) ? updater(store.read(key)) : updater;
    return store.write(key, next);
  };

  const removeValue = () => store.remove(key);

  return [value, setValue, removeValue];
}
