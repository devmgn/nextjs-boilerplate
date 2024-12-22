import type { Middleware } from "./type";

export const addCustomHeaderMiddleware: Middleware = (_req, _event, next) => {
  const requestUuid = crypto.randomUUID();
  const response = next();
  response.headers.set("x-request-id", requestUuid);

  return response;
};
