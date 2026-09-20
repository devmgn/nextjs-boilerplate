---
description: Development, lint, test, and build commands
---

# Development Commands

```bash
pnpm dev                            # Dev server (Turbopack)
pnpm build                          # Production build
pnpm start                          # Start production server
pnpm check                          # All checks (ultracite check = Oxfmt + Oxlint, then Knip)
pnpm fix                            # Auto-fix lint + format (ultracite fix)
pnpm knip                           # Dead code detection (knip + knip --production)
pnpm lint:workflows                 # GitHub Actions lint (actionlint + zizmor)
pnpm test                           # Run all tests
pnpm test:unit                      # Unit tests only (typecheck included)
pnpm test:oxlint-rules              # Tests for the custom oxlint rules in tools/
pnpm test:watch                     # Watch mode
pnpm test:coverage                  # Tests with coverage (80% threshold)
pnpm test:update                    # Update snapshots
pnpm vitest run path/to/test.test.ts  # Specific test file
pnpm storybook                      # Storybook dev server
pnpm build-storybook                # Storybook static build
pnpm generate-api                   # Generate OpenAPI client
pnpm generate-api:clean             # Clean + regenerate OpenAPI client
pnpm generate-mock                  # Generate MSW handlers from OpenAPI spec
pnpm analyze                        # Bundle analysis via Turbopack (no build artifacts; serves a UI)
pnpm doctor                         # React Doctor scan (security / perf / a11y / architecture)
pnpm apm                            # Sync Claude Code agent assets (apm install -t claude)
```

## Lint / Format (Ultracite)

`pnpm check` / `pnpm fix` are the entry points. Use the CLI directly to scope a run:

```bash
pnpm ultracite check src/components/button   # Check specific paths
pnpm ultracite fix src/components/button     # Fix specific paths
pnpm ultracite doctor                        # Diagnose the lint/format setup
pnpm exec oxlint src/...                     # Lint only (skip the formatter pass)
```

Note: oxlint prints nothing when there are no violations — silence means clean.
