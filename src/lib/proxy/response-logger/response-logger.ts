import type { NextResponse } from "next/server";

export function responseLogger(response: NextResponse) {
  const { status } = response;
  const type = response.headers.get("content-type");
  // oxlint-disable-next-line no-console
  console.log("[RESPONSE]", { status, type });
}
