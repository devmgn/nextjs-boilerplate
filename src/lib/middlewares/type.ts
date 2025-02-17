import type { NextFetchEvent, NextRequest, NextResponse } from "next/server";

export type Middleware = (
  req: NextRequest,
  event: NextFetchEvent,
  next: () => Promise<NextResponse>,
) => Promise<NextResponse>;
