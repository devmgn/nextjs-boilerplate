'use client';

import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useUnmount } from 'react-use';
import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { axios } from '@/lib';
import { queryFn, queryKey } from './getPokemonList';
import type { PokemonListResponse } from './getPokemonList';

export const PokemonList: React.FC<React.ComponentPropsWithoutRef<'div'>> = (
  props,
) => {
  const { data, isFetching } = useSuspenseQuery({
    queryKey,
    queryFn,
  });

  const queryClient = useQueryClient();
  const onClickPagination = (url: string | null) => {
    return () => {
      if (!url) return;
      queryClient
        .fetchQuery({
          queryKey,
          queryFn: () =>
            axios.get<PokemonListResponse>(url).then((res) => res.data),
        })
        .catch(() => {
          throw Error();
        });
    };
  };

  useUnmount(() => {
    queryClient.removeQueries({ queryKey });
  });

  return (
    <div {...props}>
      <div className="flex items-center gap-2">
        <Button
          disabled={!data.previous || isFetching}
          onClick={onClickPagination(data.previous)}
        >
          Prev
        </Button>
        <Button
          disabled={!data.next || isFetching}
          onClick={onClickPagination(data.next)}
        >
          Next
        </Button>
        {isFetching && 'loading...'}
      </div>
      <p className="prose mt-2">Results: {data.count}</p>
      <ul className="mt-2 grid grid-cols-[repeat(auto-fit,minmax(198px,1fr))] gap-4">
        {data.results.map(({ name, url }) => (
          <Card key={url}>
            <CardHeader>{name}</CardHeader>
          </Card>
        ))}
      </ul>
    </div>
  );
};

PokemonList.displayName = 'PokemonList';
