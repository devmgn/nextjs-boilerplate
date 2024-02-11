import Link from 'next/link';
import { Hydrator } from '@/components';
import { queryFn, queryKey } from '../components/getPokemonList';
import { PokemonList } from '../components/PokemonList';
import type { NextPage } from 'next';

const Sandbox: NextPage = () => {
  return (
    <>
      <h1 className="text-2xl font-bold">SSR</h1>
      <p>
        <Link className="text-blue-500 hover:underline" href="/tanstack-query">
          Return
        </Link>
      </p>
      <Hydrator fetchQueryOptions={{ queryKey, queryFn }}>
        <PokemonList />
      </Hydrator>
    </>
  );
};

export default Sandbox;
