import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll } from "vitest";

// happy-dom's fetch sends a CORS preflight for cross-origin requests, and msw v3 intercepts it too.
// Initial handlers survive resetHandlers(), so allow them all here.
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
