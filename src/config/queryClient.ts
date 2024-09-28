import type { QueryClientConfig } from "@tanstack/react-query";

export const queryClientConfig = {
  defaultOptions: {
    queries: {
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
} satisfies QueryClientConfig;
