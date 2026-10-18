import type { GetArticlesParams } from "../../../../../api/openapi/model/get-articles-params";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { connection } from "next/server";
import { getGetArticlesSuspenseQueryOptions } from "../../../../../api/openapi/articles/articles";
import { getQueryClient } from "../../../../../lib/get-query-client";
import { ArticleList } from "../article-list";

const params: GetArticlesParams = { limit: 10 };

/**
 * Prefetches in the Server Component and hands the dehydrated state to the
 * client.
 *
 * The result of `dehydrate()` includes `dataUpdatedAt: Date.now()`, which Cache
 * Components prerendering rejects as a non-deterministic value. `connection()`
 * opts into request-time rendering, and the caller's `<Suspense>` separates it
 * from the static shell.
 *
 * @returns The article list wrapped in a HydrationBoundary that passes on the
 *   prefetched state
 */
export async function ArticleListContainer() {
  await connection();

  const queryClient = getQueryClient();

  void (async () => {
    try {
      await queryClient.query(getGetArticlesSuspenseQueryOptions(params));
    } catch {
      // Prefetch failures are refetched and handled by useSuspenseQuery on the client
    }
  })();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ArticleList params={params} />
    </HydrationBoundary>
  );
}
