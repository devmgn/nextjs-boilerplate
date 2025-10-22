import { Hono } from "hono";
import { handle } from "hono/vercel";
import { NextResponse } from "next/server";
import { addCustomHeader } from "./lib/proxy/addCustomHeader";
import { requestLogger } from "./lib/proxy/requestLogger";
import { responseLogger } from "./lib/proxy/responseLogger";

const app = new Hono();

app.use(addCustomHeader).use(requestLogger).use(responseLogger);

app.all("*", (ctx) => {
  return NextResponse.next({ request: ctx.req.raw });
});

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

export default handle(app);
