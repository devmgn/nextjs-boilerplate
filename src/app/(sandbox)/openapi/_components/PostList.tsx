"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { postQueries } from "../../../../api/queries/post.queries";

export function PostList() {
  const { data } = useSuspenseQuery({ ...postQueries.getPosts() });

  return (
    <div>
      <h2 className="text-2xl">Post List</h2>
      <ul>
        {data.map((post) => (
          <li key={post.id}>{post.body}</li>
        ))}
      </ul>
    </div>
  );
}
