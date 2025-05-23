import type { MiddlewareHandler } from "hono";

export const responseLoggerMiddleware: MiddlewareHandler = async (
  ctx,
  next,
) => {
  await next();
  const { status, type } = ctx.res;
  // biome-ignore lint/suspicious/noConsole: logging
  console.log("[RESPONSE]", { status, type });
};
