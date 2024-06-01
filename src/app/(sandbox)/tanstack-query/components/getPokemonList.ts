import { createQueryKeys } from '@lukemorales/query-key-factory';
import { kyInstance } from '@/lib';

export type PokemonListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Pokemon[];
};

export type Pokemon = {
  name: string;
  url: string;
};

export const pokemon = createQueryKeys('pokemon', {
  list: (offset?: number) => ({
    queryKey: [offset],
    queryFn: () =>
      kyInstance
        .get('https://pokeapi.co/api/v2/pokemon', {
          searchParams: { offset: offset ?? 0, limit: 12 },
        })
        .json<PokemonListResponse>(),
  }),
});
