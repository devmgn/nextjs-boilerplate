"use client";

import { useSyncExternalStore } from "react";
import { LoadingView } from "./LoadingView";
import { loadingStore } from "./utils";

export { loadingStore as loading } from "./utils";

/**
 * `loading.show()` / `loading.hide()` などの imperative API に連動する全画面オーバーレイ。
 * ルートレイアウトに 1 つだけマウントして利用する。
 */
export function LoadingOverlay() {
  const open = useSyncExternalStore(
    loadingStore.subscribe,
    loadingStore.getSnapshot,
    loadingStore.getServerSnapshot,
  );

  return <LoadingView open={open} />;
}
