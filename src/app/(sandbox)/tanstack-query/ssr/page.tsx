import NextLink from 'next/link';
import { Heading, Link, Text } from '@yamada-ui/react';
import { Hydrator } from '@/components';
import { queryFn, queryKey } from '../components/getPokemonList';
import { PokemonList } from '../components/PokemonList';
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
      <Hydrator fetchQueryOptions={{ queryKey, queryFn }}>
        <PokemonList />
      </Hydrator>
    </>
  );
};

export default Sandbox;
