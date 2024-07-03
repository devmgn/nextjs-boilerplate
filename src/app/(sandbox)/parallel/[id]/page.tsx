import { Hydrator } from '@/components';
import { post } from '../components/getPost';
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
    <Hydrator fetchQueryOptions={post.item(id)}>
      <PostModal id={id} />
    </Hydrator>
  );
}
