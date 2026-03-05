---
paths:
  - "src/mocks/**"
---

# MSW Mock Rules

## Setup

- **MSW** (Mock Service Worker) for API mocking
- Worker directory: `./public`
- Node: `setupServer()` for Vitest
- Browser: `mswLoader` in `.storybook/preview.tsx` (NOT `setupWorker()`)

## Server Setup (`src/mocks/server.ts`)

```typescript
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll } from "vitest";

export const server = setupServer();

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
});

afterAll(() => {
  server.close();
});

afterEach(() => {
  server.resetHandlers(); // Critical for test isolation
});
```

## Handler Pattern

```typescript
import { http, HttpResponse } from "msw";

http.get("/api/endpoint", () => {
  return HttpResponse.json({ data: "value" });
});
```
