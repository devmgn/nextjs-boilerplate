---
paths:
  - ".github/**"
---

# CI/CD Rules

- `main` + feature branches, CI runs on non-main branches only
- **lint.yml**: `pnpm check` — **test.yml**: `pnpm test:unit` — **build.yml**: `pnpm build` + upload `.next/`
- **update-msw.yml**: Auto-update MSW worker (Renovate bot only)
- Shared setup: ubuntu-24.04, 10min timeout, `pnpm/action-setup@v5`, Node.js from `.tool-versions`
- `upload-artifact` requires `include-hidden-files: true` for `.next/`
- Action versions pinned by commit SHA
