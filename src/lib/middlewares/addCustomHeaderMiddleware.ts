import type { Middleware } from "./type";

export const addCustomHeaderMiddleware: Middleware = async (
  _req,
  _event,
  next,
) => {
  const requestUuid = crypto.randomUUID();
  const response = await next();
  response.headers.set("x-request-id", requestUuid);

  return response;
};
