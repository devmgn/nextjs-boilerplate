import { addCustomHeaderMiddleware } from "./addCustomHeaderMiddleware";
import { requestLoggerMiddleware } from "./requestLoggerMiddleware";
import { responseLoggerMiddleware } from "./responseLoggerMiddleware";
import { createMiddlewareChain } from "./utils/createMiddlewareChain";

export const middlewareChain = createMiddlewareChain(
  requestLoggerMiddleware,
  responseLoggerMiddleware,
  addCustomHeaderMiddleware,
);
