import type { MiddlewareHandler } from "hono";

export const addCustomHeaderMiddleware: MiddlewareHandler = async (
  ctx,
  next,
) => {
  await next();
  const requestUuid = crypto.randomUUID();
  ctx.header("x-request-id", requestUuid);
};
