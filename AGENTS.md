# AGENTS.md

This file provides guidance to AI coding agents when working with code in this repository.

## Development Commands

### Essential Commands

```bash
pnpm dev              # Development server with Turbopack
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run all checks (Oxlint + type check + Oxfmt check)
pnpm lint:oxlint      # Oxlint check (type-aware + type-check)
pnpm lint:oxlint:fix  # Oxlint with auto-fix
pnpm lint:fmt         # Oxfmt formatting (check only)
pnpm lint:fmt:fix     # Oxfmt formatting (write)
pnpm lint:knip        # Dead code detection (strict mode)
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
- **Storybook 10** with Vitest integration, a11y testing, MSW
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

- **Oxlint** (oxlint.config.ts) — linting + type checking (type-aware + `--type-check` replaces `tsc --noEmit`)
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

| Purpose                                                          | MCP Tool                                                                                 |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| **Next.js official docs**                                        | `next-devtools` (`nextjs_docs`, `nextjs_index`, `nextjs_call`)                           |
| **Other libraries** (React, TanStack Query, Zod, Tailwind, etc.) | `context7` (`resolve-library-id` → `query-docs`)                                         |
| **Vitest docs**                                                  | `WebFetch` → `https://vitest.dev/llms-full.txt`                                          |
| **Storybook UI dev** (stories, component docs)                   | `storybook-mcp` (`get_ui_building_instructions`, `preview-stories`, `get-documentation`) |

### AI Agent Setup

This project uses complementary tools for AI agent support:

- **`@next/codemod agents-md`** — Embeds Next.js docs index into AGENTS.md for `nextjs_docs` lookups
  - Update: `npx @next/codemod@canary agents-md --output /AGENTS.md`
- **`vercel-labs/agent-skills`** — Provides React/Next.js best practices and coding pattern skills
  - Add: `npx skills add vercel-labs/agent-skills`
  - Skills: `vercel-react-best-practices`, `vercel-composition-patterns`, `vercel-react-native-skills`
- **`antfu/skills` (Vitest)** — Vitest testing guidelines (writing tests, mocking, coverage, fixtures)
  - Add: `npx skills add antfu/skills`
  - Skills: `vitest`

<!-- NEXT-AGENTS-MD-START -->[Next.js Docs Index]|root: ./.next-docs|STOP. What you remember about Next.js is WRONG for this project. Always search docs and read before any task.|If docs missing, run this command first: npx @next/codemod agents-md --output AGENTS.md|01-app:{04-glossary.mdx}|01-app/01-getting-started:{01-installation.mdx,02-project-structure.mdx,03-layouts-and-pages.mdx,04-linking-and-navigating.mdx,05-server-and-client-components.mdx,06-cache-components.mdx,07-fetching-data.mdx,08-updating-data.mdx,09-caching-and-revalidating.mdx,10-error-handling.mdx,11-css.mdx,12-images.mdx,13-fonts.mdx,14-metadata-and-og-images.mdx,15-route-handlers.mdx,16-proxy.mdx,17-deploying.mdx,18-upgrading.mdx}|01-app/02-guides:{analytics.mdx,authentication.mdx,backend-for-frontend.mdx,caching.mdx,ci-build-caching.mdx,content-security-policy.mdx,css-in-js.mdx,custom-server.mdx,data-security.mdx,debugging.mdx,draft-mode.mdx,environment-variables.mdx,forms.mdx,incremental-static-regeneration.mdx,instrumentation.mdx,internationalization.mdx,json-ld.mdx,lazy-loading.mdx,local-development.mdx,mcp.mdx,mdx.mdx,memory-usage.mdx,multi-tenant.mdx,multi-zones.mdx,open-telemetry.mdx,package-bundling.mdx,prefetching.mdx,production-checklist.mdx,progressive-web-apps.mdx,public-static-pages.mdx,redirecting.mdx,sass.mdx,scripts.mdx,self-hosting.mdx,single-page-applications.mdx,static-exports.mdx,tailwind-v3-css.mdx,third-party-libraries.mdx,videos.mdx}|01-app/02-guides/migrating:{app-router-migration.mdx,from-create-react-app.mdx,from-vite.mdx}|01-app/02-guides/testing:{cypress.mdx,jest.mdx,playwright.mdx,vitest.mdx}|01-app/02-guides/upgrading:{codemods.mdx,version-14.mdx,version-15.mdx,version-16.mdx}|01-app/03-api-reference:{07-edge.mdx,08-turbopack.mdx}|01-app/03-api-reference/01-directives:{use-cache-private.mdx,use-cache-remote.mdx,use-cache.mdx,use-client.mdx,use-server.mdx}|01-app/03-api-reference/02-components:{font.mdx,form.mdx,image.mdx,link.mdx,script.mdx}|01-app/03-api-reference/03-file-conventions/01-metadata:{app-icons.mdx,manifest.mdx,opengraph-image.mdx,robots.mdx,sitemap.mdx}|01-app/03-api-reference/03-file-conventions:{default.mdx,dynamic-routes.mdx,error.mdx,forbidden.mdx,instrumentation-client.mdx,instrumentation.mdx,intercepting-routes.mdx,layout.mdx,loading.mdx,mdx-components.mdx,not-found.mdx,page.mdx,parallel-routes.mdx,proxy.mdx,public-folder.mdx,route-groups.mdx,route-segment-config.mdx,route.mdx,src-folder.mdx,template.mdx,unauthorized.mdx}|01-app/03-api-reference/04-functions:{after.mdx,cacheLife.mdx,cacheTag.mdx,connection.mdx,cookies.mdx,draft-mode.mdx,fetch.mdx,forbidden.mdx,generate-image-metadata.mdx,generate-metadata.mdx,generate-sitemaps.mdx,generate-static-params.mdx,generate-viewport.mdx,headers.mdx,image-response.mdx,next-request.mdx,next-response.mdx,not-found.mdx,permanentRedirect.mdx,redirect.mdx,refresh.mdx,revalidatePath.mdx,revalidateTag.mdx,unauthorized.mdx,unstable_cache.mdx,unstable_noStore.mdx,unstable_rethrow.mdx,updateTag.mdx,use-link-status.mdx,use-params.mdx,use-pathname.mdx,use-report-web-vitals.mdx,use-router.mdx,use-search-params.mdx,use-selected-layout-segment.mdx,use-selected-layout-segments.mdx,userAgent.mdx}|01-app/03-api-reference/05-config/01-next-config-js:{adapterPath.mdx,allowedDevOrigins.mdx,appDir.mdx,assetPrefix.mdx,authInterrupts.mdx,basePath.mdx,browserDebugInfoInTerminal.mdx,cacheComponents.mdx,cacheHandlers.mdx,cacheLife.mdx,compress.mdx,crossOrigin.mdx,cssChunking.mdx,devIndicators.mdx,distDir.mdx,env.mdx,expireTime.mdx,exportPathMap.mdx,generateBuildId.mdx,generateEtags.mdx,headers.mdx,htmlLimitedBots.mdx,httpAgentOptions.mdx,images.mdx,incrementalCacheHandlerPath.mdx,inlineCss.mdx,isolatedDevBuild.mdx,logging.mdx,mdxRs.mdx,onDemandEntries.mdx,optimizePackageImports.mdx,output.mdx,pageExtensions.mdx,poweredByHeader.mdx,productionBrowserSourceMaps.mdx,proxyClientMaxBodySize.mdx,reactCompiler.mdx,reactMaxHeadersLength.mdx,reactStrictMode.mdx,redirects.mdx,rewrites.mdx,sassOptions.mdx,serverActions.mdx,serverComponentsHmrCache.mdx,serverExternalPackages.mdx,staleTimes.mdx,staticGeneration.mdx,taint.mdx,trailingSlash.mdx,transpilePackages.mdx,turbopack.mdx,turbopackFileSystemCache.mdx,typedRoutes.mdx,typescript.mdx,urlImports.mdx,useLightningcss.mdx,viewTransition.mdx,webVitalsAttribution.mdx,webpack.mdx}|01-app/03-api-reference/05-config:{02-typescript.mdx,03-eslint.mdx}|01-app/03-api-reference/06-cli:{create-next-app.mdx,next.mdx}|02-pages/01-getting-started:{01-installation.mdx,02-project-structure.mdx,04-images.mdx,05-fonts.mdx,06-css.mdx,11-deploying.mdx}|02-pages/02-guides:{analytics.mdx,authentication.mdx,babel.mdx,ci-build-caching.mdx,content-security-policy.mdx,css-in-js.mdx,custom-server.mdx,debugging.mdx,draft-mode.mdx,environment-variables.mdx,forms.mdx,incremental-static-regeneration.mdx,instrumentation.mdx,internationalization.mdx,lazy-loading.mdx,mdx.mdx,multi-zones.mdx,open-telemetry.mdx,package-bundling.mdx,post-css.mdx,preview-mode.mdx,production-checklist.mdx,redirecting.mdx,sass.mdx,scripts.mdx,self-hosting.mdx,static-exports.mdx,tailwind-v3-css.mdx,third-party-libraries.mdx}|02-pages/02-guides/migrating:{app-router-migration.mdx,from-create-react-app.mdx,from-vite.mdx}|02-pages/02-guides/testing:{cypress.mdx,jest.mdx,playwright.mdx,vitest.mdx}|02-pages/02-guides/upgrading:{codemods.mdx,version-10.mdx,version-11.mdx,version-12.mdx,version-13.mdx,version-14.mdx,version-9.mdx}|02-pages/03-building-your-application/01-routing:{01-pages-and-layouts.mdx,02-dynamic-routes.mdx,03-linking-and-navigating.mdx,05-custom-app.mdx,06-custom-document.mdx,07-api-routes.mdx,08-custom-error.mdx}|02-pages/03-building-your-application/02-rendering:{01-server-side-rendering.mdx,02-static-site-generation.mdx,04-automatic-static-optimization.mdx,05-client-side-rendering.mdx}|02-pages/03-building-your-application/03-data-fetching:{01-get-static-props.mdx,02-get-static-paths.mdx,03-forms-and-mutations.mdx,03-get-server-side-props.mdx,05-client-side.mdx}|02-pages/03-building-your-application/06-configuring:{12-error-handling.mdx}|02-pages/04-api-reference:{06-edge.mdx,08-turbopack.mdx}|02-pages/04-api-reference/01-components:{font.mdx,form.mdx,head.mdx,image-legacy.mdx,image.mdx,link.mdx,script.mdx}|02-pages/04-api-reference/02-file-conventions:{instrumentation.mdx,proxy.mdx,public-folder.mdx,src-folder.mdx}|02-pages/04-api-reference/03-functions:{get-initial-props.mdx,get-server-side-props.mdx,get-static-paths.mdx,get-static-props.mdx,next-request.mdx,next-response.mdx,use-params.mdx,use-report-web-vitals.mdx,use-router.mdx,use-search-params.mdx,userAgent.mdx}|02-pages/04-api-reference/04-config/01-next-config-js:{adapterPath.mdx,allowedDevOrigins.mdx,assetPrefix.mdx,basePath.mdx,bundlePagesRouterDependencies.mdx,compress.mdx,crossOrigin.mdx,devIndicators.mdx,distDir.mdx,env.mdx,exportPathMap.mdx,generateBuildId.mdx,generateEtags.mdx,headers.mdx,httpAgentOptions.mdx,images.mdx,isolatedDevBuild.mdx,onDemandEntries.mdx,optimizePackageImports.mdx,output.mdx,pageExtensions.mdx,poweredByHeader.mdx,productionBrowserSourceMaps.mdx,proxyClientMaxBodySize.mdx,reactStrictMode.mdx,redirects.mdx,rewrites.mdx,serverExternalPackages.mdx,trailingSlash.mdx,transpilePackages.mdx,turbopack.mdx,typescript.mdx,urlImports.mdx,useLightningcss.mdx,webVitalsAttribution.mdx,webpack.mdx}|02-pages/04-api-reference/04-config:{01-typescript.mdx,02-eslint.mdx}|02-pages/04-api-reference/05-cli:{create-next-app.mdx,next.mdx}|03-architecture:{accessibility.mdx,fast-refresh.mdx,nextjs-compiler.mdx,supported-browsers.mdx}|04-community:{01-contribution-guide.mdx,02-rspack.mdx}<!-- NEXT-AGENTS-MD-END -->
