import type { QueryClientConfig } from "@tanstack/react-query";
import { MutationCache, QueryCache } from "@tanstack/react-query";
import { toast } from "sonner";

function handleCacheError(
  error: Error,
  meta: { skipToast?: boolean } | undefined,
) {
  if (meta?.skipToast === true) {
    return;
  }
  toast.error(error.message);
}

export const QUERY_CLIENT_CONFIG = {
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      // With SSR, we usually want to set some default staleTime
      // above 0 to avoid refetching immediately on the client
      staleTime: 60 * 1000,
    },
    mutations: {
      retry: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
      handleCacheError(error, query.meta);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      handleCacheError(error, mutation.meta);
    },
  }),
} as const satisfies QueryClientConfig;
