"use client";

import type { GetArticlesParams } from "../../../../../api/openapi/model/get-articles-params";
import { useGetArticlesSuspense } from "../../../../../api/openapi/articles/articles";

interface Props {
  /**
   * Pass the same value as the prefetch to read the cache under the same query
   * key
   */
  params: GetArticlesParams;
}

/**
 * Reads the article list from the prefetched cache and renders it.
 *
 * @param props - Query parameters for fetching the list
 * @returns The article count and the list of articles
 */
export function ArticleList({ params }: Props) {
  const { data } = useGetArticlesSuspense(params);

  return (
    <div>
      <h2 className="text-2xl">Articles ({data.articlesCount})</h2>
      <ul aria-label="Articles">
        {data.articles.map((article) => (
          <li key={article.slug}>
            <p>{article.title}</p>
            <p>
              by {article.author.username} · ♥ {article.favoritesCount}
            </p>
            <p>{article.tagList.map((tag) => `#${tag}`).join(" ")}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
