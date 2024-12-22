import { Hydrator } from "../../../../lib/Hydrator";
import { PostModal } from "../components/PostModal";
import { post } from "../components/getPost";

interface DynamicPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function DynamicPage(props: DynamicPageProps) {
  const { id } = await props.params;

  return (
    <Hydrator fetchQueryOptions={[post.item(id)]}>
      <PostModal id={id} />
    </Hydrator>
  );
}
