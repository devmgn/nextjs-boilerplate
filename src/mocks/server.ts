import type { RequestHandler } from "msw";
import { setupServer } from "msw/node";

export const createServer = (...handlers: RequestHandler[]) => {
  const server = setupServer(...handlers);

  // biome-ignore lint/correctness/noUndeclaredVariables: <explanation>
  beforeAll(() => {
    server.listen();
  });

  // biome-ignore lint/correctness/noUndeclaredVariables: <explanation>
  afterEach(() => {
    server.resetHandlers();
  });

  // biome-ignore lint/correctness/noUndeclaredVariables: <explanation>
  afterAll(() => {
    server.close();
  });

  return server;
};
