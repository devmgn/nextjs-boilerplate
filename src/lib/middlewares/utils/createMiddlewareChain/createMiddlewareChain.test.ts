import type { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { createMiddlewareChain } from "./index";

describe("createMiddlewareChain", () => {
  const mockNextRequest = {} as NextRequest;
  const mockNextEvent = {} as NextFetchEvent;
  const mockNextResponse = Promise.resolve({} as NextResponse);

  it("ミドルウェアが順番通りに実行されること", () => {
    const middleware1 = vi.fn((_req, _event, next) => next());
    const middleware2 = vi.fn((_req, _event, next) => next());
    const middleware3 = vi.fn((_req, _event, next) => next());

    const chain = createMiddlewareChain(middleware1, middleware2, middleware3);
    chain(mockNextRequest, mockNextEvent, () => mockNextResponse);

    expect(middleware1).toHaveBeenCalled();
    expect(middleware2).toHaveBeenCalled();
    expect(middleware3).toHaveBeenCalled();
    expect(middleware1).toHaveBeenCalledBefore(middleware2);
    expect(middleware2).toHaveBeenCalledBefore(middleware3);
  });

  it("最終的なレスポンスが正しく返されること", async () => {
    const middleware1 = vi.fn((_req, _event, next) => next());
    const middleware2 = vi.fn((_req, _event, next) => next());

    const chain = createMiddlewareChain(middleware1, middleware2);
    const response = await chain(
      mockNextRequest,
      mockNextEvent,
      () => mockNextResponse,
    );

    expect(response).toBe(await mockNextResponse);
  });

  it("ミドルウェアが残っていない場合にnextが呼び出されること", () => {
    const middleware1 = vi.fn((_req, _event, next) => next());
    const middleware2 = vi.fn((_req, _event, next) => next());

    const next = vi.fn(() => mockNextResponse);

    const chain = createMiddlewareChain(middleware1, middleware2);
    chain(mockNextRequest, mockNextEvent, next);

    expect(next).toHaveBeenCalled();
  });
});
