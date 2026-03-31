---
paths:
  - "src/mocks/**"
---

# MSW Mock Rules

- Worker directory: `./public`
- Vitest: `setupServer()` — shared instance in `src/mocks/server.ts`
- Storybook: `mswLoader` in `.storybook/preview.tsx` (NOT `setupWorker()`)
- Test isolation: `server.resetHandlers()` runs in `afterEach` automatically

## msw-auto-mock

- `pnpm generate-mock` で `openapi.yml` → `src/mocks/handlers.ts` を自動生成
- 生成後に `@faker-js/faker/locale/ja` へ自動差し替え（日本語データ）
- `faker.seed(1)` により決定的データ（実質固定値）
- **手動編集しない** — `openapi.yml` 更新後に `pnpm generate-mock` で再生成

## Files

| File | Purpose | Management |
|------|---------|------------|
| `handlers.ts` | OpenAPI から自動生成されたハンドラー | 自動生成 |
| `browser.ts` | ブラウザ用 `setupWorker` | 自動生成 |
| `node.ts` | Node.js 用 `setupServer`（全ハンドラー付き） | 自動生成 |
| `native.ts` | React Native 用 | 自動生成 |
| `server.ts` | Vitest 用 `setupServer`（空、テストで `server.use()` する） | 手動管理 |
