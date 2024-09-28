import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// biome-ignore lint/style/useImportType: <explanation>
import React, { Suspense } from "react";
import { queryClientConfig } from "../../src/config";
import { SbErrorBoundary } from "./SbErrorBoundary";
import "../../src/app/globals.css";

export const SbProvider = ({ children }: React.PropsWithChildren) => {
  const queryClient = new QueryClient(queryClientConfig);

  return (
    <QueryClientProvider client={queryClient}>
      <SbErrorBoundary>
        <Suspense fallback="loading...">{children}</Suspense>
      </SbErrorBoundary>
    </QueryClientProvider>
  );
};
