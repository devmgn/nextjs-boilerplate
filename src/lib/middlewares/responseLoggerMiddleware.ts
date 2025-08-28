import type { Context, Next } from "hono";

export async function responseLoggerMiddleware(ctx: Context, next: Next) {
  await next();
  const { status, type } = ctx.res;
  // biome-ignore lint/suspicious/noConsole: logging
  console.log("[RESPONSE]", { status, type });
}
