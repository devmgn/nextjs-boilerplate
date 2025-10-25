import type { Context, Next } from "hono";

export async function requestLogger(ctx: Context, next: Next) {
  await next();
  const { url, method } = ctx.req;
  // biome-ignore lint/suspicious/noConsole: logging
  console.log("[REQUEST]", { url, method });
}
