import type { Plugin } from "@oxlint/plugins";
import newlineAfterImport from "./newline-after-import/index.ts";
import noIndexTsx from "./no-index-tsx/index.ts";
import noRestrictedSyntax from "./no-restricted-syntax/index.ts";
import sortHookDeps from "./sort-hook-deps/index.ts";

const plugin: Plugin = {
  meta: { name: "custom-rules" },
  rules: {
    "newline-after-import": newlineAfterImport,
    "no-index-tsx": noIndexTsx,
    "no-restricted-syntax": noRestrictedSyntax,
    "sort-hook-deps": sortHookDeps,
  },
};

export default plugin;
