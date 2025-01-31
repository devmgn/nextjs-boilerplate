import { createQueryKeys } from "@lukemorales/query-key-factory";

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Pokemon[];
}

interface Pokemon {
  name: string;
  url: string;
}

export const pokemon = createQueryKeys("pokemon", {
  list: (offset = 0) => ({
    queryKey: [offset],
    queryFn: async () => {
      // NOTE: 500ms delay to simulate network latency
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 500);
      });

      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=12`,
      );
      const data: PokemonListResponse = await response.json();
      return data;
    },
  }),
});
