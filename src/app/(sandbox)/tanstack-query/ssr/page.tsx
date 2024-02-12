import Link from 'next/link';
import { Hydrator } from '@/components';
import { queryFn, queryKey } from '../components/getPokemonList';
import { PokemonList } from '../components/PokemonList';
import type { NextPage } from 'next';

const Sandbox: NextPage = () => {
  return (
    <>
      <h2>SSR</h2>
      <p>
        <Link href="/tanstack-query">Return</Link>
      </p>
      <Hydrator fetchQueryOptions={{ queryKey, queryFn }}>
        <PokemonList />
      </Hydrator>
    </>
  );
};

export default Sandbox;
