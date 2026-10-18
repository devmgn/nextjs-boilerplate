/**
 * Non-source paths shared by Oxlint / oxfmt. `cSpell.ignorePaths` in
 * `.vscode/settings.json` cannot reference this from JSON, so keep it in sync
 * manually. The same goes for `fallow.toml`.
 */

/** Output of `pnpm generate-api` / `mise lock`. */
export const generatedSources = ["src/api/openapi/**", ".mise/locks/**"];

/** Served assets. Includes msw's `mockServiceWorker.js`. */
export const staticAssets = ["public/**"];

/**
 * Vendored external content (skills from `mise run skills:update`, the OpenAPI
 * spec). Formatting it would diverge from upstream and be reverted on the next
 * update.
 */
export const vendoredSources = [".claude/skills/**", "openapi/**"];
