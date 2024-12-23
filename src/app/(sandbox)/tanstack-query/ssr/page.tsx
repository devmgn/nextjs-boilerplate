import Link from "next/link";
import { Hydrator } from "../../../../lib/Hydrator";
import { pokemon } from "../components/getPokemonList";
import { PokemonList } from "../components/pokemonList";

export default function Ssr() {
  return (
    <>
      <h2>SSR</h2>
      <p>
        <Link href="/tanstack-query">Return</Link>
      </p>
      <Hydrator fetchQueryOptions={[pokemon.list()]}>
        <PokemonList />
      </Hydrator>
    </>
  );
}
