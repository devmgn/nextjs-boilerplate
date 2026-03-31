import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll } from "vitest";

export const server = setupServer();

// Start server before all tests
beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
});

// Reset handlers after each test `important for test isolation`
afterEach(() => {
  server.resetHandlers();
});

//  Close server after all tests
afterAll(() => {
  server.close();
});
