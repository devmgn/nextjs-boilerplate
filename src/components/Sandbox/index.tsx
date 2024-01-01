'use client';

import { Suspense, useState, useTransition } from 'react';
import dynamic from 'next/dynamic';
import { Button, Flex, Loading } from '@yamada-ui/react';
import { uniqueId } from 'lodash-es';

const FetchMock = dynamic(
  () => import('./FetchMock').then((m) => m.FetchMock),
  { ssr: false },
);

export const Sandbox = () => {
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
      <FetchMock queryKey={queryKey} />
      <Suspense fallback="loading..." />
    </>
  );
};

Sandbox.displayName = 'Sandbox';
