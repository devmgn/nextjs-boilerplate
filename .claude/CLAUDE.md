# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Commands

```bash
pnpm dev              # Development server with Turbopack
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run all linting (Oxlint + Oxfmt check)
pnpm lint:oxlint      # Run Oxlint with auto-fix (includes fn-style/no-top-level-arrow)
pnpm lint:fmt         # Run Oxfmt formatting (write)
pnpm lint:fmt:check   # Run Oxfmt formatting (check only)
pnpm lint:knip        # Dead code detection (strict mode)
pnpm check-types      # TypeScript type checking
pnpm generate-api     # Generate OpenAPI client
pnpm generate-api:clean # Clean and regenerate OpenAPI client
pnpm analyze          # Analyze bundle size (requires build)
```

### Testing Commands

```bash
pnpm test             # Run all tests
pnpm test:unit        # Run unit tests only
pnpm test:watch       # Run tests in watch mode
pnpm test:coverage    # Run tests with coverage (80% threshold)
pnpm test:update      # Update test snapshots
pnpm vitest run path/to/test.test.ts  # Run specific test file
```

### Storybook Commands

```bash
pnpm storybook        # Start Storybook development server
pnpm build-storybook  # Build static Storybook
pnpm chromatic        # Deploy to Chromatic (visual testing)
```

## Project Architecture

### Core Technology Stack

- **Next.js 16** with App Router, React 19, and Turbopack
  - React Compiler enabled (reactCompiler: true)
  - TypeScript typed routes (typedRoutes: true)
  - Experimental: authInterrupts, turbopackFileSystemCacheForDev, viewTransition
  - Node.js 24 (engines.node: "24.13.0"), pnpm 10 (packageManager: "pnpm@10.28.2")
- **React 19** with React Compiler optimizations
- **TypeScript** with strict type checking (type-fest for advanced utilities)
- **Tailwind CSS v4** with @tailwindcss/postcss
- **TanStack Query** with @lukemorales/query-key-factory
- **React Hook Form + Zod v4** with @hookform/resolvers
- **Hono** for proxy middleware
- **UI**: @radix-ui primitives, tailwind-variants, tailwind-merge
- **Utilities**: es-toolkit (lodash alternative)
- **OxC** (Oxlint + Oxfmt) for linting and formatting
  - Oxlint: 665+ built-in rules (React, Next.js, TypeScript, Vitest, jsx-a11y, etc.)
  - Oxfmt: Prettier-compatible formatter (import sorting, Tailwind class sorting)
  - jsPlugins: eslint-plugin-react-compiler, @tanstack/eslint-plugin-query, eslint-plugin-storybook, eslint-plugin-import
  - Suppress comments: `// oxlint-disable-next-line <rule>`
- **Vitest** with 80% coverage requirement
  - Unit tests (JSDOM) + Storybook tests (Playwright)
  - @testing-library/react, jest-extended, @faker-js/faker
- **Storybook 10** with Vitest integration, a11y testing, MSW, Chromatic
- **MSW** for API mocking (worker directory: ./public)

### Directory Structure

| Directory         | Purpose                                                                 |
| ----------------- | ----------------------------------------------------------------------- |
| `src/app/`        | Next.js App Router (file-based routing)                                 |
| `src/components/` | Reusable UI components (each in own dir with index.tsx, stories, tests) |
| `src/api/`        | API layer (openapi/ generated client, queries/ TanStack Query hooks)    |
| `src/providers/`  | Context providers (RootProvider)                                        |
| `src/hooks/`      | Custom React hooks                                                      |
| `src/lib/`        | Library code (proxy/, styles/, Hydrator, WebVitalsReporter)             |
| `src/utils/`      | Pure utility functions                                                  |
| `src/config/`     | Application configuration                                               |
| `src/features/`   | Feature modules (domain-organized)                                      |
| `src/mocks/`      | MSW mock handlers and fixtures                                          |
| `src/schemas/`    | Zod schemas (runtime validation, env vars)                              |
| `src/types/`      | Shared TypeScript types                                                 |
| `scripts/`        | Custom lint/check scripts                                               |

### Key Patterns

- **No default exports** except Next.js special files (page.tsx, layout.tsx, etc.) and Storybook stories
- **Function declarations** at top level (no top-level arrow functions, enforced by `fn-style/no-top-level-arrow` Oxlint rule)
- **Named exports only** for components
- **TanStack Query** for server state, **React Hook Form + Zod** for form state, **no global client state**
- **Zod schemas** for runtime validation (forms, env vars)
- **Generated types** from OpenAPI spec (do not edit `src/api/openapi/` manually)
- **Proxy middleware** in `src/proxy.ts` (not `middleware.ts`)

### Code Quality

- **Oxlint** (.oxlintrc.json) — linting with auto-fix
- **Oxfmt** (.oxfmtrc.jsonc) — formatting (single quotes, import sorting, Tailwind class sorting)
- **Knip** (knip.jsonc) — dead code detection (`pnpm lint:knip`)
- **fn-style jsPlugin** — top-level arrow function check (integrated in Oxlint)
- **Coverage**: 80% threshold (lines, functions, branches, statements)

### Environment Configuration

Env vars validated through Zod schemas in `src/schemas/env.schema.ts`:

- `NEXT_PUBLIC_APP_NAME`, `NEXT_PUBLIC_DEFAULT_DESCRIPTION`

### GitHub & CI/CD

- **Branch strategy**: `main` + `feature/*` branches
- **Shared setup**: `.github/actions/setup/action.yml` (pnpm install, Node.js, caching)
- **CI notes**: `upload-artifact` needs `include-hidden-files: true` for `.next/`

### Component Development Workflow

1. Create component in `/src/components/ComponentName/index.tsx`
2. Add Storybook stories (`*.stories.tsx`)
3. Use `tailwind-variants` for styling
4. Export as named export only
5. Add unit tests if component has logic

### MCP Tool Usage

| Purpose                                                          | MCP Tool                                                       |
| ---------------------------------------------------------------- | -------------------------------------------------------------- |
| **Next.js official docs**                                        | `next-devtools` (`nextjs_docs`, `nextjs_index`, `nextjs_call`) |
| **Other libraries** (React, TanStack Query, Zod, Tailwind, etc.) | `context7` (`resolve-library-id` → `query-docs`)               |
