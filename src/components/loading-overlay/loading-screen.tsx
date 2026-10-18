import { LoadingView } from "./loading-view";

/**
 * Declarative full-screen loading that is always visible while mounted.
 * Intended for Next.js App Router `loading.tsx` (Suspense fallback).
 *
 * @returns An always-visible full-screen loading indicator.
 */
export function LoadingScreen() {
  return <LoadingView open />;
}
