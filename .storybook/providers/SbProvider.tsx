import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// biome-ignore lint/style/useImportType: use import type
import React from "react";
import "../../src/lib/styles/globals.css";
import { Suspense, useState } from "react";
import { QUERY_CLIENT_CONFIG } from "../../src/providers/RootProvider/TanstackQueryProvider/config";
import { SbErrorBoundary } from "./SbErrorBoundary";

export function SbProvider({ children }: React.PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient(QUERY_CLIENT_CONFIG));

  return (
    <QueryClientProvider client={queryClient}>
      <SbErrorBoundary>
        <Suspense fallback="loading...">{children}</Suspense>
      </SbErrorBoundary>
    </QueryClientProvider>
  );
}
