"use server";

import type { PostSchema } from "../../_lib/post-schema";
import { apiClient } from "../../../../../api/api-client";

// useActionState が持ち回す状態。この action は結果を保持しないため常に null。
type PostActionState = null;

export async function post(
  _prevState: PostActionState,
  data: PostSchema
): Promise<PostActionState> {
  await apiClient.postsPost({ post: data });
  return null;
}
