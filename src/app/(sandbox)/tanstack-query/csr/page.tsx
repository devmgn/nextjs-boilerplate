import { Suspense } from 'react';
import NextLink from 'next/link';
import { Heading, Link, Text } from '@yamada-ui/react';
import { PokemonList } from '../components/PokemonList';
import type { NextPage } from 'next';

const Sandbox: NextPage = async () => {
  return (
    <>
      <Heading size="xl">CSR</Heading>
      <Text>
        <Link as={NextLink} href="/tanstack-query">
          Return
        </Link>
      </Text>
      <Suspense fallback="loading...">
        <PokemonList />
      </Suspense>
    </>
  );
};

export default Sandbox;
