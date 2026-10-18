---
paths:
  - "src/app/**"
---

# Next.js App Router Rules

## Convention Files

Next.js convention files are the only files that sit flat in a route directory (everything else follows `directory-structure.md`) and the only non-story files allowed a default export:

`page.tsx`, `layout.tsx`, `template.tsx`, `default.tsx`, `loading.tsx`, `error.tsx`, `global-error.tsx`, `not-found.tsx`, `global-not-found.tsx`, `forbidden.tsx`, `unauthorized.tsx`, `route.ts`, `sitemap.ts`

## Data Fetching

- Server Component: `getQueryClient` (`src/lib/get-query-client`) + `get<Operation>SuspenseQueryOptions` (prefetch) + `HydrationBoundary` (`@tanstack/react-query`)
- Client Component: `"use client"` + the generated suspense hook (`useGetArticlesSuspense`, ...). Pass the same params as the prefetch so both use the same query key (see `api.md`)
- Build every `QueryClient` with `createQueryClientConfig()`, never a shared config object: `QueryCache` / `MutationCache` hold the cache, so sharing them leaks data between server requests (and between stories)

### Under Cache Components

`cacheComponents: true` is enabled, so calling `dehydrate()` during prerendering fails: `dataUpdatedAt: Date.now()` is rejected as a non-deterministic value (`blocking-prerender-current-time`).

Move the prefetch + `HydrationBoundary` into a dedicated component, opt it into request-time rendering with `await connection()` (`next/server`), and wrap it in `<Suspense>` in the calling `page.tsx`. Reference: `src/app/(sandbox)/openapi/`

```tsx
// _components/article-list-container/article-list-container.tsx
const params: GetArticlesParams = { limit: 10 };

export async function ArticleListContainer() {
  await connection();
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(getGetArticlesSuspenseQueryOptions(params));
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ArticleList params={params} />
    </HydrationBoundary>
  );
}

// page.tsx
export default function Page() {
  return (
    <Suspense fallback={<Spinner />}>
      <ArticleListContainer />
    </Suspense>
  );
}
```

## Files That Bypass the Root Layout

`global-error.tsx` and `global-not-found.tsx` are not rendered inside the root layout, so they provide their own `<html>` / `<body>` and import `../lib/styles/globals.css`.

|  | Rendered when | Component | metadata |
| --- | --- | --- | --- |
| `global-error.tsx` | An uncaught error in the root layout / template | Client only | Not supported (use `<title>`) |
| `global-not-found.tsx` | A URL matches no route | Server OK | Supported |
| `not-found.tsx` | `notFound()` is called | Server OK | Supported (rendered inside the root layout) |

## Form Handling

- React Hook Form: `createFormControl` + `Form` + `zodResolver`
- Server Actions: `"use server"` + `useActionState` + `startTransition`
- Server Actions are public POST endpoints: re-validate input with the same Zod schema (`safeParse`) before using it
- Return a state object for expected failures instead of throwing: `ApiError` → a fixed message per status (never `error.body`), fetch network failure (`TypeError`) → a network error message. Re-throw anything else so real bugs reach the error boundary. Reference: `src/app/(sandbox)/form/_actions/create-article/`

## Proxy

`src/proxy.ts` (NOT `middleware.ts`) — the Next.js 16 Proxy convention. Its helpers live in `src/lib/proxy/`
