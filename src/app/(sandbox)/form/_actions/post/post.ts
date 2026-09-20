"use server";

import type { PostSchema } from "../../_lib/post-schema";
import { apiClient } from "../../../../../api/api-client";

// 第 1 引数は useActionState が持ち回す状態。この action は結果を保持しないため
// 常に null を受け取り、null を返す。
export async function post(_prevState: null, data: PostSchema): Promise<null> {
  await apiClient.postsPost({ post: data });
  return null;
}
