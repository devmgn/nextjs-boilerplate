import { PostList } from "./_components/PostList";
import { getPostsQueryOptions } from "../../../api/queries/post.queries";
import { Hydrator } from "../../../lib/Hydrator";

export default function Page() {
  return (
    <Hydrator fetchQueryOptions={[getPostsQueryOptions()]}>
      <PostList />
    </Hydrator>
  );
}
