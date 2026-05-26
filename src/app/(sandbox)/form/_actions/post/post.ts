"use server";

import type { PostSchema } from "../../_lib/postSchema";
import { apiClient } from "../../../../../api/apiClient";

export async function post(_: unknown, data: PostSchema) {
  await apiClient.postsPost({ post: data });
}
