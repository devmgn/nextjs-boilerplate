import type { MiddlewareHandler } from "hono";

export const requestLoggerMiddleware: MiddlewareHandler = async (ctx, next) => {
  await next();
  const { url, method } = ctx.req;
  // biome-ignore lint/suspicious/noConsole: logging
  console.log("[REQUEST]", { url, method });
};
