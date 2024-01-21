import {
  QueryClient,
  HydrationBoundary as THydrationBoundary,
  dehydrate,
} from '@tanstack/react-query';
import type {
  DefaultError,
  FetchQueryOptions,
  QueryKey,
} from '@tanstack/react-query';

type PrefetchQueryProps<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = React.PropsWithChildren<{
  fetchQueryOptions: FetchQueryOptions<TQueryFnData, TError, TData, TQueryKey>;
  hydrationBoundaryProps?: React.ComponentPropsWithoutRef<
    typeof THydrationBoundary
  >;
}>;

export const HydrationBoundary = async <
  TQueryFnData,
  TError,
  TData,
  TQueryKey extends QueryKey,
>({
  fetchQueryOptions,
  hydrationBoundaryProps,
  children,
}: PrefetchQueryProps<TQueryFnData, TError, TData, TQueryKey>) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(fetchQueryOptions);

  return (
    <THydrationBoundary
      state={dehydrate(queryClient)}
      {...hydrationBoundaryProps}
    >
      {children}
    </THydrationBoundary>
  );
};

HydrationBoundary.displayName = 'PrefetchQuery';
