import type { NextRequest } from "next/server";

/**
 * Development logger that prints the request URL and method to the console.
 *
 * @param request - The request to log
 */
export function requestLogger(request: NextRequest) {
  const { url, method } = request;
  // Development proxy log. console.log is allowed only here
  // oxlint-disable-next-line no-console
  console.log("[REQUEST]", { url, method });
}
