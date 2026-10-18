import { Suspense } from "react";
import { ArticleListContainer } from "./_components/article-list-container";
import { Spinner } from "../../../components/spinner";

/**
 * OpenAPI クライアント経由で取得した記事一覧を表示するサンドボックスページ。
 *
 * @returns 読み込み中はスピナーを出す記事一覧
 */
export default function Page() {
  return (
    <Suspense fallback={<Spinner />}>
      <ArticleListContainer />
    </Suspense>
  );
}
