import { Suspense } from "react";
import { ArticleListContainer } from "./_components/article-list-container";
import { Spinner } from "../../../components/spinner";

/**
 * Sandbox page that shows articles fetched via the OpenAPI client.
 *
 * @returns The article list, with a spinner while loading
 */
export default function Page() {
  return (
    <Suspense fallback={<Spinner />}>
      <ArticleListContainer />
    </Suspense>
  );
}
