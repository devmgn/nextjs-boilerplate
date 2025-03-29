import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// biome-ignore lint/style/useImportType: <explanation>
import React from "react";
import { Suspense } from "react";
import { QUERY_CLIENT_CONFIG } from "../../src/providers/RootProvider/TanstackQueryProvider/config";
import { SbErrorBoundary } from "./SbErrorBoundary";
import "../../src/app/globals.css";

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
