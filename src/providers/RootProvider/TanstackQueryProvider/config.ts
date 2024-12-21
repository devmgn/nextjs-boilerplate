import type { QueryClientConfig } from "@tanstack/react-query";

export const QUERY_CLIENT_CONFIG = {
  defaultOptions: {
    queries: {
      retry: false,
      // With SSR, we usually want to set some default staleTime
      // above 0 to avoid refetching immediately on the client
      staleTime: 60 * 1000,
    },
    mutations: {
      retry: false,
    },
  },
} as const satisfies QueryClientConfig;
