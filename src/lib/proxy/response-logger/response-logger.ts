import type { NextResponse } from "next/server";

export function responseLogger(response: NextResponse) {
  const { status } = response;
  const type = response.headers.get("content-type");
  // 開発用の proxy ログ。ここだけ console.log を許可する
  // oxlint-disable-next-line no-console
  console.log("[RESPONSE]", { status, type });
}
