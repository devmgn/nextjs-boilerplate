import { createQueryKeys } from '@lukemorales/query-key-factory';
import { ky } from '@/lib';

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
  list: (offset: number = 0) => ({
    queryKey: [offset],
    queryFn: async () => {
      // NOTE: 500ms delay to simulate network latency
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 500);
      });

      return ky
        .get('https://pokeapi.co/api/v2/pokemon', {
          searchParams: { offset, limit: 12 },
        })
        .json<PokemonListResponse>();
    },
  }),
});
