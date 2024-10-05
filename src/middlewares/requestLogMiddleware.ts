import type { Middleware } from "@/types";

export const requestLogMiddleware: Middleware = (req, _event, next) => {
  const response = next();
  // biome-ignore lint/suspicious/noConsole: <explanation>
  console.log(
    `[Request ]     ${req.method}: ${req.url} | STATUS: ${response.status}`,
  );

  return response;
};
