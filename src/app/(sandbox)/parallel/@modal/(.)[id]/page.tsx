import { PostModal } from '../../components/PostModal';

interface ModalRouteProps {
  params: {
    id: string;
  };
}

export default function ModalRoute(props: ModalRouteProps) {
  const {
    params: { id },
  } = props;

  return <PostModal id={id} isIntercepted />;
}
