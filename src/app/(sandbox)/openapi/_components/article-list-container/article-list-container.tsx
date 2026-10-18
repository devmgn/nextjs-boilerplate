import type { GetArticlesParams } from "../../../../../api/openapi/model/get-articles-params";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { connection } from "next/server";
import { getGetArticlesSuspenseQueryOptions } from "../../../../../api/openapi/articles/articles";
import { getQueryClient } from "../../../../../lib/get-query-client";
import { ArticleList } from "../article-list";

const params: GetArticlesParams = { limit: 10 };

/**
 * Server Component 側で prefetch し、dehydrate した state をクライアントへ引き渡す。
 *
 * `dehydrate()` の結果には `dataUpdatedAt: Date.now()` が含まれ、Cache Components の
 * prerender では不安定値として弾かれる。`connection()` でリクエスト時レンダリングを
 * 宣言し、呼び出し側の `<Suspense>` で static shell と切り離す。
 *
 * @returns Prefetch した state を引き渡す HydrationBoundary で包んだ記事一覧
 */
export async function ArticleListContainer() {
  await connection();

  const queryClient = getQueryClient();

  void (async () => {
    try {
      await queryClient.query(getGetArticlesSuspenseQueryOptions(params));
    } catch {
      // prefetch 失敗はクライアント側の useSuspenseQuery で再取得・エラー処理される
    }
  })();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ArticleList params={params} />
    </HydrationBoundary>
  );
}
