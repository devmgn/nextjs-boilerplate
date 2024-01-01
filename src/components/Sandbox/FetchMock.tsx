import { useSuspenseQuery } from '@tanstack/react-query';
import { Text } from '@yamada-ui/react';
import { apiClient } from '@/utils';

export const FetchMock: React.FC<{ queryKey: number }> = ({ queryKey }) => {
  const { data } = useSuspenseQuery({
    queryKey: [queryKey],
    queryFn: () =>
      apiClient.get<string>('https://hub.dummyapis.com/delay', {
        params: { seconds: 2 },
      }),
  });

  return <Text>{data && data}</Text>;
};
