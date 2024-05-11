import Link from 'next/link';
import { Hydrator } from '@/components';
import { pokemon } from '../components/getPokemonList';
import { PokemonList } from '../components/PokemonList';
import type { NextPage } from 'next';

const Sandbox: NextPage = () => {
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
};

export default Sandbox;
