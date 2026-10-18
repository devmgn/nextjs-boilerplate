import { useSyncExternalStore } from "react";
import {
  bubbleCompositionStore,
  captureCompositionStore,
} from "./utils/composition-store";

/**
 * Hook that returns whether IME composition is in progress.
 *
 * @param capture - Whether to subscribe to composition events in the capture
 *   phase
 * @returns `true` while IME composition is in progress
 */
export function useIsComposing(capture = true): boolean {
  const store = capture ? captureCompositionStore : bubbleCompositionStore;

  return useSyncExternalStore(store.subscribe, store.getSnapshot, () => false);
}
