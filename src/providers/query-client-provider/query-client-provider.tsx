"use client";

import { QueryClientProvider as QueryClientProviderPrimitive } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getQueryClient } from "../../lib/get-query-client";

/**
 * TanStack Query の QueryClient を配下へ提供する Provider。Devtools も併せて描画する。
 *
 * @param props - QueryClient を提供する子要素
 * @returns QueryClient を提供する Provider 要素
 */
export function QueryClientProvider(props: React.PropsWithChildren) {
  const { children } = props;

  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient();

  return (
    <QueryClientProviderPrimitive client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProviderPrimitive>
  );
}
