import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, useState } from "react";
import { Toaster } from "sonner";
import { createQueryClientConfig } from "../src/lib/get-query-client/config/query-client-config";
import "../src/lib/styles/globals.css";

/**
 * Provider that wraps each Storybook story with TanStack Query, Suspense, and
 * Toaster.
 *
 * @param props - The story to wrap
 * @returns The story wrapped in the providers
 */
export function SbProvider({ children }: React.PropsWithChildren) {
  // oxlint-disable-next-line react/hook-use-state
  const [queryClient] = useState(
    () => new QueryClient(createQueryClientConfig())
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback="loading...">{children}</Suspense>
      <Toaster richColors closeButton />
    </QueryClientProvider>
  );
}
