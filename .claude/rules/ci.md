---
paths:
  - ".github/**"
---

# CI/CD Rules

## Branch Strategy

- `main` + feature branches (see `git-pr.md` for naming)
- CI runs on non-main branches only

## Workflows

- **lint.yml**: `pnpm check` (Oxlint + Oxfmt + Knip)
- **test.yml**: `pnpm test:unit` (Vitest)
- **build.yml**: `pnpm build` + upload `.next/` artifact
- **update-msw.yml**: Auto-update MSW worker (manual trigger + pnpm-lock.yaml changes, Renovate bot only)

## Shared Setup (`.github/actions/setup/action.yml`)

- Runner: ubuntu-24.04
- Timeout: 10 minutes
- pnpm installed via `pnpm/action-setup@v4` (version from `packageManager` in package.json)
- Node.js version read from `.tool-versions`
- Copies `.env.development` to `.env.local`
- Concurrency: per-branch cancellation (`cancel-in-progress: true`)

## Notes

- `upload-artifact` requires `include-hidden-files: true` for `.next/` directory
- Action versions are pinned by commit SHA
