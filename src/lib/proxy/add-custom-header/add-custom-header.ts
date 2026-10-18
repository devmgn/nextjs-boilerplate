import type { NextResponse } from "next/server";

/**
 * Adds a request ID (`x-request-id`) header to the response.
 *
 * @param response - The response to add the header to
 */
export function addCustomHeader(response: NextResponse) {
  response.headers.set("x-request-id", crypto.randomUUID());
}
