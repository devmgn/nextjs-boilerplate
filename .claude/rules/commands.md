---
description: Development, lint, test, and build commands
---

# Development Commands

```bash
pnpm dev                            # Dev server (Turbopack)
pnpm build                          # Production build
pnpm start                          # Start production server
pnpm check                          # All checks (Oxlint + Oxfmt + Knip)
pnpm fix                            # Auto-fix lint + format
pnpm knip                           # Dead code detection
pnpm test                           # Run all tests
pnpm test:unit                      # Unit tests only
pnpm test:watch                     # Watch mode
pnpm test:coverage                  # Tests with coverage (80% threshold)
pnpm test:update                    # Update snapshots
pnpm vitest run path/to/test.test.ts  # Specific test file
pnpm storybook                      # Storybook dev server
pnpm build-storybook                # Storybook static build
pnpm generate-api                   # Generate OpenAPI client
pnpm generate-api:clean             # Clean + regenerate OpenAPI client
pnpm generate-mock                  # Generate MSW handlers from OpenAPI spec
pnpm analyze                        # Bundle size analysis (requires build)
```
