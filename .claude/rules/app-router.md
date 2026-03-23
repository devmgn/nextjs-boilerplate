---
paths:
  - "src/app/**"
---

# Next.js App Router Rules

## Default Exports

Only Next.js special files may use default export:
page.tsx, layout.tsx, loading.tsx, error.tsx, global-error.tsx, not-found.tsx, forbidden.tsx, unauthorized.tsx, template.tsx, default.tsx, route.tsx, sitemap.ts

## Data Fetching

- Server Component: `Hydrator` (`src/lib/Hydrator`) wrapping `queryOptions` for prefetching
- Client Component: `"use client"` + `useSuspenseQuery`

## Form Handling

- React Hook Form: `createFormControl` + `Form` + `zodResolver`
- Server Actions: `"use server"` + `useActionState` + `startTransition`

## Proxy

`src/proxy.ts` (NOT `middleware.ts`) — Next.js Proxy convention
