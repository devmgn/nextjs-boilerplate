import type { QueryClientConfig } from "@tanstack/react-query";

export const QUERY_CLIENT_CONFIG = {
  defaultOptions: {
    queries: {
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
} as const satisfies QueryClientConfig;
