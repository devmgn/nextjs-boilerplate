import { Suspense } from 'react';
import { Hydrator } from '@/components';
import { post } from '../components/getPost';
import { List } from '../components/List';

export default function ListRoute() {
  return (
    <Hydrator fetchQueryOptions={post.list()}>
      <Suspense>
        <List />
      </Suspense>
    </Hydrator>
  );
}
