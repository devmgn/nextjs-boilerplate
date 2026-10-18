import type { NextResponse } from "next/server";

/**
 * Development logger that prints the response status and Content-Type to the
 * console.
 *
 * @param response - The response to log
 */
export function responseLogger(response: NextResponse) {
  const { status } = response;
  const type = response.headers.get("content-type");
  // Development proxy log. console.log is allowed only here
  // oxlint-disable-next-line no-console
  console.log("[RESPONSE]", { status, type });
}
