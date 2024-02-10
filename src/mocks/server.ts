import { setupServer } from 'msw/node';
import type { RequestHandler } from 'msw';

const createServer = (...handlers: RequestHandler[]) => {
  const server = setupServer(...handlers);

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  return server;
};

export default createServer;
