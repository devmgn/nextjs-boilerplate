import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Toaster } from "sonner";
import { Button } from "../src/components/button";
import { QUERY_CLIENT_CONFIG } from "../src/lib/get-query-client/config/query-client-config";
import "../src/lib/styles/globals.css";

export function SbProvider({ children }: React.PropsWithChildren) {
  // oxlint-disable-next-line react/hook-use-state
  const [queryClient] = useState(() => new QueryClient(QUERY_CLIENT_CONFIG));

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary
        fallbackRender={(props) => {
          const { error, resetErrorBoundary } = props;
          return (
            <>
              <h1 className="text-2xl font-bold">Something went wrong:</h1>
              {Error.isError(error) && (
                <p className="mt-4 text-destructive">{error.message}</p>
              )}
              <Button className="mt-4" onClick={resetErrorBoundary}>
                Try again
              </Button>
            </>
          );
        }}
      >
        <Suspense fallback="loading...">{children}</Suspense>
      </ErrorBoundary>
      <Toaster richColors closeButton />
    </QueryClientProvider>
  );
}
