import type { NextResponse } from "next/server";
import type { Middleware } from "../../type";
/**
 * middleware 関数を順番に実行するミドルウェアを作成する
 */
export const createMiddlewareChain =
  (...middlewares: Middleware[]): Middleware =>
  async (req, event, next) => {
    const execMiddleware = (index = 0): Promise<NextResponse> =>
      middlewares[index]
        ? middlewares[index](req, event, () => execMiddleware(index + 1))
        : next();

    return await execMiddleware();
  };
