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

Import shared MSW server: `import { server } from "../../mocks/server"` then `server.use(http.get(...))`.

### Pattern

```typescript
import { HttpResponse, http } from "msw";
import { server } from "../../mocks/server";

const BASE_URL = "https://jsonplaceholder.typicode.com";

describe("apiClient", () => {
  it("投稿一覧を取得できること", async () => {
    server.use(
      http.get(`${BASE_URL}/posts`, () =>
        HttpResponse.json([{ id: 1, title: "test" }]),
      ),
    );
    const result = await apiClient.listPosts();
    expect(result).toHaveLength(1);
  });
});
```

- テストごとに `server.use()` でハンドラーを設定（テスト分離）
- `afterEach` の `resetHandlers()` は `server.ts` で自動実行
- `request.json()` の戻り値を spread する場合は `as Record<string, unknown>` でアサート
