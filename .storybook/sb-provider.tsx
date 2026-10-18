import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, useState } from "react";
import { Toaster } from "sonner";
import { createQueryClientConfig } from "../src/lib/get-query-client/config/query-client-config";
import "../src/lib/styles/globals.css";

/**
 * Storybook の各 story を TanStack Query・Suspense・Toaster で包むプロバイダー。
 *
 * @param props - 包む対象の story
 * @returns プロバイダーで包んだ story
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
