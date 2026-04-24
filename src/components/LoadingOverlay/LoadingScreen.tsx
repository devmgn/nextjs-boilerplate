import { LoadingView } from "./LoadingView";

/**
 * マウントされている間は常に表示される宣言的な全画面ローディング。
 * Next.js App Router の `loading.tsx`（Suspense fallback）用途を想定。
 */
export function LoadingScreen() {
  return <LoadingView open />;
}
