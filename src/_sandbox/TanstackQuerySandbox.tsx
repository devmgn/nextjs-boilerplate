'use client';

import { Suspense, useState, useTransition } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Flex, Input } from '@yamada-ui/react';
import axios from 'axios';
import { uniqueId } from 'lodash-es';
import { UserList } from './UserList';

export const TanstackQuerySandbox = () => {
  const [queryKey, setQueryKey] = useState<number>(0);
  const [isPending, startTransitions] = useTransition();
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: async (data: unknown) => {
      return axios
        .post<{ id: number }[]>(
          'https://jsonplaceholder.typicode.com/posts',
          data,
        )
        .then((res) => res.data);
    },
  });

  return (
    <>
      <Flex gap="2" alignItems="center">
        <Button
          onClick={() =>
            startTransitions(() => setQueryKey(Number(uniqueId())))
          }
        >
          Update Key
        </Button>
        <Button
          onClick={async () => {
            try {
              await mutateAsync({ title: 'foo', body: 'bar', userId: 1 });
              await queryClient.invalidateQueries({ queryKey: [queryKey] });
            } catch {
              // nothing
            }
          }}
        >
          POST
        </Button>
      </Flex>
      <Input />
      <Suspense fallback="loading...">
        {isPending && 'loading...'}
        <UserList queryKey={queryKey} />
      </Suspense>
    </>
  );
};
