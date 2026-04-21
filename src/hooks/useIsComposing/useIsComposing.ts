import { useSyncExternalStore } from "react";
import { bubbleCompositionStore, captureCompositionStore } from "./utils";

/**
 * IME 変換中かどうかを返すフック。
 *
 * @param capture - キャプチャフェーズで composition イベントを購読するかどうか
 */
export function useIsComposing(capture = true): boolean {
  const store = capture ? captureCompositionStore : bubbleCompositionStore;
  return useSyncExternalStore(store.subscribe, store.getSnapshot, () => false);
}
