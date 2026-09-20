import type { NextRequest } from "next/server";

export function requestLogger(request: NextRequest) {
  const { url, method } = request;
  // 開発用の proxy ログ。ここだけ console.log を許可する
  // oxlint-disable-next-line no-console
  console.log("[REQUEST]", { url, method });
}
