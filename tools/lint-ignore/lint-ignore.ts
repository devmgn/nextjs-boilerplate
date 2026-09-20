/**
 * Oxlint / oxfmt / knip が共有する、ソースではないパス。
 * `.vscode/settings.json` の `cSpell.ignorePaths` は JSON からこれを参照できないため手動で同期する。
 */

/** `pnpm generate-api` / `pnpm generate-mock` の生成物。 */
export const generatedSources = ["src/api/openapi/**", "src/mocks/**"];

/**
 * 配信アセット。msw の `mockServiceWorker.js` を含む。
 * knip は元から走査しないため knip の ignore には入れない。
 */
export const staticAssets = ["public/**"];
