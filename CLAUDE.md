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

# Run all linting (ESLint + Biome)
pnpm lint

# Run ESLint only
pnpm lint:eslint

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

# Deploy to Chromatic (visual testing)
pnpm chromatic
```

## Project Architecture

### Core Technology Stack
- **Next.js** with App Router, React 19, and Turbopack
  - React Compiler enabled (reactCompiler: true)
  - TypeScript typed routes (typedRoutes: true)
  - Experimental features: authInterrupts, turbopackFileSystemCacheForDev, viewTransition
  - Compiler: reactRemoveProperties enabled for production optimization
  - poweredByHeader disabled for security
  - Node.js 24 required (engines.node: "24.10.0")
  - pnpm package manager (packageManager: "pnpm@10.19.0")
- **React 19** with React Compiler optimizations
- **TypeScript** with strict type checking
  - type-fest for advanced TypeScript utilities
- **Tailwind CSS v4** for styling with @tailwindcss/postcss
- **TanStack Query** for server state management
  - @lukemorales/query-key-factory for query key management
- **React Hook Form + Zod v4** for form handling and validation
  - @hookform/resolvers for Zod integration
- **Hono** for proxy middleware
- **UI Libraries**:
  - @radix-ui/react-* primitives for accessible components
  - tailwind-variants for component styling with type-safe variants
  - tailwind-merge for conditional class merging
- **Utility Libraries**:
  - es-toolkit for modern utility functions (lodash alternative)
- **Vitest** for testing with 80% coverage requirement
  - Browser testing via Playwright
  - Coverage via @vitest/coverage-v8
  - Separate unit and Storybook test projects
  - @testing-library/react and @testing-library/user-event for component testing
  - jest-extended for additional matchers
- **Storybook** for component development
  - Integration with Vitest for component testing (@storybook/addon-vitest)
  - Accessibility testing via axe-core (@storybook/addon-a11y)
  - MSW integration via msw-storybook-addon
  - Chromatic for visual regression testing
- **Biome** as primary linter/formatter
- **MSW** for API mocking (worker directory: ./public)
- **Testing utilities**:
  - @faker-js/faker for generating test data
  - @testing-library/jest-dom for DOM assertions
- **ESLint** with flat config (eslint.config.mjs)
  - React Hooks plugin
  - TanStack Query plugin
  - React Compiler plugin
  - Vitest plugin

### Directory Structure & Conventions

#### `/src/app/` - Next.js App Router
- Uses file-based routing with App Router conventions
- Layout hierarchy: root layout → nested layouts → pages
- Special files: `page.tsx`, `layout.tsx`, `error.tsx`, `not-found.tsx`, `global-error.tsx`
- Route groups: `(sandbox)/` for logical grouping without affecting URL
- Instrumentation support via `instrumentation.ts` and `instrumentation-client.ts`

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

#### `/src/config/` - Configuration Files
- Application-wide configuration constants

#### `/src/features/` - Feature Modules
- Feature-specific code organized by domain
- Self-contained feature implementations

#### `/src/mocks/` - Mock Data and Handlers
- MSW mock handlers for API endpoints
- Test data and fixtures

#### `/src/schemas/` - Zod Schemas
- Runtime validation schemas
- Environment variable validation (env.schema.ts)

#### `/src/stories/` - Storybook Stories
- Standalone Storybook examples
- Pattern demonstrations

#### `/src/types/` - TypeScript Type Definitions
- Shared TypeScript types and interfaces

### Key Architectural Patterns

#### Proxy Architecture
The project uses Hono for proxy middleware, configured in `src/proxy.ts`:
- Excludes API routes, static assets, and metadata files via matcher config

#### State Management
- **Server State**: TanStack Query with centralized configuration
- **Form State**: React Hook Form with Zod schemas
- **No global client state management** (no Redux/Zustand)

#### Type Safety
- Zod schemas for runtime validation (forms, environment variables)
- Generated types from OpenAPI specification
- Strict TypeScript configuration with no implicit any

#### Testing Strategy
- **Unit tests** with Vitest (project: "unit")
  - JSDOM environment for React component testing
  - Global setup via vitest.globalSetup.ts
  - Test setup via vitest.setup.ts
- **Storybook tests** (project: "storybook")
  - Browser environment using Playwright (Chromium)
  - @storybook/addon-vitest integration
  - Tagged stories with "test" tag are executed
- 80% coverage threshold enforced (lines, functions, branches, statements)
- MSW for API mocking in both unit and Storybook tests
- Coverage excludes generated code, stories, and Next.js special files

#### Code Quality
- Biome for linting with extensive rules (biome.jsonc)
  - Use `pnpm lint:biome:unsafe` for unsafe auto-fixes
- ESLint with flat config (eslint.config.mjs)
  - Includes React Compiler, React Hooks, TanStack Query, and Vitest plugins
- Knip for dead code detection (ignores generated API code)
  - Use `pnpm lint:knip` for strict mode checking
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
- React Compiler enabled for automatic memoization and optimization
- reactRemoveProperties compiler option removes development-only props in production
- Turbopack for faster builds with filesystem cache in development
- Turbopack used in both dev and production builds
- View transitions API support (experimental.viewTransition)
- Web Vitals monitoring in development (WebVitalsReporter component)
- Auth interrupts support for better authentication UX (experimental.authInterrupts)

### Component Development Workflow
1. Create component in `/src/components/ComponentName/index.tsx`
2. Add Storybook stories (`*.stories.tsx`) for visual testing
3. Use `tailwind-variants` for styling with type-safe variants
4. Export as named export (no default exports per linting rules)
5. Add unit tests if component has logic

### Important Notes
- This project uses **Next.js 16** and **React 19** with React Compiler enabled
- MSW worker is initialized automatically via `pnpm init:msw` (postinstall hook)
- The `.claude` directory is gitignored for Claude Code specific files
- All builds use Turbopack (both dev and production)
- TypeScript typed routes are enabled for type-safe navigation
- Proxy middleware is defined in `src/proxy.ts` (not `middleware.ts`)
