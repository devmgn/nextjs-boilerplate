import type { Middleware } from "@/types";
import type { NextResponse } from "next/server";

/**
 * middleware 関数を順番に実行するミドルウェアを作成する
 */
export const createMiddlewareChain =
  (...middlewares: Middleware[]): Middleware =>
  (req, event, next) => {
    const execMiddleware = (index = 0): NextResponse =>
      middlewares[index]
        ? middlewares[index](req, event, () => execMiddleware(index + 1))
        : next();

    return execMiddleware();
  };
