---
paths:
  - "src/schemas/**"
---

# Schema Rules

## Zod v4

- Used for runtime validation (forms, environment variables)
- Derive types with `z.infer<typeof schema>`

## Environment Variable Schema (env.schema.ts)

```typescript
import { z } from "zod";

export const envSchema = z
  .object({
    appName: z.string(),
    defaultDescription: z.string(),
  })
  .readonly();

export type EnvSchema = z.infer<typeof envSchema>;
```

Validated at `src/config/env.ts` via `envSchema.parse()`.

## Form Schema

- Integrate with React Hook Form via `zodResolver`
- Place schemas in `src/schemas/` or co-locate within feature directories (e.g., `src/app/(sandbox)/form/schema.ts`)
