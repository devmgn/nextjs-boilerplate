import type { Middleware } from "./type";

export const responseLoggerMiddleware: Middleware = async (
  _req,
  _event,
  next,
) => {
  const response = await next();
  const { status, type } = response;
  // biome-ignore lint/suspicious/noConsole: <explanation>
  console.log("[RESPONSE]", { status, type });
  return response;
};
