import { Suspense } from 'react';
import Link from 'next/link';
import { PokemonList } from '../components/PokemonList';
import type { NextPage } from 'next';

const Sandbox: NextPage = () => {
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
};

export default Sandbox;
