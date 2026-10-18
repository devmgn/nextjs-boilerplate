"use server";

import type { ArticleSchema } from "../../_lib/article-schema";
import { isApiError } from "../../../../../api/api-client";
import { createArticle as createArticleApi } from "../../../../../api/openapi/articles/articles";
import { articleSchema } from "../../_lib/article-schema";

export type CreateArticleState = { ok: boolean; message: string } | null;

// 上流の応答本文は内部情報を含みうるため画面に出さず、ステータスに応じた固定文言にする
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

// 第 1 引数は useActionState が持ち回す前回の状態。
// RealWorld の記事作成は認証が必要なため、トークンなしでは 401 が返る（エラー表示のデモになる）。
export async function createArticle(
  _prevState: CreateArticleState,
  data: ArticleSchema
): Promise<CreateArticleState> {
  // server action は直接 POST できる公開エンドポイントなので、クライアントの検証に頼らず再検証する
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

    // fetch は通信失敗（DNS・接続断・CORS など）を TypeError で reject する。
    // それ以外は想定外のバグなので握りつぶさず error boundary に上げる
    if (error instanceof TypeError) {
      return { ok: false, message: "Network error" };
    }

    throw error;
  }
}
