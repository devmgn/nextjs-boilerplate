import type { Context, Next } from "hono";

export async function responseLogger(ctx: Context, next: Next) {
  await next();
  const { status, type } = ctx.res;
  // oxlint-disable-next-line no-console
  console.log("[RESPONSE]", { status, type });
}
