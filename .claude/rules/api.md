---
paths:
  - "src/api/**"
---

# API Layer Rules

- **Never manually edit** files in `src/api/openapi/` — regenerate with `pnpm generate-api`

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

