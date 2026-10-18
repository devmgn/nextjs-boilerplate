## Core Technology Stack

- **Next.js 16** with App Router, React 19, Turbopack, React Compiler (see `next.config.ts`)
  - Node.js 24, pnpm 12 (exact versions in `package.json` / `mise.toml`)
- **TypeScript** with strict type checking
- **Tailwind CSS v4** with `@tailwindcss/postcss`, **M3 Design Tokens** (see `.claude/rules/design-tokens.md`)
- **TanStack Query** with Orval-generated hooks and query options (see `.claude/rules/api.md`)
- **React Hook Form + Zod v4** with `@hookform/resolvers`
- **UI**: Radix UI primitives, tailwind-variants, tailwind-merge
- **nuqs** for URL state (`NuqsAdapter` in `src/app/layout.tsx`)
- **Ultracite** (Oxlint + Oxfmt preset) for linting and formatting — entry points are `pnpm check` / `pnpm fix`
  - Presets (`oxlint.config.ts`): core, react, next, tanstack, vitest, storybook, anti-slop + js-plugins (github, jsdoc-js, sonarjs, tsdoc, react-doctor)
  - jsPlugins: `@tanstack/eslint-plugin-query`, `eslint-plugin-storybook` (stories only), own rules in `tools/oxlint-rules/`
  - Type-aware lint + type check enabled (oxlint-tsgolint); TS compiler diagnostics surface as lint errors, so there is no separate `tsc --noEmit` script
  - Suppress comments: `// oxlint-disable-next-line <rule>` (`eslint-disable` is NOT honored; unused directives are errors)
  - Ignore lists live in `tools/lint-ignore/` and are shared by `oxlint.config.ts` / `oxfmt.config.ts` (`fallow.toml` cannot import them, so sync manually)
- **fallow** for dead code and import boundaries (`fallow.toml`)
- **Vitest** (coverage reported, no threshold enforced)
- **Storybook 10** with Vitest integration, a11y testing, MSW
- **Lefthook** for git hooks (see `lefthook.yml`)
  - Skip with `git commit --no-verify` or `LEFTHOOK=0 git ...`

## Key Patterns

- **State management**: TanStack Query (server state), React Hook Form + Zod (form state), nuqs (URL state), no global client state
- **Language**: write docs, code comments, test titles, and commit messages in English. User-facing UI copy is out of scope (`<html lang="ja">`)

## Project Rules

Topic-specific rules live in `.claude/rules/` (path-scoped ones load automatically in Claude Code; other agents should read the relevant file before editing):

| File | Covers |
| --- | --- |
| `commands.md` | Dev / lint / test / build commands |
| `directory-structure.md` | `src/` layout, naming, one feature per directory, colocation under `app/` |
| `app-router.md` | Convention files, data fetching, Cache Components, forms, Proxy |
| `api.md` | Orval codegen, `ApiError`, TanStack Query usage |
| `components.md` | Component conventions, tailwind-variants |
| `design-tokens.md` | M3 token usage |
| `tsdoc.md` | Doc comment requirements and TSDoc syntax |
| `testing.md` | Vitest setup and API mocking in tests |
| `mocks.md` | MSW setup and Orval fixtures |
| `storybook.md` | Story patterns, MSW in stories, Storybook MCP |
| `ci.md` | GitHub Actions workflows |
| `git-pr.md` | Branches, commits, PRs |

## Skills Priority

Prefer skill instructions over rules files when they conflict. Always consult the relevant skill:

- **React/TSX components**: `vercel-react-best-practices`, `vercel-composition-patterns`, `vercel-react-view-transitions`
- **UI/UX review**: `web-design-guidelines`
- **React diagnostics**: `react-doctor` (fix-it-now / pre-commit), `improve-react` (codebase-wide audit and plans)
- **OpenAPI codegen** (`orval.config.ts`, mutator, generated mocks): `orval`

## MCP Tool Usage

| Purpose | MCP Tool |
| --- | --- |
| **Next.js official docs** | `next-devtools` (`nextjs_docs`, `nextjs_index`, `nextjs_call`) |
| **Other libraries** (React, TanStack Query, Zod, Tailwind, etc.) | `context7` (`resolve-library-id` → `query-docs`) |
| **Vitest docs** | `WebFetch` → `https://vitest.dev/llms-full.txt` |
| **Storybook UI dev** (stories, component docs) | `storybook-mcp` (see `.claude/rules/storybook.md` for full tool list) |

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
