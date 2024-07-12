import {
  type QueryClientConfig,
  defaultShouldDehydrateQuery,
} from "@tanstack/react-query";

export const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      // With SSR, we usually want to set some default staleTime
      // above 0 to avoid refetching immediately on the client
      staleTime: 60 * 1000,
    },
    mutations: {
      retry: false,
    },
    dehydrate: {
      // per default, only successful Queries are included,
      // this includes pending Queries as well
      shouldDehydrateQuery: (query) =>
        defaultShouldDehydrateQuery(query) || query.state.status === "pending",
    },
  },
};
