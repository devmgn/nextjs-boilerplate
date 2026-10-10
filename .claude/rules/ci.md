---
paths:
  - ".github/**"
---

# CI/CD Rules

- `main` + feature branches. Workflows trigger on `push` with `branches-ignore: main`, except **actions-lint.yml** (every branch)
- **ci.yml**: jobs `Build` (`pnpm build`) / `Lint` (`pnpm check`) / `Test` (`pnpm test:unit` + `pnpm test:oxlint-rules`). Job IDs double as required status check names — do not rename
- Path-scoped: **actions-lint.yml** (`.github/**`, `mise.toml`, `mise.lock`), **adr-check.yml** (`docs/adr/**`)
- Shared setup (`.github/actions/setup`): `pnpm/action-setup`, `setup-node` with `node-version-file: mise.toml`, copies `.env.development` to `.env.local`
- actionlint / zizmor are installed by `jdx/mise-action` from `mise.toml` (`--locked` via `mise.lock`), matching the versions lefthook runs locally
- Action versions pinned by commit SHA
