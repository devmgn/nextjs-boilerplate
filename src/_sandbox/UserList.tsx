import { useSuspenseQuery } from '@tanstack/react-query';
import { DiscList, ListItem } from '@yamada-ui/react';
import axios from 'axios';
import { shuffle } from 'lodash-es';

export const UserList: React.FC<{ queryKey: number }> = ({ queryKey }) => {
  const { data } = useSuspenseQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      return axios
        .get<{ id: number; name: string }[]>(
          'https://jsonplaceholder.typicode.com/users',
        )
        .then((res) => shuffle(res.data));
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
