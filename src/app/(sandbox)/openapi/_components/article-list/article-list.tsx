"use client";

import type { GetArticlesParams } from "../../../../../api/openapi/model/get-articles-params";
import { useGetArticlesSuspense } from "../../../../../api/openapi/articles/articles";

interface Props {
  /** Prefetch 側と同じ値を渡し、同じ query key のキャッシュを読む */
  params: GetArticlesParams;
}

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
