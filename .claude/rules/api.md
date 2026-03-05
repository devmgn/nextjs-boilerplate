---
paths:
  - "src/api/**"
---

# API Layer Rules

## Structure

```
src/api/
├── apiClient/
│   ├── apiClient.ts    # Configuration + DefaultApi instance
│   └── index.ts        # Re-export
├── openapi/            # Auto-generated (DO NOT edit manually)
│   ├── apis/
│   ├── models/
│   └── runtime.ts
└── queries/            # TanStack Query hooks
    └── *.queries.ts
```

## OpenAPI Generated Client

- **Never manually edit** files in `src/api/openapi/`
- Regenerate: `pnpm generate-api` (or `pnpm generate-api:clean` for clean rebuild)

## TanStack Query Pattern

Use `queryOptions` helper to define reusable query configurations:

```typescript
import type { ListPostsRequest } from "../openapi";
import { queryOptions } from "@tanstack/react-query";
import { apiClient } from "../apiClient";

export function getPostsQueryOptions(request: ListPostsRequest = {}) {
  return queryOptions({
    queryKey: ["getPosts", request] as const,
    queryFn: () => apiClient.listPosts(request),
  });
}
```

## Data Fetching

- **Server Component**: Use `Hydrator` component (`src/lib/Hydrator`) for prefetching
- **Client Component**: `useSuspenseQuery` + `queryOptions` for data access
- **Server Action**: `"use server"` directive + direct `apiClient` call
