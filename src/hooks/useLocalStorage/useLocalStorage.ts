import { localStorageStore } from "../../utils/webStorageStore";
import { useWebStorage } from "../useWebStorage";

/**
 * LocalStorage フック。`useWebStorage` に `localStorageStore` を束縛したラッパー。
 *
 * 他タブの変更も `storage` イベント経由で反映される。ストレージ未設定・取得失敗・SSR 時は
 * `null` を返す。
 *
 * @param key - ストレージキー。
 * @returns `useWebStorage` と同じ 3 要素タプル。
 */
export function useLocalStorage(key: string) {
  return useWebStorage(localStorageStore, key);
}
