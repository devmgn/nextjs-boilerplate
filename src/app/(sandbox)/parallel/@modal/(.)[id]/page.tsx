import { PostModal } from "../../components/PostModal";

interface ModalRouteProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ModalRoute(props: ModalRouteProps) {
  const { id } = await props.params;

  return <PostModal id={id} isIntercepted={true} />;
}
