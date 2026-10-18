import type { NextResponse } from "next/server";

/**
 * レスポンスにリクエスト ID（`x-request-id`）ヘッダーを付与する。
 *
 * @param response - ヘッダーを付与するレスポンス
 */
export function addCustomHeader(response: NextResponse) {
  response.headers.set("x-request-id", crypto.randomUUID());
}
