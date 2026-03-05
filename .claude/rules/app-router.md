---
paths:
  - "src/app/**"
---

# Next.js App Router Rules

## Default Exports

Only Next.js special files may use default export:
page.tsx, layout.tsx, loading.tsx, error.tsx, global-error.tsx, not-found.tsx, forbidden.tsx, unauthorized.tsx, template.tsx, default.tsx, route.tsx, sitemap.ts

## Data Fetching Pattern

- Server Component (default): `Hydrator` (`src/lib/Hydrator`) for prefetching with `queryOptions`
- Client Component: `"use client"` + `useSuspenseQuery` for data access

```typescript
// Server Component (page.tsx)
export default function Page() {
  return (
    <Hydrator fetchQueryOptions={[getPostsQueryOptions()]}>
      <PostList />
    </Hydrator>
  );
}
```

## Form Handling

- React Hook Form: `createFormControl` + `Form` + `zodResolver`
- Server Actions: `"use server"` + `useActionState` + `startTransition`

## Root Layout

- Props: `React.PropsWithChildren`
- Exports: `metadata` (Metadata) + `viewport` (Viewport)
- Wraps children with `RootProvider` (QueryClient, NuqsAdapter, ErrorBoundary)

## Proxy

- `src/proxy.ts` (NOT `middleware.ts`) — Hono + `handle(app)` from `hono/vercel`
