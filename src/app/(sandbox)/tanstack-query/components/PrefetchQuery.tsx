import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';

type PrefetchQueryProps = React.PropsWithChildren<{
  prefetchQueryOptions: Parameters<QueryClient['prefetchQuery']>[0];
  hydrationBoundaryProps?: React.ComponentPropsWithoutRef<
    typeof HydrationBoundary
  >;
}>;

export const PrefetchQuery: React.FC<PrefetchQueryProps> = async ({
  prefetchQueryOptions,
  hydrationBoundaryProps,
  children,
}) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(prefetchQueryOptions);

  return (
    <HydrationBoundary
      state={dehydrate(queryClient)}
      {...hydrationBoundaryProps}
    >
      {children}
    </HydrationBoundary>
  );
};

PrefetchQuery.displayName = 'PrefetchQuery';
