/**
 * Oxlint / oxfmt が共有する、ソースではないパス。
 * `.vscode/settings.json` の `cSpell.ignorePaths` は JSON からこれを参照できないため手動で同期する。
 * `fallow.toml` も同様。
 */

/** `pnpm generate-api` / `mise lock` の生成物。 */
export const generatedSources = ["src/api/openapi/**", ".mise/locks/**"];

/** 配信アセット。msw の `mockServiceWorker.js` を含む。 */
export const staticAssets = ["public/**"];

/**
 * 外部から取り込んだもの（`mise run skills:update` のスキル、OpenAPI
 * spec）。整形すると上流との差分になり、次の更新で戻る。
 */
export const vendoredSources = [".claude/skills/**", "openapi/**"];
