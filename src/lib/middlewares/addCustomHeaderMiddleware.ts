import type { Context, Next } from "hono";

export async function addCustomHeaderMiddleware(ctx: Context, next: Next) {
  await next();
  const requestUuid = crypto.randomUUID();
  ctx.header("x-request-id", requestUuid);
}
