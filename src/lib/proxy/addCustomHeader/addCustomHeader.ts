import type { NextResponse } from "next/server";

export function addCustomHeader(response: NextResponse) {
  response.headers.set("x-request-id", crypto.randomUUID());
}
