import type { Context, Next } from "hono";

export async function requestLogger(ctx: Context, next: Next) {
  await next();
  const { url, method } = ctx.req;
  // oxlint-disable-next-line no-console
  console.log("[REQUEST]", { url, method });
}
