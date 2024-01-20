import NextLink from 'next/link';
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { Heading, Link, Text } from '@yamada-ui/react';
import { queryFn, queryKey } from '@/_sandbox/getPokemonList';
import { PokemonList } from '@/_sandbox/PokemonList';
import type { NextPage } from 'next';

const Sandbox: NextPage = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({ queryKey, queryFn });

  return (
    <>
      <Heading size="xl">SSR</Heading>
      <Text>
        <Link as={NextLink} href="/tanstack-query">
          Return
        </Link>
      </Text>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PokemonList />
      </HydrationBoundary>
    </>
  );
};

export default Sandbox;
