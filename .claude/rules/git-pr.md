---
description: Branch naming, commit messages, PR workflow
---

# Git & Pull Request Rules

## Branch Naming

`feat/`, `fix/`, `chore/`, `refactor/` + short description. Branch from `main`.

## Commit Messages

Follow Conventional Commits: `feat:`, `fix:`, `refactor:`, `chore:`, `chore(deps):`. Include PR number when squash-merging.

## PR Workflow

Branch from `main` → push (CI runs automatically) → open PR → all checks must pass before merge.
