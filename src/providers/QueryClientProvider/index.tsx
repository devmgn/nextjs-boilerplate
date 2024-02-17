'use client';

import { useState } from 'react';
import {
  QueryClient,
  QueryClientProvider as TQueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClientConfig } from './config';

export const QueryClientProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [queryClient] = useState(() => new QueryClient(queryClientConfig));

  return (
    <TQueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </TQueryClientProvider>
  );
};

QueryClientProvider.displayName = 'QueryClientProvider';
