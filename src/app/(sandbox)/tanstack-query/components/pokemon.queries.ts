import { createQueryKeys } from "@lukemorales/query-key-factory";
import { DefaultApi, type PokemonListRequest } from "../../../../openapi";

const client = new DefaultApi();

export const pokemon = createQueryKeys("pokeApi", {
  getPokemonList: (req: PokemonListRequest = {}) => ({
    queryKey: [req],
    queryFn: () => client.pokemonList(req),
  }),
});
