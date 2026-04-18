import { sessionStorageStore } from "../../utils/webStorageStore";
import { useWebStorage } from "../useWebStorage";

/**
 * SessionStorage フック。`useWebStorage` に `sessionStorageStore` を束縛したラッパー。
 *
 * SessionStorage は同一タブに閉じる Web Storage 仕様に従い、他タブとは同期しない。ストレージ
 * 未設定・取得失敗・SSR 時は `null` を返す。
 *
 * @param key - ストレージキー。
 * @returns `useWebStorage` と同じ 3 要素タプル。
 */
export function useSessionStorage(key: string) {
  return useWebStorage(sessionStorageStore, key);
}
