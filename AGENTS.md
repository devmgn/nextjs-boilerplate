## Core Technology Stack

- **Next.js 16** with App Router, React 19, Turbopack, React Compiler (see `next.config.ts`)
  - Node.js 24, pnpm 10 (exact versions in package.json)
- **TypeScript** with strict type checking
- **Tailwind CSS v4** with @tailwindcss/postcss, **M3 Design Tokens** (see `.claude/rules/design-tokens.md`)
- **TanStack Query** with queryOptions helper
- **React Hook Form + Zod v4** with @hookform/resolvers
- **UI**: @radix-ui primitives, tailwind-variants, tailwind-merge
- **Utilities**: custom debounce (`src/utils/debounce`)
- **nuqs** for URL state management (NuqsAdapter in RootProvider)
- **OxC** (Oxlint + Oxfmt) for linting and formatting
  - jsPlugins: @tanstack/eslint-plugin-query, eslint-plugin-react-hooks
  - Suppress comments: `// oxlint-disable-next-line <rule>`
- **Vitest** with 80% coverage requirement
- **Storybook 10** with Vitest integration, a11y testing, MSW
- **Lefthook** for git hooks (see `lefthook.yml`)
  - Skip with `git commit --no-verify` or `LEFTHOOK=0 git ...`

## Key Patterns

- **State management**: TanStack Query (server state), React Hook Form + Zod (form state), no global client state

## Skills Priority

Prefer skill instructions over rules files when they conflict. Always consult the relevant skill:

- **Tests**: `vitest`
- **React/TSX components**: `react-best-practices`, `composition-patterns`, `react-view-transitions`
- **UI/UX review**: `web-design-guidelines`

## MCP Tool Usage

| Purpose                                                          | MCP Tool                                                              |
| ---------------------------------------------------------------- | --------------------------------------------------------------------- |
| **Next.js official docs**                                        | `next-devtools` (`nextjs_docs`, `nextjs_index`, `nextjs_call`)        |
| **Other libraries** (React, TanStack Query, Zod, Tailwind, etc.) | `context7` (`resolve-library-id` → `query-docs`)                      |
| **Vitest docs**                                                  | `WebFetch` → `https://vitest.dev/llms-full.txt`                       |
| **Storybook UI dev** (stories, component docs)                   | `storybook-mcp` (see `.claude/rules/storybook.md` for full tool list) |

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
