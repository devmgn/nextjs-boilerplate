import NextLink from 'next/link';
import { Heading, Link, Text } from '@yamada-ui/react';
import { queryFn, queryKey } from '../components/getPokemonList';
import { PokemonList } from '../components/PokemonList';
import { PrefetchQuery } from '../components/PrefetchQuery';
import type { NextPage } from 'next';

const Sandbox: NextPage = () => {
  return (
    <>
      <Heading size="xl">SSR</Heading>
      <Text>
        <Link as={NextLink} href="/tanstack-query">
          Return
        </Link>
      </Text>
      <PrefetchQuery prefetchQueryOptions={{ queryKey, queryFn }}>
        <PokemonList />
      </PrefetchQuery>
    </>
  );
};

export default Sandbox;
