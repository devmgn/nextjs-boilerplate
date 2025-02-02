import { createQueryKeys } from "@lukemorales/query-key-factory";
import { apiClient } from "../apiClient";
import type { PokemonListRequest } from "../openapi";

export const pokemon = createQueryKeys("pokeApi", {
  getPokemonList: (req: PokemonListRequest = {}) => ({
    queryKey: [req],
    queryFn: () => apiClient.pokemonList(req),
  }),
});
