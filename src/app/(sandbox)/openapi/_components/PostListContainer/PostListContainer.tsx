import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { connection } from "next/server";
import { getPostsQueryOptions } from "../../../../../api/queries/post";
import { getQueryClient } from "../../../../../lib/getQueryClient";
import { PostList } from "../PostList";

/**
 * Server Component 側で prefetch し、dehydrate した state をクライアントへ引き渡す。
 *
 * `dehydrate()` の結果には `dataUpdatedAt: Date.now()` が含まれ、Cache Components の
 * prerender では不安定値として弾かれる。`connection()` でリクエスト時レンダリングを
 * 宣言し、呼び出し側の `<Suspense>` で static shell と切り離す。
 */
export async function PostListContainer() {
  await connection();

  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(getPostsQueryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostList />
    </HydrationBoundary>
  );
}
