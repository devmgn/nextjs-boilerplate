"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";
import { post } from "./getPost";

export function List() {
  const { data } = useSuspenseQuery(post.list());

  return (
    <ul>
      {data.map((item) => (
        <li key={item.id}>
          <Link href={`/parallel/${item.id.toString()}`} scroll={false}>
            {item.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}
