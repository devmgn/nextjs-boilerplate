---
paths:
  - ".github/**"
---

# CI/CD Rules

- `main` + feature branches. Workflows trigger on `push` with `branches-ignore: main`, except **actions-lint.yml** (every branch) and **skills-update.yml** (weekly `schedule` + `workflow_dispatch`)
- **ci.yml**: jobs `Build` (`pnpm build`) / `Lint` (`pnpm check`) / `Test` (`pnpm test:unit` + `pnpm test:oxlint-rules`). Job IDs double as required status check names — do not rename
- Path-scoped: **actions-lint.yml** (`.github/**`, `mise.toml`, `mise.lock`)
- Shared setup (`.github/actions/setup`): `pnpm/action-setup`, `setup-node` with `node-version-file: mise.toml`, copies `.env.development` to `.env.local`
- actionlint / zizmor are installed by `jdx/mise-action` from `mise.toml` (`--locked` via `mise.lock`), matching the versions lefthook runs locally. skills-update.yml installs only `node` + `npm:skills` and runs `mise run --skip-tools skills:update`
- **skills-update.yml**: the `Update` job (read-only) runs the skills CLI and uploads a patch; the `PullRequest` job (write) only applies it and opens/updates a `chore/update-agent-skills` PR via `peter-evans/create-pull-request`. Keep third-party code out of the write job. Pushes with `GITHUB_TOKEN` do not trigger workflows, so it dispatches ci.yml with `gh workflow run` — keep ci.yml's filename and its `workflow_dispatch` trigger
- Action versions pinned by commit SHA
