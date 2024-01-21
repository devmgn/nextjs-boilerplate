'use client';

import { useState } from 'react';
import {
  QueryClient,
  QueryClientProvider as TQueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental';
import { queryClientConfig } from './config';

export const QueryClientProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [queryClient] = useState(() => new QueryClient(queryClientConfig));

  return (
    <TQueryClientProvider client={queryClient}>
      <ReactQueryStreamedHydration>{children}</ReactQueryStreamedHydration>
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
    </TQueryClientProvider>
  );
};

QueryClientProvider.displayName = 'QueryClientProvider';
