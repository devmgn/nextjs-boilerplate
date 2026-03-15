import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { addCustomHeader } from "./lib/proxy/addCustomHeader";
import { requestLogger } from "./lib/proxy/requestLogger";
import { responseLogger } from "./lib/proxy/responseLogger";

export function proxy(request: NextRequest) {
  const response = NextResponse.next({
    request: { headers: new Headers(request.headers) },
  });

  addCustomHeader(response);
  requestLogger(request);
  responseLogger(response);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|images/favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
