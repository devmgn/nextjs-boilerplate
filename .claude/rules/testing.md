---
paths:
  - "**/*.test.ts"
  - "**/*.test.tsx"
---

# Testing Rules

## Stack

- **Vitest** (globals: true — `describe`, `it`, `expect`, `vi` available without import)
- **@testing-library/react** for component and hook testing
- **@testing-library/jest-dom** + **jest-extended** matchers (auto-registered via `vitest.setup.ts`)
- `restoreMocks: true` — mocks automatically restored after each test
- `vitest.globalSetup.ts` loads env vars via `@next/env`, sets `TZ=Asia/Tokyo` and `LANG=ja_JP.UTF-8`
- Coverage threshold: 80% (lines, functions, branches, statements)

## Excluded from Coverage

`**/*.d.ts`, `**/*.stories.tsx`, `src/{api,mocks}/**`, Next.js special files

## API Mocking

Use shared MSW server with per-test handlers. `resetHandlers()` runs automatically in `afterEach`.

```typescript
import { HttpResponse, http } from "msw";
import { server } from "../../mocks/server";

server.use(
  http.get(`${BASE_URL}/posts`, () => HttpResponse.json([...])),
);
```

- Cast `request.json()` as `Record<string, unknown>` when spreading into response
