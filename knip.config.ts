import { defineConfig } from "knip/config";
import { generatedSources } from "./tools/lint-ignore/index.ts";

export default defineConfig({
  ignore: [...generatedSources],
  ignoreBinaries: ["openapiconfig.json", "actionlint", "zizmor", "apm"],
  ignoreIssues: {
    // knip は `./foo.ts` のような拡張子付き import を解決できず、この配下を未使用と誤検出する
    // （allowImportingTsExtensions 前提のディレクトリ）。
    "tools/oxlint-rules/**/*.ts": ["files"],
    // knip は oxlint / oxfmt の設定ファイルの import を辿らないため、
    // そこからしか参照されない export が未使用に見える。
    "tools/lint-ignore/**/*.ts": ["files", "exports"],
  },
  vitest: {
    entry: ["vitest.global-setup.ts", "vitest.setup.ts"],
  },
});
