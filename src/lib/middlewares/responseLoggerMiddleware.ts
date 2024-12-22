import type { Middleware } from "./type";
import { logger } from "./utils/logger";

export const responseLoggerMiddleware: Middleware = (_req, _event, next) => {
  const response = next();
  const { status, type } = response;
  logger.info({ status, type }, "[RESPONSE]");
  return response;
};
