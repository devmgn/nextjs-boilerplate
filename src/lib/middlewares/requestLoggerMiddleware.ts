import type { Middleware } from "./type";

export const requestLoggerMiddleware: Middleware = (req, _event, next) => {
  const { url, method } = req;
  // biome-ignore lint/suspicious/noConsole: <explanation>
  console.log("[REQUEST]", { url, method });
  return next();
};
