import { Suspense } from "react";
import { PostListContainer } from "./_components/PostListContainer";
import { Spinner } from "../../../components/Spinner";

export default function Page() {
  return (
    <Suspense fallback={<Spinner />}>
      <PostListContainer />
    </Suspense>
  );
}
