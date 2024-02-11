import { Suspense } from 'react';
import Link from 'next/link';
import { PokemonList } from '../components/PokemonList';
import type { NextPage } from 'next';

const Sandbox: NextPage = async () => {
  return (
    <>
      <h1 className="text-2xl font-bold">CSR</h1>
      <p>
        <Link className="text-blue-500 hover:underline" href="/tanstack-query">
          Return
        </Link>
      </p>
      <Suspense fallback="loading...">
        <PokemonList />
      </Suspense>
    </>
  );
};

export default Sandbox;
