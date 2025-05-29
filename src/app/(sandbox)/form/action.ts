"use server";

import { parseWithZod } from "@conform-to/zod/v4";
import { apiClient } from "../../../api/apiClient";
import { postSchema } from "./schema";

export async function post(_: unknown, formData: FormData) {
  const submission = parseWithZod(formData, {
    schema: postSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  await apiClient.postsPost({ post: submission.payload });
}
