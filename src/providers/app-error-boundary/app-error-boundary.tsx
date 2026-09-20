"use client";

import type { FallbackProps } from "react-error-boundary";
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage from "../../app/error";

// fallback をインライン定義するとレンダーのたびに別コンポーネント扱いになり、
// 境界が復帰するたびに state が捨てられる。
function ErrorFallback(props: FallbackProps) {
  const { error, resetErrorBoundary } = props;

  return <ErrorPage error={error} reset={resetErrorBoundary} />;
}

export function AppErrorBoundary(props: React.PropsWithChildren) {
  const { children } = props;

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>{children}</ErrorBoundary>
  );
}
