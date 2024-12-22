import { Suspense } from "react";
import { Hydrator } from "../../../../lib/Hydrator";
import { List } from "../components/List";
import { post } from "../components/getPost";

export default function ListRoute() {
  return (
    <Hydrator fetchQueryOptions={[post.list()]}>
      <Suspense>
        <List />
      </Suspense>
    </Hydrator>
  );
}
