import { useSuspenseQuery } from '@tanstack/react-query';
import { DiscList, ListItem } from '@yamada-ui/react';
import axios from 'axios';

export const Fetcher: React.FC<{ queryKey: number }> = ({ queryKey }) => {
  const { data } = useSuspenseQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      // sleep
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });

      return axios
        .get<{ id: number; name: string }[]>(
          'https://jsonplaceholder.typicode.com/users',
        )
        .then((res) => res.data);
    },
  });

  return (
    <DiscList>
      {data.map(({ id, name }) => (
        <ListItem key={id}>{name}</ListItem>
      ))}
    </DiscList>
  );
};
