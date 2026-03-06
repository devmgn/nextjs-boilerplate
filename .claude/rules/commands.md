---
---

# Development Commands

## Dev / Build

```bash
pnpm dev              # Development server with Turbopack
pnpm build            # Build for production
pnpm start            # Start production server
```

## Linting & Formatting

```bash
pnpm check            # Run all checks (Oxlint + Oxfmt + Knip)
pnpm fix              # Auto-fix lint + format
pnpm lint             # Oxlint check (type-aware + type-check)
pnpm lint:fix         # Oxlint with auto-fix
pnpm fmt              # Oxfmt formatting (check only)
pnpm fmt:fix          # Oxfmt formatting (write)
pnpm knip             # Dead code detection (strict mode)
```

## Testing

```bash
pnpm test             # Run all tests
pnpm test:unit        # Run unit tests only
pnpm test:watch       # Run tests in watch mode
pnpm test:coverage    # Run tests with coverage (80% threshold)
pnpm test:update      # Update test snapshots
pnpm vitest run path/to/test.test.ts  # Run specific test file
```

## Storybook

```bash
pnpm storybook        # Start Storybook development server
pnpm build-storybook  # Build static Storybook
```

## API Generation

```bash
pnpm generate-api     # Generate OpenAPI client
pnpm generate-api:clean # Clean and regenerate OpenAPI client
```

## Analysis

```bash
pnpm analyze          # Analyze bundle size (requires build)
```
