import Link from "next/link";
import { pokemon } from "../../../../api/queries/pokemon.queries";
import { Hydrator } from "../../../../lib/Hydrator";
import { PokemonList } from "../components/pokemonList";

export default function Ssr() {
  return (
    <>
      <h2>SSR</h2>
      <p>
        <Link href="/tanstack-query">Return</Link>
      </p>
      <Hydrator fetchQueryOptions={[pokemon.getPokemonList()]}>
        <PokemonList />
      </Hydrator>
    </>
  );
}
