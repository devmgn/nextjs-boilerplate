# nextjs-boilerplate

A Next.js 16 + React 19 boilerplate with App Router, React Compiler, and Turbopack.

## Tech Stack

| Category | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack, React Compiler) |
| UI | React 19, Tailwind CSS v4 (M3 tokens), Radix UI, tailwind-variants |
| State | TanStack Query, React Hook Form + Zod v4, nuqs |
| API | Orval (OpenAPI → TanStack Query hooks, MSW fixtures) |
| Linting | Ultracite (Oxlint + Oxfmt), fallow |
| Testing | Vitest, Storybook 10, Playwright, MSW |
| Language | TypeScript (strict), Node.js 24, pnpm 12 |

## Getting Started

Requires [mise](https://mise.jdx.dev/), which pins Node.js / pnpm / actionlint / zizmor and runs the git hooks.

```bash
mise install
pnpm install   # also generates the API client into src/api/openapi/
pnpm dev
```

## Scripts

```bash
pnpm dev              # Development server
pnpm build            # Production build
pnpm check            # All checks (Oxlint + Oxfmt + fallow)
pnpm fix              # Auto-fix lint + format
pnpm test             # Run tests
pnpm storybook        # Storybook dev server
```

See [`.claude/rules/commands.md`](.claude/rules/commands.md) for the full list.

## Documentation

- [`AGENTS.md`](AGENTS.md) — stack overview and conventions
- [`.claude/rules/`](.claude/rules/) — rules by topic (directory structure, App Router, API, testing, ...)
