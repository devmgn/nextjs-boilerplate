'use client';

import { useState } from 'react';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useUnmount } from 'react-use';
import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { pokemon } from './getPokemonList';

export const PokemonList: React.FC<React.ComponentPropsWithoutRef<'div'>> = (
  props,
) => {
  const [offset, setOffset] = useState(0);
  const { data, isFetching } = useSuspenseQuery(pokemon.list(offset));

  const queryClient = useQueryClient();
  const onClickPagination = (url: string | null) => {
    return () => {
      if (!url) return;
      const parsed = new URL(url);
      setOffset(parseInt(parsed.searchParams.get('offset') || '0', 10));
    };
  };

  useUnmount(() => {
    queryClient.removeQueries({
      queryKey: pokemon.list().queryKey.filter(Boolean),
    });
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
