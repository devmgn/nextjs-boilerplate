---
paths:
  - "src/mocks/**"
---

# MSW Mock Rules

- Worker directory: `./public`
- Vitest: `setupServer()` — shared instance in `src/mocks/server.ts`
- Storybook: `mswLoader` in `.storybook/preview.tsx` (NOT `setupWorker()`)
- Test isolation: `server.resetHandlers()` runs in `afterEach` automatically
