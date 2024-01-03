'use client';

import { Suspense, useState, useTransition } from 'react';
import { Button, Flex, Loading } from '@yamada-ui/react';
import { uniqueId } from 'lodash-es';
import { Fetcher } from './Fetcher';

export const FetchSandbox = () => {
  const [queryKey, setQueryKey] = useState<number>(0);
  const [isPending, startTransition] = useTransition();

  const updateQueryKey = () => {
    startTransition(() => setQueryKey(Number(uniqueId())));
  };

  return (
    <>
      <Flex gap="2" alignItems="center">
        <Button onClick={updateQueryKey}>Update Key</Button>
        {isPending && <Loading size="2xl" />}
      </Flex>
      <Suspense fallback="loading...">
        <Fetcher queryKey={queryKey} />
      </Suspense>
    </>
  );
};
