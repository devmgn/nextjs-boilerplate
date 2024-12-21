import type { Middleware } from "../types/middleware";

export const addCustomHeaderMiddleware: Middleware = (_req, _event, next) => {
  const requestUuid = crypto.randomUUID();
  const response = next();
  response.headers.set("x-request-id", requestUuid);

  return response;
};
