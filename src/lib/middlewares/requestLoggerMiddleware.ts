import type { Middleware } from "./type";
import { logger } from "./utils/logger";

export const requestLoggerMiddleware: Middleware = (req, _event, next) => {
  const { url, method } = req;
  logger.info({ url, method }, "[REQUEST]");
  return next();
};
