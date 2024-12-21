import { createMiddlewareChain } from "../lib/createMiddlewareChain";
import { addCustomHeaderMiddleware } from "./addCustomHeaderMiddleware";
import { requestLogMiddleware } from "./requestLogMiddleware";

export const middlewareChain = createMiddlewareChain(
  requestLogMiddleware,
  addCustomHeaderMiddleware,
);
