---
paths:
  - "**/*.test.ts"
  - "**/*.test.tsx"
  - "**/*.test-d.ts"
---

# Testing Rules

## Stack

- **Vitest** (`globals: true` at runtime for Testing Library auto-cleanup; import `describe` / `it` / `expect` / `vi` explicitly from `"vitest"` — no global types)
- **@testing-library/react** for component and hook testing
- **@testing-library/jest-dom** matchers (runtime: `setupFiles`, types: `tsconfig.json` `types`, both via `@testing-library/jest-dom/vitest`)
- `mockReset: true` + `restoreMocks: true` — mock implementations reset and spies restored before each test
- `vitest.global-setup.ts` loads env vars via `@next/env`, sets `TZ=Asia/Tokyo`
- `vitest.setup.ts` (unit project `setupFiles`) calls `faker.seed(1)` before each test, so Orval-generated mock data is deterministic
- **Type tests**: `typecheck.enabled: true`. Write `expectTypeOf` / `assertType` in `*.test-d.ts` files to have type errors surface as test failures.

## Excluded from Coverage

`**/*.d.ts`, `**/*.test-d.{ts,tsx}`, `**/*.stories.tsx`, `src/{api/openapi,mocks}/**`, Next.js special files

## API Mocking

Use shared MSW server with per-test handlers. `resetHandlers()` runs automatically in `afterEach`.

```typescript
import { defineFixtures } from "../../api/openapi/index.fixtures";
import { createFixtureHandler } from "../../mocks/fixture-handler";
import { server } from "../../mocks/server";

server.use(
  createFixtureHandler(
    defineFixtures({ "GET /api/articles": { articles: [], articlesCount: 0 } })
  )
);
```

- Cast `request.json()` as `Record<string, unknown>` when spreading into response
- Mock spec-described responses with Orval fixtures (`defineFixtures` + `createFixtureHandler`, see `mocks.md`) and override only the fields the test asserts on. Use a plain `http.*` handler, with the URL from the generated `get<Operation>Url()`, only for responses outside the spec (network errors, HTML error pages)
- To assert on the request, use a fixture function: `"POST /api/articles": ({ body }) => { received = body; return { article: { slug: "x" } }; }`
- Server Action tests: add `// @vitest-environment node` at the top. Server Actions run on Node.js, and happy-dom's `fetch` rejects network failures with a different error than Node's `TypeError`
- Situations MSW + happy-dom cannot produce (e.g. a response body that fails mid-stream) can be tested with `vi.spyOn(globalThis, "fetch")`
