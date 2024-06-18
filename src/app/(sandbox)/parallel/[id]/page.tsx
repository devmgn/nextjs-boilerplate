import { Suspense } from 'react';
import { PostModal } from '../components/PostModal';

interface ParallelPageProps {
  params: {
    id: string;
  };
}

export default function ParallelPage(props: ParallelPageProps) {
  const {
    params: { id },
  } = props;

  return (
    <Suspense fallback="loading...">
      <PostModal id={id} />
    </Suspense>
  );
}
