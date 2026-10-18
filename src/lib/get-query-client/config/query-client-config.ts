import type { QueryClientConfig } from "@tanstack/react-query";
import {
  MutationCache,
  QueryCache,
  defaultShouldDehydrateQuery,
} from "@tanstack/react-query";
import { loadingStore as loading } from "../../../components/loading-overlay/utils/loading-store";
import { errorNotifier } from "../../error-notifier";

function handleCacheError(
  error: Error,
  meta: { skipToast?: boolean } | undefined
) {
  if (meta?.skipToast === true) {
    return;
  }

  errorNotifier.notify(error.message);
}

/**
 * Creates the QueryClient config. QueryCache / MutationCache each hold their
 * own cache, so new ones are created on every call. Sharing them as constants
 * would make the per-request QueryClients on the server share a cache.
 *
 * @returns The config passed to QueryClient
 */
export function createQueryClientConfig() {
  return {
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
      dehydrate: {
        // include pending queries in dehydration
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
    },
    queryCache: new QueryCache({
      onError: (error, query) => {
        handleCacheError(error, query.meta);
      },
    }),
    mutationCache: new MutationCache({
      onMutate: (_variables, mutation) => {
        if (mutation.meta?.skipLoading === true) {
          return;
        }

        loading.show();
      },
      onSettled: (_data, _error, _variables, _context, mutation) => {
        if (mutation.meta?.skipLoading === true) {
          return;
        }

        loading.hide();
      },
      onError: (error, _variables, _context, mutation) => {
        handleCacheError(error, mutation.meta);
      },
    }),
  } as const satisfies QueryClientConfig;
}
