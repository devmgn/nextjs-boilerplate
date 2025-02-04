import { postQueries } from "../../../api/queries/post.queries";
import { Hydrator } from "../../../lib/Hydrator";
import { PostList } from "./_components/PostList";

export default function Page() {
  return (
    <Hydrator fetchQueryOptions={[postQueries.getPosts()]}>
      <PostList />
    </Hydrator>
  );
}
