import { PostModal } from '../../components/PostModal';

interface ParallelPageProps {
  params: {
    id: string;
  };
}

export default function ParallelPage(props: ParallelPageProps) {
  const {
    params: { id },
  } = props;

  return <PostModal id={id} />;
}
