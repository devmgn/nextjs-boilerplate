import { useSuspenseQuery } from '@tanstack/react-query';
import { Box, Card, CardBody, CardHeader, List } from '@yamada-ui/react';
import axios from 'axios';

type Post = { id: number; title: string; body: string };

export const UserList: React.FC<{ queryKey: number }> = ({ queryKey }) => {
  const { data } = useSuspenseQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 500);
      });

      return axios
        .get<Post[]>('https://jsonplaceholder.typicode.com/posts')
        .then((res) => res.data);
    },
    select: (res) => [res[0], res[1]],
  });

  return (
    <Box p="2">
      <List>
        {data.map(({ id, title, body }) => (
          <Card key={id} as="li">
            <CardHeader>{title}</CardHeader>
            <CardBody>{body}</CardBody>
          </Card>
        ))}
      </List>
    </Box>
  );
};
