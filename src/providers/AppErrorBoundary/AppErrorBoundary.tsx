"use client";

import { ErrorBoundary } from "react-error-boundary";
import ErrorPage from "../../app/error";

export function AppErrorBoundary(props: React.PropsWithChildren) {
  const { children } = props;

  return (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <ErrorPage error={error} reset={resetErrorBoundary} />
      )}
    >
      {children}
    </ErrorBoundary>
  );
}
