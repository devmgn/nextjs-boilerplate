import { useSyncExternalStore } from "react";
import {
  bubbleCompositionStore,
  captureCompositionStore,
} from "./utils/composition-store";

/**
 * IME 変換中かどうかを返すフック。
 *
 * @param capture - キャプチャフェーズで composition イベントを購読するかどうか
 * @returns IME 変換中なら `true`
 */
export function useIsComposing(capture = true): boolean {
  const store = capture ? captureCompositionStore : bubbleCompositionStore;

  return useSyncExternalStore(store.subscribe, store.getSnapshot, () => false);
}
