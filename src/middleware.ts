import {
  type NextFetchEvent,
  type NextRequest,
  NextResponse,
} from "next/server";
import { middlewareChain } from "./lib/middlewares";

export const middleware = (req: NextRequest, event: NextFetchEvent) => {
  const next = () => NextResponse.next();

  return middlewareChain(req, event, next);
};

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
