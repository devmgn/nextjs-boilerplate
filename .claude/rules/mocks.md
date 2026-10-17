---
paths:
  - "src/mocks/**"
  - "**/*.stories.tsx"
  - "**/*.test.ts"
  - "**/*.test.tsx"
---

# MSW Mock Rules

- Worker directory: `./public`
- Vitest: shared `setupServer()` in `src/mocks/server.ts`
- Storybook: `mswLoader` in `.storybook/preview.tsx` (NOT `setupWorker()`)
- Test isolation: `server.resetHandlers()` runs in `afterEach` automatically

## Fixtures (Orval)

Spec-described responses are mocked with Orval-generated **fixtures** (`src/api/openapi/index.fixtures.ts`, from `mock.fixtures: true`):

- `defineFixtures({ "<METHOD> <path>": value })` — keys are spec routes (e.g. `"GET /api/articles"`, `"POST /api/articles"`), typed from the spec
- A value is deep-merged onto the route's mock (`{}` = the mock as is; arrays replace), so only the fields that matter are written. The rest is faker data with a per-route seed fixed at generation time, identical on every run
- `respond(status, body)` for error responses; a function `({ params, body }) => value` to inspect the request
- `set.extend({...})` derives a variant (e.g. a story overriding the meta-level set)
- `createFixtureHandler(set)` (`src/mocks/fixture-handler.ts`) turns a set into an MSW handler. Unmatched requests fall through to the next handler

```ts
const fixtures = defineFixtures({ "GET /api/articles": {} });
server.use(
  createFixtureHandler(
    fixtures.extend({ "GET /api/articles": { articles: [], articlesCount: 0 } })
  )
);
server.use(
  createFixtureHandler(
    defineFixtures({
      "POST /api/articles": respond(401, { errors: { token: ["is missing"] } }),
    })
  )
);
```

Use a plain `http.*` handler (URL from the generated `get<Operation>Url()`) only for responses the spec cannot describe: network errors (`HttpResponse.error()`), non-JSON error pages, and so on.

Mocks follow the spec as is: nullable fields (e.g. `Profile.bio` / `image`) can be `null`. Faker is also seeded with `faker.seed(1)` before each story (`.storybook/preview.tsx`) and each Vitest test (`vitest.setup.ts`) for code that calls the generated `get<Operation>ResponseMock()` factories directly.

The per-tag `<tag>.msw.ts` handlers (`get<Tag>Mock()`, `get<Operation>MockHandler()`) are also generated, but prefer fixtures.

## Files

| File | Purpose | Managed |
| --- | --- | --- |
| `server.ts` | Vitest shared instance (CORS preflight handler only, use `server.use()` per test) | Manual |
| `fixture-handler.ts` | `createFixtureHandler()`: Orval fixtures → MSW handler | Manual |
