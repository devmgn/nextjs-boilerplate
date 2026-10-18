"use client";

import { useSyncExternalStore } from "react";
import { LoadingView } from "./loading-view";
import { loadingStore } from "./utils/loading-store";

/**
 * Full-screen overlay driven by the imperative API (`loading.show()` /
 * `loading.hide()`, etc.). Mount exactly one in the root layout.
 *
 * @returns Full-screen loading that follows the store's visibility state.
 */
export function LoadingOverlay() {
  const open = useSyncExternalStore(
    loadingStore.subscribe,
    loadingStore.getSnapshot,
    loadingStore.getServerSnapshot
  );

  return <LoadingView open={open} />;
}
