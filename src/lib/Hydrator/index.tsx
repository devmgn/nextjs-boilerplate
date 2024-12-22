import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import type {
  DefaultError,
  FetchQueryOptions,
  QueryKey,
} from "@tanstack/react-query";

type PrefetchQueryProps<
  TsQueryFnData = unknown,
  TsError = DefaultError,
  TsData = TsQueryFnData,
  TsQueryKey extends QueryKey = QueryKey,
> = React.PropsWithChildren<{
  fetchQueryOptions: FetchQueryOptions<
    TsQueryFnData,
    TsError,
    TsData,
    TsQueryKey
  >[];
  hydrationBoundaryProps?: React.ComponentPropsWithoutRef<
    typeof HydrationBoundary
  >;
}>;

export async function Hydrator<
  TsQueryFnData,
  TsError,
  TsData,
  TsQueryKey extends QueryKey,
>({
  fetchQueryOptions,
  hydrationBoundaryProps,
  children,
}: PrefetchQueryProps<TsQueryFnData, TsError, TsData, TsQueryKey>) {
  const queryClient = new QueryClient();
  await Promise.all(fetchQueryOptions.map((o) => queryClient.prefetchQuery(o)));

  return (
    <HydrationBoundary
      state={dehydrate(queryClient)}
      {...hydrationBoundaryProps}
    >
      {children}
    </HydrationBoundary>
  );
}
