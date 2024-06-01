import { useState, useTransition } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { pokemon } from './getPokemonList';

export const usePokemonList = () => {
  const [offset, setOffset] = useState(0);
  const query = useSuspenseQuery(pokemon.list(offset));

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

  return {
    query,
    isPending,
    extractOffsetFromUrl,
    navigateTo,
  };
};
