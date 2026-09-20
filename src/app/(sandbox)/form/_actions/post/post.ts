"use server";

import type { PostSchema } from "../../_lib/post-schema";
import { apiClient } from "../../../../../api/api-client";

export async function post(_: unknown, data: PostSchema) {
  await apiClient.postsPost({ post: data });
}
