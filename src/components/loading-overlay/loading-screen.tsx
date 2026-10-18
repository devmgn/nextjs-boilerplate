import { LoadingView } from "./loading-view";

/**
 * マウントされている間は常に表示される宣言的な全画面ローディング。
 * Next.js App Router の `loading.tsx`（Suspense fallback）用途を想定。
 *
 * @returns 常に表示状態の全画面ローディング。
 */
export function LoadingScreen() {
  return <LoadingView open />;
}
