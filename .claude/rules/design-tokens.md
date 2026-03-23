# M3 Design Tokens

See `src/lib/styles/DesignTokens.mdx` for full token catalog and usage guide.

## Files

- `src/lib/styles/theme.css` — Token definitions (`@theme` + `@theme inline`)
- `src/lib/styles/utilities.css` — `typeset-*` shorthand utilities
- `src/lib/styles/DesignTokens.mdx` — Storybook docs (Color / Radius / Elevation / Typography / Token Mapping)

## Rules

- Use M3 tokens or component aliases for colors. Never use raw hex/rgb or Tailwind default palette (`red-500`, etc.)
- Use `rounded-{none,xs,sm,md,lg,xl,full}` for border radius
- Use `shadow-elevation-{0-5}` for shadows
- Use `typeset-*` (shorthand) or `text-* font-m3-*` (composable) for typography
