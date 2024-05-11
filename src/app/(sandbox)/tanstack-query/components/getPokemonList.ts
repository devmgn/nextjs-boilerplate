import { createQueryKeys } from '@lukemorales/query-key-factory';
import { axios } from '@/lib';

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
      axios
        .get<PokemonListResponse>('https://pokeapi.co/api/v2/pokemon', {
          params: { offset: offset ?? 0, limit: 12 },
        })
        .then((res) => res.data),
  }),
});
