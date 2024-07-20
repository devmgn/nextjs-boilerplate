import Link from "next/link";
import { Suspense } from "react";
import { PokemonList } from "../components/pokemonList";

export default function Csr() {
  return (
    <>
      <h2>CSR</h2>
      <p>
        <Link href="/tanstack-query">Return</Link>
      </p>
      <Suspense fallback="loading...">
        <PokemonList />
      </Suspense>
    </>
  );
}
