"use server";

import type { ArticleSchema } from "../../_lib/article-schema";
import { isApiError } from "../../../../../api/api-client";
import { createArticle as createArticleApi } from "../../../../../api/openapi/articles/articles";
import { articleSchema } from "../../_lib/article-schema";

/** Result of the create-article action. `null` before submission */
export type CreateArticleState = { ok: boolean; message: string } | null;

// The upstream body may contain internal details, so show a fixed message per status instead
function toErrorMessage(status: number): string {
  switch (status) {
    case 401: {
      return "Login required";
    }

    case 422: {
      return "Validation failed";
    }

    default: {
      return `Request failed (${status})`;
    }
  }
}

/**
 * Server action that revalidates the input and creates an article via the
 * RealWorld API. Creating articles on RealWorld requires auth, so without a
 * token it returns 401 (demonstrating the error display).
 *
 * @param _prevState - The previous state carried over by useActionState
 * @param data - The form input values
 * @returns Whether creation succeeded, and the message to display
 */
export async function createArticle(
  _prevState: CreateArticleState,
  data: ArticleSchema
): Promise<CreateArticleState> {
  // Server actions are public endpoints that accept direct POSTs, so revalidate instead of trusting the client
  const parsed = articleSchema.safeParse(data);

  if (!parsed.success) {
    return { ok: false, message: "Invalid input" };
  }

  const { title, description, body, tags } = parsed.data;

  const tagList = tags
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag !== "");

  try {
    const { article } = await createArticleApi({
      article: {
        title,
        description,
        body,
        tagList,
      },
    });

    return { ok: true, message: `Created: ${article.slug}` };
  } catch (error) {
    if (isApiError(error)) {
      return { ok: false, message: toErrorMessage(error.status) };
    }

    // fetch rejects network failures (DNS, dropped connections, CORS, etc.) with a TypeError.
    // Anything else is an unexpected bug, so rethrow it to the error boundary instead of swallowing it
    if (error instanceof TypeError) {
      return { ok: false, message: "Network error" };
    }

    throw error;
  }
}
