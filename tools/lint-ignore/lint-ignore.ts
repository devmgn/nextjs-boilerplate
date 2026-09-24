/**
 * Oxlint / oxfmt が共有する、ソースではないパス。
 * `.vscode/settings.json` の `cSpell.ignorePaths` は JSON からこれを参照できないため手動で同期する。
 * `fallow.toml` も同様。
 */

/** `pnpm generate-api` / `pnpm generate-mock` の生成物。 */
export const generatedSources = ["src/api/openapi/**", "src/mocks/**"];

/** 配信アセット。msw の `mockServiceWorker.js` を含む。 */
export const staticAssets = ["public/**"];
