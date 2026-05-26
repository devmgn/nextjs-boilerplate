import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { PostList } from "./_components/PostList";
import { getPostsQueryOptions } from "../../../api/queries/post";
import { getQueryClient } from "../../../lib/getQueryClient";

export default function Page() {
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(getPostsQueryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostList />
    </HydrationBoundary>
  );
}
