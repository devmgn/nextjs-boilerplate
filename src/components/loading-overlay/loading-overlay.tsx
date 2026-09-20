"use client";

import { useSyncExternalStore } from "react";
import { LoadingView } from "./loading-view";
import { loadingStore } from "./utils/loading-store";

/**
 * `loading.show()` / `loading.hide()` などの imperative API に連動する全画面オーバーレイ。
 * ルートレイアウトに 1 つだけマウントして利用する。
 */
export function LoadingOverlay() {
  const open = useSyncExternalStore(
    loadingStore.subscribe,
    loadingStore.getSnapshot,
    loadingStore.getServerSnapshot
  );

  return <LoadingView open={open} />;
}
