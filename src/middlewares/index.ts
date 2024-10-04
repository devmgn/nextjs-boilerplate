import { createMiddlewareChain } from "@/lib";
import { addCustomHeaderMiddleware } from "./addCustomHeaderMiddleware";
import { requestLogMiddleware } from "./requestLogMiddleware";

export const middlewareChain = createMiddlewareChain(
  requestLogMiddleware,
  addCustomHeaderMiddleware,
);
