---
paths:
  - "src/app/**"
---

# Next.js App Router Rules

## Default Exports

Only Next.js special files may use default export: page.tsx, layout.tsx, loading.tsx, error.tsx, global-error.tsx, not-found.tsx, global-not-found.tsx, forbidden.tsx, unauthorized.tsx, template.tsx, default.tsx, route.tsx, sitemap.ts

## Data Fetching

- Server Component: `getQueryClient` (`src/lib/get-query-client`) + `get<Operation>SuspenseQueryOptions` (prefetch) + `HydrationBoundary` (`@tanstack/react-query`)
- Client Component: `"use client"` + the generated suspense hook (`useGetArticlesSuspense`, ...). Pass the same params as the prefetch so both use the same query key (see `api.md`)
- Build every `QueryClient` with `createQueryClientConfig()`, never a shared config object: `QueryCache` / `MutationCache` hold the cache, so sharing them leaks data between server requests (and between stories)

### Cache Components 下での制約

`cacheComponents: true` が有効なので、`dehydrate()` を prerender 経路で呼ぶと `dataUpdatedAt: Date.now()` が不安定値として弾かれる（`blocking-prerender-current-time`）。

prefetch + `HydrationBoundary` は専用のコンポーネントに切り出し、`await connection()`（`next/server`）でリクエスト時レンダリングを宣言して、呼び出し側の `page.tsx` で `<Suspense>` で包む。参考実装: `src/app/(sandbox)/openapi/`

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

## Root Layout をバイパスするファイル

`global-error.tsx` / `global-not-found.tsx` は root layout を経由しないため、`<html>` / `<body>` と `../lib/styles/globals.css` を自前で用意する。

|  | 発火条件 | Component 種別 | metadata |
| --- | --- | --- | --- |
| `global-error.tsx` | root layout / template の未捕捉エラー | Client 必須 | 不可（`<title>` で代替） |
| `global-not-found.tsx` | どのルートにもマッチしない URL | Server 可 | 可 |
| `not-found.tsx` | `notFound()` 呼び出し | Server 可 | 可（root layout 内で描画される） |

## Form Handling

- React Hook Form: `createFormControl` + `Form` + `zodResolver`
- Server Actions: `"use server"` + `useActionState` + `startTransition`
- Server Actions are public POST endpoints: re-validate input with the same Zod schema (`safeParse`) before using it
- Return a state object for expected failures instead of throwing: `ApiError` → a fixed message per status (never `error.body`), fetch network failure (`TypeError`) → a network error message. Re-throw anything else so real bugs reach the error boundary. Reference: `src/app/(sandbox)/form/_actions/create-article/`

## Proxy

`src/proxy.ts` (NOT `middleware.ts`) — Next.js Proxy convention
