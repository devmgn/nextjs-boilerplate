---
paths:
  - "**/*.test.ts"
  - "**/*.test.tsx"
---

# Testing Rules

## Stack

- **Vitest** (globals: true — `describe`, `it`, `expect`, `vi` are available without import)
- **@testing-library/react** for component and hook testing
- **@testing-library/jest-dom** + **jest-extended** matchers (auto-registered via `vitest.setup.ts`)
- `restoreMocks: true` — mocks are automatically restored after each test
- `vitest.globalSetup.ts` loads env vars via `@next/env`, sets `TZ=Asia/Tokyo` and `LANG=ja_JP.UTF-8`
- Coverage threshold: 80% (lines, functions, branches, statements)

## Patterns

### Component Snapshot Test

```typescript
import { render } from "@testing-library/react";

describe(ComponentName, () => {
  it("renders correctly", () => {
    const { asFragment } = render(<ComponentName />);
    expect(asFragment()).toMatchSnapshot();
  });
});
```

### Custom Hook Test

```typescript
import { act, renderHook } from "@testing-library/react";

describe(useHookName, () => {
  it("returns expected value", () => {
    const { result } = renderHook(() => useHookName());
    act(() => {
      result.current.action();
    });
    expect(result.current.value).toBe(expected);
  });
});
```

### Parameterized Test

```typescript
it.for(patterns)("value: %s, expected: %s", ([value, expected]) => {
  expect(fn(value)).toBe(expected);
});
```

## Excluded from Tests (in vitest.config.ts)

- `**/*.d.ts`, `**/*.stories.tsx`
- `src/{api,mocks}/**`
- Next.js special files (page.tsx, layout.tsx, loading.tsx, etc.)

## API Mocking with MSW

Import the shared MSW server when tests need API mocks:

```typescript
import { server } from "../../mocks/server";
import { http, HttpResponse } from "msw";

server.use(http.get("/api/...", () => HttpResponse.json(data)));
```
