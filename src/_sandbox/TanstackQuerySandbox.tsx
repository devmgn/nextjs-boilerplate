'use client';

import { Suspense, useState, useTransition } from 'react';
import { Button, Flex, Loading } from '@yamada-ui/react';
import { uniqueId } from 'lodash-es';
import { UserList } from './UserList';

export const TanstackQuerySandbox = () => {
  const [queryKey, setQueryKey] = useState<number>(0);
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <Flex gap="2" alignItems="center">
        <Button onClick={() => setQueryKey(Number(uniqueId()))}>
          Update Key
        </Button>
        <Button
          onClick={() => startTransition(() => setQueryKey(Number(uniqueId())))}
        >
          Update Key with Transition API
        </Button>
        {isPending && <Loading size="2xl" />}
      </Flex>
      <Suspense fallback="loading...">
        <UserList queryKey={queryKey} />
      </Suspense>
    </>
  );
};
