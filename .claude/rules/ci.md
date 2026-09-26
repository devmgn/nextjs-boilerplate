---
paths:
  - ".github/**"
---

# CI/CD Rules

- `main` + feature branches. Workflows trigger on `push` with `branches-ignore: main`, except **actions-lint.yml** (every branch)
- **lint.yml**: `pnpm check` — **test.yml**: `pnpm test:unit` + `pnpm test:oxlint-rules` — **build.yml**: `pnpm build` + upload `.next/`
- Path-scoped: **actions-lint.yml** (`.github/**`), **adr-check.yml** (`docs/adr/**`)
- Shared setup: ubuntu-24.04, 10min timeout, `pnpm/action-setup@v6`, Node.js from `mise.toml`, copies `.env.development` to `.env.local`
- `upload-artifact` requires `include-hidden-files: true` for `.next/`
- Action versions pinned by commit SHA
