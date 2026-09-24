import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, useState } from "react";
import { Toaster } from "sonner";
import { QUERY_CLIENT_CONFIG } from "../src/lib/get-query-client/config/query-client-config";
import "../src/lib/styles/globals.css";

export function SbProvider({ children }: React.PropsWithChildren) {
  // oxlint-disable-next-line react/hook-use-state
  const [queryClient] = useState(() => new QueryClient(QUERY_CLIENT_CONFIG));

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback="loading...">{children}</Suspense>
      <Toaster richColors closeButton />
    </QueryClientProvider>
  );
}
