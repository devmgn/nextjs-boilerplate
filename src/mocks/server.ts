import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll } from "vitest";

// happy-dom の fetch はクロスオリジン時に CORS preflight を送り、msw v3 はそれも捕捉する。
// 初期ハンドラは resetHandlers() 後も残るため、ここで一括許可する。
const corsPreflightHandler = http.options(
  "*",
  () =>
    new HttpResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
      },
    })
);

export const server = setupServer(corsPreflightHandler);

// Start server before all tests
beforeAll(() => {
  server.listen({ onUnhandledFrame: "error" });
});

// Reset handlers after each test `important for test isolation`
afterEach(() => {
  server.resetHandlers();
});

//  Close server after all tests
afterAll(() => {
  server.close();
});
