"use server";

import { apiClient } from "../../../api/apiClient";
import type { PostSchema } from "./schema";

export async function post(_: unknown, data: PostSchema) {
  await apiClient.postsPost({ post: data });
}
