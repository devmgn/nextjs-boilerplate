---
paths:
  - "src/mocks/**"
---

# MSW Mock Rules

- Worker directory: `./public`
- Vitest: shared `setupServer()` in `src/mocks/server.ts`
- Storybook: `mswLoader` in `.storybook/preview.tsx` (NOT `setupWorker()`)
- Test isolation: `server.resetHandlers()` runs in `afterEach` automatically

## msw-auto-mock

- `pnpm generate-mock` generates `src/mocks/handlers.ts` from `openapi.yml`
- Auto-patches to `@faker-js/faker/locale/ja` (Japanese data, deterministic via `faker.seed(1)`)
- Only `handlers.ts` is kept; the other generated files (`browser.ts`, `node.ts`, `native.ts`) are discarded (unused, and `native.ts` imports `msw/native` which msw v3 removed)
- **Never manually edit** generated files — re-run `pnpm generate-mock` after spec changes

## Files

| File | Purpose | Managed |
| --- | --- | --- |
| `handlers.ts` | Auto-generated from OpenAPI | Generated |
| `server.ts` | Vitest shared instance (CORS preflight handler only, use `server.use()` per test) | Manual |
