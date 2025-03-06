import { Hono } from "hono";
import { handle } from "hono/vercel";
import { NextResponse } from "next/server";
import { addCustomHeaderMiddleware } from "./lib/middlewares/addCustomHeaderMiddleware";
import { requestLoggerMiddleware } from "./lib/middlewares/requestLoggerMiddleware";
import { responseLoggerMiddleware } from "./lib/middlewares/responseLoggerMiddleware";

const app = new Hono();

app
  .use(addCustomHeaderMiddleware)
  .use(requestLoggerMiddleware)
  .use(responseLoggerMiddleware);

app.all("*", (ctx) => {
  return NextResponse.next({ request: ctx.req.raw });
});

export const middleware = handle(app);

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
