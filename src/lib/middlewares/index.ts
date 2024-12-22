import { addCustomHeaderMiddleware } from "./addCustomHeaderMiddleware";
import { requestLogMiddleware } from "./requestLogMiddleware";
import { createMiddlewareChain } from "./utils/createMiddlewareChain";

export const middlewareChain = createMiddlewareChain(
  requestLogMiddleware,
  addCustomHeaderMiddleware,
);
