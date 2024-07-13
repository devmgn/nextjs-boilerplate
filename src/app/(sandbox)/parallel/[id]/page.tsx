import { Hydrator } from "@/components";
import { PostModal } from "../components/PostModal";
import { post } from "../components/getPost";

interface DynamicPageProps {
  params: {
    id: string;
  };
}

export default function DynamicPage(props: DynamicPageProps) {
  const {
    params: { id },
  } = props;

  return (
    <Hydrator fetchQueryOptions={post.item(id)}>
      <PostModal id={id} />
    </Hydrator>
  );
}
