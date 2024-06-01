'use client';

import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { usePokemonList } from './usePokemonList';

export const PokemonList: React.FC<React.ComponentPropsWithoutRef<'div'>> = (
  props,
) => {
  const {
    query: { data },
    isPending,
    navigateTo,
    extractOffsetFromUrl,
  } = usePokemonList();

  return (
    <div {...props}>
      <div className="flex items-center gap-2">
        <Button
          disabled={!data.previous || isPending}
          onClick={navigateTo(extractOffsetFromUrl(data.previous))}
        >
          Prev
        </Button>
        <Button
          disabled={!data.next || isPending}
          onClick={navigateTo(extractOffsetFromUrl(data.next))}
        >
          Next
        </Button>
        {isPending && <Spinner />}
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
