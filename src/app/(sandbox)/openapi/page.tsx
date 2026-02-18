import { PostList } from "./_components/PostList";
import { postQueries } from "../../../api/queries/post.queries";
import { Hydrator } from "../../../lib/Hydrator";

export default function Page() {
  return (
    <Hydrator fetchQueryOptions={[postQueries.getPosts()]}>
      <PostList />
    </Hydrator>
  );
}
