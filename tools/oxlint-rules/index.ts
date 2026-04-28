import type { Plugin } from "@oxlint/plugins";
import newlineAfterImport from "./newline-after-import.ts";
import noIndexTsx from "./no-index-tsx.ts";
import noTopLevelArrow from "./no-top-level-arrow.ts";
import sortHookDeps from "./sort-hook-deps.ts";

const plugin: Plugin = {
  meta: { name: "custom-rules" },
  rules: {
    "newline-after-import": newlineAfterImport,
    "no-index-tsx": noIndexTsx,
    "no-top-level-arrow": noTopLevelArrow,
    "sort-hook-deps": sortHookDeps,
  },
};

export default plugin;
