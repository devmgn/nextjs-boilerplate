import { Suspense } from "react";
import { ArticleListContainer } from "./_components/article-list-container";
import { Spinner } from "../../../components/spinner";

export default function Page() {
  return (
    <Suspense fallback={<Spinner />}>
      <ArticleListContainer />
    </Suspense>
  );
}
