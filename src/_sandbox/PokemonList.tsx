'use client';

import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { Box, Button, Card, Flex, List, Loading, Text } from '@yamada-ui/react';
import axios from 'axios';
import type { BoxProps } from '@yamada-ui/react';

type PokemonListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Pokemon[];
};

type Pokemon = {
  name: string;
  url: string;
};

export const PokemonList: React.FC<BoxProps> = (props) => {
  const queryKey = ['fetchPokemonList'];
  const { data, isFetching } = useSuspenseQuery({
    queryKey,
    queryFn: () =>
      axios
        .get<PokemonListResponse>('https://pokeapi.co/api/v2/pokemon', {
          params: { limit: 5 },
        })
        .then((res) => res.data),
  });

  const queryClient = useQueryClient();
  const onClickPagination = (url: string) => {
    return () => {
      if (!url) return;

      queryClient.fetchQuery({
        queryKey,
        queryFn: () =>
          axios.get<PokemonListResponse>(url).then((res) => res.data),
      });
    };
  };

  return (
    <Box p="2" {...props}>
      <Flex gap="2" alignItems="center">
        <Button
          onClick={onClickPagination(data.previous ?? '')}
          disabled={!data.previous}
        >
          Prev
        </Button>
        <Button
          onClick={onClickPagination(data.next ?? '')}
          disabled={!data.next}
        >
          Next
        </Button>
        {isFetching && <Loading size="2xl" />}
      </Flex>
      <Text mt="2">Results: {data.count}</Text>
      <List mt="2">
        {data.results.map(({ name, url }) => (
          <Card key={url} as="li">
            {name}
          </Card>
        ))}
      </List>
    </Box>
  );
};
