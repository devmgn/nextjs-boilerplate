'use client';

import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { Box, Button, Card, Flex, List, Loading, Text } from '@yamada-ui/react';
import axios from 'axios';
import { useUnmount } from 'react-use';
import { queryFn, queryKey } from './getPokemonList';
import type { BoxProps } from '@yamada-ui/react';

export const PokemonList: React.FC<BoxProps> = (props) => {
  const { data, isFetching } = useSuspenseQuery({
    queryKey,
    queryFn,
  });

  const queryClient = useQueryClient();
  const onClickPagination = (url: string | null) => {
    return () => {
      if (!url) return;
      queryClient.fetchQuery({
        queryKey,
        queryFn: () => axios.get(url).then((res) => res.data),
      });
    };
  };

  useUnmount(() => {
    queryClient.removeQueries({ queryKey });
  });

  return (
    <Box p="2" {...props}>
      <Flex gap="2" alignItems="center">
        <Button
          onClick={onClickPagination(data.previous)}
          disabled={!data.previous || isFetching}
        >
          Prev
        </Button>
        <Button
          onClick={onClickPagination(data.next)}
          disabled={!data.next || isFetching}
        >
          Next
        </Button>
        {isFetching && <Loading size="2xl" />}
      </Flex>
      <Text mt="2">Results: {data.count}</Text>
      <List
        mt="2"
        display="grid"
        gridTemplateColumns="repeat(auto-fit, minmax(296px, 1fr))"
        gap="4"
      >
        {data.results.map(({ name, url }) => (
          <Card key={url} as="li" p="2">
            {name}
          </Card>
        ))}
      </List>
    </Box>
  );
};

PokemonList.displayName = 'PokemonList';
