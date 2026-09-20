import { Suspense } from "react";
import { PostListContainer } from "./_components/post-list-container";
import { Spinner } from "../../../components/spinner";

export default function Page() {
  return (
    <Suspense fallback={<Spinner />}>
      <PostListContainer />
    </Suspense>
  );
}
