---
paths:
  - "src/components/**"
---

# Component Development Rules

## Directory Structure

```
src/components/ComponentName/
├── ComponentName.tsx           # Implementation
├── ComponentName.stories.tsx   # Storybook stories
├── ComponentName.test.tsx      # Tests (when component has logic)
└── index.ts                    # Named re-export only
```

## Conventions

- **Named exports only** — no default exports (enforced by `import/no-default-export` Oxlint rule)
- **Function declarations** for exports — no top-level arrow functions (enforced by `fn-style/no-top-level-arrow`)
- Style with `tailwind-variants` `tv()`, extract types via `VariantProps<typeof variants>`
- Props: extend `React.ComponentProps<"element">` intersected with `VariantProps`
- Pass `className` through `tv()` call
- Support Radix UI `Slot` + `asChild` pattern where applicable

## tailwind-variants Pattern

```typescript
import type { VariantProps } from "tailwind-variants";
import { tv } from "tailwind-variants";

const componentVariants = tv({
  base: "...",
  variants: { ... },
  defaultVariants: { ... },
});

interface ComponentProps
  extends React.ComponentProps<"div">, VariantProps<typeof componentVariants> {}

export function Component(props: ComponentProps) {
  const { className, variant, ..._props } = props;
  return <div className={componentVariants({ className, variant })} {..._props} />;
}
```

## index.ts

```typescript
export { ComponentName } from "./ComponentName";
```
