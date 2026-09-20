import type { NextRequest } from "next/server";

export function requestLogger(request: NextRequest) {
  const { url, method } = request;
  // oxlint-disable-next-line no-console
  console.log("[REQUEST]", { url, method });
}
