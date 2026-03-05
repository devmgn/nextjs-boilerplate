---
---

# Git & Pull Request Rules

## Branch Naming

Branch from `main` using Conventional Commits type as prefix:

- `feat/<short-description>` — new feature
- `fix/<short-description>` — bug fix
- `chore/<short-description>` — maintenance, config, dependencies
- `refactor/<short-description>` — code improvement without behavior change

## Commit Messages

Follow Conventional Commits:

```
feat: add user authentication
fix: resolve hydration mismatch
refactor: simplify form validation
chore: update dependencies
chore(deps): update patch dependencies
```

- Include PR number when squash-merging: `fix: resolve issue (#123)`

## Pull Request Workflow

1. Create branch from `main` (e.g., `feat/add-auth`, `fix/hydration-error`)
2. Push to remote — CI (lint, test, build) runs automatically on non-main branches
3. Open PR to `main`
4. All CI checks must pass before merge

## CI Checks on Push

- **lint**: Oxlint + type check + Oxfmt + Knip
- **test**: Vitest unit tests
- **build**: Next.js production build
