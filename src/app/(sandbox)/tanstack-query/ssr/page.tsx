import NextLink from 'next/link';
import { Heading, Link, Text } from '@yamada-ui/react';
import { HydrationBoundary } from '@/components/PrefetchQuery';
import { queryFn, queryKey } from '../components/getPokemonList';
import { PokemonList } from '../components/PokemonList';
import type { PokemonListResponse } from '../components/getPokemonList';
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
      <HydrationBoundary<
        PokemonListResponse,
        Error,
        PokemonListResponse,
        string[]
      >
        fetchQueryOptions={{ queryKey, queryFn }}
      >
        <PokemonList />
      </HydrationBoundary>
    </>
  );
};

export default Sandbox;
