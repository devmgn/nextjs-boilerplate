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
pnpm lint             # Run all checks (Oxlint + type check + Oxfmt check)
pnpm lint:oxlint      # Oxlint check (type-aware + type-check)
pnpm lint:oxlint:fix  # Oxlint with auto-fix
pnpm lint:fmt         # Oxfmt formatting (check only)
pnpm lint:fmt:fix     # Oxfmt formatting (write)
pnpm lint:knip        # Dead code detection (strict mode)
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
