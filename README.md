# nextjs-boilerplate

Next.js 16 + React 19 のボイラープレート。App Router、React Compiler、Turbopack を採用。

## Tech Stack

| Category  | Technology                                             |
| --------- | ------------------------------------------------------ |
| Framework | Next.js 16 (App Router, Turbopack)                     |
| UI        | React 19, Tailwind CSS v4, Radix UI, tailwind-variants |
| State     | TanStack Query, React Hook Form + Zod v4               |
| Linting   | OxC (Oxlint + Oxfmt)                                   |
| Testing   | Vitest, Storybook 10, Playwright, MSW                  |
| Language  | TypeScript (strict), Node.js 24, pnpm 10               |

## Getting Started

```bash
pnpm install
pnpm dev
```

## Scripts

```bash
pnpm dev              # Development server
pnpm build            # Production build
pnpm lint             # Lint (Oxlint + Oxfmt + fn-style)
pnpm check-types      # Type check
pnpm test             # Run tests
pnpm test:coverage    # Tests with coverage (80% threshold)
pnpm storybook        # Storybook dev server
pnpm lint:knip        # Dead code detection
```
