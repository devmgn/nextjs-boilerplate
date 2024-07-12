import { Hydrator } from "@/components";
import Link from "next/link";
import { PokemonList } from "../components/PokemonList";
import { pokemon } from "../components/getPokemonList";

export default function Ssr() {
  return (
    <>
      <h2>SSR</h2>
      <p>
        <Link href="/tanstack-query">Return</Link>
      </p>
      <Hydrator fetchQueryOptions={pokemon.list()}>
        <PokemonList />
      </Hydrator>
    </>
  );
}
