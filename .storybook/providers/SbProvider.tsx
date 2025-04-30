import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// biome-ignore lint/style/useImportType: use import type
import React from "react";
import "../../src/app/globals.css";
import { Suspense } from "react";
import { QUERY_CLIENT_CONFIG } from "../../src/providers/RootProvider/TanstackQueryProvider/config";
import { SbErrorBoundary } from "./SbErrorBoundary";

export const SbProvider = ({ children }: React.PropsWithChildren) => {
  const queryClient = new QueryClient(QUERY_CLIENT_CONFIG);

  return (
    <QueryClientProvider client={queryClient}>
      <SbErrorBoundary>
        <Suspense fallback="loading...">{children}</Suspense>
      </SbErrorBoundary>
    </QueryClientProvider>
  );
};
