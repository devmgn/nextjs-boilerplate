import { useSuspenseQuery } from '@tanstack/react-query';
import { DiscList, ListItem } from '@yamada-ui/react';
import { shuffle } from 'lodash-es';
import { apiClient } from '@/utils';

export const FetchMock: React.FC<{ queryKey: number }> = ({ queryKey }) => {
  const { data } = useSuspenseQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const response = await apiClient.get<{ name: string }[]>(
        'https://jsonplaceholder.typicode.com/users',
      );

      return queryKey > 0 ? shuffle(response) : response;
    },
  });

  return (
    <DiscList>
      {data?.map((d) => <ListItem key={d.name}>{d.name}</ListItem>)}
    </DiscList>
  );
};
