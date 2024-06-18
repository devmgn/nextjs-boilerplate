import { Suspense } from 'react';
import { List } from '../components/List';

export default function ListPage() {
  return (
    <Suspense>
      <List />
    </Suspense>
  );
}
