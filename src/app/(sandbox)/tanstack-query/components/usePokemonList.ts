import { useState, useTransition } from 'react';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useUnmount } from 'react-use';
import { pokemon } from './getPokemonList';

export const usePokemonList = () => {
  const [offset, setOffset] = useState(0);
  const { data } = useSuspenseQuery(pokemon.list(offset));

  const extractOffsetFromUrl = (url: string | null): number => {
    if (!url) return 0;

    const { searchParams } = new URL(url);
    return parseInt(searchParams.get('offset') ?? '0', 10);
  };

  const [isPending, startTransition] = useTransition();
  const navigateTo = (newOffset: number) => {
    return () => {
      startTransition(() => {
        setOffset(newOffset);
      });
    };
  };

  const queryClient = useQueryClient();
  useUnmount(() => {
    queryClient.removeQueries({
      queryKey: pokemon.list().queryKey.filter(Boolean),
    });
  });

  return {
    data,
    isPending,
    extractOffsetFromUrl,
    navigateTo,
  };
};
