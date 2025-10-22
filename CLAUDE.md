# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Commands
```bash
# Development server with Turbopack
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting (both Next.js and Biome)
pnpm lint

# Run Biome linting with auto-fix
pnpm lint:biome

# Run type checking
pnpm check-types

# Run dead code detection
pnpm knip

# Generate OpenAPI client code
pnpm generate-api

# Clean and regenerate OpenAPI client
pnpm generate-api:clean

# Analyze bundle size (requires build)
pnpm analyze
```

### Testing Commands
```bash
# Run all tests
pnpm test

# Run unit tests only
pnpm test:unit

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage (80% threshold required)
pnpm test:coverage

# Update test snapshots
pnpm test:update

# Run specific test file
pnpm vitest run path/to/test.test.ts
```

### Storybook Commands
```bash
# Start Storybook development server
pnpm storybook

# Build static Storybook
pnpm build-storybook
```

## Project Architecture

### Core Technology Stack
- **Next.js** (beta) with App Router, React 19, and Turbopack
  - Experimental: React Compiler (babel-plugin-react-compiler)
  - Node.js 22+ required
  - pnpm package manager
- **TypeScript** with strict type checking
- **Tailwind CSS** for styling
- **TanStack Query** for server state management
- **React Hook Form + Zod** for form handling and validation
- **Hono** for proxy middleware
- **Vitest** (beta) for testing with 80% coverage requirement
  - Browser testing via Playwright
  - Coverage via @vitest/coverage-v8
- **Storybook** (beta) for component development
  - Integration with Vitest for component testing
  - Accessibility testing via axe-core
- **Biome** as primary linter/formatter
- **MSW** for API mocking
- **ESLint** with flat config
  - React Hooks plugin
  - TanStack Query plugin
  - React Compiler plugin

### Directory Structure & Conventions

#### `/src/app/` - Next.js App Router
- Uses file-based routing with App Router conventions
- Layout hierarchy: root layout � nested layouts � pages
- Special files: `page.tsx`, `layout.tsx`, `error.tsx`, `not-found.tsx`, `global-error.tsx`
- Route groups: `(sandbox)/` for logical grouping without affecting URL

#### `/src/components/` - Reusable UI Components
- Each component in its own directory with `index.tsx`
- Includes Storybook stories (`*.stories.tsx`) and tests
- Uses `tailwind-variants` for component styling with variants
- Exports only named exports (no default exports per linting rules)

#### `/src/api/` - API Layer
- `/openapi/` - Auto-generated TypeScript client from OpenAPI spec
- `/queries/` - TanStack Query hooks using query key factory pattern
- `/apiClient/` - Configured API client instance

#### `/src/providers/` - Context Providers
- `RootProvider` wraps all providers (currently TanStack Query)
- Provider hierarchy is centralized here

#### `/src/hooks/` - Custom React Hooks
- Each hook in its own directory with tests and stories
- Includes debounce, disclosure, and composing detection utilities

#### `/src/lib/` - Library Code
- `/proxy/` - Hono middleware for logging and headers
- `/styles/` - Global CSS files and Tailwind configuration
- `Hydrator` - Server state hydration component
- `WebVitalsReporter` - Performance monitoring (dev only)

#### `/src/utils/` - Utility Functions
- Pure utility functions with comprehensive tests
- Type helpers and environment detection utilities

### Key Architectural Patterns

#### Proxy Architecture
The project uses Hono for proxy middleware, configured in `src/middleware.ts`:
- Request/response logging
- Custom header injection
- Excludes API routes and static assets

#### State Management
- **Server State**: TanStack Query with centralized configuration
- **Form State**: React Hook Form with Zod schemas
- **No global client state management** (no Redux/Zustand)

#### Type Safety
- Zod schemas for runtime validation (forms, environment variables)
- Generated types from OpenAPI specification
- Strict TypeScript configuration with no implicit any

#### Testing Strategy
- Unit tests with Vitest (JSDOM environment)
- Storybook tests run in browser environment (Playwright)
- 80% coverage threshold enforced
- MSW for API mocking in tests

#### Code Quality
- Biome for linting with extensive rules
  - Use `pnpm lint:biome:unsafe` for unsafe auto-fixes
- ESLint with flat config (eslint.config.js)
  - Includes React Compiler plugin for early optimization warnings
- Knip for dead code detection (ignores generated API code)
  - Use `pnpm lint:knip` for strict mode checking
- Pre-commit hooks via Husky and lint-staged
  - Runs linting, type checking, Knip, and unit tests on changed files
  - Initialized via `pnpm init:husky`
- Consistent naming conventions enforced

### Environment Configuration
Environment variables are validated through Zod schemas:
- `NEXT_PUBLIC_APP_NAME` - Application name
- `NEXT_PUBLIC_DEFAULT_DESCRIPTION` - Default meta description
- All env vars must be defined in `src/schemas/env.schema.ts`

### OpenAPI Integration
The project generates TypeScript clients from `openapi.yml`:
- Run `pnpm generate-api` to regenerate (or `pnpm generate-api:clean` for full cleanup)
- Generated code is in `src/api/openapi/` (do not edit manually)
- Configuration in `openapiconfig.json`
- Uses typescript-fetch generator from OpenAPI Generator

### Performance & Optimization
- Bundle analysis available via `pnpm analyze` (uses @next/bundle-analyzer)
- React Compiler experimental support for automatic optimization
- Turbopack for faster builds in both dev and production
- Web Vitals monitoring in development (WebVitalsReporter component)

### Component Development Workflow
1. Create component in `/src/components/ComponentName/index.tsx`
2. Add Storybook stories (`*.stories.tsx`) for visual testing
3. Use `tailwind-variants` for styling with type-safe variants
4. Export as named export (no default exports per linting rules)
5. Add unit tests if component has logic
6. Test runs automatically on pre-commit for changed files

### Important Notes
- This project uses **Next.js 16 beta** and **React 19** - expect potential breaking changes
- MSW worker is initialized automatically via `pnpm init:msw` (postinstall hook)
- The `.claude` directory is gitignored for Claude Code specific files
- All builds use Turbopack (both dev and production)
- Git hooks are managed by Husky and set up via `pnpm init:husky`
